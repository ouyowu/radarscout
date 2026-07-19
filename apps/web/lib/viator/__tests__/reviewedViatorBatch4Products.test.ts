import { describe, expect, it } from 'vitest'

import { reviewedViatorBatch4ProductSeedRecords } from '../reviewedViatorBatch4Products'
import { validateReviewedViatorProduct } from '../reviewedViatorProducts'

describe('reviewedViatorBatch4Products', () => {
  it('contains exactly 100 unique reviewed Thailand products across six popular cities', () => {
    expect(reviewedViatorBatch4ProductSeedRecords).toHaveLength(100)
    expect(new Set(reviewedViatorBatch4ProductSeedRecords.map((product) => product.id)).size).toBe(100)
    expect(new Set(reviewedViatorBatch4ProductSeedRecords.map((product) => product.productCode)).size).toBe(100)

    expect(Object.fromEntries(
      [...new Set(reviewedViatorBatch4ProductSeedRecords.map((product) => product.city))]
        .map((city) => [
          city,
          reviewedViatorBatch4ProductSeedRecords.filter((product) => product.city === city).length,
        ]),
    )).toEqual({
      Bangkok: 17,
      'Chiang Mai': 14,
      Phuket: 20,
      Krabi: 20,
      Pattaya: 11,
      'Koh Samui': 18,
    })
  })

  it('keeps every record inside the reviewed public schema and approved affiliate handoff', () => {
    for (const product of reviewedViatorBatch4ProductSeedRecords) {
      expect(validateReviewedViatorProduct(product)).toMatchObject({ ok: true })
      expect(new URL(product.productUrl).searchParams.get('pid')).toBe('P00309837')
      expect(product.imageUrl).toMatch(/^https:\/\//)
      expect(product).not.toHaveProperty('price')
      expect(product).not.toHaveProperty('availability')
      expect(product).not.toHaveProperty('supplier')
      expect(product).not.toHaveProperty('rating')
      expect(product).not.toHaveProperty('reviews')
      expect(product).not.toHaveProperty('raw')
    }
  })
})
