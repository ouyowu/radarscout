import { describe, expect, it } from 'vitest'

import type { ReviewedViatorProduct } from '../reviewedViatorProducts'
import {
  listReviewedViatorCatalogueProducts,
  paginateReviewedViatorCatalogueProducts,
} from '../reviewedViatorCatalogue'

function product(overrides: Partial<ReviewedViatorProduct> = {}): ReviewedViatorProduct {
  return {
    id: 'viator_example',
    city: 'Bangkok',
    destinationId: '343',
    productCode: 'EXAMPLE',
    title: 'Bangkok Culture and Food Day Trip',
    shortSummary: 'A reviewed full-day Bangkok route.',
    tags: ['culture', 'food', 'day-trip'],
    productUrl: 'https://www.viator.com/tours/Bangkok/example/d343-EXAMPLE?pid=P00309837',
    imageUrl: 'https://media.example.test/example.jpg',
    reviewedAt: '2026-07-17T00:00:00.000Z',
    ...overrides,
  }
}

describe('listReviewedViatorCatalogueProducts', () => {
  const products = [
    product(),
    product({
      id: 'viator_chiang_mai',
      city: 'Chiang Mai',
      destinationId: '5267',
      productCode: 'CHIANGMAI',
      title: 'Chiang Mai Nature Walk',
      shortSummary: 'A reviewed half-day nature experience.',
      tags: ['nature', 'half-day'],
    }),
  ]

  it('filters only against reviewed city, theme, and explicitly described duration data', () => {
    expect(listReviewedViatorCatalogueProducts(products, {
      city: 'chiang-mai',
      theme: 'nature',
      duration: 'half-day',
    }).map(product => product.id)).toEqual(['viator_chiang_mai'])

    expect(listReviewedViatorCatalogueProducts(products, {
      city: 'bangkok',
      duration: 'full-day',
    }).map(product => product.id)).toEqual(['viator_example'])
  })

  it('does not infer traveller-group suitability from product copy', () => {
    expect(listReviewedViatorCatalogueProducts(products, {}).map(product => product.id)).toEqual([
      'viator_example',
      'viator_chiang_mai',
    ])
  })

  it('paginates reviewed results without dropping the total match count', () => {
    const page = paginateReviewedViatorCatalogueProducts(products, 2, 1)

    expect(page.items.map(product => product.id)).toEqual(['viator_chiang_mai'])
    expect(page.page).toBe(2)
    expect(page.totalPages).toBe(2)
    expect(page.totalItems).toBe(2)
  })
})
