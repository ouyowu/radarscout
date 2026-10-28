import { describe, expect, it } from 'vitest'
import type { ActivityFeedV1Item } from './activityFeedV1'
import { selectPostHandoffNextStepCandidates } from './postHandoffNextStep'

function activity(
  id: string,
  city: string,
  themes: string[],
  reviewStatus: 'human_reviewed' | 'not_reviewed' | 'derived_from_reviewed_fields' = 'human_reviewed',
): ActivityFeedV1Item {
  return {
    schemaVersion: 'radarscout.activity-feed.v1',
    id,
    detailHref: `/tours/${id}`,
    destination: { country: 'Thailand', countryCode: 'TH', city },
    title: id,
    summary: 'Reviewed summary',
    recommendation: {
      whyRecommended: { status: 'derived_from_reviewed_fields', value: 'Reviewed rationale.' },
      bestFor: { status: 'human_reviewed', value: ['Reviewed travelers'] },
      strengths: { status: 'human_reviewed', value: ['Reviewed strength'] },
      tradeoffs: { status: 'human_reviewed', value: ['Reviewed tradeoff'] },
    },
    suitableFor: { status: 'human_reviewed', value: ['Reviewed travelers'] },
    notSuitableFor: { status: 'human_reviewed', value: ['Travelers avoiding this fit'] },
    startingPrice: { status: 'not_reviewed', value: null },
    duration: { status: 'human_reviewed', value: 'Half day' },
    pickupArea: { status: 'human_reviewed', value: ['Central Chiang Mai'] },
    childPolicy: { status: 'not_reviewed', value: null },
    fitnessLevel: { status: 'not_reviewed', value: null },
    cancellationPolicy: { status: 'human_reviewed', value: 'Review partner terms' },
    ethicalAttributes: { status: 'not_reviewed', value: [] },
    experienceFeatures: { status: 'human_reviewed', value: ['Feature'] },
    themes,
    offers: [{
      provider: 'viator', inventorySource: 'reviewed_viator_catalog', affiliatePartner: 'viator',
      deeplink: `https://www.viator.com/tours/Chiang-Mai/${id}/d5267-12345P1`,
      availabilityClaimed: false, priceSnapshot: { status: 'not_reviewed', value: null }, verifiedAt: '2026-08-15T00:00:00.000Z',
    }],
    partnerHandoff: {
      provider: 'Viator', url: `https://www.viator.com/tours/Chiang-Mai/${id}/d5267-12345P1`, label: 'Check availability',
      availabilityClaimed: false, source: 'operator_verified_public_link', verifiedBy: 'operator_manual_review',
    },
    provenance: {
      source: 'reviewed_viator_catalog',
      // Exercise the runtime fail-closed review guard even though the public
      // Activity Feed type narrows its normal output to human-reviewed items.
      reviewStatus: reviewStatus as 'human_reviewed',
      verifiedAt: '2026-08-15T00:00:00.000Z',
    },
  }
}

describe('selectPostHandoffNextStepCandidates', () => {
  it('keeps suggestions reviewed, local, distinct from the opened activity, and capped at two', () => {
    const primary = activity('primary', 'Chiang Mai', ['elephants', 'nature'])
    const candidates = selectPostHandoffNextStepCandidates(primary, [
      primary,
      activity('food-and-culture', 'Chiang Mai', ['food', 'culture']),
      activity('culture', 'Chiang Mai', ['culture']),
      activity('same-theme', 'Chiang Mai', ['elephants']),
      activity('other-city', 'Phuket', ['food', 'culture']),
      activity('not-reviewed', 'Chiang Mai', ['waterfalls'], 'not_reviewed'),
    ])

    expect(candidates.map(candidate => candidate.item.id)).toEqual(['food-and-culture', 'culture'])
    expect(candidates[0]?.newThemes).toEqual(['food', 'culture'])
  })

  it('returns no candidates when there is no separately themed reviewed local activity', () => {
    const primary = activity('primary', 'Chiang Mai', ['elephants'])
    expect(selectPostHandoffNextStepCandidates(primary, [
      primary,
      activity('same-theme', 'Chiang Mai', ['elephants']),
    ])).toEqual([])
  })
})
