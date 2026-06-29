type PartnerInventoryNoticeProps = {
  status?: 'live' | 'coming-soon' | 'planning-only'
  inventoryStatus?: 'live' | 'coming-soon' | 'planning-only'
  destinationName?: string
  currentDestination?: string
  availableLocations?: string[]
}

export function PartnerInventoryNotice({
  status,
  inventoryStatus,
  destinationName,
  currentDestination,
  availableLocations = ['Thailand'],
}: PartnerInventoryNoticeProps) {
  const resolvedStatus = inventoryStatus ?? status ?? 'planning-only'
  const destination = currentDestination ?? destinationName ?? 'this destination'
  const liveLocations = availableLocations.length > 0 ? availableLocations : ['Thailand']
  const liveLocationText = liveLocations.join(', ')
  const isLive = resolvedStatus === 'live'

  return (
    <aside className={`rounded-3xl border p-5 ${isLive ? 'border-[var(--color-live-inventory)] bg-[#f2f8f4]' : 'border-[var(--color-coming-soon)] bg-[var(--color-accent-orange-pale)]'}`}>
      <p className={`text-sm font-black uppercase tracking-[0.12em] ${isLive ? 'text-[var(--color-live-inventory)]' : 'text-[var(--color-coming-soon)]'}`}>
        {isLive ? 'Partner handoff ready' : 'Planning only'}
      </p>
      <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
        {isLive
          ? `Recommended experiences are currently available in ${destination} through trusted booking partner handoff. ${liveLocationText} is RadarScout's current focused experience location.`
          : `Partner-ready experiences are coming soon for ${destination}. ${liveLocationText} is RadarScout's current focused experience location. RadarScout only shows traveler-facing recommendations when product details and booking partner handoff are safe to present.`}
      </p>
      {!isLive ? (
        <p className="mt-2 text-xs font-bold leading-6 text-[#7c4a03]">
          Other destinations remain planning-only while RadarScout onboards trusted local suppliers.
        </p>
      ) : null}
      <p className="mt-2 text-xs font-bold leading-6 text-[var(--color-text-muted)]">
        Thailand is currently RadarScout&apos;s first focused experience destination.
      </p>
    </aside>
  )
}
