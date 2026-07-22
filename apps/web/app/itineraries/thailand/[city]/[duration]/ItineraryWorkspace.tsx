'use client'

import { useMemo, useState } from 'react'
import { track } from '@/lib/analytics/track'
import { filterItineraryProducts, getStopsForPace } from '@/lib/itineraries/itineraryFilters'
import type {
  ThailandItineraryPace,
  ThailandItineraryTemplate,
} from '@/lib/itineraries/thailandTemplates'
import type { ReviewedViatorProduct } from '@/lib/viator/reviewedViatorProducts'
import { MapLibreDayMap } from './MapLibreDayMap'

const paces: readonly { value: ThailandItineraryPace; label: string }[] = [
  { value: 'chill', label: 'Chill' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'packed', label: 'Packed' },
]

type ItineraryWorkspaceProps = {
  template: ThailandItineraryTemplate
  products: readonly ReviewedViatorProduct[]
  publicMapToken: string | null
}

export function ItineraryWorkspace({ template, products, publicMapToken }: ItineraryWorkspaceProps) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [pace, setPace] = useState<ThailandItineraryPace>('balanced')
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const currentDay = template.dayPlans.find(dayPlan => dayPlan.day === selectedDay) ?? template.dayPlans[0]
  const stops = getStopsForPace(currentDay, pace)
  const themes = useMemo(
    () => Array.from(new Set(products.filter(product => product.city === template.cityName).flatMap(product => product.tags)))
      .sort()
      .slice(0, 8),
    [products, template.cityName],
  )
  const matchingProducts = filterItineraryProducts(products, template.cityName, selectedThemes).slice(0, 6)

  function toggleTheme(theme: string) {
    setSelectedThemes(current => current.includes(theme)
      ? current.filter(value => value !== theme)
      : [...current, theme])
  }

  return (
    <div className="mt-8">
      <div className="rounded-rs-lg border border-rs-sage-200/80 bg-white p-4 shadow-rs-soft sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-end">
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
                    ? 'min-h-[40px] rounded-rs-pill bg-rs-terracotta px-4 text-xs font-bold capitalize text-rs-ink'
                    : 'min-h-[40px] rounded-rs-pill border border-rs-sage-200 bg-white px-4 text-xs font-bold capitalize text-rs-muted hover:border-rs-terracotta'}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,1.04fr)] lg:items-start">
        <section aria-label="Day-by-day itinerary" className="min-w-0 overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft">
          <div className="border-b border-rs-sage-200/80 px-5 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">{template.days} days itinerary</p>
            <h2 className="mt-2 font-rs-display text-3xl font-semibold tracking-[-0.025em] text-rs-ink">{template.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">{template.summary}</p>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Choose itinerary day">
              {template.dayPlans.map(dayPlan => (
                <button
                  key={dayPlan.day}
                  type="button"
                  aria-pressed={selectedDay === dayPlan.day}
                  onClick={() => setSelectedDay(dayPlan.day)}
                  className={selectedDay === dayPlan.day
                    ? 'min-h-[44px] shrink-0 rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink'
                    : 'min-h-[44px] shrink-0 rounded-rs-pill border border-rs-sage-200 px-5 text-sm font-bold text-rs-muted hover:border-rs-forest-500'}
                >
                  Day {dayPlan.day}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Day {currentDay.day}</p>
                <h3 className="mt-1 font-rs-display text-2xl font-semibold text-rs-ink">{currentDay.theme}</h3>
              </div>
              <span className="rounded-rs-pill bg-rs-sage-200/60 px-3 py-1 text-xs font-bold capitalize text-rs-forest-700">{pace} pace</span>
            </div>

            <ol className="mt-5 grid gap-3">
              {stops.map((stop, index) => (
                <li key={stop.name} className="rounded-rs-md border border-rs-sage-200/80 bg-rs-sand-50 p-4">
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rs-terracotta text-sm font-black text-rs-ink">{index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h4 className="font-rs-display text-lg font-semibold text-rs-ink">{stop.name}</h4>
                        <span className="text-xs font-bold text-rs-muted">About {stop.durationMinutes} min</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold leading-6 text-rs-muted">{stop.summary}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <aside aria-label="Selected day map" className="min-w-0 lg:sticky lg:top-5">
          <MapLibreDayMap
            cityName={template.cityName}
            day={currentDay.day}
            stops={stops}
            publicToken={publicMapToken}
          />
        </aside>
      </div>

      <section aria-label="Reviewed experiences" className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Reviewed experiences</p>
            <h2 className="mt-2 font-rs-display text-3xl font-semibold tracking-[-0.025em] text-rs-ink">Compare a day tour for this route</h2>
          </div>
          <p className="text-xs font-semibold text-rs-muted">Current details continue on Viator</p>
        </div>

        {matchingProducts.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {matchingProducts.map(product => (
              <article key={product.id} className="overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft">
                <img src={product.imageUrl} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">{product.city}</p>
                  <h3 className="mt-2 font-rs-display text-xl font-semibold leading-7 text-rs-ink">{product.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-rs-muted">{product.shortSummary}</p>
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() => track('booking_partner_handoff_clicked', {
                      provider: 'viator',
                      placement: 'itinerary_template',
                      city: product.city,
                      destination: template.citySlug,
                      hasDates: false,
                      productId: product.id,
                    })}
                    className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                  >
                    Check availability
                  </a>
                  <p className="mt-2 text-center text-xs font-semibold text-rs-muted">Opens Viator for current product details.</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-rs-lg border border-rs-sage-200 bg-white px-5 py-8 text-sm font-semibold leading-6 text-rs-muted">
            No reviewed experience currently matches these theme filters. Clear a theme to see the reviewed city set.
          </div>
        )}

        <p className="mt-4 text-xs font-semibold leading-5 text-rs-muted">
          RadarScout compares reviewed options. Current details and the final booking step stay with Viator after you continue.
        </p>
      </section>
    </div>
  )
}
