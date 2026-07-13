import {
  resolveOwnerManagedProfileHandoff,
  type PublicBookingPartnerHandoff,
} from './bookingPartnerHandoff'
import { resolveReviewedResaleProductHandoff } from './reviewedResaleProductHandoffMappings'

export type PublicProductOwnerManagedHandoffMapping = {
  publicProductId: string
  ownerManagedBokunId: string
  reviewedBy: 'operator_manual_review'
  reviewNote: string
}

export const ownerManagedProductHandoffMappings: readonly PublicProductOwnerManagedHandoffMapping[] = []

type ResolveReviewedProductHandoffInput = {
  publicProductId: string
  bokunActivityId: string | null | undefined
}

export function resolveReviewedProductHandoff({
  publicProductId,
  bokunActivityId,
}: ResolveReviewedProductHandoffInput): PublicBookingPartnerHandoff | null {
  const normalizedProductId = publicProductId.trim()
  const normalizedActivityId = bokunActivityId?.trim()

  if (!normalizedProductId || !normalizedActivityId) return null

  const mapping = ownerManagedProductHandoffMappings.find(candidate =>
    candidate.publicProductId === normalizedProductId,
  )

  if (!mapping) return resolveReviewedResaleProductHandoff(normalizedActivityId)
  if (mapping.ownerManagedBokunId !== normalizedActivityId) return null

  return resolveOwnerManagedProfileHandoff(mapping.ownerManagedBokunId)
}
