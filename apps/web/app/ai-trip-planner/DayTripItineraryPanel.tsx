import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import { buildAiTripPlannerDetailHref } from './AiSearchProductCard'
import { buildOpenStreetMapSearchHref, getItineraryDestinations } from './dayTripMap'

type DayTripItineraryPanelProps = {
  itinerary: DayTripItinerary
}

export function DayTripItineraryPanel({ itinerary }: DayTripItineraryPanelProps) {
  const destinations = getItineraryDestinations(itinerary)

  return (
    <section
      aria-label="Suggested Thailand day trips"
      className="mt-3 overflow-hidden rounded-[1.5rem] border border-[#d8eadf] bg-[#f5fbf7] sm:mt-4"
    >
      <div className="border-b border-[#d8eadf] px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
          Day-tour plan
        </p>
        <h3 className="mt-1.5 text-xl font-black tracking-[-0.025em] text-[#101820] sm:mt-2 sm:text-2xl">
          Your suggested Thailand day trips
        </h3>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#5a6670]">
          Built from reviewed day-tour suggestions that matched your trip idea. This is a planning sequence; current product details stay on product pages.
        </p>
      </div>

      {destinations.length > 0 ? (
        <div
          aria-label="Destination map overview"
          className="border-b border-[#d8eadf] bg-[#e7f5f2] px-4 py-4 sm:px-5"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
            Map overview
          </p>
          <h4 className="mt-1.5 text-lg font-black text-[#101820]">
            Explore destination areas
          </h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
            These links show destination areas only. Exact meeting and pickup details remain on each product page.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {destinations.map(destination => (
              <a
                key={destination}
                href={buildOpenStreetMapSearchHref(destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full bg-white px-4 text-xs font-black uppercase tracking-[0.1em] text-[#1e2d59] transition hover:text-[#0f766e]"
              >
                Open {destination} area map
              </a>
            ))}
          </div>
        </div>
      ) : null}

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
              {day.experience.summary ? (
                <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[#5a6670]">
                  {day.experience.summary}
                </p>
              ) : null}
              {day.experience.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {day.experience.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f5efe8] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#8a4b25]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <a
                href={buildAiTripPlannerDetailHref(day.experience.detailHref, day.experience.productId)}
                className="mt-auto pt-4 text-sm font-black text-[#1e2d59] underline decoration-[#1e2d59]/30 underline-offset-4 hover:text-[#0f766e]"
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
