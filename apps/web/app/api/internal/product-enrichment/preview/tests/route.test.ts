import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { db } from '@reddit-monitor/db'

const enrichmentMock = vi.hoisted(() => ({
  generateProductEnrichmentCandidates: vi.fn(),
}))

vi.mock('@/lib/localAi/productEnrichment', () => enrichmentMock)

import { POST } from '../route'

const mockFindUnique = db.bokunProduct.findUnique as unknown as ReturnType<typeof vi.fn>
const mockGenerateProductEnrichmentCandidates =
  enrichmentMock.generateProductEnrichmentCandidates as unknown as ReturnType<typeof vi.fn>

function makeRequest(body: unknown = {}, secret?: string) {
  return new NextRequest('http://localhost/api/internal/product-enrichment/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-internal-ai-preview-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })
}

const PRODUCT = {
  id: 'product_123',
  title: 'Chiang Mai elephant sanctuary day tour',
  description: 'Visit an elephant sanctuary with lunch.',
  excerpt: 'Elephant sanctuary with lunch',
  city: 'Chiang Mai',
  location: 'Northern Thailand',
  supplier: { title: 'Trusted Local Operator' },
}

describe('POST /api/internal/product-enrichment/preview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.INTERNAL_AI_PREVIEW_SECRET = 'preview-secret'
  })

  it('returns 503 when INTERNAL_AI_PREVIEW_SECRET is missing', async () => {
    delete process.env.INTERNAL_AI_PREVIEW_SECRET

    const response = await POST(makeRequest({ productId: 'product_123' }))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'preview_not_configured',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 401 when the preview secret header is missing', async () => {
    const response = await POST(makeRequest({ productId: 'product_123' }))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 401 when the preview secret header is invalid', async () => {
    const response = await POST(makeRequest({ productId: 'product_123' }, 'wrong-secret'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when productId is invalid', async () => {
    for (const productId of [null, '', '   ', 'x'.repeat(129), 123]) {
      const response = await POST(makeRequest({ productId }, 'preview-secret'))

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: 'invalid_product_id',
      })
    }

    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('returns 404 when the product does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    const response = await POST(makeRequest({ productId: 'missing_product' }, 'preview-secret'))

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'product_not_found',
    })
    expect(mockGenerateProductEnrichmentCandidates).not.toHaveBeenCalled()
  })

  it('loads only safe product fields and calls the enrichment helper with safe input', async () => {
    mockFindUnique.mockResolvedValue(PRODUCT)
    mockGenerateProductEnrichmentCandidates.mockResolvedValue({
      ok: true,
      productId: 'product_123',
      cleanedTitle: 'Clean title',
      shortSummary: 'Clean summary',
      suggestedTags: ['elephants'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: ['availability'],
      warnings: [],
    })

    const response = await POST(makeRequest({ productId: ' product_123 ' }, 'preview-secret'))

    expect(response.status).toBe(200)
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 'product_123' },
      select: {
        id: true,
        title: true,
        description: true,
        excerpt: true,
        city: true,
        location: true,
        supplier: {
          select: {
            title: true,
          },
        },
      },
    })
    expect(JSON.stringify(mockFindUnique.mock.calls)).not.toContain('rawJson')
    expect(mockGenerateProductEnrichmentCandidates).toHaveBeenCalledWith({
      id: 'product_123',
      title: PRODUCT.title,
      description: PRODUCT.description,
      excerpt: PRODUCT.excerpt,
      destination: PRODUCT.city,
      location: PRODUCT.location,
      supplierName: PRODUCT.supplier.title,
    })
    expect(JSON.stringify(mockGenerateProductEnrichmentCandidates.mock.calls)).not.toContain('rawJson')
  })

  it('returns a successful candidate preview response', async () => {
    mockFindUnique.mockResolvedValue(PRODUCT)
    mockGenerateProductEnrichmentCandidates.mockResolvedValue({
      ok: true,
      productId: 'product_123',
      cleanedTitle: 'Clean title',
      shortSummary: 'Clean summary',
      suggestedTags: ['elephants', 'family-friendly'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: ['availability'],
      warnings: [],
    })

    const response = await POST(makeRequest({ productId: 'product_123' }, 'preview-secret'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      productId: 'product_123',
      candidate: {
        ok: true,
        productId: 'product_123',
        cleanedTitle: 'Clean title',
        shortSummary: 'Clean summary',
        suggestedTags: ['elephants', 'family-friendly'],
        seoTitle: 'SEO title',
        seoDescription: 'SEO description',
        missingFacts: ['availability'],
        warnings: [],
      },
    })
  })

  it('returns local AI candidate failures safely inside a successful preview response', async () => {
    mockFindUnique.mockResolvedValue(PRODUCT)
    mockGenerateProductEnrichmentCandidates.mockResolvedValue({
      ok: false,
      productId: 'product_123',
      error: 'local_ai_not_configured',
      warnings: [],
    })

    const response = await POST(makeRequest({ productId: 'product_123' }, 'preview-secret'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      productId: 'product_123',
      candidate: {
        ok: false,
        productId: 'product_123',
        error: 'local_ai_not_configured',
        warnings: [],
      },
    })
  })

  it('does not return rawJson or forbidden generated fields', async () => {
    mockFindUnique.mockResolvedValue(PRODUCT)
    mockGenerateProductEnrichmentCandidates.mockResolvedValue({
      ok: true,
      productId: 'product_123',
      cleanedTitle: 'Clean title',
      shortSummary: 'Clean summary',
      suggestedTags: ['elephants'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: [],
      warnings: [],
      rawJson: { forbidden: true },
      bookingUrl: 'https://forbidden.example.com',
      price: '999 USD',
      availability: 'available now',
      checkout: 'forbidden',
      payment: 'forbidden',
      rating: '5 stars',
    })

    const response = await POST(makeRequest({ productId: 'product_123' }, 'preview-secret'))
    const body = await response.json()
    const serialized = JSON.stringify(body)

    expect(body.candidate).not.toHaveProperty('rawJson')
    expect(body.candidate).not.toHaveProperty('bookingUrl')
    expect(body.candidate).not.toHaveProperty('price')
    expect(body.candidate).not.toHaveProperty('availability')
    expect(body.candidate).not.toHaveProperty('checkout')
    expect(body.candidate).not.toHaveProperty('payment')
    expect(body.candidate).not.toHaveProperty('rating')
    expect(serialized).not.toContain('forbidden.example.com')
    expect(serialized).not.toContain('999 USD')
  })
})
