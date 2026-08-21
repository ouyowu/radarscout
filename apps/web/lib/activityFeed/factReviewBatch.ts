import {
  loadActivityFeedV1,
  type ActivityFeedField,
  type ActivityFeedV1Item,
} from './activityFeedV1'

export const ACTIVITY_FACT_REVIEW_FIELDS = [
  'duration',
  'pickupArea',
  'childPolicy',
  'fitnessLevel',
  'cancellationPolicy',
  'ethicalAttributes',
] as const

export type ActivityFactReviewField = typeof ACTIVITY_FACT_REVIEW_FIELDS[number]

export type ActivityFactReviewCandidate = {
  productId: string
  title: string
  city: string
  reviewPath: `/tours/${string}`
  lastVerifiedAt: string
  pendingFields: ActivityFactReviewField[]
}

function needsFactReview(field: ActivityFeedField<unknown>): boolean {
  return field.status === 'not_reviewed'
}

function reviewableFields(
  item: ActivityFeedV1Item,
): Record<ActivityFactReviewField, ActivityFeedField<unknown>> {
  return {
    duration: item.duration,
    pickupArea: item.pickupArea,
    childPolicy: item.childPolicy,
    fitnessLevel: item.fitnessLevel,
    cancellationPolicy: item.cancellationPolicy,
    ethicalAttributes: item.ethicalAttributes,
  }
}

/**
 * Builds a bounded, read-only batch for human fact review. It never fetches
 * provider data, infers missing facts, or changes the public Activity Feed.
 */
export function selectActivityFactReviewBatch(
  items: readonly ActivityFeedV1Item[],
  take = 20,
): ActivityFactReviewCandidate[] {
  const limit = Math.max(0, Math.min(40, Math.floor(take)))

  return items
    .map((item) => {
      const fields = reviewableFields(item)
      const pendingFields = ACTIVITY_FACT_REVIEW_FIELDS.filter(field => needsFactReview(fields[field]))

      return {
        productId: item.id,
        title: item.title,
        city: item.destination.city,
        reviewPath: item.detailHref,
        lastVerifiedAt: item.provenance.verifiedAt,
        pendingFields,
      }
    })
    .filter(candidate => candidate.pendingFields.length > 0)
    .sort((left, right) => (
      right.pendingFields.length - left.pendingFields.length
      || left.city.localeCompare(right.city)
      || left.title.localeCompare(right.title)
      || left.productId.localeCompare(right.productId)
    ))
    .slice(0, limit)
}

export function loadActivityFactReviewBatch(take = 20): ActivityFactReviewCandidate[] {
  return selectActivityFactReviewBatch(loadActivityFeedV1(), take)
}
