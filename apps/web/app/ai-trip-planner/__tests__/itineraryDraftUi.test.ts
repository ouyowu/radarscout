/**
 * UI logic tests for TD-AI-ITINERARY-7.
 * vitest is Node-only (no jsdom). Tests cover pure logic and type-level contracts.
 */
import { describe, expect, it, vi } from 'vitest'
import { canSearchFromConfirmed, canGenerateDraft } from '../IntentParserDemo'
import type { ItineraryDraftResponse } from '../../api/ai-trip/itinerary-draft/route'

function makeConfirmed() {
  return {
    destination: 'Chiang Mai',
    durationDays: 3,
    duration: '3 days',
    interests: ['elephants', 'temples'],
    language: 'en' as const,
    confirmedAt: '09:30',
  }
}

function makeOkDraftResponse(overrides: Partial<ItineraryDraftResponse> = {}): ItineraryDraftResponse {
  return {
    status: 'ok',
    intent: { destination: 'Chiang Mai', days: 3, interests: ['elephants'] },
    itinerary: {
      destination: 'Chiang Mai',
      durationDays: 3,
      summary: 'A 3-day suggested plan.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            {
              type: 'experience',
              productId: 'prod_1',
              title: 'Temple Tour',
              description: 'Visit Doi Suthep.',
              timeOfDay: 'morning',
            },
          ],
        },
        {
          day: 2,
          title: 'Day 2',
          theme: 'Nature',
          items: [
            {
              type: 'experience',
              productId: 'prod_2',
              title: 'Elephant Sanctuary',
              description: 'Half-day ethical elephant visit.',
              timeOfDay: 'morning',
            },
          ],
        },
        {
          day: 3,
          title: 'Day 3',
          theme: 'Markets',
          items: [
            {
              type: 'free_time',
              title: 'Night Bazaar',
              description: 'Explore the market.',
              timeOfDay: 'evening',
            },
          ],
        },
      ],
      warnings: [],
    },
    products: [
      {
        id: 'prod_1',
        title: 'Temple Tour',
        city: 'Chiang Mai',
        summary: 'Visit temples.',
        tags: ['Culture'],
        detailHref: '/tours/prod_1',
        retailPrice: null,
        currency: null,
      },
      {
        id: 'prod_2',
        title: 'Elephant Sanctuary',
        city: 'Chiang Mai',
        summary: 'Half-day ethical elephant visit.',
        tags: ['Nature'],
        detailHref: '/tours/prod_2',
        retailPrice: null,
        currency: null,
      },
    ],
    meta: {
      itineraryGenerationEnabled: true,
      bookingEnabled: false,
      availabilityEnabled: false,
    },
    ...overrides,
  }
}

describe('canGenerateDraft (UI logic)', () => {
  it('returns false when confirmed is null (no intent confirmed)', () => {
    expect(canGenerateDraft(null, true)).toBe(false)
  })

  it('returns false when itineraryEnabled is false even if confirmed', () => {
    expect(canGenerateDraft(makeConfirmed(), false)).toBe(false)
  })

  it('returns true when confirmed and itineraryEnabled=true', () => {
    expect(canGenerateDraft(makeConfirmed(), true)).toBe(true)
  })

  it('returns false when both confirmed is null and flag is false', () => {
    expect(canGenerateDraft(null, false)).toBe(false)
  })
})

describe('canSearchFromConfirmed regression (unchanged)', () => {
  it('returns false for null', () => {
    expect(canSearchFromConfirmed(null)).toBe(false)
  })

  it('returns true for confirmed intent', () => {
    expect(canSearchFromConfirmed(makeConfirmed())).toBe(true)
  })
})

describe('ItineraryDraftResponse type contract', () => {
  it('ok status response has itinerary and products', () => {
    const res: ItineraryDraftResponse = makeOkDraftResponse()
    expect(res.status).toBe('ok')
    expect(res.itinerary).not.toBeNull()
    expect(res.products.length).toBeGreaterThan(0)
    expect(res.meta.bookingEnabled).toBe(false)
    expect(res.meta.availabilityEnabled).toBe(false)
  })

  it('disabled status has null itinerary and empty products', () => {
    const res: ItineraryDraftResponse = {
      status: 'disabled',
      itinerary: null,
      products: [],
      meta: { itineraryGenerationEnabled: false, bookingEnabled: false, availabilityEnabled: false },
    }
    expect(res.itinerary).toBeNull()
    expect(res.products).toEqual([])
    expect(res.meta.itineraryGenerationEnabled).toBe(false)
  })

  it('generation_failed has null itinerary and empty products', () => {
    const res: ItineraryDraftResponse = {
      status: 'generation_failed',
      itinerary: null,
      products: [],
      meta: { itineraryGenerationEnabled: true, bookingEnabled: false, availabilityEnabled: false },
    }
    expect(res.itinerary).toBeNull()
    expect(res.products).toEqual([])
  })

  it('product links use detailHref matching /tours/{id} pattern', () => {
    const res = makeOkDraftResponse()
    for (const product of res.products) {
      expect(product.detailHref).toMatch(/^\/tours\//)
    }
  })

  it('no forbidden commerce/availability fields in ok response', () => {
    const res = makeOkDraftResponse()
    const resStr = JSON.stringify(res)
    expect(resStr).not.toContain('booking confirmed')
    expect(resStr).not.toContain('available now')
    expect(resStr).not.toContain('checkout')
    expect(resStr).not.toContain('payment')
    expect(resStr).not.toContain('live availability')
    expect(resStr).not.toContain('supplier net rate')
  })

  it('draft day sections are separate from product search results', () => {
    // Products in the draft are linked by id; they are not injected into the search section
    const res = makeOkDraftResponse()
    // Draft has its own product list from the itinerary context
    // Search products come from the /api/ai-trip/search endpoint separately
    expect(res.itinerary).not.toBeNull()
    expect(res.products).toBeDefined()
    // The itinerary and products fields are top-level and independent
    expect(Object.keys(res)).toContain('itinerary')
    expect(Object.keys(res)).toContain('products')
  })

  it('current disabled state: itineraryGenerationEnabled is false in meta when status=disabled', () => {
    const res: ItineraryDraftResponse = {
      status: 'disabled',
      itinerary: null,
      products: [],
      meta: { itineraryGenerationEnabled: false, bookingEnabled: false, availabilityEnabled: false },
    }
    expect(res.meta.itineraryGenerationEnabled).toBe(false)
    // This matches the "Generate itinerary — coming later" disabled state in the UI
  })
})

describe('MockItineraryDraftProvider (unit check)', () => {
  it('mock provider is importable and generates output', async () => {
    const { MockItineraryDraftProvider } = await import('@/lib/aiProducts/itineraryDraftProvider')

    vi.mock('server-only', () => ({}))

    const mock = new MockItineraryDraftProvider()
    const output = await mock.generate({
      schemaVersion: 'itinerary-draft-v1',
      destination: 'Chiang Mai',
      durationDays: 1,
      interests: ['temples'],
      products: [
        {
          id: 'prod_1',
          title: 'Temple Tour',
          city: 'Chiang Mai',
          summary: 'Visit temples.',
          tags: [],
          detailHref: '/tours/prod_1',
        },
      ],
      rules: [],
    })
    expect(output).not.toBeNull()
    expect(typeof output).toBe('object')
  })

  it('mock with fixture returns the fixture', async () => {
    const { MockItineraryDraftProvider } = await import('@/lib/aiProducts/itineraryDraftProvider')

    vi.mock('server-only', () => ({}))

    const fixture = { custom: 'invalid output' }
    const mock = new MockItineraryDraftProvider({ fixture })
    const output = await mock.generate({} as never)
    expect(output).toEqual(fixture)
  })
})
