'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import type { AiProductContextItem } from '@/lib/aiProducts/buildAiProductContext'
import { track } from '@/lib/analytics/track'
import { getStopsForPace } from '@/lib/itineraries/itineraryFilters'
import type { ThailandItineraryPace } from '@/lib/itineraries/thailandTemplates'
import { isReviewedViatorAffiliateUrl } from '@/lib/viator/reviewedViatorMatching'
import { buildAiTripPlannerDetailHref } from '../ai-trip-planner/AiSearchProductCard'
import { MapLibreDayMap } from '../itineraries/thailand/[city]/[duration]/MapLibreDayMap'
import { getReviewedPlannerMapDay } from './plannerMapCoverage'
import {
  adaptPlannerDecisionSignals,
  collectPlannerThemes,
  filterPlannerProductsByThemes,
  toPlannerPace,
} from './plannerFilters'

const paces: readonly { value: ThailandItineraryPace; label: string }[] = [
  { value: 'chill', label: 'Chill' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'packed', label: 'Packed' },
]

type PlannerDecisionGuideProps = {
  whyRecommended: string
  bestFor: readonly string[]
  watchOut: string
}

function PlannerDecisionGuide({ whyRecommended, bestFor, watchOut }: PlannerDecisionGuideProps) {
  return (
    <div aria-label="Traveler decision guide" className="mt-4 divide-y divide-rs-sage-200/70 border-y border-rs-sage-200/70">
      <div className="py-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-forest-500">Why recommended</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-rs-muted">{whyRecommended}</p>
      </div>
      <div className="py-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-trust">Best for</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {bestFor.map(item => (
            <span key={item} className="rounded-rs-pill bg-rs-sage-100 px-2.5 py-1 text-xs font-bold text-rs-forest-700">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="py-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Watch out</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-rs-muted">{watchOut}</p>
      </div>
    </div>
  )
}

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
  const [pace, setPace] = useState<ThailandItineraryPace>(() => toPlannerPace(itinerary.tripSpec.pace))
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const requestedDays = useMemo(
    () => Array.from({ length: itinerary.tripSpec.durationDays }, (_, index) => index + 1),
    [itinerary.tripSpec.durationDays],
  )
  const selectedItineraryDay = itinerary.days.find(day => day.dayNumber === selectedDay)
  const selectedProduct = selectedItineraryDay?.experience ?? null
  const mapDay = getReviewedPlannerMapDay(itinerary.tripSpec.destination, selectedDay, selectedProduct)
  const selectedProductId = selectedProduct?.productId ?? null
  const rawHandoffHref = selectedProduct?.handoff.href ?? null
  const selectedHandoffHref = rawHandoffHref
    && isReviewedViatorAffiliateUrl(rawHandoffHref)
    ? rawHandoffHref
    : null
  const mapStops = mapDay ? getStopsForPace(mapDay.dayPlan, pace) : []
  const themes = useMemo(() => collectPlannerThemes(products), [products])
  const filteredProducts = useMemo(
    () => filterPlannerProductsByThemes(products, selectedThemes),
    [products, selectedThemes],
  )
  const selectedDecisionSignals = selectedProduct
    ? adaptPlannerDecisionSignals(selectedProduct, selectedProduct.decisionSignals, pace, selectedThemes)
    : null

  function toggleTheme(theme: string) {
    setSelectedThemes(current => current.includes(theme)
      ? current.filter(value => value !== theme)
      : [...current, theme])
  }

  useEffect(() => {
    setSelectedDay(1)
  }, [itinerary.tripSpec.destination, itinerary.tripSpec.durationDays])

  useEffect(() => {
    setPace(toPlannerPace(itinerary.tripSpec.pace))
  }, [itinerary.tripSpec.pace])

  useEffect(() => {
    setSelectedThemes([])
  }, [products])

  return (
    <section aria-label="Interactive day-trip workspace">
      <div className="rounded-rs-md border border-rs-sage-200/80 bg-white p-3 shadow-rs-soft sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">
              {itinerary.tripSpec.durationDays} day{itinerary.tripSpec.durationDays === 1 ? '' : 's'} itinerary
            </p>
            <h3 className="mt-1 font-rs-display text-xl font-semibold tracking-[-0.025em] text-rs-ink sm:text-2xl">
              {itinerary.tripSpec.destination} day-tour route
            </h3>
          </div>
          <p className="text-xs font-semibold text-rs-muted">
            {products.length} reviewed match{products.length === 1 ? '' : 'es'} · comparison only
          </p>
        </div>

        <div className="mt-3 grid gap-3 border-t border-rs-sage-200/80 pt-3 xl:grid-cols-[auto_1fr] xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Pace</p>
            <div className="mt-2 flex flex-wrap gap-2" aria-label="Choose itinerary pace">
              {paces.map(option => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={pace === option.value}
                  onClick={() => setPace(option.value)}
                  className={pace === option.value
                    ? 'min-h-[44px] rounded-rs-pill bg-rs-forest-900 px-5 text-sm font-bold text-white'
                    : 'min-h-[44px] rounded-rs-pill border border-rs-sage-200 bg-rs-sand-50 px-5 text-sm font-bold text-rs-forest-700 hover:border-rs-forest-500'}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {themes.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Themes</p>
              <div className="mt-2 flex flex-wrap gap-2" aria-label="Filter reviewed experiences by theme">
                {themes.map(theme => (
                  <button
                    key={theme}
                    type="button"
                    aria-pressed={selectedThemes.includes(theme)}
                    onClick={() => toggleTheme(theme)}
                    className={selectedThemes.includes(theme)
                      ? 'min-h-[44px] rounded-rs-pill bg-rs-terracotta px-4 text-xs font-bold text-rs-ink'
                      : 'min-h-[44px] rounded-rs-pill border border-rs-sage-200 bg-white px-4 text-xs font-bold text-rs-muted hover:border-rs-terracotta'}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose itinerary day">
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

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(290px,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <article aria-live="polite" className="min-w-0 overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft">
          {selectedProduct ? (
            <>
              {selectedProduct.imageUrl ? (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.imageAlt ?? selectedProduct.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : null}
              <div className="p-4 sm:p-5">
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
                <PlannerDecisionGuide
                  whyRecommended={selectedDecisionSignals?.whyRecommended
                    ?? selectedProduct.summary
                    ?? `A reviewed match selected for Day ${selectedDay} of this route.`}
                  bestFor={selectedDecisionSignals?.bestFor
                    ?? (selectedProduct.tags.length > 0
                    ? selectedProduct.tags.slice(0, 3)
                    : ['Travelers comparing this route stop'])}
                  watchOut={selectedDecisionSignals?.watchOut
                    ?? 'Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.'}
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
              stops={mapStops}
              publicToken={publicMapToken}
              precision={mapDay.precision}
              reviewedAt={mapDay.lastReviewedAt}
              className="h-[420px] lg:h-[calc(100vh-12rem)] lg:min-h-[560px] lg:max-h-[760px]"
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

      <section aria-label="Filtered reviewed matches" className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Reviewed matches</p>
            <h3 className="mt-2 font-rs-display text-2xl font-semibold tracking-[-0.025em] text-rs-ink sm:text-3xl">
              Compare experiences for this trip
            </h3>
          </div>
          <p className="text-xs font-semibold text-rs-muted">{filteredProducts.length} shown · filters stay on this page</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(product => {
              const handoffHref = product.ctaHref && isReviewedViatorAffiliateUrl(product.ctaHref)
                ? product.ctaHref
                : null
              const decisionSignals = adaptPlannerDecisionSignals(
                product,
                product.decisionSignals,
                pace,
                selectedThemes,
              )

              return (
                <article key={product.id} className="min-w-0 overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt ?? product.title}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : null}
                  <div className="p-5">
                    {product.city ? (
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">{product.city}</p>
                    ) : null}
                    <h4 className="mt-2 font-rs-display text-xl font-semibold leading-7 text-rs-ink">{product.title}</h4>
                    {product.summary ? (
                      <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-rs-muted">{product.summary}</p>
                    ) : null}
                    <PlannerDecisionGuide
                      whyRecommended={decisionSignals?.whyRecommended
                        ?? product.summary
                        ?? 'A reviewed match for the confirmed destination and themes.'}
                      bestFor={decisionSignals?.bestFor
                        ?? (product.tags.length > 0
                        ? product.tags.slice(0, 3)
                        : ['Travelers comparing this Thailand day trip'])}
                      watchOut={decisionSignals?.watchOut
                        ?? 'Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.'}
                    />
                    <div className="mt-5 grid gap-2">
                      <Link
                        href={buildAiTripPlannerDetailHref(product.detailHref, product.id)}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill border border-rs-forest-500 px-5 text-sm font-bold text-rs-forest-700 transition hover:bg-rs-sage-100"
                      >
                        Review product details
                      </Link>
                      {handoffHref ? (
                        <a
                          href={handoffHref}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={() => track('booking_partner_handoff_clicked', {
                            placement: 'planner_filtered_matches',
                            destination: itinerary.tripSpec.destination,
                            productId: product.id,
                          })}
                          className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                        >
                          Check availability
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-rs-lg border border-rs-sage-200 bg-white px-5 py-8 text-sm font-semibold leading-6 text-rs-muted">
            No reviewed experience matches these themes. Clear a theme to return to the reviewed result set.
          </div>
        )}
      </section>
    </section>
  )
}
