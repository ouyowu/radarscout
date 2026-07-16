import { describe, expect, it } from 'vitest'

import type { ReviewedViatorProduct } from '../reviewedViatorProducts'
import {
  auditViatorCatalogCoverage,
  viatorCatalogCoverageTargets,
} from '../catalogCoverage'

function product(overrides: Partial<ReviewedViatorProduct> = {}): ReviewedViatorProduct {
  return {
    id: 'viator_example',
    city: 'Bangkok',
    destinationId: '343',
    productCode: 'EXAMPLE',
    title: 'Bangkok Culture and Food Day Trip',
    shortSummary: 'A reviewed Bangkok day trip.',
    tags: ['culture', 'food', 'day-trip'],
    productUrl: 'https://www.viator.com/tours/Bangkok/example/d343-EXAMPLE?pid=P00309837',
    imageUrl: 'https://media.example.test/example.jpg',
    reviewedAt: '2026-07-17T00:00:00.000Z',
    ...overrides,
  }
}

describe('auditViatorCatalogCoverage', () => {
  it('makes city, theme and multi-day catalogue gaps explicit before a new review batch', () => {
    const report = auditViatorCatalogCoverage([
      product(),
      product({ id: 'viator_example_2', productCode: 'EXAMPLE2', tags: ['nature', 'adventure'] }),
    ], {
      targets: [
        {
          city: 'Bangkok',
          minimumProducts: 3,
          minimumProductsByTheme: 1,
          themes: ['culture', 'food', 'nature', 'adventure'],
          requestedDayCounts: [1, 3],
        },
        {
          city: 'Chiang Rai',
          minimumProducts: 8,
          minimumProductsByTheme: 1,
          themes: ['culture', 'nature'],
          requestedDayCounts: [1, 3],
        },
      ],
    })

    expect(report.totalProducts).toBe(2)
    expect(report.cities).toEqual([
      expect.objectContaining({
        city: 'Bangkok',
        productCount: 2,
        missingProducts: 1,
        themeCoverage: expect.arrayContaining([
          expect.objectContaining({ theme: 'food', productCount: 1, covered: true }),
        ]),
        multiDayCoverage: expect.arrayContaining([
          expect.objectContaining({ days: 3, availableDistinctExperiences: 2, covered: false }),
        ]),
      }),
      expect.objectContaining({
        city: 'Chiang Rai',
        productCount: 0,
        missingProducts: 8,
        needsNewCandidateBatch: true,
      }),
    ])
  })

  it('audits the current reviewed seed against the approved Thailand-city priorities', () => {
    const report = auditViatorCatalogCoverage()

    expect(report.totalProducts).toBeGreaterThan(0)
    expect(report.cities.map((city) => city.city)).toEqual(
      viatorCatalogCoverageTargets.map((target) => target.city),
    )
    expect(report.cities.find((city) => city.city === 'Chiang Mai')).toEqual(
      expect.objectContaining({ needsNewCandidateBatch: true }),
    )
  })
})
