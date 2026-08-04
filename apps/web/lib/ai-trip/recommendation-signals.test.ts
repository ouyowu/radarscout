import { describe, expect, it } from 'vitest'
import { loadReviewedViatorProducts } from '../viator/reviewedViatorProducts'
import {
  buildProductRecommendationSignals,
  extractTravelMonth,
} from './recommendation-signals'

describe('deterministic product recommendation signals', () => {
  it('creates complete safe signals for every reviewed Viator product', () => {
    const products = loadReviewedViatorProducts()

    expect(products).toHaveLength(205)

    for (const product of products) {
      const signals = buildProductRecommendationSignals(product, {
        destination: product.city,
        interests: product.tags.slice(0, 2),
        travelerType: 'unspecified',
        pace: 'moderate',
        month: null,
      })

      expect(signals.whyRecommended.trim()).not.toBe('')
      expect([
        'interest_match',
        'destination_match',
        'theme_match',
        'reviewed_fallback',
      ]).toContain(signals.reasonCode)
      expect(signals.bestFor.length).toBeGreaterThan(0)
      expect(signals.watchOut.trim()).not.toBe('')
      expect(JSON.stringify(signals)).not.toMatch(
        /guaranteed availability|available now|instant confirmation|guaranteed slot|checkout|payment|reservation complete|fake reviews|fake ratings|supplier net rate|partner rate|commission/i,
      )
    }
  })

  it('adapts family, pace, month, and interest guidance without claiming live facts', () => {
    const signals = buildProductRecommendationSignals({
      title: 'Doi Inthanon National Park and Waterfalls Day Trip',
      city: 'Chiang Mai',
      shortSummary: 'A reviewed mountain, waterfall, and nature route.',
      tags: ['Nature', 'Waterfalls'],
    }, {
      destination: 'Chiang Mai',
      interests: ['nature'],
      travelerType: 'family',
      pace: 'relaxed',
      month: 7,
    })

    expect(signals.whyRecommended).toMatch(/Chiang Mai/i)
    expect(signals.whyRecommended).toMatch(/nature/i)
    expect(signals.reasonCode).toBe('interest_match')
    expect(signals.bestFor).toContain('Families comparing this route')
    expect(signals.bestFor).toContain('A relaxed itinerary')
    expect(signals.watchOut).toMatch(/rainy-season/i)
  })

  it('adapts couple and packed-pace guidance', () => {
    const signals = buildProductRecommendationSignals({
      title: 'Bangkok Evening Food Tour',
      city: 'Bangkok',
      shortSummary: 'A reviewed evening food experience.',
      tags: ['Food', 'Markets'],
    }, {
      destination: 'Bangkok',
      interests: ['food'],
      travelerType: 'couple',
      pace: 'packed',
      month: 12,
    })

    expect(signals.bestFor).toContain('Couples comparing this route')
    expect(signals.bestFor).toContain('A packed itinerary')
    expect(signals.watchOut).toMatch(/finish time|return arrangements/i)
  })

  it('extracts an explicitly named travel month and otherwise stays unknown', () => {
    expect(extractTravelMonth('Family trip to Chiang Mai in December')).toBe(12)
    expect(extractTravelMonth('Phuket in Sept for beaches')).toBe(9)
    expect(extractTravelMonth('Bangkok for three days')).toBeNull()
  })
})
