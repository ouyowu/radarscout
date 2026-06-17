import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findFirst: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

const enrichmentMock = vi.hoisted(() => ({
  getReviewedEnrichmentByProductId: vi.fn(),
}))

vi.mock('@/lib/reviewedEnrichmentReader', () => enrichmentMock)

import { GET } from '../route'

const FORBIDDEN_ENRICHMENT_KEYS = [
  'rawJson',
  'price',
  'availability',
  'supplier',
  'supplierName',
  'rating',
  'reviewCount',
  'bookingUrl',
  'bookingStatus',
  'openingHours',
  'checkout',
  'payment',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
]

function makeRequest(id: string) {
  return new NextRequest(`http://localhost/api/products/${encodeURIComponent(id)}`)
}

function makeParams(id: string) {
  return { params: { id } }
}

function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'product_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    description: '<p>Half-day ethical elephant visit.</p>',
    excerpt: 'Half-day ethical elephant visit.',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    retailPrice: { toString: () => '49.00' },
    currency: 'USD',
    rawJson: {},
    ...overrides,
  }
}

function makeEnrichment() {
  return {
    cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
    shortSummary: 'A responsible half-day elephant experience.',
    suggestedTags: ['Elephants', 'Nature', 'Families'],
    seoTitle: 'Best Elephant Sanctuary in Chiang Mai',
    seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
    reviewedBy: 'editor@radarscout.com',
    reviewedAt: '2026-06-15T12:00:00.000Z',
  }
}

describe('GET /api/products/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 404 when the product is not found', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(null)

    const response = await GET(makeRequest('missing_id'), makeParams('missing_id'))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_NOT_FOUND')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns 404 when the id is empty', async () => {
    const response = await GET(makeRequest(''), makeParams(''))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_NOT_FOUND')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns product with reviewedEnrichment: null when no enrichment exists', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.product).not.toBeNull()
    expect(body.product.reviewedEnrichment).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).toHaveBeenCalledWith('product_abc')
  })

  it('returns product with reviewedEnrichment when enrichment exists', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.product.reviewedEnrichment).toEqual({
      cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
      shortSummary: 'A responsible half-day elephant experience.',
      suggestedTags: ['Elephants', 'Nature', 'Families'],
      seoTitle: 'Best Elephant Sanctuary in Chiang Mai',
      seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
      reviewedBy: 'editor@radarscout.com',
      reviewedAt: '2026-06-15T12:00:00.000Z',
    })
  })

  it('does not expose forbidden fields inside reviewedEnrichment', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const serialized = JSON.stringify(await response.json())

    for (const key of FORBIDDEN_ENRICHMENT_KEYS) {
      expect(serialized).not.toContain(`"${key}"`)
    }
  })

  it('does not expose rawJson anywhere in the response', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      rawJson: { keyPhoto: { originalUrl: 'https://cdn.example.com/photo.jpg' } },
    }))
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.product).not.toHaveProperty('rawJson')
    expect(JSON.stringify(body)).not.toContain('"rawJson"')
  })

  it('does not expose AI candidate output anywhere in the response', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const serialized = JSON.stringify(await response.json())

    expect(serialized).not.toContain('candidate')
    expect(serialized).not.toContain('aiRawResponse')
    expect(serialized).not.toContain('aiPrompt')
    expect(serialized).not.toContain('localAiRawOutput')
  })

  it('does not let reviewedEnrichment override transactional Bókun fields', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      retailPrice: { toString: () => '75.00' },
      currency: 'USD',
    }))
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.product.retailPrice).toBe('75.00')
    expect(body.product.currency).toBe('USD')
    expect(body.product.reviewedEnrichment).not.toHaveProperty('price')
    expect(body.product.reviewedEnrichment).not.toHaveProperty('retailPrice')
  })

  it('keeps bookingEnabled and availabilityEnabled false regardless of enrichment', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })

  it('returns core product fields alongside reviewedEnrichment', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.product.id).toBe('product_abc')
    expect(body.product.title).toBe('Chiang Mai Elephant Sanctuary')
    expect(body.product.city).toBe('Chiang Mai')
    expect(body.product.detailHref).toBe('/tours/product_abc')
    expect(body.product).toHaveProperty('reviewedEnrichment')
  })

  it('returns 500 when an unexpected error occurs', async () => {
    dbMock.bokunProduct.findFirst.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_DETAIL_UNAVAILABLE')
  })
})
