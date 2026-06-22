import Link from 'next/link'
import type { ItineraryDraft } from '@/lib/aiProducts/itineraryDraftSchema'
import type { AiProductContextItem } from '@/lib/aiProducts/buildAiProductContext'

type ItineraryDraftShellProps = {
  draft: ItineraryDraft
  products: AiProductContextItem[]
}

const timeOfDayLabel: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  flexible: 'Flexible',
}

export function ItineraryDraftShell({ draft, products }: ItineraryDraftShellProps) {
  const productMap = new Map(products.map(p => [p.id, p]))

  return (
    <section
      aria-label="AI itinerary draft"
      className="mt-5 border border-[#1e2d59]/20 bg-[#f7f9ff] p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1e2d59]">
            AI itinerary draft
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
            {draft.destination} — {draft.durationDays} day{draft.durationDays === 1 ? '' : 's'}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#5a6670]">
          Suggested plan only. No booking or availability check.
        </p>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">{draft.summary}</p>

      {draft.warnings.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {draft.warnings.map((w, i) => (
            <li key={i} className="text-xs font-semibold text-[#a35c09]">
              {w}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 space-y-4">
        {draft.days.map(day => (
          <article key={day.day} className="border border-[#dce8fb] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e2d59] text-xs font-black text-white">
                {day.day}
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#1e2d59]">
                  {day.theme}
                </p>
                <h4 className="text-base font-black text-[#101820]">{day.title}</h4>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {day.items.map((item, j) => {
                const linkedProduct =
                  item.type === 'experience' && item.productId
                    ? productMap.get(item.productId)
                    : null

                return (
                  <div
                    key={j}
                    className="border-l-2 border-[#c7d9f5] pl-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5a6670]">
                      {timeOfDayLabel[item.timeOfDay] ?? item.timeOfDay}
                      {item.type !== 'experience' ? ` · ${item.type.replace(/_/g, ' ')}` : ''}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#101820]">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#5a6670]">
                      {item.description}
                    </p>
                    {linkedProduct ? (
                      <Link
                        href={linkedProduct.detailHref}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f766e] hover:underline"
                      >
                        View experience →
                      </Link>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold leading-6 text-[#9a9084]">
        This is an AI suggested plan using matched real Thailand experiences from trusted local operators. No booking, availability, or
        pricing is confirmed. Check availability and secure booking handoff are handled by our booking partner.
      </p>
    </section>
  )
}
