import { describe, expect, it } from 'vitest'
import type { ActivityFeedV1Item } from './activityFeedV1'
import { selectActivityFactReviewBatch } from './factReviewBatch'

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
    childPolicy: { status: 'human_reviewed', value: 'Suitable for children aged 6+' },
    fitnessLevel: { status: 'human_reviewed', value: 'Low' },
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

describe('Activity facts review batch', () => {
  it('selects only fields that still need an explicit fact review', () => {
    const needingReview = activity('needs-review')
    needingReview.childPolicy = { status: 'not_reviewed', value: 'Unreviewed text must not count' }
    needingReview.fitnessLevel = { status: 'not_reviewed', value: null }
    const ready = activity('ready')

    const batch = selectActivityFactReviewBatch([ready, needingReview])

    expect(batch).toEqual([{
      productId: 'needs-review',
      title: 'needs-review',
      city: 'Chiang Mai',
      reviewPath: '/tours/needs-review',
      lastVerifiedAt: '2026-08-15T00:00:00.000Z',
      pendingFields: ['childPolicy', 'fitnessLevel'],
    }])
  })

  it('prioritizes products with more decision-critical gaps and applies a bounded batch size', () => {
    const twoGaps = activity('two-gaps')
    twoGaps.childPolicy = { status: 'not_reviewed', value: null }
    twoGaps.pickupArea = { status: 'not_reviewed', value: [] }
    const oneGap = activity('one-gap')
    oneGap.ethicalAttributes = { status: 'not_reviewed', value: [] }

    const batch = selectActivityFactReviewBatch([oneGap, twoGaps], 1)

    expect(batch).toHaveLength(1)
    expect(batch[0]?.productId).toBe('two-gaps')
    expect(batch[0]?.pendingFields).toEqual(['pickupArea', 'childPolicy'])
  })

  it('never expands a human review batch past forty candidates', () => {
    const items = Array.from({ length: 41 }, (_, index) => {
      const item = activity(`product-${index}`)
      item.cancellationPolicy = { status: 'not_reviewed', value: null }
      return item
    })

    expect(selectActivityFactReviewBatch(items, 99)).toHaveLength(40)
  })
})
