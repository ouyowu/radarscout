import { describe, expect, it } from 'vitest'

import {
  resolveReviewedResaleProductHandoff,
  type ReviewedResaleProductHandoffMapping,
} from '../reviewedResaleProductHandoffMappings'

const reviewedMapping: ReviewedResaleProductHandoffMapping = {
  bokunActivityId: '502003',
  supplierName: 'Thai Tour Guide',
  bookingWidgetUrl:
    'https://widgets.bokun.io/online-sales/channel-id/experience/502003',
  resaleContractConfirmed: true,
  contentUseConfirmed: true,
  imageUseConfirmed: true,
  reviewedBy: 'operator_manual_review',
  reviewedAt: '2026-07-13T00:00:00.000Z',
  reviewNote: 'Supplier contract and public display rights reviewed by the operator.',
}

describe('resolveReviewedResaleProductHandoff', () => {
  it('returns a safe handoff only for a fully reviewed resale mapping', () => {
    expect(resolveReviewedResaleProductHandoff('502003', [reviewedMapping])).toEqual({
      href: reviewedMapping.bookingWidgetUrl,
      label: 'Check availability',
      rel: 'nofollow sponsored noopener noreferrer',
      source: 'booking_partner_verified_public_widget',
      verifiedBy: 'operator_manual_review',
    })
  })

  it.each([
    ['resaleContractConfirmed', false],
    ['contentUseConfirmed', false],
    ['imageUseConfirmed', false],
  ] as const)('rejects a mapping when %s is not confirmed', (field, value) => {
    expect(resolveReviewedResaleProductHandoff('502003', [{
      ...reviewedMapping,
      [field]: value,
    }])).toBeNull()
  })

  it('rejects mismatched activity IDs and unsafe widget URLs', () => {
    expect(resolveReviewedResaleProductHandoff('999999', [reviewedMapping])).toBeNull()
    expect(resolveReviewedResaleProductHandoff('502003', [{
      ...reviewedMapping,
      bookingWidgetUrl: 'http://localhost/experience/502003',
    }])).toBeNull()
  })
})
