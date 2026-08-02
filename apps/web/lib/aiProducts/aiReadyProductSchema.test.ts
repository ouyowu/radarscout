import { describe, expect, it } from 'vitest'

import { loadReviewedViatorPublicCatalogue } from '../viator/reviewedViatorPublicCatalogue'
import {
  AI_READY_PRODUCT_SCHEMA_VERSION,
  buildAiReadyProduct,
  getAiReadyProductById,
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
      expect(product.fit.suitableFor).toMatchObject({
        status: 'derived_from_reviewed_fields',
      })
      expect(product.fit.suitableFor.values.length).toBeGreaterThan(0)
      expect(product.fit.notSuitableFor).toEqual({
        status: 'not_reviewed',
        values: [],
      })
      expect(product.logistics).toEqual({
        pickupAreas: { status: 'not_reviewed', values: [] },
        duration: { status: 'not_reviewed', value: null },
        childRules: { status: 'not_reviewed', value: null },
      })
      expect(product.experience.features).toEqual({
        status: 'human_reviewed',
        values: product.themes,
      })
      expect(product.experience.ethicalFeatures).toEqual({
        status: 'not_reviewed',
        values: [],
      })
      expect(product.partnerLink).toBe(
        `https://www.radarscout.io/tours/${product.id}`,
      )
      expect(product.handoff).toEqual({
        mode: 'affiliate_partner',
        label: 'Check availability',
        availabilityClaimed: false,
      })
      expect(product.partnerHandoff).toMatchObject({
        platform: 'Viator',
        role: 'booking_partner',
        label: 'Check availability',
        currentDetailsOwner: 'Viator',
        availabilityClaimed: false,
      })
      expect(product.partnerHandoff.url).toMatch(
        /^https:\/\/(?:[^/]+\.)?viator\.com\/.+[?&]pid=P00309837(?:&|$)/,
      )
      expect(Number.isNaN(Date.parse(product.provenance.lastVerifiedAt))).toBe(false)
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
    expect(product.provenance.lastVerifiedAt).toBe(source.reviewedAt)
    expect(product.partnerHandoff.url).toBe(source.bookingPartnerHandoff.href)

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
    expect(JSON.stringify(product)).not.toMatch(/available now|live availability/i)
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
    const otherProduct = loadAiReadyProductCatalogue()[1]

    expect(validateAiReadyProduct({
      ...product,
      partnerLink: 'https://www.viator.com/tours/example',
    })).toEqual({ ok: false, error: 'invalid_shape' })

    expect(validateAiReadyProduct({
      ...product,
      schemaVersion: 'radarscout.ai-ready-product.v3',
    })).toEqual({ ok: false, error: 'invalid_shape' })

    expect(validateAiReadyProduct({
      ...product,
      partnerHandoff: {
        ...product.partnerHandoff,
        url: 'https://example.com/not-a-reviewed-handoff',
      },
    })).toEqual({ ok: false, error: 'invalid_shape' })

    expect(validateAiReadyProduct({
      ...product,
      partnerHandoff: {
        ...product.partnerHandoff,
        url: otherProduct.partnerHandoff.url,
      },
    })).toEqual({ ok: false, error: 'invalid_shape' })
  })

  it('fails closed instead of inventing logistics, child, suitability, or ethics facts', () => {
    const product = loadAiReadyProductCatalogue()[0]

    for (const mutation of [
      { logistics: { ...product.logistics, duration: { status: 'human_reviewed', value: '8 hours' } } },
      { fit: { ...product.fit, notSuitableFor: { status: 'human_reviewed', values: ['Children'] } } },
      { experience: { ...product.experience, ethicalFeatures: { status: 'human_reviewed', values: ['Ethical'] } } },
    ]) {
      expect(validateAiReadyProduct({ ...product, ...mutation })).toEqual({
        ok: false,
        error: 'invalid_shape',
      })
    }
  })

  it('looks up only reviewed catalogue IDs', () => {
    const product = loadAiReadyProductCatalogue()[0]

    expect(getAiReadyProductById(`  ${product.id}  `)?.id).toBe(product.id)
    expect(getAiReadyProductById('viator_not_reviewed')).toBeNull()
    expect(getAiReadyProductById('')).toBeNull()
  })
})
