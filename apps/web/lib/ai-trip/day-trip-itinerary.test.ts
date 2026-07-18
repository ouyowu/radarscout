import { describe, expect, it } from 'vitest'
import type { AiProductContextItem } from '../aiProducts/buildAiProductContext'
import { buildDayTripItinerary } from './day-trip-itinerary'

function makeProduct(overrides: Partial<AiProductContextItem> = {}): AiProductContextItem {
  return {
    id: 'viator_191442p6',
    title: 'Doi Inthanon, Waterfall and Royal Project Day Trip',
    city: 'Chiang Mai',
    summary: 'A reviewed Chiang Mai nature day trip.',
    imageUrl: 'https://images.example.com/doi-inthanon.jpg',
    imageAlt: 'A Chiang Mai nature day trip',
    tags: ['Nature', 'Waterfalls'],
    detailHref: '/tours/viator_191442p6',
    retailPrice: null,
    currency: null,
    ctaHref: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-191442P6?pid=P00309837',
    ctaLabel: 'Check availability',
    ctaRel: 'nofollow sponsored noopener noreferrer',
    externalHandoff: true,
    ...overrides,
  }
}

describe('buildDayTripItinerary', () => {
  it('builds a structured multi-day plan using reviewed day-tour products only', () => {
    const itinerary = buildDayTripItinerary({
      destination: 'Chiang Mai',
      durationDays: 2,
      interests: ['elephants', 'nature'],
      pace: 'relaxed',
      travelerType: 'family',
      groupSize: 4,
    }, [
      makeProduct(),
      makeProduct({
        id: 'viator_211395p4',
        title: 'Doi Inthanon Nature Day Trip',
        detailHref: '/tours/viator_211395p4',
        ctaHref: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-211395P4?pid=P00309837',
        tags: ['Nature', 'Hiking'],
      }),
    ])

    expect(itinerary).toMatchObject({
      version: 1,
      tripSpec: {
        destination: 'Chiang Mai',
        durationDays: 2,
        interests: ['elephants', 'nature'],
        pace: 'relaxed',
        travelerType: 'family',
        groupSize: 4,
        contentScope: 'day_tours_only',
      },
      unfilledDayCount: 0,
    })
    expect(itinerary?.days).toHaveLength(2)
    expect(itinerary?.days[0]).toMatchObject({
      dayNumber: 1,
      experience: {
        productId: 'viator_191442p6',
        title: 'Doi Inthanon, Waterfall and Royal Project Day Trip',
        handoff: {
          label: 'Check availability',
          href: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-191442P6?pid=P00309837',
          rel: 'nofollow sponsored noopener noreferrer',
        },
      },
    })

    const serialized = JSON.stringify(itinerary)
    expect(serialized).not.toMatch(/retailPrice|currency|price|live availability|available now/i)
    expect(serialized).not.toMatch(/hotel|flight|checkout|instant confirmation/i)
    expect(itinerary?.safety).toEqual({
      availabilityChecked: false,
      bookingCompleted: false,
      paymentHandled: false,
    })
  })

  it('skips unsafe products and reports unfilled days without inventing experiences', () => {
    const itinerary = buildDayTripItinerary({
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['food'],
      pace: 'moderate',
      travelerType: 'couple',
      groupSize: 2,
    }, [
      makeProduct(),
      makeProduct({
        id: 'unsafe_handoff',
        ctaHref: 'https://example.com/checkout',
      }),
    ])

    expect(itinerary?.days).toHaveLength(1)
    expect(itinerary?.days[0].experience.productId).toBe('viator_191442p6')
    expect(itinerary?.unfilledDayCount).toBe(2)
  })

  it('returns null when required trip details or reviewed products are missing', () => {
    const baseIntent = {
      destination: 'Chiang Mai',
      durationDays: 1,
      interests: [],
      pace: 'unspecified' as const,
      travelerType: 'unspecified' as const,
      groupSize: null,
    }

    expect(buildDayTripItinerary({ ...baseIntent, destination: '' }, [makeProduct()])).toBeNull()
    expect(buildDayTripItinerary({ ...baseIntent, durationDays: 0 }, [makeProduct()])).toBeNull()
    expect(buildDayTripItinerary(baseIntent, [makeProduct({ externalHandoff: false })])).toBeNull()
  })

  it('caps the itinerary at seven day tours', () => {
    const products = Array.from({ length: 9 }, (_, index) => makeProduct({
      id: `viator_cm_test_${index}`,
      detailHref: `/tours/viator_cm_test_${index}`,
      ctaHref: `https://www.viator.com/tours/Chiang-Mai/example/d5267-99900${index}?pid=P00309837`,
    }))

    const itinerary = buildDayTripItinerary({
      destination: 'Chiang Mai',
      durationDays: 9,
      interests: ['nature'],
      pace: 'packed',
      travelerType: 'friends',
      groupSize: 3,
    }, products)

    expect(itinerary?.tripSpec.durationDays).toBe(7)
    expect(itinerary?.days).toHaveLength(7)
    expect(itinerary?.unfilledDayCount).toBe(0)
  })

  it('rejects legacy Bókun widget handoffs from the public Viator itinerary', () => {
    const itinerary = buildDayTripItinerary({
      destination: 'Chiang Mai',
      durationDays: 1,
      interests: ['nature'],
      pace: 'relaxed',
      travelerType: 'couple',
      groupSize: 2,
    }, [makeProduct({
      ctaHref: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
    })])

    expect(itinerary).toBeNull()
  })
})
