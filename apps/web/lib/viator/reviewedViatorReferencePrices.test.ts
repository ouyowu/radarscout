import { describe, expect, it } from 'vitest'

import {
  getFreshViatorReferencePrice,
  validateReviewedViatorReferencePrice,
} from './reviewedViatorReferencePrices'

describe('reviewed Viator reference prices', () => {
  it('returns a reviewed consumer from-price while it is no more than seven days old', () => {
    const result = getFreshViatorReferencePrice(
      '191442P6',
      new Date('2026-07-30T08:52:26.057Z'),
    )

    expect(result).toEqual({
      retailPrice: '1536.37',
      currency: 'THB',
      priceFetchedAt: '2026-07-23T08:52:26.057Z',
    })
  })

  it('hides a reference price once it is older than seven days', () => {
    const result = getFreshViatorReferencePrice(
      '191442P6',
      new Date('2026-07-30T08:52:26.058Z'),
    )

    expect(result).toBeNull()
  })

  it('rejects commercial fields instead of allowing an upstream pricing object through', () => {
    expect(validateReviewedViatorReferencePrice({
      productCode: '191442P6',
      retailFromPrice: 1536.37,
      currency: 'THB',
      priceFetchedAt: '2026-07-23T08:52:26.057Z',
      partnerNetFromPrice: 1200,
    })).toEqual({
      ok: false,
      error: 'forbidden_fields',
      fields: ['partnerNetFromPrice'],
    })
  })
})
