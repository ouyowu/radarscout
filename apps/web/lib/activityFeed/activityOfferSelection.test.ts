import { describe, expect, it } from 'vitest'

import { loadActivityFeedV1 } from './activityFeedV1'
import { selectReviewedActivityOffer } from './activityOfferSelection'

describe('selectReviewedActivityOffer', () => {
  it('selects the reviewed Viator offer without making price or availability claims', () => {
    const activity = loadActivityFeedV1({ take: 1 })[0]

    expect(selectReviewedActivityOffer(activity)).toEqual(activity.offers[0])
  })

  it('fails closed for an altered or invalid offer', () => {
    const activity = loadActivityFeedV1({ take: 1 })[0]

    expect(selectReviewedActivityOffer({
      ...activity,
      offers: [{
        ...activity.offers[0],
        deeplink: 'https://example.com/unapproved',
      }],
    })).toBeNull()

  })
})
