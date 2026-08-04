import { describe, expect, it } from 'vitest'
import { buildPlannerRecommendationEvents } from './plannerRecommendationTracking'

describe('buildPlannerRecommendationEvents', () => {
  it('creates one safe event per reviewed recommendation', () => {
    expect(buildPlannerRecommendationEvents({
      destination: 'Phuket',
      durationDays: 4,
      pace: 'relaxed',
      travelerType: 'couple',
      products: [
        {
          id: 'viator_123p1',
          city: 'Phuket',
          decisionSignals: { reasonCode: 'interest_match' },
        },
        {
          id: 'viator_456p2',
          city: null,
          decisionSignals: { reasonCode: 'reviewed_fallback' },
        },
      ],
    })).toEqual([
      {
        provider: 'viator',
        placement: 'planner_filtered_matches',
        city: 'Phuket',
        productId: 'viator_123p1',
        recommendationSource: 'planner',
        reasonCode: 'interest_match',
        durationDays: 4,
        pace: 'relaxed',
        travelerType: 'couple',
      },
      {
        provider: 'viator',
        placement: 'planner_filtered_matches',
        city: 'Phuket',
        productId: 'viator_456p2',
        recommendationSource: 'planner',
        reasonCode: 'reviewed_fallback',
        durationDays: 4,
        pace: 'relaxed',
        travelerType: 'couple',
      },
    ])
  })
})
