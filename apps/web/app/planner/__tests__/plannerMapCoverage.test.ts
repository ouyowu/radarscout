import { describe, expect, it } from 'vitest'
import type { DayTripExperience } from '@/lib/ai-trip/itinerary-contract'
import { THAILAND_COORDINATE_BOUNDS } from '@/lib/itineraries/thailandTemplates'
import { loadReviewedViatorProducts } from '@/lib/viator/reviewedViatorProducts'
import { getReviewedPlannerMapDay } from '../plannerMapCoverage'

function experience(city: string, title: string): DayTripExperience {
  return {
    productId: `viator_${city.toLowerCase().replaceAll(/\W+/g, '')}`,
    title,
    city,
    summary: `A reviewed ${city} experience.`,
    imageUrl: 'https://example.com/image.jpg',
    imageAlt: title,
    tags: ['day-trip'],
    detailHref: '/tours/reviewed-product',
    handoff: {
      label: 'Check availability',
      href: 'https://www.viator.com/tours/example?pid=P00309837',
      rel: 'nofollow sponsored noopener noreferrer',
    },
  }
}

describe('getReviewedPlannerMapDay', () => {
  it('reuses reviewed Bangkok route coordinates for matching planner days', () => {
    const day = getReviewedPlannerMapDay('Bangkok', 2)

    expect(day?.cityName).toBe('Bangkok')
    expect(day?.dayPlan.day).toBe(2)
    expect(day?.dayPlan.stops).not.toHaveLength(0)
    expect(day?.dayPlan.stops.every(stop =>
      stop.lat >= THAILAND_COORDINATE_BOUNDS.minLat
      && stop.lat <= THAILAND_COORDINATE_BOUNDS.maxLat
      && stop.lng >= THAILAND_COORDINATE_BOUNDS.minLng
      && stop.lng <= THAILAND_COORDINATE_BOUNDS.maxLng
      && !(stop.lat === 0 && stop.lng === 0),
    )).toBe(true)
  })

  it('fails closed when a requested day has no reviewed map coverage', () => {
    expect(getReviewedPlannerMapDay('Bangkok', 4)).toBeNull()
    expect(getReviewedPlannerMapDay('Phuket', 1)).toBeNull()
  })

  it.each([
    ['Bangkok', 'Bangkok Canal Tour: Longtail Boat Ride', 'Chao Phraya and canal area'],
    ['Chiang Mai', 'Doi Inthanon Waterfall Day Trip', 'Doi Inthanon area'],
    ['Phuket', 'Phi Phi Islands Adventure Day Trip', 'Phi Phi Islands area'],
    ['Pattaya', 'Pattaya Coral Island Tour to Koh Larn', 'Koh Larn area'],
    ['Koh Samui', 'Angthong National Marine Park Small Group Tour', 'Ang Thong Marine Park area'],
    ['Krabi', 'Hong Islands Private Longtail Boat Tour', 'Hong Islands area'],
  ])('uses reviewed regional coverage for a selected %s product', (city, title, expectedTheme) => {
    const day = getReviewedPlannerMapDay(city, 5, experience(city, title))

    expect(day?.cityName).toBe(city)
    expect(day?.dayPlan.day).toBe(5)
    expect(day?.dayPlan.theme).toBe(expectedTheme)
    expect(day?.precision).toBe('area')
    expect(day?.sourceUrl).toMatch(/^https:\/\/www\.openstreetmap\.org\//)
    expect(day?.dayPlan.stops).toHaveLength(1)
    expect(day?.dayPlan.stops.every(stop =>
      stop.lat >= THAILAND_COORDINATE_BOUNDS.minLat
      && stop.lat <= THAILAND_COORDINATE_BOUNDS.maxLat
      && stop.lng >= THAILAND_COORDINATE_BOUNDS.minLng
      && stop.lng <= THAILAND_COORDINATE_BOUNDS.maxLng
      && !(stop.lat === 0 && stop.lng === 0),
    )).toBe(true)
  })

  it('uses a reviewed city orientation fallback without claiming an exact product route', () => {
    const day = getReviewedPlannerMapDay(
      'Phuket',
      2,
      experience('Phuket', 'A reviewed Phuket experience without a mapped regional keyword'),
    )

    expect(day?.dayPlan.theme).toBe('Phuket orientation area')
    expect(day?.dayPlan.stops[0]?.name).toBe('Phuket orientation area')
    expect(day?.precision).toBe('area')
  })

  it('rejects cross-city product coordinates instead of showing a wrong map', () => {
    expect(getReviewedPlannerMapDay(
      'Chiang Mai',
      1,
      experience('Bangkok', 'Bangkok Canal Tour'),
    )).toBeNull()
  })

  it('covers every reviewed product in the six launch destinations', () => {
    const launchCities = new Set(['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Koh Samui', 'Krabi'])
    const products = loadReviewedViatorProducts().filter(product => launchCities.has(product.city))

    expect(products).not.toHaveLength(0)
    for (const product of products) {
      const day = getReviewedPlannerMapDay(
        product.city,
        1,
        experience(product.city, product.title),
      )

      expect(day?.cityName).toBe(product.city)
      expect(day?.dayPlan.stops).toHaveLength(1)
    }
  })
})
