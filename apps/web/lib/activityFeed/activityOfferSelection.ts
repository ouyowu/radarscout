import { isReviewedViatorAffiliateUrl } from '@/lib/viator/reviewedViatorMatching'

import type { ActivityFeedOffer, ActivityFeedV1Item } from './activityFeedV1'

/**
 * Selects an activity's public booking handoff from reviewed offers only.
 *
 * Activity suitability is selected elsewhere. This keeps the current public
 * Viator-only handoff explicit until a future provider has reviewed, mapped
 * offers for the same activity.
 */
export function selectReviewedActivityOffer(
  activity: ActivityFeedV1Item,
): ActivityFeedOffer | null {
  return activity.offers.find((offer) => (
    offer.provider === 'viator'
    && offer.affiliatePartner === 'viator'
    && offer.inventorySource === 'reviewed_viator_catalog'
    && offer.availabilityClaimed === false
    && isReviewedViatorAffiliateUrl(offer.deeplink)
  )) ?? null
}
