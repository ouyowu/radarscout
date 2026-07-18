import { describe, expect, it } from 'vitest'

import { isThailandCompatibleDestination } from '../../aiProducts/destinationIntent'
import {
  loadReviewedViatorProducts,
  validateReviewedViatorProduct,
  VIATOR_AFFILIATE_PID,
} from '../reviewedViatorProducts'

describe('reviewedViatorProducts', () => {
  it('loads the 105 manually reviewed Thailand day-trip products with safe handoff and image URLs', () => {
    const products = loadReviewedViatorProducts()

    expect(products).toHaveLength(105)
    expect(new Set(products.map((product) => product.city))).toEqual(new Set([
      'Bangkok',
      'Bophut',
      'Chiang Mai',
      'Chiang Rai',
      'Hua Hin',
      'Kanchanaburi',
      'Khao Lak',
      'Ko Chang',
      'Ko Lanta',
      'Ko Lipe',
      'Ko Pha Ngan',
      'Ko Phi Phi Don',
      'Ko Yao Yai',
      'Koh Tao',
      'Phuket',
      'Krabi',
      'Mae Hong Son',
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
      expect(isThailandCompatibleDestination(product.city)).toBe(true)
    }

    expect(products.some((product) => product.productCode === '5553790P1')).toBe(true)
    expect(products.some((product) => product.productCode === '5601517P6')).toBe(true)
    expect(products.some((product) => product.productCode === '157340P38')).toBe(false)
    expect(products.some((product) => product.productCode === '90546P33')).toBe(false)
  })

  it('carries the approved RadarScout affiliate pid on every seed URL', () => {
    for (const product of loadReviewedViatorProducts()) {
      const pid = new URL(product.productUrl).searchParams.get('pid')
      expect(pid, `product ${product.id} must use the approved affiliate pid`).toBe(VIATOR_AFFILIATE_PID)
    }
  })

  it('rejects a seed URL whose pid is not the approved affiliate id', () => {
    expect(validateReviewedViatorProduct({
      id: 'viator_5567417p3',
      city: 'Bangkok',
      destinationId: '343',
      productCode: '5567417P3',
      title: 'Reviewed product',
      shortSummary: 'A reviewed day-trip option in Bangkok.',
      tags: ['culture'],
      productUrl: 'https://www.viator.com/tours/Bangkok/example/d343-5567417P3?pid=P99999999',
      imageUrl: 'https://media.example.test/product.jpg',
      reviewedAt: '2026-07-16T00:00:00.000Z',
    })).toEqual({ ok: false, error: 'invalid_product_url' })
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
