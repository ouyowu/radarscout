import { describe, expect, it, vi } from 'vitest'

import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
  paginateReviewedViatorPublicCatalogue,
} from '../reviewedViatorPublicCatalogue'

describe('reviewedViatorPublicCatalogue', () => {
  it('exposes all reviewed Viator products through one display-safe public shape', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-24T00:00:00.000Z'))
    const products = loadReviewedViatorPublicCatalogue()

    try {
      expect(products).toHaveLength(205)

      for (const product of products) {
        expect(product.id).toMatch(/^viator_/)
        expect(product.detailHref).toBe(`/tours/${product.id}`)
        if (product.retailPrice !== null) {
          expect(Number(product.retailPrice)).toBeGreaterThan(0)
          expect(product.currency).toMatch(/^(THB|USD)$/)
          expect(product.priceFetchedAt).toBe('2026-07-23T08:52:26.057Z')
        } else {
          expect(product.currency).toBeNull()
          expect(product.priceFetchedAt).toBeNull()
        }
        expect(product.bookingPartnerHandoff).toMatchObject({
          label: 'Check availability',
          rel: 'nofollow sponsored noopener noreferrer',
          source: 'operator_verified_public_link',
          verifiedBy: 'operator_manual_review',
        })
        expect(product.bookingPartnerHandoff.href).toMatch(
          /^https:\/\/(?:[^/]+\.)?viator\.com\/.+[?&]pid=P00309837(?:&|$)/,
        )

        expect(product).not.toHaveProperty('raw')
        expect(product).not.toHaveProperty('supplier')
        expect(product).not.toHaveProperty('availability')
        expect(product).not.toHaveProperty('rating')
        expect(product).not.toHaveProperty('reviews')
        expect(product).not.toHaveProperty('partnerNetFromPrice')
        expect(product).not.toHaveProperty('commission')
      }

      expect(products.filter(product => product.retailPrice !== null)).toHaveLength(6)
    } finally {
      vi.useRealTimers()
    }
  })

  it('filters the reviewed catalogue by every supported Thailand city slug', () => {
    const cities = listReviewedViatorPublicCatalogueCities()

    expect(cities).toHaveLength(19)
    expect(new Set(cities.map((city) => city.slug)).size).toBe(19)
    expect(cities).toContainEqual({ slug: 'chiang-mai', label: 'Chiang Mai' })
    expect(cities).toContainEqual({ slug: 'ko-pha-ngan', label: 'Ko Pha Ngan' })

    expect(loadReviewedViatorPublicCatalogue({ city: 'chiang-mai' })).toHaveLength(20)
    expect(loadReviewedViatorPublicCatalogue({ city: 'phuket' })).toHaveLength(36)
    expect(loadReviewedViatorPublicCatalogue({ city: 'tokyo' })).toEqual([])
  })

  it('paginates the complete reviewed catalogue without duplicates or omissions', () => {
    const products = loadReviewedViatorPublicCatalogue()
    const pages = Array.from({ length: 18 }, (_, index) => (
      paginateReviewedViatorPublicCatalogue(products, index + 1, 12)
    ))
    const productIds = pages.flatMap((page) => page.items.map((product) => product.id))

    expect(pages[0]).toMatchObject({ page: 1, pageSize: 12, totalItems: 205, totalPages: 18 })
    expect(pages[17].items).toHaveLength(1)
    expect(productIds).toHaveLength(205)
    expect(new Set(productIds).size).toBe(205)
    expect(paginateReviewedViatorPublicCatalogue(products, 99, 12).page).toBe(18)
  })
})
