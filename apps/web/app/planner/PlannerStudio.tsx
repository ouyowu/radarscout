'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
import { deriveTripEndDate } from '@/lib/ai-trip/trip-context'
import type { AiTripSearchResponse } from '../api/ai-trip/search/route'
import {
  decideNextGuideStep,
  mergeTripIdea,
  parseMergedTripIdea,
  reconcileTripIdeaParts,
  REVIEWED_RETRY_CHIPS,
  SKIP_INTERESTS_CHIP,
  summarizeUnderstoodIntent,
} from './plannerConversation'
import { buildDeterministicRouteOverview } from './deterministicRouteOverview'
import { PlannerItineraryWorkspace } from './PlannerItineraryWorkspace'

type StudioMessage = {
  id: number
  role: 'guide' | 'traveler'
  content: string
  chips?: string[]
  understoodChips?: string[]
}

const WELCOME_MESSAGE =
  'Tell me your Thailand trip idea in one sentence — destination, days, and interests. I parse it locally into a structured plan, then match reviewed Thailand experiences you can compare.'
const STARTER_CHIPS = [
  'Chiang Mai 3 days elephants food temples',
  'Bangkok 2 days canals and street food',
  'Phuket 4 days islands and beaches',
  'Thailand 7 days Bangkok Chiang Mai Phuket',
]
const PLANNER_STEPS = ['Describe', 'Confirm', 'Compare'] as const
const GROUP_SIZE_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1)

let nextMessageId = 1

function createMessage(message: Omit<StudioMessage, 'id'>): StudioMessage {
  nextMessageId += 1
  return { id: nextMessageId, ...message }
}

function buildResultGuideMessage(response: AiTripSearchResponse): StudioMessage {
  if (response.status === 'ok' && response.products.length > 0) {
    const itineraryNote = response.itinerary
      ? ` I arranged ${response.itinerary.days.length} of them into a day-by-day route on the right — every stop links to reviewed product details before the booking partner handoff.`
      : ' Compare them on the right; every match links to reviewed product details before the booking partner handoff.'

    return createMessage({
      role: 'guide',
      content: `Found ${response.products.length} reviewed Thailand experience${response.products.length === 1 ? '' : 's'} for this idea.${itineraryNote} Add another interest, or send a new Thailand destination to replace this route.`,
    })
  }

  if (response.status === 'unsupported_destination') {
    return createMessage({
      role: 'guide',
      content:
        response.message ??
        'I currently match Thailand experiences only. Try a Thailand destination and I will structure the route.',
      chips: REVIEWED_RETRY_CHIPS,
    })
  }

  if (response.status === 'no_match') {
    return createMessage({
      role: 'guide',
      content:
        'No reviewed booking partner match fits that combination yet — I only place experiences that passed human review. These reviewed searches work well:',
      chips: REVIEWED_RETRY_CHIPS,
    })
  }

  return createMessage({
    role: 'guide',
    content: 'The experience search did not complete. Try again with a clearer Thailand trip idea.',
  })
}

function formatConfirmedDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`))
}

type PlannerStudioProps = {
  initialIdea?: string
  publicMapToken?: string | null
}

export function PlannerStudio({ initialIdea = '', publicMapToken = null }: PlannerStudioProps) {
  const safeInitialIdea = initialIdea.trim().slice(0, PARSER_PROMPT_LIMIT)
  const [messages, setMessages] = useState<StudioMessage[]>(() => [
    createMessage({ role: 'guide', content: WELCOME_MESSAGE, chips: STARTER_CHIPS }),
  ])
  const [draft, setDraft] = useState(safeInitialIdea)
  const [ideaParts, setIdeaParts] = useState<string[]>([])
  const [interestsSkipped, setInterestsSkipped] = useState(false)
  // True while the guide's most recent question was the interests prompt. Any
  // traveler reply then counts as their interests answer — even free-form text
  // the local matcher doesn't recognize — so we advance instead of re-asking.
  const [awaitingInterests, setAwaitingInterests] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchState, setSearchState] = useState<AiTripSearchResponse | null>(null)
  const [startDate, setStartDate] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const conversationEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isSearching, searchState])

  async function runSearch(parts: string[]) {
    setIsSearching(true)
    setSearchState(null)

    try {
      const res = await fetch('/api/ai-trip/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mergeTripIdea(parts),
          tripContext: {
            startDate: startDate || null,
            groupSize: groupSize ? Number(groupSize) : null,
          },
        }),
      })
      const data = await res.json() as AiTripSearchResponse
      setSearchState(data)
      setMessages(current => [...current, buildResultGuideMessage(data)])
    } catch {
      setMessages(current => [
        ...current,
        createMessage({
          role: 'guide',
          content: 'The experience search did not complete. Try again with a clearer Thailand trip idea.',
        }),
      ])
    } finally {
      setIsSearching(false)
    }
  }

  function advanceConversation(parts: string[], skipped: boolean) {
    const result = parseMergedTripIdea(parts)
    const step = decideNextGuideStep(result, { interestsSkipped: skipped })
    const understoodChips = summarizeUnderstoodIntent(result)

    setAwaitingInterests(step.kind === 'ask_interests')

    setMessages(current => [
      ...current,
      createMessage({
        role: 'guide',
        content: step.message,
        chips: step.chips,
        understoodChips: step.kind === 'ready_to_search' ? understoodChips : undefined,
      }),
    ])

    if (step.kind === 'ready_to_search') {
      void runSearch(parts)
    }
  }

  function sendTravelerMessage(rawContent: string, options?: { skipInterests?: boolean }) {
    const content = rawContent.trim()
    if (isSearching) return
    if (!content && !options?.skipInterests) return

    // Once the guide has asked for interests, any non-empty reply is the
    // traveler's answer. Treat it as resolved so free-form wording the local
    // matcher can't map to a known interest doesn't loop the same question.
    const answersInterestPrompt = awaitingInterests && content.length > 0
    const skipped = interestsSkipped || Boolean(options?.skipInterests) || answersInterestPrompt
    const parts = content ? reconcileTripIdeaParts(ideaParts, content) : ideaParts

    if (content && searchState) {
      setSearchState(null)
    }

    setMessages(current => [
      ...current,
      createMessage({ role: 'traveler', content: content || SKIP_INTERESTS_CHIP }),
    ])
    setIdeaParts(parts)
    setInterestsSkipped(skipped)
    setDraft('')
    advanceConversation(parts, skipped)
  }

  function handleChip(chip: string) {
    if (chip === SKIP_INTERESTS_CHIP) {
      sendTravelerMessage('', { skipInterests: true })
      return
    }

    sendTravelerMessage(chip)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendTravelerMessage(draft)
  }

  function handleStartOver() {
    setMessages([createMessage({ role: 'guide', content: WELCOME_MESSAGE, chips: STARTER_CHIPS })])
    setIdeaParts([])
    setInterestsSkipped(false)
    setAwaitingInterests(false)
    setSearchState(null)
    setDraft('')
    setStartDate('')
    setGroupSize('')
  }

  const itinerary = searchState?.status === 'ok' ? searchState.itinerary ?? null : null
  const currentIdea = mergeTripIdea(ideaParts)
  const currentDurationDays = parseMergedTripIdea(ideaParts).intent.durationDays
  const minimumStartDate = new Date().toISOString().slice(0, 10)
  const derivedEndDate = startDate ? deriveTripEndDate(startDate, currentDurationDays) : null
  const routeOverview = itinerary ? buildDeterministicRouteOverview(itinerary) : null
  const currentStep = itinerary ? 3 : ideaParts.length > 0 || isSearching ? 2 : 1

  return (
    <div className="space-y-3">
      <nav aria-label="Planner progress" className="rounded-rs-md border border-rs-sage-200/70 bg-white px-3 py-2 shadow-rs-soft">
        <ol className="grid grid-cols-3 gap-1.5">
          {PLANNER_STEPS.map((step, index) => {
            const number = index + 1
            const isCurrent = number === currentStep
            const isComplete = number < currentStep

            return (
              <li
                key={step}
                aria-current={isCurrent ? 'step' : undefined}
                className={
                  isCurrent
                    ? 'rounded-rs-sm bg-rs-forest-900 px-3 py-2 text-white'
                    : isComplete
                      ? 'rounded-rs-sm bg-rs-sage-100 px-3 py-2 text-rs-forest-700'
                      : 'rounded-rs-sm bg-rs-sand-50 px-3 py-2 text-rs-muted'
                }
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em]">Step {number}</p>
                <p className="mt-0.5 text-xs font-bold sm:text-sm">{step}</p>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(340px,0.68fr)_minmax(0,1.32fr)] lg:items-start">
        <section
          aria-label="Guided planning conversation"
          className="flex flex-col overflow-hidden rounded-rs-lg border border-rs-sage-200/70 bg-white shadow-rs-soft lg:sticky lg:top-4 lg:h-[calc(100vh-8.5rem)] lg:min-h-[620px] lg:max-h-[760px]"
        >
        <div className="flex items-center justify-between gap-3 border-b border-rs-sage-200/70 px-4 py-3 sm:px-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-500">Planning guide</p>
            <h2 className="mt-1 font-rs-display text-lg font-semibold tracking-[-0.02em] text-rs-ink">Describe your Thailand days</h2>
          </div>
          <button
            type="button"
            onClick={handleStartOver}
            className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-sage-200 px-4 text-xs font-bold uppercase tracking-[0.12em] text-rs-muted transition hover:border-rs-forest-500 hover:text-rs-forest-700"
          >
            Start over
          </button>
        </div>

        <fieldset className="border-b border-rs-sage-200/70 bg-rs-sand-50 px-4 py-3 sm:px-5">
          <legend className="sr-only">Optional trip details</legend>
          <div className="grid grid-cols-2 gap-3">
            <label htmlFor="planner-start-date" className="text-xs font-bold text-rs-forest-700">
              Start date <span className="font-semibold text-rs-muted">(optional)</span>
              <input
                id="planner-start-date"
                type="date"
                min={minimumStartDate}
                value={startDate}
                disabled={isSearching}
                onChange={event => setStartDate(event.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-rs-sm border border-rs-sage-200 bg-white px-3 text-sm font-semibold text-rs-ink outline-none focus:border-rs-forest-500 focus:ring-2 focus:ring-rs-forest-500/20 disabled:opacity-60"
              />
            </label>
            <label htmlFor="planner-group-size" className="text-xs font-bold text-rs-forest-700">
              Travelers <span className="font-semibold text-rs-muted">(optional)</span>
              <select
                id="planner-group-size"
                value={groupSize}
                disabled={isSearching}
                onChange={event => setGroupSize(event.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-rs-sm border border-rs-sage-200 bg-white px-3 text-sm font-semibold text-rs-ink outline-none focus:border-rs-forest-500 focus:ring-2 focus:ring-rs-forest-500/20 disabled:opacity-60"
              >
                <option value="">Not set</option>
                {GROUP_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs font-semibold leading-5 text-rs-muted" aria-live="polite">
            {derivedEndDate
              ? `Ends ${formatConfirmedDate(derivedEndDate)}. Dates and travelers are used on the next search.`
              : 'Add a start date after choosing the trip length; RadarScout will derive the end date without guessing.'}
          </p>
        </fieldset>

        <div
          aria-label="Conversation messages"
          className="flex min-h-[320px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={message.role === 'guide' ? 'flex justify-start' : 'flex justify-end'}
            >
              <div
                className={
                  message.role === 'guide'
                    ? 'max-w-[85%] rounded-[1.25rem] rounded-bl-md bg-rs-sage-100 px-4 py-3'
                    : 'max-w-[85%] rounded-[1.25rem] rounded-br-md bg-rs-terracotta px-4 py-3'
                }
              >
                <p
                  className={
                    message.role === 'guide'
                      ? 'text-sm font-semibold leading-6 text-rs-ink'
                      : 'text-sm font-semibold leading-6 text-rs-ink'
                  }
                >
                  {message.content}
                </p>
                {message.understoodChips && message.understoodChips.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.understoodChips.map(chip => (
                      <span
                        key={chip}
                        className="rounded-rs-pill bg-white px-2.5 py-1 text-xs font-bold text-rs-forest-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
                {message.chips && message.chips.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.chips.map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChip(chip)}
                        disabled={isSearching}
                        className="min-h-[40px] rounded-rs-pill border border-rs-forest-500/30 bg-white px-3 py-1.5 text-left text-xs font-bold leading-5 text-rs-forest-700 transition hover:border-rs-forest-500 hover:bg-rs-sage-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {isSearching ? (
            <div className="flex justify-start">
              <p
                role="status"
                aria-live="polite"
                className="max-w-[85%] rounded-[1.25rem] rounded-bl-md bg-rs-sage-100 px-4 py-3 text-sm font-semibold leading-6 text-rs-forest-700"
              >
                Searching read-only Thailand experience records…
              </p>
            </div>
          ) : null}
          {routeOverview ? (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-[1.25rem] rounded-bl-md border border-[#d8eadf] bg-white px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8a4b25]">
                  Route overview · built locally
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#1f2937]">
                  {routeOverview}
                </p>
              </div>
            </div>
          ) : null}
          <div ref={conversationEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-rs-sage-200/70 px-4 py-3 sm:px-5">
          <label htmlFor="planner-studio-input" className="sr-only">
            Trip idea message
          </label>
          <div className="flex gap-2">
            <input
              id="planner-studio-input"
              type="text"
              value={draft}
              maxLength={PARSER_PROMPT_LIMIT}
              onChange={event => setDraft(event.target.value)}
              placeholder="e.g. Chiang Mai 3 days elephants and food"
              className="min-h-[52px] w-full rounded-rs-pill border border-rs-sage-200 bg-rs-sand-50 px-5 text-sm font-semibold text-rs-ink outline-none focus:border-rs-forest-500 focus:ring-2 focus:ring-rs-forest-500/20"
            />
            <button
              type="submit"
              disabled={isSearching || draft.trim().length === 0}
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold uppercase tracking-[0.12em] text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white disabled:cursor-not-allowed disabled:bg-rs-sage-200"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold leading-5 text-rs-muted">
            Local parsing · reviewed Thailand matches · external booking partner handoff
          </p>
        </form>
        </section>

        <section aria-label="Trip workspace" className="min-w-0">
          {itinerary ? (
            <div className="space-y-3">
              <PlannerItineraryWorkspace
                itinerary={itinerary}
                products={searchState?.status === 'ok' ? searchState.products : []}
                publicMapToken={publicMapToken}
              />
              <p className="text-sm font-semibold leading-6 text-rs-muted">
                Want the full comparison grid for this idea?{' '}
                <Link
                  href={`/ai-trip-planner?idea=${encodeURIComponent(currentIdea)}#intent-demo`}
                  className="font-bold text-rs-forest-700 underline decoration-rs-forest-500/30 underline-offset-4 hover:text-rs-terracotta-600"
                >
                  Open it in the full Thailand trip planner
                </Link>
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-rs-lg border border-rs-forest-500/20 bg-rs-forest-900 text-white shadow-rs-soft">
              <div className="px-6 py-8 sm:px-8 sm:py-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd67a]">Route preview</p>
                <h2 className="mt-3 font-rs-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  Your day-by-day Thailand route appears here
                </h2>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/80">
                  Once the guide has a destination and trip length, it builds a reviewed day-trip sequence with a schematic route map,
                  real experience photos, and a reviewed product-detail path on every stop.
                </p>
                <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                  {['Describe the trip', 'Confirm what was understood', 'Compare the reviewed route'].map((step, index) => (
                    <li key={step} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ffd67a]">Step {index + 1}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white/90">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-t border-white/10 bg-white/5 px-6 py-4 sm:px-8">
                <p className="text-xs font-semibold leading-5 text-white/70">
                  Planning stays read-only on RadarScout: no availability claims, and every continue step happens with the external booking partner.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
