import { describe, expect, it } from 'vitest'

import { reviewedViatorBatch5ProductSeedRecords } from '../reviewedViatorBatch5Products'
import { validateReviewedViatorProduct } from '../reviewedViatorProducts'

describe('reviewedViatorBatch5Products', () => {
  it('contains exactly 48 unique owner-approved products for underrepresented Thailand destinations', () => {
    expect(reviewedViatorBatch5ProductSeedRecords).toHaveLength(48)
    expect(new Set(reviewedViatorBatch5ProductSeedRecords.map((product) => product.id)).size).toBe(48)
    expect(new Set(reviewedViatorBatch5ProductSeedRecords.map((product) => product.productCode)).size).toBe(48)

    expect(Object.fromEntries(
      [...new Set(reviewedViatorBatch5ProductSeedRecords.map((product) => product.city))]
        .map((city) => [
          city,
          reviewedViatorBatch5ProductSeedRecords.filter((product) => product.city === city).length,
        ]),
    )).toEqual({
      Bophut: 3,
      'Chiang Rai': 4,
      'Hua Hin': 4,
      Kanchanaburi: 4,
      'Khao Lak': 4,
      'Ko Chang': 4,
      'Ko Lanta': 4,
      'Ko Lipe': 4,
      'Ko Pha Ngan': 4,
      'Ko Phi Phi Don': 4,
      'Ko Yao Yai': 3,
      'Koh Tao': 4,
      'Mae Hong Son': 2,
    })
  })

  it('keeps every record inside the reviewed public schema and approved affiliate handoff', () => {
    for (const product of reviewedViatorBatch5ProductSeedRecords) {
      expect(validateReviewedViatorProduct(product)).toMatchObject({ ok: true })
      expect(Object.keys(product).sort()).toEqual([
        'city',
        'destinationId',
        'id',
        'imageUrl',
        'productCode',
        'productUrl',
        'reviewedAt',
        'shortSummary',
        'tags',
        'title',
      ])
      expect(new URL(product.productUrl).searchParams.get('pid')).toBe('P00309837')
      expect(product.imageUrl).toMatch(/^https:\/\//)
      expect(product).not.toHaveProperty('evidence')
      expect(product).not.toHaveProperty('disposition')
      expect(product).not.toHaveProperty('price')
      expect(product).not.toHaveProperty('availability')
      expect(product).not.toHaveProperty('supplier')
      expect(product).not.toHaveProperty('rating')
      expect(product).not.toHaveProperty('reviews')
      expect(product).not.toHaveProperty('raw')
    }
  })
})
