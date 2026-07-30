import { describe, expect, it } from 'vitest'

import { loadReviewedViatorPublicCatalogue } from '../viator/reviewedViatorPublicCatalogue'
import {
  AI_READY_PRODUCT_SCHEMA_VERSION,
  buildAiReadyProduct,
  loadAiReadyProductCatalogue,
  validateAiReadyProduct,
} from './aiReadyProductSchema'

describe('AI-ready reviewed product schema', () => {
  it('projects every reviewed Viator product into one deterministic decision-support shape', () => {
    const products = loadAiReadyProductCatalogue()

    expect(products).toHaveLength(205)

    for (const product of products) {
      expect(product.schemaVersion).toBe(AI_READY_PRODUCT_SCHEMA_VERSION)
      expect(product.destination).toMatchObject({
        country: 'Thailand',
        countryCode: 'TH',
      })
      expect(product.recommendation.whyRecommended.trim()).not.toBe('')
      expect(product.recommendation.bestFor.length).toBeGreaterThan(0)
      expect(product.recommendation.strengths.length).toBeGreaterThan(0)
      expect(product.recommendation.tradeoffs.length).toBeGreaterThan(0)
      expect(product.partnerLink).toBe(
        `https://www.radarscout.io/tours/${product.id}`,
      )
      expect(product.handoff).toEqual({
        mode: 'affiliate_partner',
        label: 'Check availability',
        availabilityClaimed: false,
      })
      expect(validateAiReadyProduct(product)).toEqual({
        ok: true,
        value: product,
      })
    }
  })

  it('reuses reviewed catalogue facts without exposing upstream or commercial fields', () => {
    const source = loadReviewedViatorPublicCatalogue()[0]
    const product = buildAiReadyProduct(source)

    expect(product.id).toBe(source.id)
    expect(product.title).toBe(source.title)
    expect(product.summary).toBe(source.summary)
    expect(product.destination.city).toBe(source.destination)
    expect(product.themes).toEqual(source.tags)

    for (const field of [
      'bookingPartnerHandoff',
      'retailPrice',
      'currency',
      'price',
      'availability',
      'rating',
      'reviews',
      'supplier',
      'commission',
      'raw',
    ]) {
      expect(product).not.toHaveProperty(field)
    }
    expect(JSON.stringify(product)).not.toMatch(
      /https:\/\/(?:[^/]+\.)?viator\.com|available now|live availability/i,
    )
  })

  it('fails closed when an AI-ready record contains forbidden or unknown fields', () => {
    const product = loadAiReadyProductCatalogue()[0]

    expect(validateAiReadyProduct({
      ...product,
      price: 100,
      raw: { upstream: true },
    })).toEqual({
      ok: false,
      error: 'forbidden_fields',
      fields: ['price', 'raw'],
    })
  })

  it('rejects off-domain partner links and unsupported schema versions', () => {
    const product = loadAiReadyProductCatalogue()[0]

    expect(validateAiReadyProduct({
      ...product,
      partnerLink: 'https://www.viator.com/tours/example',
    })).toEqual({ ok: false, error: 'invalid_shape' })

    expect(validateAiReadyProduct({
      ...product,
      schemaVersion: 'radarscout.ai-ready-product.v2',
    })).toEqual({ ok: false, error: 'invalid_shape' })
  })
})
