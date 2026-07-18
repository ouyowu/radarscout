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

const handoffMock = vi.hoisted(() => ({
  resolveReviewedProductHandoff: vi.fn(),
}))
vi.mock('@/lib/publicProducts/ownerManagedProductHandoffMappings', () => handoffMock)

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
    bokunActivityId: '1232729',
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
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())
    handoffMock.resolveReviewedProductHandoff.mockReturnValue({
      href: 'https://widgets.bokun.io/online-sales/channel/experience/1232729',
      label: 'Check availability',
      rel: 'nofollow sponsored noopener noreferrer',
      source: 'booking_partner_verified_public_widget',
      verifiedBy: 'operator_manual_review',
    })
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

  it('returns 404 when no human-reviewed enrichment exists', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)
    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
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

  it('never publishes transactional Bókun fields, even when present in the database', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      retailPrice: { toString: () => '75.00' },
      currency: 'USD',
    }))
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.product.retailPrice).toBeNull()
    expect(body.product.currency).toBeNull()
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

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(body.product.id).toBe('product_abc')
    expect(body.product.title).toBe('Ethical Elephant Sanctuary Chiang Mai')
    expect(body.product.city).toBe('Chiang Mai')
    expect(body.product.detailHref).toBe('/tours/product_abc')
    expect(body.product).toHaveProperty('reviewedEnrichment')
  })

  it('returns only the public product detail allowlist fields', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      rawJson: {
        duration: 'Half day',
        meetingPoint: 'Mae Rim',
        pickupAvailable: true,
        cancellationPolicy: 'Review partner policy before continuing.',
        bookingUrl: 'https://internal.example.com/book',
        supplierRate: '10.00',
      },
    }))
    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(Object.keys(body).sort()).toEqual(['meta', 'product'])
    expect(Object.keys(body.product).sort()).toEqual([
      'bookingPartnerHandoff',
      'city',
      'currency',
      'description',
      'destination',
      'detailHref',
      'facts',
      'id',
      'imageGalleryUrls',
      'imageUrl',
      'location',
      'retailPrice',
      'reviewedEnrichment',
      'summary',
      'title',
    ])
    expect(Object.keys(body.product.facts).sort()).toEqual([
      'cancellationPolicy',
      'duration',
      'meetingPoint',
      'pickupAvailable',
    ])
    expect(JSON.stringify(body)).not.toContain('bookingUrl')
    expect(JSON.stringify(body)).not.toContain('supplierRate')
  })

  it('returns 500 when an unexpected error occurs', async () => {
    dbMock.bokunProduct.findFirst.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_DETAIL_UNAVAILABLE')
  })

  it('does not expose issueFlag in the public product response', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const serialized = JSON.stringify(await response.json())

    expect(serialized).not.toContain('issueFlag')
    expect(serialized).not.toContain('flaggedBy')
    expect(serialized).not.toContain('flaggedAt')
    expect(serialized).not.toContain('resolvedAt')
  })
})

describe('GET /api/products/[id] — Thailand eligibility guardrail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 404 for product with foreign signal in title (same shape as not-found)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      title: 'Singapore City Tour',
      city: 'Bangkok',
    }))

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_NOT_FOUND')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns 404 for product with no geographic signal ("Thai" only)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      title: 'Thai Cooking Class',
      city: null,
      location: null,
    }))

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_NOT_FOUND')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns 404 for destination-mismatched product (city=Phuket but title mentions Bali)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      title: 'Bali Yoga Retreat',
      city: 'Phuket',
    }))

    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.product).toBeNull()
    expect(body.error).toBe('PRODUCT_NOT_FOUND')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns 200 for eligible product (regression — existing behavior preserved)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    const response = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.product).not.toBeNull()
    expect(body.product.id).toBe('product_abc')
  })

  it('does not constrain detail lookup to the old hardcoded Thailand city list', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      id: 'chiang_rai_1',
      title: 'Chiang Rai Temple Tour',
      city: 'Chiang Rai',
      location: null,
    }))
    const response = await GET(makeRequest('chiang_rai_1'), makeParams('chiang_rai_1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.product.id).toBe('chiang_rai_1')
    expect(body.product.city).toBe('Chiang Rai')
    expect(dbMock.bokunProduct.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.not.objectContaining({
        city: expect.anything(),
      }),
    }))
  })

  it('ineligible 404 body matches the not-found 404 body', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      title: 'Vietnam Mekong River Tour',
      city: 'Bangkok',
    }))

    const ineligibleResponse = await GET(makeRequest('product_abc'), makeParams('product_abc'))
    const ineligibleBody = await ineligibleResponse.json()

    dbMock.bokunProduct.findFirst.mockResolvedValue(null)

    const notFoundResponse = await GET(makeRequest('missing'), makeParams('missing'))
    const notFoundBody = await notFoundResponse.json()

    expect(ineligibleResponse.status).toBe(notFoundResponse.status)
    expect(ineligibleBody.product).toEqual(notFoundBody.product)
    expect(ineligibleBody.error).toBe(notFoundBody.error)
  })

  it('getReviewedEnrichmentByProductId is not called when product is ineligible', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct({
      title: 'Tokyo Cherry Blossom Tour',
      city: 'Bangkok',
    }))

    await GET(makeRequest('product_abc'), makeParams('product_abc'))

    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })
})
