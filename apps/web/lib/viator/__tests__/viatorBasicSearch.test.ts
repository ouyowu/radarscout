import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { searchViatorSandboxProducts } from '../viatorBasicSearch'

const sampleProduct = {
  productCode: '1234P1',
  title: 'Chiang Mai cooking class',
  productUrl: 'https://www.viator.com/tours/Chiang-Mai/Cooking-Class/d5267-1234P1?pid=example',
  images: [
    {
      isCover: true,
      variants: [
        { width: 320, height: 180, url: 'https://images.example.test/small.jpg' },
        { width: 1200, height: 675, url: 'https://images.example.test/large.jpg' },
      ],
    },
  ],
  supplier: { name: 'Do not expose' },
  pricing: { partnerNetFromPrice: 25 },
  reviews: { totalReviews: 999 },
  viatorUniqueContent: { description: 'Do not expose' },
}

describe('searchViatorSandboxProducts', () => {
  it('fails closed without an API key and does not call Viator', async () => {
    const fetchFn = vi.fn()

    await expect(searchViatorSandboxProducts(
      { destinationId: '5267' },
      { apiKey: undefined, fetchFn },
    )).resolves.toEqual({ ok: false, reason: 'not_configured' })

    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('uses the Sandbox search endpoint and reduces the upstream response to safe fields', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      products: [sampleProduct],
      totalCount: 1,
    }), { status: 200 }))

    await expect(searchViatorSandboxProducts(
      { destinationId: '5267', count: 5 },
      { apiKey: 'sandbox-test-key', fetchFn },
    )).resolves.toEqual({
      ok: true,
      products: [
        {
          productCode: '1234P1',
          title: 'Chiang Mai cooking class',
          productUrl: 'https://www.viator.com/tours/Chiang-Mai/Cooking-Class/d5267-1234P1?pid=example',
          imageUrl: 'https://images.example.test/large.jpg',
        },
      ],
    })

    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.sandbox.viator.com/partner/products/search',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Accept': 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          'Content-Type': 'application/json',
          'exp-api-key': 'sandbox-test-key',
        },
        body: JSON.stringify({
          filtering: { destination: '5267' },
          pagination: { start: 1, count: 5 },
          currency: 'THB',
        }),
      }),
    )
  })

  it('excludes products without a valid Viator affiliate URL', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      products: [{ ...sampleProduct, productUrl: 'https://example.test/not-an-affiliate-link' }],
    }), { status: 200 }))

    await expect(searchViatorSandboxProducts(
      { destinationId: '5267' },
      { apiKey: 'sandbox-test-key', fetchFn },
    )).resolves.toEqual({ ok: true, products: [] })
  })

  it('returns an opaque upstream error without exposing the upstream body', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: 'partner details must remain private',
    }), { status: 401 }))

    await expect(searchViatorSandboxProducts(
      { destinationId: '5267' },
      { apiKey: 'sandbox-test-key', fetchFn },
    )).resolves.toEqual({ ok: false, reason: 'upstream_error', status: 401 })
  })
})
