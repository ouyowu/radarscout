'use client'

import { FormEvent, useState } from 'react'
import { track } from '@/lib/analytics/track'
import {
  isAgodaSupportedCity,
  type AgodaHotelResult,
} from '@/lib/accommodation/agoda-contract'
import { addDaysToIsoDate } from './agodaStaySearch.helpers'

type AgodaStaySearchProps = {
  city: string
  durationDays: number
}

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function AgodaStaySearch({ city, durationDays }: AgodaStaySearchProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [hotels, setHotels] = useState<AgodaHotelResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAgodaSupportedCity(city)) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checkIn || !checkOut || loading) return
    setLoading(true)
    setError(null)
    setHotels([])

    try {
      const response = await fetch('/api/accommodations/agoda/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, checkIn, checkOut, adults, children: 0 }),
      })
      if (!response.ok) throw new Error('search_failed')
      const data = await response.json() as { hotels?: AgodaHotelResult[] }
      setHotels(Array.isArray(data.hotels) ? data.hotels : [])
    } catch {
      setError('Hotel results could not be loaded. Your day-trip route is still available above.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-label="Agoda stay suggestions" className="mt-8 rounded-rs-lg border border-rs-sage-200/80 bg-white p-5 shadow-rs-soft sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Stay around this route</p>
        <h3 className="mt-2 font-rs-display text-2xl font-semibold tracking-[-0.025em] text-rs-ink sm:text-3xl">
          Compare Agoda stays in {city}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">
          Add dates to retrieve current Agoda hotel content and rates for this trip. Review the stay details and continue on Agoda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.7fr_auto] lg:items-end">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-rs-forest-700">
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={event => {
              const nextCheckIn = event.target.value
              setCheckIn(nextCheckIn)
              setCheckOut(addDaysToIsoDate(nextCheckIn, Math.max(1, durationDays)))
            }}
            required
            className="mt-2 min-h-[48px] w-full rounded-rs-sm border border-rs-sage-200 bg-rs-sand-50 px-3 text-sm font-semibold text-rs-ink"
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-rs-forest-700">
          Check-out
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={event => setCheckOut(event.target.value)}
            required
            className="mt-2 min-h-[48px] w-full rounded-rs-sm border border-rs-sage-200 bg-rs-sand-50 px-3 text-sm font-semibold text-rs-ink"
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-rs-forest-700">
          Adults
          <input
            type="number"
            min={1}
            max={10}
            value={adults}
            onChange={event => setAdults(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
            className="mt-2 min-h-[48px] w-full rounded-rs-sm border border-rs-sage-200 bg-rs-sand-50 px-3 text-sm font-semibold text-rs-ink"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !checkIn || !checkOut}
          className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white disabled:cursor-not-allowed disabled:bg-rs-sage-200"
        >
          {loading ? 'Searching…' : 'Find Agoda stays'}
        </button>
      </form>

      {error ? <p role="alert" className="mt-4 text-sm font-semibold text-rs-terracotta-600">{error}</p> : null}
      {!loading && !error && checkIn && hotels.length === 0 ? (
        <p className="mt-4 text-sm font-semibold text-rs-muted">
          Choose dates and search to see Agoda hotel results.
        </p>
      ) : null}

      {hotels.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hotels.map(hotel => (
            <article key={hotel.hotelId} className="overflow-hidden rounded-rs-md border border-rs-sage-200/80 bg-rs-sand-50">
              {hotel.imageUrl ? (
                <img src={hotel.imageUrl} alt={hotel.name} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              ) : null}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-rs-forest-700">Agoda stay · {hotel.city}</p>
                <h4 className="mt-2 font-rs-display text-xl font-semibold leading-7 text-rs-ink">{hotel.name}</h4>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-rs-muted">
                  {hotel.starRating ? <span>{hotel.starRating.toFixed(1)}-star property</span> : null}
                  {hotel.reviewScore ? <span>{hotel.reviewScore.toFixed(1)}/10 on Agoda</span> : null}
                </div>
                {hotel.price ? (
                  <p className="mt-3 text-sm font-bold text-rs-forest-700">
                    From {formatPrice(hotel.price.perNight, hotel.price.currency)} per night for these dates
                  </p>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-rs-muted">Review current rates on Agoda.</p>
                )}
                <a
                  href={hotel.handoffUrl}
                  target="_blank"
                  rel={hotel.handoffRel}
                  onClick={() => track('affiliate_partner_handoff_clicked', {
                    partner: 'agoda',
                    placement: 'planner_stay_results',
                    destination: city,
                    productId: `agoda:${hotel.hotelId}`,
                  })}
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-rs-pill bg-rs-forest-900 px-5 text-sm font-bold text-white transition hover:bg-rs-forest-700"
                >
                  View on Agoda
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
