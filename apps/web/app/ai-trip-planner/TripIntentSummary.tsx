type SummaryItemProps = {
  label: string
  value: string | number | null
}

type SummaryListProps = {
  label: string
  values: string[]
}

type TripIntentSummaryProps = {
  destination: string | null
  duration: string | null
  interests: string[]
  avoid: string[]
  excludedStyles: string[]
  pace: string
  budget: string
  traveler: string | null
  foodPreferences: string[]
  language: string
  confidence: number
}

function formatValue(value: string | number | null): string {
  if (value === null || value === '') return 'Not detected'
  return String(value)
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'None detected'
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="border border-[#e8dfd2] bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatValue(value)}</dd>
    </div>
  )
}

function SummaryList({ label, values }: SummaryListProps) {
  return (
    <div className="border border-[#e8dfd2] bg-white p-4">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">{label}</dt>
      <dd className="mt-2 text-sm font-black leading-6 text-[#101820]">{formatList(values)}</dd>
    </div>
  )
}

export function TripIntentSummary({
  destination,
  duration,
  interests,
  avoid,
  excludedStyles,
  pace,
  budget,
  traveler,
  foodPreferences,
  language,
  confidence,
}: TripIntentSummaryProps) {
  return (
    <dl className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <SummaryItem label="Destination" value={destination} />
      <SummaryItem label="Duration" value={duration} />
      <SummaryList label="Interests" values={interests} />
      <SummaryList label="Avoid" values={avoid} />
      <SummaryList label="Travel style exclusions" values={excludedStyles} />
      <SummaryItem label="Pace" value={pace} />
      <SummaryItem label="Budget" value={budget} />
      <SummaryItem label="Traveler / group" value={traveler} />
      <SummaryList label="Food preferences" values={foodPreferences} />
      <SummaryItem label="Language" value={language} />
      <SummaryItem label="Confidence" value={confidence} />
    </dl>
  )
}
