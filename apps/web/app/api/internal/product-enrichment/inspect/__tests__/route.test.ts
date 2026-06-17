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

const VALID_SECRET = 'test-enrichment-secret'

const FORBIDDEN_FIELDS = [
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

function makeRequest(productId?: string, secret?: string) {
  const url = productId
    ? `http://localhost/api/internal/product-enrichment/inspect?productId=${encodeURIComponent(productId)}`
    : 'http://localhost/api/internal/product-enrichment/inspect'

  return new NextRequest(url, {
    headers: secret ? { 'x-internal-enrichment-review-secret': secret } : {},
  })
}

function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'product_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    retailPrice: { toString: () => '49.00' },
    currency: 'USD',
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

describe('GET /api/internal/product-enrichment/inspect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('inspect_not_configured')
  })

  it('returns 401 when secret header is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest('product_abc'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  it('returns 401 when secret header is wrong', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest('product_abc', 'wrong-secret'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  it('returns 400 when productId is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest(undefined, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('productId_required')
  })

  it('returns 404 when product is not found', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockResolvedValue(null)

    const response = await GET(makeRequest('missing_id', VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('product_not_found')
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns product with reviewedEnrichment null when no enrichment exists', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.product.id).toBe('product_abc')
    expect(body.product.title).toBe('Chiang Mai Elephant Sanctuary')
    expect(body.reviewedEnrichment).toBeNull()
  })

  it('returns product with reviewedEnrichment populated when enrichment exists', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.reviewedEnrichment.cleanedTitle).toBe('Ethical Elephant Sanctuary Chiang Mai')
    expect(body.reviewedEnrichment.shortSummary).toBe('A responsible half-day elephant experience.')
    expect(body.reviewedEnrichment.suggestedTags).toEqual(['Elephants', 'Nature', 'Families'])
    expect(body.reviewedEnrichment.seoTitle).toBe('Best Elephant Sanctuary in Chiang Mai')
    expect(body.reviewedEnrichment.seoDescription).toBe('Visit rescued elephants ethically in Chiang Mai.')
    expect(body.reviewedEnrichment.reviewedBy).toBe('editor@radarscout.com')
    expect(body.reviewedEnrichment.reviewedAt).toBe('2026-06-15T12:00:00.000Z')
  })

  it('does not expose forbidden fields in the response', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const serialized = JSON.stringify(await response.json())

    for (const key of FORBIDDEN_FIELDS) {
      expect(serialized).not.toContain(`"${key}"`)
    }
  })

  it('does not expose rawJson in the product field', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const body = await response.json()

    expect(body.product).not.toHaveProperty('rawJson')
    expect(JSON.stringify(body)).not.toContain('"rawJson"')
  })

  it('returns 500 when an unexpected error occurs', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest('product_abc', VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('inspect_unavailable')
  })
})
