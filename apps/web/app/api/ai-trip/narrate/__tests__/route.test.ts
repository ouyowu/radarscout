import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { parseTripIntent } from '@/lib/ai-trip/parse-intent'
import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'

const mocks = vi.hoisted(() => ({
  rateLimit: vi.fn(),
  runPipeline: vi.fn(),
  stream: vi.fn(),
}))

vi.mock('@/lib/rateLimit', () => ({ rateLimit: mocks.rateLimit }))
vi.mock('@/lib/ai-trip/gated-itinerary-pipeline', () => ({
  runGatedItineraryPipeline: mocks.runPipeline,
}))
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({ messages: { stream: mocks.stream } })),
}))

import { POST } from '../route'

const itinerary: DayTripItinerary = {
  version: 1,
  tripSpec: {
    destination: 'Chiang Mai',
    durationDays: 1,
    interests: ['elephants'],
    pace: 'relaxed',
    travelerType: 'family',
    groupSize: 3,
    contentScope: 'day_tours_only',
  },
  days: [
    {
      dayNumber: 1,
      experience: {
        productId: 'reviewed-product',
        title: 'Reviewed Chiang Mai Day',
        city: 'Chiang Mai',
        summary: 'A reviewed day-trip comparison.',
        imageUrl: null,
        imageAlt: null,
        tags: ['Elephants'],
        detailHref: '/tours/reviewed-product',
        handoff: {
          label: 'Check availability',
          href: 'https://widgets.bokun.io/online-sales/channel/experience/1',
          rel: 'nofollow sponsored noopener noreferrer',
        },
      },
    },
  ],
  unfilledDayCount: 0,
  safety: {
    availabilityChecked: false,
    bookingCompleted: false,
    paymentHandled: false,
  },
}

function request(prompt = 'Chiang Mai 1 day elephants') {
  return new NextRequest('https://radarscout.io/api/ai-trip/narrate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.42',
    },
    body: JSON.stringify({ prompt }),
  })
}

describe('POST /api/ai-trip/narrate', () => {
  const originalEnabled = process.env.AI_TRIP_NARRATION_ENABLED
  const originalKey = process.env.ANTHROPIC_API_KEY
  const originalRedisUrl = process.env.REDIS_URL

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.AI_TRIP_NARRATION_ENABLED = 'true'
    process.env.ANTHROPIC_API_KEY = 'test-key'
    process.env.REDIS_URL = 'redis://localhost:6379'
    mocks.rateLimit.mockResolvedValue(null)
    mocks.runPipeline.mockResolvedValue({
      status: 'ok',
      parsed: parseTripIntent('Chiang Mai 1 day elephants'),
      handoffReadyProducts: [],
      itinerary,
      fallbackUsed: false,
      candidateCount: 1,
    })
    mocks.stream.mockReturnValue((async function* () {
      yield {
        type: 'content_block_delta',
        delta: {
          type: 'text_delta',
          text: 'Day 1: Review https://example.com for price and booking details.',
        },
      }
    })())
  })

  afterEach(() => {
    if (originalEnabled === undefined) delete process.env.AI_TRIP_NARRATION_ENABLED
    else process.env.AI_TRIP_NARRATION_ENABLED = originalEnabled
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = originalKey
    if (originalRedisUrl === undefined) delete process.env.REDIS_URL
    else process.env.REDIS_URL = originalRedisUrl
  })

  it('stays off until the dedicated feature flag is enabled', async () => {
    process.env.AI_TRIP_NARRATION_ENABLED = 'false'

    const response = await POST(request())

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ narrationEnabled: false })
    expect(mocks.rateLimit).not.toHaveBeenCalled()
    expect(mocks.runPipeline).not.toHaveBeenCalled()
  })

  it('enforces both per-IP and global paid-request limits', async () => {
    mocks.rateLimit
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(NextResponse.json({ error: 'global limit' }, { status: 429 }))

    const response = await POST(request())

    expect(response.status).toBe(429)
    expect(mocks.rateLimit).toHaveBeenNthCalledWith(1, expect.any(NextRequest), {
      key: 'ai-trip-narrate',
      max: 10,
      windowSeconds: 600,
    })
    expect(mocks.rateLimit).toHaveBeenNthCalledWith(2, expect.any(NextRequest), {
      key: 'ai-trip-narrate',
      max: 100,
      windowSeconds: 600,
      scope: 'global',
    })
    expect(mocks.runPipeline).not.toHaveBeenCalled()
  })

  it('does not let an over-limit IP consume the shared global budget', async () => {
    mocks.rateLimit.mockResolvedValueOnce(
      NextResponse.json({ error: 'per-IP limit' }, { status: 429 }),
    )

    const response = await POST(request())

    expect(response.status).toBe(429)
    expect(mocks.rateLimit).toHaveBeenCalledTimes(1)
    expect(mocks.runPipeline).not.toHaveBeenCalled()
  })

  it('does not call the model when the guarded pipeline has no itinerary', async () => {
    mocks.runPipeline.mockResolvedValue({
      status: 'no_match',
      parsed: parseTripIntent('Chiang Mai 1 day elephants'),
      fallbackUsed: false,
      candidateCount: 0,
    })

    const response = await POST(request())

    expect(response.status).toBe(422)
    expect(mocks.stream).not.toHaveBeenCalled()
  })

  it('streams sanitized text from the reviewed server-side itinerary only', async () => {
    const response = await POST(request())
    const text = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(text).toContain('Day 1:')
    expect(text).not.toContain('https://')
    expect(text).not.toMatch(/\bprice\b|\bbooking\b/i)
    expect(mocks.runPipeline).toHaveBeenCalledWith('Chiang Mai 1 day elephants')
  })
})
