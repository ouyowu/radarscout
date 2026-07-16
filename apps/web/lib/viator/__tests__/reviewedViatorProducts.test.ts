import { describe, expect, it } from 'vitest'

import {
  loadReviewedViatorProducts,
  validateReviewedViatorProduct,
} from '../reviewedViatorProducts'

describe('reviewedViatorProducts', () => {
  it('loads the 77 manually reviewed Thailand day-trip products with safe handoff and image URLs', () => {
    const products = loadReviewedViatorProducts()

    expect(products).toHaveLength(77)
    expect(new Set(products.map((product) => product.city))).toEqual(new Set([
      'Bangkok',
      'Chiang Mai',
      'Phuket',
      'Krabi',
      'Pattaya',
      'Koh Samui',
    ]))

    for (const product of products) {
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
      expect(product.productUrl).toMatch(/^https:\/\/(?:[^/]+\.)?viator\.com\//)
      expect(product.imageUrl).toMatch(/^https:\/\//)
      expect(Number.isNaN(Date.parse(product.reviewedAt))).toBe(false)
    }

    expect(products.some((product) => product.productCode === '5553790P1')).toBe(true)
    expect(products.filter((product) => product.city === 'Chiang Mai')).toHaveLength(10)
    expect(products.some((product) => product.productCode === '345511P1')).toBe(true)
    expect(products.some((product) => product.productCode === '157340P45')).toBe(true)
    expect(products.some((product) => product.productCode === '5554656P4')).toBe(false)
    expect(products.some((product) => product.productCode === '157340P38')).toBe(false)
    expect(products.some((product) => product.productCode === '90546P33')).toBe(false)
  })

  it('fails closed when a seed record includes commercial or raw upstream data', () => {
    expect(validateReviewedViatorProduct({
      id: 'viator_5567417p3',
      city: 'Bangkok',
      destinationId: '343',
      productCode: '5567417P3',
      title: 'Reviewed product',
      shortSummary: 'A reviewed day-trip option in Bangkok.',
      tags: ['culture'],
      productUrl: 'https://www.viator.com/tours/Bangkok/example/d343-5567417P3?pid=P00309837',
      imageUrl: 'https://media.example.test/product.jpg',
      reviewedAt: '2026-07-16T00:00:00.000Z',
      price: 100,
    })).toEqual({ ok: false, error: 'forbidden_fields', fields: ['price'] })
  })
})
