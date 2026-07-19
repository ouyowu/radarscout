import { NextRequest, NextResponse } from 'next/server'
import {
  isAgodaAccommodationConfigured,
  searchAgodaHotels,
} from '@/lib/accommodation/agoda'
import {
  isAgodaSupportedCity,
  type AgodaHotelSearchInput,
} from '@/lib/accommodation/agoda-contract'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
}

function parseInput(body: unknown): AgodaHotelSearchInput | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const input = body as Record<string, unknown>
  if (typeof input.city !== 'string' || !isAgodaSupportedCity(input.city)) return null
  if (!isValidIsoDate(input.checkIn) || !isValidIsoDate(input.checkOut)) return null
  if (!isIntegerInRange(input.adults, 1, 10) || !isIntegerInRange(input.children, 0, 6)) return null

  const checkIn = Date.parse(`${input.checkIn}T00:00:00Z`)
  const checkOut = Date.parse(`${input.checkOut}T00:00:00Z`)
  const nights = Math.round((checkOut - checkIn) / 86_400_000)
  if (nights < 1 || nights > 30) return null

  return {
    city: input.city,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults,
    children: input.children,
  }
}

export async function POST(request: NextRequest) {
  if (!isAgodaAccommodationConfigured()) {
    return NextResponse.json(
      { error: 'provider_not_configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const input = parseInput(body)
  if (!input) {
    return NextResponse.json(
      { error: 'invalid_request' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const limited = await Promise.race([
      (async () => {
        const perIpLimit = await rateLimit(request, {
          key: 'agoda-accommodation-search',
          max: 6,
          windowSeconds: 600,
        })
        if (perIpLimit) return perIpLimit

        return rateLimit(request, {
          key: 'agoda-accommodation-search',
          max: 60,
          windowSeconds: 600,
          scope: 'global',
        })
      })(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('rate limiter timeout')), 2_000)
      }),
    ])
    if (limited) {
      limited.headers.set('Cache-Control', 'no-store')
      return limited
    }
  } catch {
    return NextResponse.json(
      { error: 'provider_unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const hotels = await searchAgodaHotels(input)
    return NextResponse.json(
      { hotels },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json(
      { error: 'provider_unavailable' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
