import { describe, expect, it } from 'vitest'
import type { ActivityFeedV1Item } from './activityFeedV1'
import { selectDetailComparisonCandidates } from './detailComparison'

function activity(id: string, city: string, themes: string[]): ActivityFeedV1Item {
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
    provenance: { source: 'reviewed_viator_catalog', reviewStatus: 'human_reviewed', verifiedAt: '2026-08-15T00:00:00.000Z' },
  }
}

describe('selectDetailComparisonCandidates', () => {
  it('keeps the comparison local, thematic, reviewed, and capped at two alternatives', () => {
    const primary = activity('primary', 'Chiang Mai', ['elephants', 'nature'])
    const candidates = selectDetailComparisonCandidates(primary, [
      primary,
      activity('best-match', 'Chiang Mai', ['elephants', 'nature']),
      activity('second-match', 'Chiang Mai', ['elephants']),
      activity('other-city', 'Phuket', ['elephants', 'nature']),
      activity('other-type', 'Chiang Mai', ['food']),
    ])

    expect(candidates.map(candidate => candidate.item.id)).toEqual(['best-match', 'second-match'])
    expect(candidates[0]?.sharedThemes).toEqual(['elephants', 'nature'])
  })

  it('returns no candidates when the primary item has no matching reviewed local themes', () => {
    const primary = activity('primary', 'Chiang Mai', ['culture'])
    expect(selectDetailComparisonCandidates(primary, [primary, activity('water', 'Chiang Mai', ['boat'])])).toEqual([])
  })
})
