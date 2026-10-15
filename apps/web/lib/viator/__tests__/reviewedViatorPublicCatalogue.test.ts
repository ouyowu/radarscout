import { describe, expect, it } from 'vitest'

import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
  paginateReviewedViatorPublicCatalogue,
} from '../reviewedViatorPublicCatalogue'

describe('reviewedViatorPublicCatalogue', () => {
  it('exposes all reviewed Viator products through one display-safe public shape', () => {
    const products = loadReviewedViatorPublicCatalogue()

    expect(products).toHaveLength(253)

    for (const product of products) {
      expect(product.id).toMatch(/^viator_/)
      expect(product.detailHref).toBe(`/tours/${product.id}`)
      expect(product.retailPrice).toBeNull()
      expect(product.currency).toBeNull()
      expect(Number.isNaN(Date.parse(product.reviewedAt))).toBe(false)
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
    const pages = Array.from({ length: 22 }, (_, index) => (
      paginateReviewedViatorPublicCatalogue(products, index + 1, 12)
    ))
    const productIds = pages.flatMap((page) => page.items.map((product) => product.id))

    expect(pages[0]).toMatchObject({ page: 1, pageSize: 12, totalItems: 253, totalPages: 22 })
    expect(pages[21].items).toHaveLength(1)
    expect(productIds).toHaveLength(253)
    expect(new Set(productIds).size).toBe(253)
    expect(paginateReviewedViatorPublicCatalogue(products, 99, 12).page).toBe(22)
  })
})
