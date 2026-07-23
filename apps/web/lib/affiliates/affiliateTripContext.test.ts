import { describe, expect, it } from 'vitest'
import { buildSafeAffiliateAnalyticsContext } from './affiliateTripContext'

describe('affiliate trip context', () => {
  it('reduces confirmed context to bounded analytics fields', () => {
    expect(buildSafeAffiliateAnalyticsContext({
      startDate: '2099-12-10',
      endDate: '2099-12-13',
      groupSize: 4,
      travelerType: 'family',
    })).toEqual({
      hasDates: true,
      hasGroupSize: true,
      travelerType: 'family',
    })
  })

  it('does not expose raw dates or group size when context is absent', () => {
    expect(buildSafeAffiliateAnalyticsContext()).toEqual({
      hasDates: false,
      hasGroupSize: false,
      travelerType: 'unspecified',
    })
  })
})
