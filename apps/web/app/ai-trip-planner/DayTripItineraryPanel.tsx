import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import type { SafeAffiliateAnalyticsContext } from '@/lib/affiliates/affiliateTripContext'
import { DecisionGuide } from '../_components/design-system'
import { buildAiTripPlannerDetailHref } from './AiSearchProductCard'
import { getItineraryDestinations } from './dayTripMap'
import { buildTripSpecChips } from './dayTripSpecSummary'
import { ThailandRouteMap } from './ThailandRouteMap'

type DayTripItineraryPanelProps = {
  itinerary: DayTripItinerary
  handoffContext: SafeAffiliateAnalyticsContext
}

export function DayTripItineraryPanel({ itinerary, handoffContext }: DayTripItineraryPanelProps) {
  const destinations = getItineraryDestinations(itinerary)
  const tripSpecChips = buildTripSpecChips(itinerary.tripSpec)

  return (
    <section
      aria-label="Suggested Thailand day trips"
      className="mt-3 overflow-hidden rounded-[1.5rem] border border-[#d8eadf] bg-[#f5fbf7] sm:mt-4"
    >
      <div className="border-b border-[#d8eadf] px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
          Suggested plan
        </p>
        <h3 className="mt-1.5 text-xl font-black tracking-[-0.025em] text-[#101820] sm:mt-2 sm:text-2xl">
          A day-by-day route from reviewed matches
        </h3>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#5a6670]">
          Built from reviewed day-tour suggestions that matched your trip idea. This is a planning sequence; current product details stay on product pages.
        </p>
        <div aria-label="Trip plan overview" className="mt-3 flex flex-wrap gap-2">
          {tripSpecChips.map(chip => (
            <span
              key={chip}
              className="rounded-full bg-[#e7f5f2] px-3 py-1 text-xs font-black text-[#0f766e]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {destinations.length > 0 ? (
        <div
          aria-label="Destination map overview"
          className="border-b border-[#d8eadf] bg-[#e7f5f2] px-4 py-4 sm:px-5"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
            Route map
          </p>
          <h4 className="mt-1.5 text-lg font-black text-[#101820]">
            Suggested route
          </h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
            The schematic map shows destination areas only. Exact meeting and pickup details remain on each product page.
          </p>
          <div className="mt-4">
            <ThailandRouteMap itinerary={itinerary} />
          </div>
        </div>
      ) : null}

      <div className="border-b border-[#d8eadf] bg-white px-4 py-4 sm:px-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
          Match results
        </p>
        <h4 className="mt-1.5 text-lg font-black text-[#101820]">Reviewed experiences</h4>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
          Compare why each match fits, who it suits, and what to review before continuing.
        </p>
      </div>

      <ol className="grid gap-px bg-[#d8eadf] sm:grid-cols-2 xl:grid-cols-3">
        {itinerary.days.map(day => (
          <li key={`${day.dayNumber}-${day.experience.productId}`} className="bg-white p-4 sm:p-5">
            <article className="flex h-full flex-col">
              {day.experience.imageUrl ? (
                <img
                  src={day.experience.imageUrl}
                  alt={day.experience.imageAlt ?? day.experience.title}
                  loading="lazy"
                  className="mb-4 aspect-[4/3] w-full rounded-[1rem] object-cover"
                />
              ) : null}
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
                Day {day.dayNumber}
              </p>
              <h4 className="mt-2 text-lg font-black leading-tight text-[#101820]">
                {day.experience.title}
              </h4>
              {day.experience.city ? (
                <p className="mt-2 text-xs font-black uppercase tracking-[0.1em] text-[#8a4b25]">
                  {day.experience.city}
                </p>
              ) : null}
              <DecisionGuide
                whyRecommended={day.experience.summary ?? `A reviewed match selected for Day ${day.dayNumber} of this route.`}
                bestFor={day.experience.tags.length > 0 ? day.experience.tags.slice(0, 3) : ['Travelers comparing this route stop']}
                watchOut="Review meeting details, timing, inclusions, and current terms on the product page."
                compact
                className="mt-4"
              />
              <a
                href={buildAiTripPlannerDetailHref(day.experience.detailHref, day.experience.productId, handoffContext)}
                className="mt-auto pt-4 text-sm font-black text-rs-forest-700 underline decoration-rs-forest-500/30 underline-offset-4 hover:text-rs-terracotta-600"
              >
                Review product details
              </a>
            </article>
          </li>
        ))}
      </ol>

      {itinerary.unfilledDayCount > 0 ? (
        <p className="border-t border-[#d8eadf] bg-[#fffdf7] px-4 py-3 text-sm font-semibold leading-6 text-[#6b5d4d] sm:px-5">
          {itinerary.unfilledDayCount} day{itinerary.unfilledDayCount === 1 ? '' : 's'} remains open because no additional reviewed day-tour match was found.
        </p>
      ) : null}
    </section>
  )
}
