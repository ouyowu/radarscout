'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { parseTripIntent } from '../../lib/ai-trip/parse-intent'
import type { ParseTripIntentResult } from '../../lib/ai-trip/intent-schema'
import { ItineraryPlaceholderShell } from './ItineraryPlaceholderShell'
import {
  CapabilityStatusPanel,
  LocalConfirmationPanel,
  PlannerNotes,
  StructuredTripDetails,
  type ConfirmedIntent,
} from './IntentParserPanels'
import { TripIntentSummary } from './TripIntentSummary'
import { AiSearchProductCard, buildAiTripPlannerDetailHref } from './AiSearchProductCard'
import type { AiTripSearchResponse } from '../api/ai-trip/search/route'
import { buildProductFitReason, buildResultFitSummary } from './resultFitSummary'

const defaultPrompt = 'Chiang Mai 3 days food temples elephants, less crowded'
const promptMaxLength = 600
const examplePrompts = [
  'Chiang Mai elephants',
  'Chiang Mai 3 days food temples elephants, less crowded',
  'Bangkok 3 days canals temples street food, relaxed pace',
  '清迈3天，大象，寺庙，美食，避开人多',
  'Phuket 4 days islands beaches local food, avoid rushed schedule',
  'Pattaya 2 days beaches food elephant day trip, easy pace',
  'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace',
]
const noMatchNextSearches = [
  { label: 'Chiang Mai elephants and food', prompt: 'Chiang Mai 3 days elephants food' },
  { label: 'Bangkok food and canals', prompt: 'Bangkok 3 days food canals' },
  { label: 'Phuket islands and local food', prompt: 'Phuket 4 days islands local food' },
  { label: 'Pattaya beaches with easy pace', prompt: 'Pattaya 2 days beaches easy pace' },
  { label: 'Thailand multi-city route', prompt: 'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace' },
]

function focusTripIdeaField() {
  document.getElementById('trip-idea')?.focus()
}

export function canSearchFromConfirmed(confirmed: ConfirmedIntent | null): boolean {
  return confirmed !== null
}

export function canConfirmTripIntent(result: ParseTripIntentResult, isParsedPromptCurrent: boolean): boolean {
  return isParsedPromptCurrent &&
    Boolean(result.intent.destination) &&
    (Boolean(result.intent.durationDays) || result.intent.interests.length > 0)
}

export function IntentParserDemo() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [parsedPrompt, setParsedPrompt] = useState(defaultPrompt)
  const [result, setResult] = useState<ParseTripIntentResult>(() => parseTripIntent(defaultPrompt))
  const [confirmed, setConfirmed] = useState<ConfirmedIntent | null>(null)
  const [searchState, setSearchState] = useState<AiTripSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [starterLoadedCity, setStarterLoadedCity] = useState<string | null>(null)

  const parsedJson = useMemo(() => JSON.stringify(result, null, 2), [result])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedPrompt = prompt.trim()
    if (normalizedPrompt.length === 0) return

    setConfirmed(null)
    setSearchState(null)
    setStarterLoadedCity(null)
    setPrompt(normalizedPrompt)
    setParsedPrompt(normalizedPrompt)
    setResult(parseTripIntent(normalizedPrompt))
  }

  function useExamplePrompt(examplePrompt: string) {
    setPrompt(examplePrompt)
    setParsedPrompt(examplePrompt)
    setConfirmed(null)
    setSearchState(null)
    setStarterLoadedCity(null)
    setResult(parseTripIntent(examplePrompt))
    focusTripIdeaField()
  }

  function handleClearPrompt() {
    setPrompt('')
    setParsedPrompt('')
    setConfirmed(null)
    setSearchState(null)
    setStarterLoadedCity(null)
    setResult(parseTripIntent(''))
    focusTripIdeaField()
  }

  function handlePromptChange(nextPrompt: string) {
    setPrompt(nextPrompt)
    setConfirmed(null)
    setSearchState(null)
    setStarterLoadedCity(null)
  }

  const hasMissingFields = result.missingFields.length > 0
  const hasWarnings = result.warnings.length > 0
  const hasPromptText = prompt.trim().length > 0
  const isParsedPromptCurrent = prompt === parsedPrompt
  const duration = result.intent.durationDays
    ? `${result.intent.durationDays} day${result.intent.durationDays === 1 ? '' : 's'}${result.intent.durationNights ? ` / ${result.intent.durationNights} night${result.intent.durationNights === 1 ? '' : 's'}` : ''}`
    : null
  const traveler = [
    result.intent.travelerType !== 'unspecified' ? result.intent.travelerType : null,
    result.intent.groupSize ? `group of ${result.intent.groupSize}` : null,
  ].filter(Boolean).join(' · ')
  const canConfirm = canConfirmTripIntent(result, isParsedPromptCurrent)
  const canSearch = canSearchFromConfirmed(confirmed)
  const productRetrievalEnabled = searchState?.status === 'ok'
  const resultFitSummary = searchState ? buildResultFitSummary(searchState) : null
  const routeStopOverview = useMemo(() => {
    if (searchState?.status !== 'ok') return []

    const counts = new Map<string, number>()
    for (const product of searchState.products) {
      const city = product.city?.trim()
      if (!city) continue

      counts.set(city, (counts.get(city) ?? 0) + 1)
    }

    return Array.from(counts, ([city, count]) => ({ city, count }))
  }, [searchState])
  const routeStopGroups = useMemo(() => {
    if (searchState?.status !== 'ok' || routeStopOverview.length <= 1) return []

    return routeStopOverview
      .map(stop => ({
        ...stop,
        products: searchState.products.filter(product => product.city?.trim() === stop.city),
      }))
      .filter(stop => stop.products.length > 0)
  }, [routeStopOverview, searchState])
  const starterSearchFeedback = searchState
    ? searchState.status === 'ok'
      ? `${searchState.products.length} matching Thailand experience${searchState.products.length === 1 ? '' : 's'} found below.`
      : searchState.status === 'no_match'
        ? 'No matching Thailand experiences found. Try a safer suggested search below.'
        : searchState.status === 'unsupported_destination'
          ? 'This starter search is limited to Thailand experiences.'
          : 'Search did not complete. Try again with a clearer Thailand trip idea.'
    : null

  useEffect(() => {
    function handleStarterPrompt(event: Event) {
      const detail = (event as CustomEvent<{ city?: unknown, prompt?: unknown }>).detail
      if (typeof detail?.prompt !== 'string' || detail.prompt.trim().length === 0) return

      setPrompt(detail.prompt)
      setParsedPrompt(detail.prompt)
      setConfirmed(null)
      setSearchState(null)
      setStarterLoadedCity(typeof detail.city === 'string' && detail.city.trim().length > 0 ? detail.city : null)
      setResult(parseTripIntent(detail.prompt))
    }

    window.addEventListener('radarscout:ai-trip-starter', handleStarterPrompt)
    return () => window.removeEventListener('radarscout:ai-trip-starter', handleStarterPrompt)
  }, [])

  function handleConfirmIntent() {
    if (!canConfirm) return

    setSearchState(null)
    setConfirmed({
      destination: result.intent.destination,
      durationDays: result.intent.durationDays,
      duration,
      interests: result.intent.interests,
      language: result.intent.language,
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  async function handleSearchProducts() {
    if (!canSearch || isSearching) return

    setIsSearching(true)
    setSearchState(null)

    try {
      const res = await fetch('/api/ai-trip/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json() as AiTripSearchResponse
      setSearchState(data)
    } catch {
      setSearchState({ status: 'error', products: [], meta: { productRetrievalEnabled: true, itineraryGenerationEnabled: false, bookingEnabled: false, availabilityEnabled: false } })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mt-10 max-w-5xl border border-[#ded7ca] bg-white p-4 shadow-[0_18px_0_rgba(16,24,32,0.08)] sm:p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="trip-idea" className="text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
          Trip idea
        </label>
        <textarea
          id="trip-idea"
          rows={4}
          maxLength={promptMaxLength}
          value={prompt}
          onChange={event => handlePromptChange(event.target.value)}
          placeholder="Chiang Mai 3 days food temples elephants, less crowded"
          className="mt-3 min-h-[140px] w-full resize-none border border-[#ded7ca] bg-[#fffdf7] px-4 py-4 text-base font-semibold leading-7 text-[#101820] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <p className="mt-2 text-right text-xs font-black uppercase tracking-[0.12em] text-[#6b7280]">
          {prompt.length} / {promptMaxLength} characters used
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {examplePrompts.map(examplePrompt => (
            <button
              key={examplePrompt}
              type="button"
              onClick={() => useExamplePrompt(examplePrompt)}
              className="border border-[#ded7ca] bg-[#fffdf7] px-3 py-2 text-left text-xs font-black leading-5 text-[#101820] hover:border-[#0f766e] hover:text-[#0f766e]"
            >
              {examplePrompt}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClearPrompt}
            className="border border-[#ded7ca] bg-white px-3 py-2 text-left text-xs font-black leading-5 text-[#5a5147] hover:border-[#a35c09] hover:text-[#a35c09]"
          >
            Clear trip idea
          </button>
        </div>
        {starterLoadedCity ? (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-[#d8eadf] bg-[#f5fbf7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black leading-6 text-[#0f766e]">
              {starterLoadedCity} route idea loaded. Review the summary, then confirm trip intent to search real Thailand experiences.
            </p>
            {starterSearchFeedback ? (
              <div className="flex flex-col gap-2 text-sm font-semibold leading-6 text-[#3f6f5c]">
                <p>{starterSearchFeedback}</p>
                {searchState?.status === 'ok' && searchState.products.length > 0 ? (
                  <a
                    href="#ai-trip-results"
                    className="font-black text-[#0f766e] underline decoration-[#0f766e]/30 underline-offset-4 hover:text-[#0b5f59]"
                  >
                    View matching experiences
                  </a>
                ) : null}
              </div>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirmIntent}
                disabled={!canConfirm}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#0f766e] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e] disabled:cursor-not-allowed disabled:border-[#c7beb1] disabled:text-[#9a9084]"
              >
                Confirm loaded trip intent
              </button>
              {confirmed ? (
                <button
                  type="button"
                  onClick={handleSearchProducts}
                  disabled={!canSearch || isSearching}
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#0f766e] px-4 text-xs font-black uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:bg-[#c7beb1] disabled:text-[#9a9084]"
                >
                  {isSearching ? 'Searching…' : 'Search loaded trip idea'}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-[#5a6670]">
            This planner understands your travel intent locally first. Product search appears only after local confirmation and remains comparison-only.
            Product matching is currently limited to Thailand experience records.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={!hasPromptText}
              className="inline-flex min-h-[52px] items-center justify-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)] disabled:cursor-not-allowed disabled:bg-[#c7beb1] disabled:text-[#9a9084]"
            >
              Parse trip intent
            </button>
            <button
              type="button"
              onClick={handleConfirmIntent}
              disabled={!canConfirm}
              className="inline-flex min-h-[52px] items-center justify-center border border-[#0f766e] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#0f766e] disabled:cursor-not-allowed disabled:border-[#c7beb1] disabled:text-[#9a9084]"
            >
              Confirm trip intent
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
          Confirmation only saves this understanding in the current browser session. It does not generate an itinerary or start a booking partner action.
        </p>
        {!hasPromptText ? (
          <p className="mt-2 text-sm font-semibold leading-6 text-[#a35c09]">
            Add a trip idea before parsing.
          </p>
        ) : null}
        {hasPromptText && !canConfirm ? (
          <p className="mt-2 text-sm font-semibold leading-6 text-[#a35c09]">
            {isParsedPromptCurrent
              ? 'Add a clearer Thailand destination plus a trip length or interest before this local confirmation can be saved.'
              : 'Trip idea changed. Parse trip intent again before confirming.'}
          </p>
        ) : null}
      </form>

      <section className="mt-6 border border-[#d8eadf] bg-[#f5fbf7] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
              Local planning summary
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
              Trip Intent Summary
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#5a6670]">
            Readable summary first. Trip details stay collapsed below for transparency.
          </p>
        </div>

        <TripIntentSummary
          destination={result.intent.destination}
          duration={duration}
          interests={result.intent.interests}
          avoid={result.intent.avoid}
          excludedStyles={result.intent.excludedStyles}
          pace={result.intent.pace}
          budget={result.intent.budget}
          traveler={traveler || null}
          foodPreferences={result.intent.foodPreferences}
          language={result.intent.language}
          confidence={result.intent.confidence}
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <LocalConfirmationPanel confirmed={confirmed} />
          <PlannerNotes
            missingFields={result.missingFields}
            warnings={result.warnings}
          />
          <CapabilityStatusPanel
            bookingEnabled={false}
            productRetrievalEnabled={productRetrievalEnabled}
            availabilityEnabled={false}
          />
        </div>

        {confirmed?.durationDays ? (
          <ItineraryPlaceholderShell
            intent={{
              destination: result.intent.destination,
              durationDays: confirmed.durationDays,
              interests: result.intent.interests,
              foodPreferences: result.intent.foodPreferences,
              pace: result.intent.pace,
              travelerType: result.intent.travelerType,
              avoid: result.intent.avoid,
            }}
          />
        ) : null}

        <StructuredTripDetails parsedJson={parsedJson} />
      </section>

      <section id="ai-trip-results" className="mt-6 scroll-mt-6 border border-[#1e2d59]/20 bg-[#f7f9ff] p-5">
        {confirmed ? (
          <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1e2d59]">
                Real Thailand experiences
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
                Search real Thailand experiences
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
                Returns real eligible products from trusted local operators. No booking partner action or current status claim.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSearchProducts}
              disabled={!canSearch || isSearching}
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-[#1e2d59] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#0f1a36] disabled:cursor-not-allowed disabled:bg-[#c7beb1] disabled:text-[#9a9084]"
            >
              {isSearching ? 'Searching…' : 'Search real Thailand experiences'}
            </button>
          </div>
          {isSearching ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 rounded-2xl border border-[#d8eadf] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#0f766e]"
            >
              Searching read-only Thailand experience records. This can take a few seconds; no partner action is running.
            </p>
          ) : null}

          {searchState ? (
            <div className="mt-6">
              {searchState.status === 'unsupported_destination' ? (
                <div className="rounded-[1.25rem] border border-[#f3d6aa] bg-[#fff8e8] p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-black text-[#a35c09]">Thailand-only search</p>
                    <a
                      href="#trip-idea"
                      className="text-xs font-black uppercase tracking-[0.12em] text-[#1e2d59] underline decoration-[#1e2d59]/30 underline-offset-4 hover:text-[#0f766e]"
                    >
                      Refine trip idea
                    </a>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6b5d4d]">
                    {searchState.message ?? 'RadarScout currently searches Thailand experiences only. Non-Thailand ideas can still be structured as planning text, but product matching stays Thailand-only until coverage is reviewed.'}
                  </p>
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#6b5d4d]">
                    Try one of these Thailand trip ideas:
                  </p>
                  <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#5a6670] sm:grid-cols-2">
                    {noMatchNextSearches.map(nextSearch => (
                      <li key={nextSearch.label}>
                        <button
                          type="button"
                          onClick={() => useExamplePrompt(nextSearch.prompt)}
                          className="min-h-[44px] w-full rounded-2xl bg-[#fff0cf] px-4 py-3 text-left font-semibold leading-6 text-[#6b5d4d] hover:bg-[#f6dfae] hover:text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30"
                        >
                          {nextSearch.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : searchState.status === 'no_match' ? (
                <div className="rounded-[1.25rem] border border-[#e8dfd2] bg-white p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-black text-[#5a5147]">No matching Thailand experiences found</p>
                    <a
                      href="#trip-idea"
                      className="text-xs font-black uppercase tracking-[0.12em] text-[#1e2d59] underline decoration-[#1e2d59]/30 underline-offset-4 hover:text-[#0f766e]"
                    >
                      Refine trip idea
                    </a>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6b7280]">
                    No Thailand experiences matched your current intent. Try one of these safer next searches:
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-[#5a6670] sm:grid-cols-2">
                    {noMatchNextSearches.map(nextSearch => (
                      <li key={nextSearch.label}>
                        <button
                          type="button"
                          onClick={() => useExamplePrompt(nextSearch.prompt)}
                          className="min-h-[44px] w-full rounded-2xl bg-[#f7f3ec] px-4 py-3 text-left font-semibold leading-6 text-[#5a6670] hover:bg-[#ebe3d6] hover:text-[#101820] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30"
                        >
                          {nextSearch.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">
                    No product cards are shown until a real eligible product matches the confirmed intent.
                  </p>
                </div>
              ) : searchState.status === 'ok' && searchState.products.length > 0 ? (
                <div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
                        {searchState.products.length} Thailand experience{searchState.products.length === 1 ? '' : 's'} found
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                        Comparison only. Current product details and booking partner handoff stay on product pages.
                      </p>
                    </div>
                    <a
                      href="#trip-idea"
                      className="text-xs font-black uppercase tracking-[0.12em] text-[#1e2d59] underline decoration-[#1e2d59]/30 underline-offset-4 hover:text-[#0f766e]"
                    >
                      Refine trip idea
                    </a>
                  </div>
                  <section aria-label="AI Trip Planner result actions" className="mt-2 grid gap-2 sm:mt-3 sm:gap-3">
                    <div className="flex flex-col gap-2 rounded-2xl border border-[#e8dfd2] bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
                      <p className="text-xs font-semibold leading-5 text-[#5a6670] sm:text-sm sm:leading-6">
                        Start with the first comparison match, then compare the remaining cards below.
                      </p>
                      <a
                        href={buildAiTripPlannerDetailHref(searchState.products[0].detailHref, searchState.products[0].id)}
                        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
                      >
                        Open top match details
                      </a>
                    </div>
                    <p
                      role="status"
                      aria-live="polite"
                      className="rounded-2xl border border-[#d8eadf] bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#0f766e] sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                    >
                      Results ready. Review the comparison cards below, then open product details to continue with a booking partner.
                    </p>
                  </section>
                  {resultFitSummary ? (
                    <section
                      aria-label="Result fit summary"
                      className="mt-3 rounded-[1.25rem] border border-[#d8eadf] bg-white p-3 sm:mt-4 sm:p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
                        Result fit summary
                      </p>
                      <h3 className="mt-1.5 text-lg font-black tracking-[-0.025em] text-[#101820] sm:mt-2 sm:text-xl">
                        {resultFitSummary.heading}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                        {resultFitSummary.chips.map(chip => (
                          <span
                            key={chip}
                            className="rounded-full bg-[#e7f5f2] px-2.5 py-1 text-xs font-black text-[#0f766e] sm:px-3"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      <ul className="mt-2 grid gap-1.5 text-xs font-semibold leading-5 text-[#5a6670] sm:mt-3 sm:gap-2 sm:text-sm sm:leading-6">
                        {resultFitSummary.points.map(point => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {routeStopOverview.length > 1 ? (
                    <section
                      aria-label="Route stop overview"
                      className="mt-3 rounded-[1.25rem] border border-[#d8eadf] bg-white p-3 sm:mt-4 sm:p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
                        Route stop overview
                      </p>
                      <p className="mt-1.5 text-xs font-semibold leading-5 text-[#5a6670] sm:mt-2 sm:text-sm sm:leading-6">
                        City grouping helps you compare returned Thailand experiences by route stop. It does not claim availability or booking status.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                        {routeStopOverview.map(stop => (
                          <span
                            key={stop.city}
                            className="rounded-full bg-[#f5fbf7] px-2.5 py-1 text-xs font-black text-[#0f766e] sm:px-3"
                          >
                            {stop.city}: {stop.count} comparison match{stop.count === 1 ? '' : 'es'}
                          </span>
                        ))}
                      </div>
                    </section>
                  ) : null}
                  {routeStopGroups.length > 1 ? (
                    <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4">
                      {routeStopGroups.map(group => (
                        <section
                          key={group.city}
                          aria-label={`${group.city} result group`}
                          className="rounded-[1.25rem] border border-[#e8dfd2] bg-[#fffdf7] p-3 sm:p-4"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                            <h4 className="text-sm font-black uppercase tracking-[0.12em] text-[#101820]">
                              {group.city} results
                            </h4>
                            <p className="text-xs font-black text-[#0f766e]">
                              {group.count} comparison match{group.count === 1 ? '' : 'es'}
                            </p>
                          </div>
                          <div className="mt-3 grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {group.products.map(product => (
                              <AiSearchProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                city={product.city}
                                summary={product.summary}
                                tags={product.tags}
                                detailHref={product.detailHref}
                                retailPrice={product.retailPrice}
                                currency={product.currency}
                                fitReason={buildProductFitReason(product, searchState.intent)}
                              />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {searchState.products.map(product => (
                        <AiSearchProductCard
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          city={product.city}
                          summary={product.summary}
                          tags={product.tags}
                          detailHref={product.detailHref}
                          retailPrice={product.retailPrice}
                          currency={product.currency}
                          fitReason={buildProductFitReason(product, searchState.intent)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : searchState.status === 'error' ? (
                <div className="rounded-[1.25rem] border border-[#fde8e8] bg-white p-5">
                  <p className="text-sm font-semibold leading-6 text-[#6b7280]">
                    Product search is temporarily unavailable. No fallback product has been substituted.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1e2d59]">
                Matching experiences
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
                Matching experiences appear here after you confirm a trip intent
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
                This stable return point helps you get back from product details. Confirm a Thailand trip idea first, then search comparison-only product results.
              </p>
            </div>
            <a
              href="#trip-idea"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#1e2d59] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#1e2d59] transition hover:border-[#0f766e] hover:text-[#0f766e]"
            >
              Refine trip idea
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
