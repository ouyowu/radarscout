'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import type { AiProductContextItem } from '@/lib/aiProducts/buildAiProductContext'
import { track } from '@/lib/analytics/track'
import { isReviewedViatorAffiliateUrl } from '@/lib/viator/reviewedViatorMatching'
import { DecisionGuide } from '../_components/design-system'
import { buildAiTripPlannerDetailHref } from '../ai-trip-planner/AiSearchProductCard'
import { MapLibreDayMap } from '../itineraries/thailand/[city]/[duration]/MapLibreDayMap'
import { getReviewedPlannerMapDay } from './plannerMapCoverage'

type PlannerItineraryWorkspaceProps = {
  itinerary: DayTripItinerary
  products: AiProductContextItem[]
  publicMapToken: string | null
}

export function PlannerItineraryWorkspace({
  itinerary,
  products,
  publicMapToken,
}: PlannerItineraryWorkspaceProps) {
  const [selectedDay, setSelectedDay] = useState(1)
  const requestedDays = useMemo(
    () => Array.from({ length: itinerary.tripSpec.durationDays }, (_, index) => index + 1),
    [itinerary.tripSpec.durationDays],
  )
  const selectedItineraryDay = itinerary.days.find(day => day.dayNumber === selectedDay)
  const selectedProduct = selectedItineraryDay?.experience ?? null
  const mapDay = getReviewedPlannerMapDay(itinerary.tripSpec.destination, selectedDay)
  const selectedProductId = selectedProduct?.productId ?? null
  const rawHandoffHref = selectedProduct?.handoff.href ?? null
  const selectedHandoffHref = rawHandoffHref
    && isReviewedViatorAffiliateUrl(rawHandoffHref)
    ? rawHandoffHref
    : null

  useEffect(() => {
    setSelectedDay(1)
  }, [itinerary.tripSpec.destination, itinerary.tripSpec.durationDays])

  return (
    <section aria-label="Interactive day-trip workspace" className="mt-4">
      <div className="rounded-rs-lg border border-rs-sage-200/80 bg-white p-4 shadow-rs-soft sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">
              {itinerary.tripSpec.durationDays} day{itinerary.tripSpec.durationDays === 1 ? '' : 's'} itinerary
            </p>
            <h3 className="mt-2 font-rs-display text-2xl font-semibold tracking-[-0.025em] text-rs-ink sm:text-3xl">
              {itinerary.tripSpec.destination} day-tour route
            </h3>
          </div>
          <p className="text-xs font-semibold text-rs-muted">
            {products.length} reviewed match{products.length === 1 ? '' : 'es'} · comparison only
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Choose itinerary day">
          {requestedDays.map(dayNumber => (
            <button
              key={dayNumber}
              type="button"
              aria-pressed={selectedDay === dayNumber}
              onClick={() => setSelectedDay(dayNumber)}
              className={selectedDay === dayNumber
                ? 'min-h-[44px] rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink'
                : 'min-h-[44px] rounded-rs-pill border border-rs-sage-200 bg-rs-sand-50 px-5 text-sm font-bold text-rs-muted hover:border-rs-forest-500'}
            >
              Day {dayNumber}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:items-start">
        <article aria-live="polite" className="min-w-0 overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft">
          {selectedProduct ? (
            <>
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.imageAlt ?? selectedProduct.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Day {selectedDay}</p>
                <h4 className="mt-2 font-rs-display text-2xl font-semibold leading-8 text-rs-ink">
                  {selectedProduct.title}
                </h4>
                {selectedProduct.city ? (
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-rs-terracotta-600">
                    {selectedProduct.city}
                  </p>
                ) : null}
                {selectedProduct.summary ? (
                  <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">{selectedProduct.summary}</p>
                ) : null}
                <DecisionGuide
                  whyRecommended={selectedProduct.summary ?? `A reviewed match selected for Day ${selectedDay} of this route.`}
                  bestFor={selectedProduct.tags.length > 0
                    ? selectedProduct.tags.slice(0, 3)
                    : ['Travelers comparing this route stop']}
                  watchOut="Review meeting details, timing, inclusions, and current terms on the product page."
                  compact
                  className="mt-4"
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={buildAiTripPlannerDetailHref(selectedProduct.detailHref, selectedProductId ?? undefined)}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill border border-rs-forest-500 px-5 text-sm font-bold text-rs-forest-700 transition hover:bg-rs-sage-100"
                  >
                    Review product details
                  </Link>
                  {selectedHandoffHref ? (
                    <a
                      href={selectedHandoffHref}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() => track('booking_partner_handoff_clicked', {
                        placement: 'planner_day_workspace',
                        destination: itinerary.tripSpec.destination,
                        productId: selectedProductId ?? '',
                      })}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                    >
                      Check availability
                    </a>
                  ) : null}
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-rs-muted">
                  Current product details and the final booking step stay with Viator.
                </p>
              </div>
            </>
          ) : (
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Day {selectedDay}</p>
              <h4 className="mt-2 font-rs-display text-2xl font-semibold text-rs-ink">Keep this day flexible</h4>
              <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                No additional reviewed day-tour match is assigned to this day yet. RadarScout does not fill the gap with an invented product.
              </p>
            </div>
          )}
        </article>

        <aside aria-label="Selected day map" className="min-w-0 lg:sticky lg:top-5">
          {mapDay ? (
            <MapLibreDayMap
              cityName={mapDay.cityName}
              day={mapDay.dayPlan.day}
              stops={mapDay.dayPlan.stops}
              publicToken={publicMapToken}
            />
          ) : (
            <div className="min-h-[340px] rounded-rs-lg border border-rs-sage-200/80 bg-rs-sage-100 p-6 shadow-rs-soft">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Map coverage</p>
              <h4 className="mt-2 font-rs-display text-2xl font-semibold text-rs-ink">No reviewed map coverage for this day yet</h4>
              <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                The product card remains usable, but RadarScout will not place an approximate pin until route coordinates have been reviewed.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
