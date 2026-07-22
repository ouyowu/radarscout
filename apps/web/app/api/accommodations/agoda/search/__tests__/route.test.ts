import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const {
  searchAgodaHotels,
  isAgodaAccommodationConfigured,
  rateLimit,
} = vi.hoisted(() => ({
  searchAgodaHotels: vi.fn(),
  isAgodaAccommodationConfigured: vi.fn(),
  rateLimit: vi.fn(),
}))

vi.mock('@/lib/accommodation/agoda', () => ({
  isAgodaAccommodationConfigured,
  searchAgodaHotels,
}))
vi.mock('@/lib/rateLimit', () => ({ rateLimit }))

import { POST } from '../route'

afterEach(() => {
  vi.clearAllMocks()
})

beforeEach(() => {
  rateLimit.mockResolvedValue(null)
})

function request(body: unknown) {
  return new NextRequest('http://localhost/api/accommodations/agoda/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/accommodations/agoda/search', () => {
  it('fails closed when Agoda credentials are not configured', async () => {
    isAgodaAccommodationConfigured.mockReturnValue(false)

    const response = await POST(request({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }))

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'provider_not_configured' })
    expect(searchAgodaHotels).not.toHaveBeenCalled()
  })

  it('rejects invalid dates and unsupported destinations', async () => {
    isAgodaAccommodationConfigured.mockReturnValue(true)

    const response = await POST(request({
      city: 'Tokyo',
      checkIn: 'not-a-date',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'invalid_request' })
    expect(searchAgodaHotels).not.toHaveBeenCalled()
  })

  it('returns only the safe hotel result contract and disables caching', async () => {
    isAgodaAccommodationConfigured.mockReturnValue(true)
    searchAgodaHotels.mockResolvedValue([{ provider: 'agoda', hotelId: '123' }])

    const response = await POST(request({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }))

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ hotels: [{ provider: 'agoda', hotelId: '123' }] })
    expect(rateLimit).toHaveBeenNthCalledWith(1, expect.any(NextRequest), {
      key: 'agoda-accommodation-search',
      max: 6,
      windowSeconds: 600,
    })
    expect(rateLimit).toHaveBeenNthCalledWith(2, expect.any(NextRequest), {
      key: 'agoda-accommodation-search',
      max: 60,
      windowSeconds: 600,
      scope: 'global',
    })
    expect(searchAgodaHotels).toHaveBeenCalledWith({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    })
  })

  it('stops before Agoda when the anonymous search limit is reached', async () => {
    isAgodaAccommodationConfigured.mockReturnValue(true)
    rateLimit.mockResolvedValue(NextResponse.json({ error: 'limited' }, { status: 429 }))

    const response = await POST(request({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }))

    expect(response.status).toBe(429)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(searchAgodaHotels).not.toHaveBeenCalled()
  })
})
