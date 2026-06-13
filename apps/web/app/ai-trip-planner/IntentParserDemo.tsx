'use client'

import { FormEvent, useMemo, useState } from 'react'
import { parseTripIntent } from '../../lib/ai-trip/parse-intent'
import type { ParseTripIntentResult } from '../../lib/ai-trip/intent-schema'

const defaultPrompt = 'Chiang Mai 3 days food temples elephants, less crowded'

function formatValue(value: string | number | null): string {
  if (value === null || value === '') return 'Not detected'
  return String(value)
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'None detected'
}

function FieldRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatValue(value)}</dd>
    </div>
  )
}

function ListRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatList(values)}</dd>
    </div>
  )
}

function FlagPill({ label, enabled }: { label: string; enabled: boolean }) {
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

  const parsedJson = useMemo(() => JSON.stringify(result, null, 2), [result])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(parseTripIntent(prompt))
  }

  return (
    <div className="mt-10 max-w-5xl border border-[#ded7ca] bg-white p-4 shadow-[0_18px_0_rgba(16,24,32,0.08)] sm:p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor="trip-idea" className="text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
          Local parser preview
        </label>
        <textarea
          id="trip-idea"
          rows={4}
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          placeholder="Chiang Mai 3 days food temples elephants, less crowded"
          className="mt-3 min-h-[140px] w-full resize-none border border-[#ded7ca] bg-[#fffdf7] px-4 py-4 text-base font-semibold leading-7 text-[#101820] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-[#5a6670]">
            This preview only parses trip intent locally. It does not search products, check availability, or create bookings.
          </p>
          <button
            type="submit"
            className="inline-flex min-h-[52px] items-center justify-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]"
          >
            Parse trip intent
          </button>
        </div>
      </form>

      <section className="mt-6 border border-[#d8eadf] bg-[#f5fbf7] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
              Deterministic debug output
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
              Parsed trip intent
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#5a6670]">
            Local parser only. No itinerary or product result is generated.
          </p>
        </div>

        <dl className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FieldRow label="Destination" value={result.intent.destination} />
          <FieldRow label="Duration days" value={result.intent.durationDays} />
          <FieldRow label="Duration nights" value={result.intent.durationNights} />
          <ListRow label="Interests" values={result.intent.interests} />
          <ListRow label="Avoid" values={result.intent.avoid} />
          <ListRow label="Excluded styles" values={result.intent.excludedStyles} />
          <FieldRow label="Pace" value={result.intent.pace} />
          <FieldRow label="Budget" value={result.intent.budget} />
          <FieldRow label="Traveler type" value={result.intent.travelerType} />
          <FieldRow label="Group size" value={result.intent.groupSize} />
          <ListRow label="Food preferences" values={result.intent.foodPreferences} />
          <FieldRow label="Language" value={result.intent.language} />
          <FieldRow label="Confidence" value={result.intent.confidence} />
          <ListRow label="Missing fields" values={result.missingFields} />
          <ListRow label="Warnings" values={result.warnings} />
        </dl>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <FlagPill label="bookingEnabled" enabled={result.bookingEnabled} />
          <FlagPill label="productRetrievalEnabled" enabled={result.productRetrievalEnabled} />
          <FlagPill label="availabilityEnabled" enabled={result.availabilityEnabled} />
        </div>

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
