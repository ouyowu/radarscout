import { describe, expect, it } from 'vitest'
import type { ActivityFeedV1Item } from './activityFeedV1'
import {
  getActivityCompareCoverage,
  summarizeActivityCompareCoverage,
} from './compareCoverage'

function activity(id: string): ActivityFeedV1Item {
  return {
    schemaVersion: 'radarscout.activity-feed.v1',
    id,
    detailHref: `/tours/${id}`,
    destination: { country: 'Thailand', countryCode: 'TH', city: 'Chiang Mai' },
    title: id,
    summary: 'Reviewed summary',
    recommendation: {
      whyRecommended: { status: 'human_reviewed', value: 'A reviewed rationale.' },
      bestFor: { status: 'human_reviewed', value: ['Families'] },
      strengths: { status: 'human_reviewed', value: ['Thoughtful pacing'] },
      tradeoffs: { status: 'human_reviewed', value: ['A limited fit'] },
    },
    suitableFor: { status: 'human_reviewed', value: ['Families'] },
    notSuitableFor: { status: 'human_reviewed', value: ['Travelers seeking nightlife'] },
    startingPrice: { status: 'not_reviewed', value: null },
    duration: { status: 'human_reviewed', value: 'Half day' },
    pickupArea: { status: 'human_reviewed', value: ['Nimman'] },
    childPolicy: { status: 'not_reviewed', value: 'A value must not bypass review' },
    fitnessLevel: { status: 'not_reviewed', value: null },
    cancellationPolicy: { status: 'human_reviewed', value: 'Review partner terms' },
    ethicalAttributes: { status: 'human_reviewed', value: ['No riding'] },
    experienceFeatures: { status: 'human_reviewed', value: ['Feeding'] },
    themes: ['elephants'],
    offers: [{
      provider: 'viator', inventorySource: 'reviewed_viator_catalog', affiliatePartner: 'viator',
      deeplink: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-12345P1',
      availabilityClaimed: false, priceSnapshot: { status: 'not_reviewed', value: null }, verifiedAt: '2026-08-15T00:00:00.000Z',
    }],
    partnerHandoff: {
      provider: 'Viator', url: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-12345P1',
      label: 'Check availability', availabilityClaimed: false,
      source: 'operator_verified_public_link', verifiedBy: 'operator_manual_review',
    },
    provenance: { source: 'reviewed_viator_catalog', reviewStatus: 'human_reviewed', verifiedAt: '2026-08-15T00:00:00.000Z' },
  }
}

describe('Activity Compare coverage', () => {
  it('fails closed when a non-reviewed field happens to contain a value', () => {
    const coverage = getActivityCompareCoverage(activity('not-reviewed-child-policy'))

    expect(coverage.coveredFields).not.toContain('childPolicy')
    expect(coverage.missingFields).toContain('childPolicy')
    expect(coverage.readyFor.family).toBe(false)
    expect(coverage.readyFor.ethics).toBe(true)
    expect(coverage.readyFor.price).toBe(false)
  })

  it('only marks a product ready for a comparison scope when every required field is reviewed', () => {
    const product = activity('family-ready')
    product.childPolicy = { status: 'human_reviewed', value: 'Suitable for children aged 6+' }

    const coverage = getActivityCompareCoverage(product)

    expect(coverage.readyFor.core).toBe(true)
    expect(coverage.readyFor.family).toBe(true)
    expect(coverage.readyFor.full).toBe(false)
    expect(coverage.missingFields).toContain('startingPrice')
  })

  it('caps a focused editorial audit at forty products and reports exact coverage counts', () => {
    const summary = summarizeActivityCompareCoverage(
      Array.from({ length: 41 }, (_, index) => activity(`product-${index}`)),
      99,
    )

    expect(summary.scanned).toBe(40)
    expect(summary.coveredProductCountByField.duration).toBe(40)
    expect(summary.coveredProductCountByField.startingPrice).toBe(0)
    expect(summary.readyProductCountByScope.core).toBe(40)
    expect(summary.readyProductCountByScope.price).toBe(0)
  })
})
