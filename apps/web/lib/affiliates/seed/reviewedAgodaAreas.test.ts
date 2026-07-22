import { describe, expect, it } from 'vitest'
import { validateAgodaAreaRecommendationCatalogue } from '../agodaAreaRecommendations'
import { reviewedAgodaAreaRecommendations } from './reviewedAgodaAreas'

describe('reviewed Agoda stay-area seed', () => {
  it('contains the 18 owner-approved public records across all six cities', () => {
    expect(reviewedAgodaAreaRecommendations).toHaveLength(18)
    expect(validateAgodaAreaRecommendationCatalogue(reviewedAgodaAreaRecommendations)).toMatchObject({ ok: true })

    const cityCounts = reviewedAgodaAreaRecommendations.reduce<Record<string, number>>((counts, area) => {
      counts[area.citySlug] = (counts[area.citySlug] ?? 0) + 1
      return counts
    }, {})

    expect(cityCounts).toEqual({
      bangkok: 3,
      'chiang-mai': 3,
      phuket: 3,
      pattaya: 3,
      'koh-samui': 3,
      krabi: 3,
    })
  })

  it('contains only the display-safe public contract', () => {
    for (const area of reviewedAgodaAreaRecommendations) {
      expect(Object.keys(area).sort()).toEqual([
        'areaSlug',
        'bestFor',
        'city',
        'citySlug',
        'id',
        'name',
        'reviewedAt',
        'reviewedBy',
        'summary',
        'tradeoffs',
      ])
      expect(area).not.toHaveProperty('affiliateHref')
      expect(area).not.toHaveProperty('reviewStatus')
    }
  })
})
