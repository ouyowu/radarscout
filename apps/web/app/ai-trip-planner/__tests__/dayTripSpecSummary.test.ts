import { describe, expect, it } from 'vitest'
import { buildTripSpecChips } from '../dayTripSpecSummary'

describe('buildTripSpecChips', () => {
  it('turns structured day-tour conditions into concise planner chips', () => {
    expect(buildTripSpecChips({
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'food'],
      pace: 'moderate',
      travelerType: 'couple',
      groupSize: 2,
      contentScope: 'day_tours_only',
    })).toEqual([
      'Chiang Mai',
      '3 day trips',
      'Moderate pace',
      'Couple',
      'Group of 2',
    ])
  })

  it('omits unspecified and absent traveler conditions', () => {
    expect(buildTripSpecChips({
      destination: 'Bangkok',
      durationDays: 1,
      interests: [],
      pace: 'unspecified',
      travelerType: 'unspecified',
      groupSize: null,
      contentScope: 'day_tours_only',
    })).toEqual(['Bangkok', '1 day trip'])
  })
})
