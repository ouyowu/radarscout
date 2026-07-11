'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
import { DayTripItineraryPanel } from '../ai-trip-planner/DayTripItineraryPanel'
import type { AiTripSearchResponse } from '../api/ai-trip/search/route'
import {
  decideNextGuideStep,
  mergeTripIdea,
  parseMergedTripIdea,
  REVIEWED_RETRY_CHIPS,
  SKIP_INTERESTS_CHIP,
  summarizeUnderstoodIntent,
} from './plannerConversation'

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

let nextMessageId = 1

function createMessage(message: Omit<StudioMessage, 'id'>): StudioMessage {
  nextMessageId += 1
  return { id: nextMessageId, ...message }
}

function buildResultGuideMessage(response: AiTripSearchResponse): StudioMessage {
  if (response.status === 'ok' && response.products.length > 0) {
    const itineraryNote = response.itinerary
      ? ` I arranged ${response.itinerary.days.length} of them into a day-by-day route on the right — every stop keeps a reviewed booking partner handoff.`
      : ' Compare them on the right; every match keeps a reviewed booking partner handoff.'

    return createMessage({
      role: 'guide',
      content: `Found ${response.products.length} reviewed Thailand experience${response.products.length === 1 ? '' : 's'} for this idea.${itineraryNote} Want to adjust the plan? Just tell me what to change.`,
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

export function PlannerStudio() {
  const [messages, setMessages] = useState<StudioMessage[]>([
    createMessage({ role: 'guide', content: WELCOME_MESSAGE, chips: STARTER_CHIPS }),
  ])
  const [draft, setDraft] = useState('')
  const [ideaParts, setIdeaParts] = useState<string[]>([])
  const [interestsSkipped, setInterestsSkipped] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchState, setSearchState] = useState<AiTripSearchResponse | null>(null)
  const conversationEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isSearching])

  async function runSearch(parts: string[]) {
    setIsSearching(true)
    setSearchState(null)

    try {
      const res = await fetch('/api/ai-trip/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: mergeTripIdea(parts) }),
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

    const skipped = interestsSkipped || Boolean(options?.skipInterests)
    const parts = content ? [...ideaParts, content] : ideaParts

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
    setSearchState(null)
    setDraft('')
  }

  const itinerary = searchState?.status === 'ok' ? searchState.itinerary ?? null : null
  const okProductCount = searchState?.status === 'ok' ? searchState.products.length : 0
  const currentIdea = mergeTripIdea(ideaParts)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <section
        aria-label="Guided planning conversation"
        className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#ece3d6] bg-white shadow-[0_30px_60px_rgba(17,24,39,0.06)]"
      >
        <div className="flex items-center justify-between border-b border-[#ece3d6] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Planning guide</p>
            <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#101820]">Describe the trip in your own words</h2>
          </div>
          <button
            type="button"
            onClick={handleStartOver}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[#ded7ca] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#5a5147] transition hover:border-[#0f766e] hover:text-[#0f766e]"
          >
            Start over
          </button>
        </div>

        <div
          aria-label="Conversation messages"
          className="flex max-h-[560px] min-h-[320px] flex-col gap-4 overflow-y-auto px-5 py-5"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={message.role === 'guide' ? 'flex justify-start' : 'flex justify-end'}
            >
              <div
                className={
                  message.role === 'guide'
                    ? 'max-w-[85%] rounded-[1.25rem] rounded-bl-md bg-[#f5fbf7] px-4 py-3'
                    : 'max-w-[85%] rounded-[1.25rem] rounded-br-md bg-[#1e2d59] px-4 py-3'
                }
              >
                <p
                  className={
                    message.role === 'guide'
                      ? 'text-sm font-semibold leading-6 text-[#1f2937]'
                      : 'text-sm font-semibold leading-6 text-white'
                  }
                >
                  {message.content}
                </p>
                {message.understoodChips && message.understoodChips.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.understoodChips.map(chip => (
                      <span
                        key={chip}
                        className="rounded-full bg-[#e7f5f2] px-2.5 py-1 text-xs font-black text-[#0f766e]"
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
                        className="min-h-[40px] rounded-full border border-[#0f766e]/30 bg-white px-3 py-1.5 text-left text-xs font-black leading-5 text-[#0f766e] transition hover:border-[#0f766e] hover:bg-[#e7f5f2] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="max-w-[85%] rounded-[1.25rem] rounded-bl-md bg-[#f5fbf7] px-4 py-3 text-sm font-semibold leading-6 text-[#0f766e]"
              >
                Searching read-only Thailand experience records…
              </p>
            </div>
          ) : null}
          <div ref={conversationEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-[#ece3d6] px-5 py-4">
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
              className="min-h-[52px] w-full rounded-full border border-[#ded7ca] bg-[#fffdf7] px-5 text-sm font-semibold text-[#101820] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
            />
            <button
              type="submit"
              disabled={isSearching || draft.trim().length === 0}
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-[#0f766e] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#0b5f59] disabled:cursor-not-allowed disabled:bg-[#c7beb1]"
            >
              Send
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-[#5a6670]">
            Local parsing first; product matching stays Thailand-only and comparison-only. The reviewed handoff opens an external booking partner.
          </p>
        </form>
      </section>

      <section aria-label="Trip workspace" className="min-w-0">
        {itinerary ? (
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1e2d59]">Your route workspace</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.025em] text-[#101820]">
                  {itinerary.tripSpec.destination} · {itinerary.tripSpec.durationDays} day
                  {itinerary.tripSpec.durationDays === 1 ? '' : 's'}
                </h2>
              </div>
              <p className="text-xs font-semibold text-[#5a6670]">
                {okProductCount} reviewed match{okProductCount === 1 ? '' : 'es'} · comparison only
              </p>
            </div>
            <DayTripItineraryPanel itinerary={itinerary} />
            <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
              Want the full comparison grid for this idea?{' '}
              <Link
                href={`/ai-trip-planner?idea=${encodeURIComponent(currentIdea)}#intent-demo`}
                className="font-black text-[#1e2d59] underline decoration-[#1e2d59]/30 underline-offset-4 hover:text-[#0f766e]"
              >
                Open it in the full Thailand trip planner
              </Link>
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.75rem] border border-[#ece3d6] bg-[#1e2d59] text-white">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f8d7bf]">Route preview</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.02em] sm:text-3xl">
                Your day-by-day Thailand route appears here
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/80">
                Once the guide has a destination and trip length, it builds a reviewed day-trip sequence with a schematic route map,
                real experience photos, and a booking partner handoff on every stop.
              </p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Describe the trip', 'Confirm what was understood', 'Compare the reviewed route'].map((step, index) => (
                  <li key={step} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f8d7bf]">Step {index + 1}</p>
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
  )
}
