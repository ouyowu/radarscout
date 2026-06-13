'use client'

import { FormEvent, useMemo, useState } from 'react'
import { parseTripIntent } from '../../lib/ai-trip/parse-intent'
import type { ParseTripIntentResult } from '../../lib/ai-trip/intent-schema'

const defaultPrompt = 'Chiang Mai 3 days food temples elephants, less crowded'
const examplePrompts = [
  'Chiang Mai 3 days food temples elephants, less crowded',
  'Tokyo for 5 days, anime, food and local markets',
  '清迈3天，大象，寺庙，美食，避开人多',
  'I want to book and pay for Dubai tomorrow',
]

function formatValue(value: string | number | null): string {
  if (value === null || value === '') return 'Not detected'
  return String(value)
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'None detected'
}

function SummaryItem({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="border border-[#e8dfd2] bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatValue(value)}</dd>
    </div>
  )
}

function SummaryList({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="border border-[#e8dfd2] bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatList(values)}</dd>
    </div>
  )
}

function CapabilityStatus({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#d8eadf] bg-[#f0fbf5] px-4 py-3 text-sm font-black text-[#0f5132]">
      <span>{label}</span>
      <span>{enabled ? 'true' : 'false'}</span>
    </div>
  )
}

export function IntentParserDemo() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [result, setResult] = useState<ParseTripIntentResult>(() => parseTripIntent(defaultPrompt))
  const [confirmed, setConfirmed] = useState<{
    destination: string | null
    durationDays: number | null
    duration: string | null
    interests: string[]
    language: string
    confirmedAt: string
  } | null>(null)

  const parsedJson = useMemo(() => JSON.stringify(result, null, 2), [result])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConfirmed(null)
    setResult(parseTripIntent(prompt))
  }

  function useExamplePrompt(examplePrompt: string) {
    setPrompt(examplePrompt)
    setConfirmed(null)
    setResult(parseTripIntent(examplePrompt))
  }

  function handlePromptChange(nextPrompt: string) {
    setPrompt(nextPrompt)
    setConfirmed(null)
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

  function handleConfirmIntent() {
    if (!canConfirm) return

    setConfirmed({
      destination: result.intent.destination,
      durationDays: result.intent.durationDays,
      duration,
      interests: result.intent.interests,
      language: result.intent.language,
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
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
            This preview only understands your travel intent locally. It does not search tours, check availability, show prices, or create bookings.
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
          Confirmation only saves this understanding in the current browser session. It does not generate an itinerary, search tours, check availability, show prices, or create bookings.
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
              Local deterministic parser preview
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
              Trip Intent Summary
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#5a6670]">
            Readable summary first. Raw JSON stays below for debugging.
          </p>
        </div>

        <dl className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <SummaryItem label="Destination" value={result.intent.destination} />
          <SummaryItem label="Duration" value={duration} />
          <SummaryList label="Interests" values={result.intent.interests} />
          <SummaryList label="Avoid" values={result.intent.avoid} />
          <SummaryList label="Travel style exclusions" values={result.intent.excludedStyles} />
          <SummaryItem label="Pace" value={result.intent.pace} />
          <SummaryItem label="Budget" value={result.intent.budget} />
          <SummaryItem label="Traveler / group" value={traveler || null} />
          <SummaryList label="Food preferences" values={result.intent.foodPreferences} />
          <SummaryItem label="Language" value={result.intent.language} />
          <SummaryItem label="Confidence" value={result.intent.confidence} />
        </dl>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="border border-[#cfe8df] bg-white p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
              Local confirmation
            </h3>
            {confirmed ? (
              <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-[#5a6670]">
                <p className="font-black text-[#0f5132]">Trip intent confirmed locally</p>
                <p>Destination: <span className="font-black text-[#101820]">{formatValue(confirmed.destination)}</span></p>
                <p>Duration: <span className="font-black text-[#101820]">{formatValue(confirmed.duration)}</span></p>
                <p>Interests: <span className="font-black text-[#101820]">{formatList(confirmed.interests)}</span></p>
                <p>Language: <span className="font-black text-[#101820]">{confirmed.language}</span></p>
                <p>Local status: <span className="font-black text-[#101820]">Confirmed in this browser session at {confirmed.confirmedAt}</span></p>
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
                Nothing has been confirmed yet. Parse a prompt, then confirm the detected destination and duration in local UI only.
              </p>
            )}
          </section>

          <section className="border border-[#f3d6aa] bg-[#fff8e8] p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#a35c09]">
              Missing fields / warnings
            </h3>
            {hasMissingFields || hasWarnings ? (
              <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
                {hasMissingFields ? (
                  <p>Missing fields: <span className="font-black text-[#101820]">{result.missingFields.join(', ')}</span></p>
                ) : null}
                {hasWarnings ? (
                  <p>Warnings: <span className="font-black text-[#101820]">{result.warnings.join(', ')}</span></p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
                No missing required fields or parser warnings detected.
              </p>
            )}
          </section>

          <section className="border border-[#d8eadf] bg-white p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
              Capability status
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
              Disabled means this preview is not searching products, checking availability, showing prices, or creating bookings.
            </p>
            <div className="mt-4 grid gap-3">
              <CapabilityStatus label="bookingEnabled" enabled={result.bookingEnabled} />
              <CapabilityStatus label="productRetrievalEnabled" enabled={result.productRetrievalEnabled} />
              <CapabilityStatus label="availabilityEnabled" enabled={result.availabilityEnabled} />
            </div>
          </section>
        </div>

        {confirmed?.durationDays ? (
          <section className="mt-5 border border-[#ded7ca] bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a35c09]">
                  Placeholder only
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
                  Itinerary planning shell
                </h3>
              </div>
              <p className="text-sm font-semibold text-[#5a6670]">
                This preview only shows placeholder day slots after local intent confirmation.
              </p>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
              Experience slots will appear here after itinerary generation is implemented. No products, suppliers, prices, availability, or booking links are loaded.
            </p>

            {confirmed.durationDays > 7 ? (
              <p className="mt-3 text-sm font-semibold leading-6 text-[#a35c09]">
                Only the first 7 placeholder days are shown in this preview.
              </p>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: placeholderDayCount }, (_, index) => (
                <article key={index} className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#a35c09]">
                    Day {index + 1} placeholder
                  </p>
                  <h4 className="mt-2 text-lg font-black text-[#101820]">
                    Planning slot placeholder
                  </h4>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
                    Experience slots will appear here after itinerary generation is implemented.
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
                    No products, suppliers, prices, availability, or booking links are loaded.
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <details className="mt-5 border border-[#e8dfd2] bg-white p-4">
          <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
            Raw structured JSON
          </summary>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs font-semibold leading-6 text-[#101820]">
            {parsedJson}
          </pre>
        </details>
      </section>
    </div>
  )
}
