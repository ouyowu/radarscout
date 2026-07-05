import type { ConfirmedTripIntent } from '../../lib/ai-trip/itinerary-contract'
import { buildDeterministicPlanningOutline } from '../../lib/ai-trip/placeholder-itinerary'

type ItineraryPlaceholderShellProps = {
  intent: Pick<
    ConfirmedTripIntent,
    'destination' | 'durationDays' | 'interests' | 'foodPreferences' | 'pace' | 'travelerType' | 'avoid'
  >
}

export function ItineraryPlaceholderShell({
  intent,
}: ItineraryPlaceholderShellProps) {
  const outline = buildDeterministicPlanningOutline(intent)

  if (!outline) return null

  return (
    <section className="mt-5 border border-[#ded7ca] bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a35c09]">
            Suggested planning outline
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
            {outline.title}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#5a6670]">
          Based only on your confirmed destination, duration, and interests.
        </p>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
        {outline.fitExplanation}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {outline.slots.map(slot => (
          <article key={slot.label} className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#a35c09]">
              {slot.label}
            </p>
            <h4 className="mt-2 text-lg font-black text-[#101820]">
              {slot.title}
            </h4>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
              {slot.description}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
        {outline.safetyNote}
      </p>
    </section>
  )
}
