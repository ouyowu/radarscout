import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { db } from '@reddit-monitor/db'

vi.mock('server-only', () => ({}))

const localAiMock = vi.hoisted(() => ({
  generateProductEnrichmentCandidates: vi.fn(),
}))

vi.mock('@/lib/localAi/productEnrichment', () => localAiMock)

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findUnique: vi.fn(),
  },
  bokunProductEnrichment: {
    upsert: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

import { POST } from '../route'

const mockFindUnique = db.bokunProduct.findUnique as unknown as ReturnType<typeof vi.fn>
const mockUpsert = db.bokunProductEnrichment.upsert as unknown as ReturnType<typeof vi.fn>
const mockGenerateProductEnrichmentCandidates =
  localAiMock.generateProductEnrichmentCandidates as unknown as ReturnType<typeof vi.fn>

const REVIEWED_AT = '2026-06-15T12:00:00.000Z'
const UPDATED_AT = new Date('2026-06-15T12:30:00.000Z')

function makeRequest(body: unknown = {}, secret?: string) {
  return new NextRequest('http://localhost/api/internal/product-enrichment/reviewed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-internal-enrichment-review-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    productId: 'product_123',
    cleanedTitle: '  Clean Chiang Mai tour  ',
    shortSummary: '  Reviewed summary.  ',
    suggestedTags: [' elephants ', 'Food', 'food', '', 'Temples'],
    seoTitle: '  SEO title  ',
    seoDescription: '  SEO description  ',
    reviewedBy: '  reviewer@example.com  ',
    reviewedAt: REVIEWED_AT,
    ...overrides,
  }
}

function mockExistingProductUpsert() {
  mockFindUnique.mockResolvedValue({ id: 'product_123' })
  mockUpsert.mockResolvedValue({
    productId: 'product_123',
    cleanedTitle: 'Clean Chiang Mai tour',
    shortSummary: 'Reviewed summary.',
    suggestedTags: ['elephants', 'Food', 'Temples'],
    seoTitle: 'SEO title',
    seoDescription: 'SEO description',
    reviewedBy: 'reviewer@example.com',
    reviewedAt: new Date(REVIEWED_AT),
    updatedAt: UPDATED_AT,
  })
}

describe('POST /api/internal/product-enrichment/reviewed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET = 'review-secret'
  })

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is missing', async () => {
    delete process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET

    const response = await POST(makeRequest(validPayload()))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'review_not_configured',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it('returns 401 when the review secret header is missing', async () => {
    const response = await POST(makeRequest(validPayload()))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 401 when the review secret header is invalid', async () => {
    const response = await POST(makeRequest(validPayload(), 'wrong-secret'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when productId is invalid', async () => {
    for (const productId of [null, '', '   ', 'x'.repeat(129), 123]) {
      const response = await POST(makeRequest(validPayload({ productId }), 'review-secret'))

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: 'invalid_product_id',
      })
    }

    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when reviewedBy is missing or invalid', async () => {
    for (const reviewedBy of [null, '', '   ', 123]) {
      const response = await POST(makeRequest(validPayload({ reviewedBy }), 'review-secret'))

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: 'invalid_reviewer',
      })
    }

    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when reviewedAt is invalid', async () => {
    const response = await POST(
      makeRequest(validPayload({ reviewedAt: 'not-a-date' }), 'review-secret'),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'invalid_reviewed_at',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when no reviewed enrichment fields are present', async () => {
    const response = await POST(
      makeRequest({
        productId: 'product_123',
        cleanedTitle: ' ',
        shortSummary: '',
        suggestedTags: [],
        seoTitle: '   ',
        seoDescription: '',
        reviewedBy: 'reviewer@example.com',
      }, 'review-secret'),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'no_reviewed_fields',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('rejects unknown fields', async () => {
    const response = await POST(
      makeRequest(validPayload({ unexpected: 'value' }), 'review-secret'),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unknown_fields',
      fields: ['unexpected'],
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('rejects forbidden fields and lists them', async () => {
    const response = await POST(
      makeRequest(validPayload({
        rawJson: {},
        price: '999',
        availability: 'available',
        supplierName: 'Forbidden supplier',
        bookingUrl: 'https://example.com/book',
        checkout: true,
        payment: true,
        candidate: {},
        aiRawResponse: 'forbidden',
      }), 'review-secret'),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'forbidden_fields',
      fields: [
        'aiRawResponse',
        'availability',
        'bookingUrl',
        'candidate',
        'checkout',
        'payment',
        'price',
        'rawJson',
        'supplierName',
      ],
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 404 when the product does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    const response = await POST(makeRequest(validPayload(), 'review-secret'))

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'product_not_found',
    })
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'product_123' },
      select: { id: true },
    })
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it('upserts reviewed enrichment for an existing product', async () => {
    mockExistingProductUpsert()

    const response = await POST(makeRequest(validPayload(), 'review-secret'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'product_123' },
      select: { id: true },
    })
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { productId: 'product_123' },
      create: {
        productId: 'product_123',
        cleanedTitle: 'Clean Chiang Mai tour',
        shortSummary: 'Reviewed summary.',
        suggestedTags: ['elephants', 'Food', 'Temples'],
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
        reviewedBy: 'reviewer@example.com',
        reviewedAt: new Date(REVIEWED_AT),
      },
      update: {
        cleanedTitle: 'Clean Chiang Mai tour',
        shortSummary: 'Reviewed summary.',
        suggestedTags: ['elephants', 'Food', 'Temples'],
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
        reviewedBy: 'reviewer@example.com',
        reviewedAt: new Date(REVIEWED_AT),
      },
    })
    expect(body).toEqual({
      ok: true,
      productId: 'product_123',
      reviewedEnrichment: {
        productId: 'product_123',
        cleanedTitle: 'Clean Chiang Mai tour',
        shortSummary: 'Reviewed summary.',
        suggestedTags: ['elephants', 'Food', 'Temples'],
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
        reviewedBy: 'reviewer@example.com',
        reviewedAt: REVIEWED_AT,
        updatedAt: UPDATED_AT.toISOString(),
      },
    })
  })

  it('does not call local AI or auto-save candidates', async () => {
    mockExistingProductUpsert()

    await POST(makeRequest(validPayload(), 'review-secret'))

    expect(mockGenerateProductEnrichmentCandidates).not.toHaveBeenCalled()
    expect(JSON.stringify(mockUpsert.mock.calls)).not.toContain('candidate')
    expect(JSON.stringify(mockUpsert.mock.calls)).not.toContain('aiRawResponse')
  })

  it('does not return forbidden fields', async () => {
    mockExistingProductUpsert()

    const response = await POST(makeRequest(validPayload(), 'review-secret'))
    const serialized = JSON.stringify(await response.json())

    for (const forbidden of [
      'rawJson',
      'price',
      'availability',
      'supplier',
      'rating',
      'bookingUrl',
      'checkout',
      'payment',
      'candidate',
      'aiRawResponse',
    ]) {
      expect(serialized).not.toContain(forbidden)
    }
  })

  it('trims, dedupes, caps, and cleans suggestedTags', async () => {
    mockExistingProductUpsert()

    await POST(
      makeRequest(validPayload({
        suggestedTags: [
          ' Food ',
          'food',
          '',
          'Temples',
          'A very long tag name that should be capped before storage',
          'Nature',
          'Families',
          'Culture',
          'Markets',
          'Walking',
          'Extra',
        ],
      }), 'review-secret'),
    )

    const upsertPayload = mockUpsert.mock.calls[0][0]

    expect(upsertPayload.create.suggestedTags).toEqual([
      'Food',
      'Temples',
      'A very long tag name that should be capp',
      'Nature',
      'Families',
      'Culture',
      'Markets',
      'Walking',
    ])
  })

  it('caps long strings and converts empty strings to null', async () => {
    mockExistingProductUpsert()

    await POST(
      makeRequest(validPayload({
        cleanedTitle: 'x'.repeat(140),
        shortSummary: '',
        seoTitle: 'y'.repeat(90),
        seoDescription: 'z'.repeat(220),
      }), 'review-secret'),
    )

    const upsertPayload = mockUpsert.mock.calls[0][0]

    expect(upsertPayload.create.cleanedTitle).toHaveLength(120)
    expect(upsertPayload.create.shortSummary).toBeNull()
    expect(upsertPayload.create.seoTitle).toHaveLength(70)
    expect(upsertPayload.create.seoDescription).toHaveLength(180)
  })
})
