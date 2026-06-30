'use client'

import { FormEvent, useMemo, useState } from 'react'
import { parseTripIntent } from '../../lib/ai-trip/parse-intent'
import type { ParseTripIntentResult } from '../../lib/ai-trip/intent-schema'
import { ItineraryPlaceholderShell } from './ItineraryPlaceholderShell'
import {
  CapabilityStatusPanel,
  LocalConfirmationPanel,
  MissingFieldsWarnings,
  RawJsonDetails,
  type ConfirmedIntent,
} from './IntentParserPanels'
import { TripIntentSummary } from './TripIntentSummary'
import { AiSearchProductCard } from './AiSearchProductCard'
import type { AiTripSearchResponse } from '../api/ai-trip/search/route'

const defaultPrompt = 'Chiang Mai 3 days food temples elephants, less crowded'
const examplePrompts = [
  'Chiang Mai 3 days food temples elephants, less crowded',
  'Tokyo for 5 days, anime, food and local markets',
  '清迈3天，大象，寺庙，美食，避开人多',
  'Dubai tomorrow, luxury food, less crowded',
]

export function canSearchFromConfirmed(confirmed: ConfirmedIntent | null): boolean {
  return confirmed !== null
}

export function IntentParserDemo() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [result, setResult] = useState<ParseTripIntentResult>(() => parseTripIntent(defaultPrompt))
  const [confirmed, setConfirmed] = useState<ConfirmedIntent | null>(null)
  const [searchState, setSearchState] = useState<AiTripSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const parsedJson = useMemo(() => JSON.stringify(result, null, 2), [result])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConfirmed(null)
    setSearchState(null)
    setResult(parseTripIntent(prompt))
  }

  function useExamplePrompt(examplePrompt: string) {
    setPrompt(examplePrompt)
    setConfirmed(null)
    setSearchState(null)
    setResult(parseTripIntent(examplePrompt))
  }

  function handlePromptChange(nextPrompt: string) {
    setPrompt(nextPrompt)
    setConfirmed(null)
    setSearchState(null)
  }

  const hasMissingFields = result.missingFields.length > 0
  const hasWarnings = result.warnings.length > 0
  const duration = result.intent.durationDays
    ? `${result.intent.durationDays} day${result.intent.durationDays === 1 ? '' : 's'}${result.intent.durationNights ? ` / ${result.intent.durationNights} night${result.intent.durationNights === 1 ? '' : 's'}` : ''}`
    : null
  const traveler = [
    result.intent.travelerType !== 'unspecified' ? result.intent.travelerType : null,
    result.intent.groupSize ? `group of ${result.intent.groupSize}` : null,
  ].filter(Boolean).join(' · ')
  const canConfirm = !hasMissingFields
  const canSearch = canSearchFromConfirmed(confirmed)
  const productRetrievalEnabled = searchState?.status === 'ok'

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

  const placeholderDayCount = confirmed?.durationDays
    ? Math.min(confirmed.durationDays, 7)
    : 0

  return (
    <div className="mt-10 max-w-5xl border border-[#ded7ca] bg-white p-4 shadow-[0_18px_0_rgba(16,24,32,0.08)] sm:p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="trip-idea" className="text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
          Trip idea
        </label>
        <textarea
          id="trip-idea"
          rows={4}
          value={prompt}
          onChange={event => handlePromptChange(event.target.value)}
          placeholder="Chiang Mai 3 days food temples elephants, less crowded"
          className="mt-3 min-h-[140px] w-full resize-none border border-[#ded7ca] bg-[#fffdf7] px-4 py-4 text-base font-semibold leading-7 text-[#101820] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
        />
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
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-[#5a6670]">
            This planner only understands your travel intent locally. It does not search tours, check availability, show prices, or create reservation handoffs.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex min-h-[52px] items-center justify-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]"
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
          Confirmation only saves this understanding in the current browser session. It does not generate an itinerary, search tours, check availability, show prices, or create reservation handoffs.
        </p>
        {!canConfirm ? (
          <p className="mt-2 text-sm font-semibold leading-6 text-[#a35c09]">
            Destination and duration are required before this local confirmation can be saved.
          </p>
        ) : null}
      </form>

      <section className="mt-6 border border-[#d8eadf] bg-[#f5fbf7] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
              Local deterministic planner
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
              Trip Intent Summary
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#5a6670]">
            Readable summary first. Raw JSON stays below for debugging.
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
          <MissingFieldsWarnings
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
            durationDays={confirmed.durationDays}
            placeholderDayCount={placeholderDayCount}
          />
        ) : null}

        <RawJsonDetails parsedJson={parsedJson} />
      </section>

      {confirmed ? (
        <section className="mt-6 border border-[#1e2d59]/20 bg-[#f7f9ff] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1e2d59]">
                Real Thailand experiences
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
                Search real Thailand experiences
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
                Returns real eligible products from trusted local operators. No reservation handoff or availability check.
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

          {searchState ? (
            <div className="mt-6">
              {searchState.status === 'unsupported_destination' ? (
                <div className="rounded-[1.25rem] border border-[#f3d6aa] bg-[#fff8e8] p-5">
                  <p className="text-sm font-black text-[#a35c09]">Thailand-only search</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6b5d4d]">
                    {searchState.message ?? 'RadarScout currently searches Thailand experiences only.'}
                  </p>
                </div>
              ) : searchState.status === 'no_match' ? (
                <div className="rounded-[1.25rem] border border-[#e8dfd2] bg-white p-5">
                  <p className="text-sm font-black text-[#5a5147]">No matching Thailand experiences found</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6b7280]">
                    No Thailand experiences matched your current intent. Try adjusting the destination or interests.
                  </p>
                </div>
              ) : searchState.status === 'ok' && searchState.products.length > 0 ? (
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
                    {searchState.products.length} Thailand experience{searchState.products.length === 1 ? '' : 's'} found
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                    Comparison only. Reservation handoff and availability are not enabled.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                      />
                    ))}
                  </div>
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
        </section>
      ) : null}
    </div>
  )
}
