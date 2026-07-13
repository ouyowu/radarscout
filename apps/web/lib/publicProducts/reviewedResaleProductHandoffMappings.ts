import {
  validatePublicBookingPartnerHandoff,
  type PublicBookingPartnerHandoff,
} from './bookingPartnerHandoff'

export type ReviewedResaleProductHandoffMapping = {
  bokunActivityId: string
  supplierName: string
  bookingWidgetUrl: string
  resaleContractConfirmed: true
  contentUseConfirmed: true
  imageUseConfirmed: true
  reviewedBy: 'operator_manual_review'
  reviewedAt: string
  reviewNote: string
}

// Add records only after the operator has reviewed the supplier contract,
// public widget, and permission to display the supplier's text and images.
export const reviewedResaleProductHandoffMappings:
readonly ReviewedResaleProductHandoffMapping[] = []

function hasText(value: string): boolean {
  return value.trim().length > 0
}

export function resolveReviewedResaleProductHandoff(
  bokunActivityId: string | null | undefined,
  mappings: readonly ReviewedResaleProductHandoffMapping[] =
    reviewedResaleProductHandoffMappings,
): PublicBookingPartnerHandoff | null {
  const normalizedActivityId = bokunActivityId?.trim()
  if (!normalizedActivityId || !/^\d+$/.test(normalizedActivityId)) return null

  const mapping = mappings.find(candidate =>
    candidate.bokunActivityId === normalizedActivityId,
  )

  if (!mapping) return null
  if (!mapping.resaleContractConfirmed ||
      !mapping.contentUseConfirmed ||
      !mapping.imageUseConfirmed) return null
  if (!hasText(mapping.supplierName) ||
      !hasText(mapping.reviewedAt) ||
      !hasText(mapping.reviewNote)) return null

  return validatePublicBookingPartnerHandoff({
    href: mapping.bookingWidgetUrl,
    source: 'booking_partner_verified_public_widget',
    verifiedBy: mapping.reviewedBy,
  })
}
