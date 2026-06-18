import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'host') return 'localhost:3000'
      return null
    },
  })),
}))

const fetchMock = vi.hoisted(() => vi.fn())
vi.stubGlobal('fetch', fetchMock)

import { generateCandidate } from '../actions'

const ENRICHMENT_SECRET = 'test-enrichment-secret'
const AI_PREVIEW_SECRET = 'test-ai-preview-secret'

function makeSuccessResponse(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    json: async () => ({
      ok: true,
      productId: 'product_abc',
      candidate: {
        ok: true,
        productId: 'product_abc',
        cleanedTitle: 'Ethical Elephant Sanctuary',
        shortSummary: 'A responsible half-day elephant experience.',
        suggestedTags: ['Elephants', 'Nature'],
        seoTitle: 'Best Elephant Sanctuary Chiang Mai',
        seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
        missingFacts: [],
        warnings: [],
        ...overrides,
      },
    }),
  }
}

describe('generateCandidate server action', () => {
  beforeEach(() => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', ENRICHMENT_SECRET)
    vi.stubEnv('INTERNAL_AI_PREVIEW_SECRET', AI_PREVIEW_SECRET)
    fetchMock.mockResolvedValue(makeSuccessResponse())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  // --- Auth / configuration ---

  it('returns not_configured when INTERNAL_ENRICHMENT_REVIEW_SECRET is not set', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const result = await generateCandidate('product_abc')

    expect(result).toEqual({ ok: false, error: 'not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns ai_preview_not_configured when INTERNAL_AI_PREVIEW_SECRET is not set', async () => {
    vi.stubEnv('INTERNAL_AI_PREVIEW_SECRET', '')
    const result = await generateCandidate('product_abc')

    expect(result).toEqual({ ok: false, error: 'ai_preview_not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns invalid_product_id when productId is empty', async () => {
    const result = await generateCandidate('   ')

    expect(result).toEqual({ ok: false, error: 'invalid_product_id' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // --- Preview API call ---

  it('calls the preview API with INTERNAL_AI_PREVIEW_SECRET header', async () => {
    await generateCandidate('product_abc')

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/internal/product-enrichment/preview')
    expect(options.method).toBe('POST')
    expect(options.headers['x-internal-ai-preview-secret']).toBe(AI_PREVIEW_SECRET)
  })

  it('does not expose INTERNAL_ENRICHMENT_REVIEW_SECRET in the preview API call', async () => {
    await generateCandidate('product_abc')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).not.toContain(ENRICHMENT_SECRET)
    expect(options.body).not.toContain(ENRICHMENT_SECRET)
    const headerValues = Object.values(options.headers).join(' ')
    expect(headerValues).not.toContain(ENRICHMENT_SECRET)
  })

  it('trims the productId before sending', async () => {
    await generateCandidate('  product_abc  ')

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.productId).toBe('product_abc')
  })

  // --- Missing product ---

  it('returns product_not_found when preview route returns 404', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404, json: async () => ({ ok: false, error: 'product_not_found' }) })

    const result = await generateCandidate('missing_product')

    expect(result).toEqual({ ok: false, error: 'product_not_found' })
  })

  // --- Local AI unavailable ---

  it('returns candidate_failed when local AI is not configured', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        productId: 'product_abc',
        candidate: {
          ok: false,
          productId: 'product_abc',
          error: 'local_ai_not_configured',
          warnings: [],
        },
      }),
    })

    const result = await generateCandidate('product_abc')

    expect(result).toEqual({ ok: false, error: 'local_ai_not_configured' })
  })

  it('returns preview_unavailable when fetch throws a network error', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'))

    const result = await generateCandidate('product_abc')

    expect(result).toEqual({ ok: false, error: 'preview_unavailable' })
  })

  it('returns preview_unavailable when preview API returns non-ok response without 404', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ ok: false, error: 'preview_not_configured' }),
    })

    const result = await generateCandidate('product_abc')

    expect(result).toEqual({ ok: false, error: 'preview_unavailable' })
  })

  // --- Successful candidate ---

  it('returns ok with allowed draft fields on success', async () => {
    const result = await generateCandidate('product_abc')

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.draft).toEqual({
      cleanedTitle: 'Ethical Elephant Sanctuary',
      shortSummary: 'A responsible half-day elephant experience.',
      suggestedTags: ['Elephants', 'Nature'],
      seoTitle: 'Best Elephant Sanctuary Chiang Mai',
      seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
    })
    expect(result.warnings).toEqual([])
  })

  // --- Forbidden fields not returned ---

  it('does not include forbidden fields in the returned draft', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        productId: 'product_abc',
        candidate: {
          ok: true,
          productId: 'product_abc',
          cleanedTitle: 'Clean title',
          shortSummary: 'Clean summary',
          suggestedTags: ['elephants'],
          seoTitle: 'SEO title',
          seoDescription: 'SEO description',
          missingFacts: [],
          warnings: [],
          rawJson: { forbidden: true },
          aiRawResponse: 'raw AI output',
          aiPrompt: 'the prompt',
          localAiRawOutput: 'raw output',
          price: '999 USD',
          availability: 'available',
          supplier: 'Forbidden Supplier',
          bookingUrl: 'https://forbidden.example.com',
          checkout: 'forbidden',
          payment: 'forbidden',
        },
      }),
    })

    const result = await generateCandidate('product_abc')
    const serialized = JSON.stringify(result)

    const forbidden = [
      'rawJson', 'aiRawResponse', 'aiPrompt', 'localAiRawOutput',
      'price', 'availability', 'supplier', 'bookingUrl', 'checkout', 'payment',
      'forbidden.example.com', '999 USD',
    ]
    for (const key of forbidden) {
      expect(serialized).not.toContain(key)
    }
  })

  // --- No auto-save ---

  it('does not call the reviewed write endpoint (no auto-save)', async () => {
    await generateCandidate('product_abc')

    const calls = fetchMock.mock.calls
    for (const [url] of calls) {
      expect(url).not.toContain('/api/internal/product-enrichment/reviewed')
    }
  })

  it('calls fetch exactly once (only the preview route)', async () => {
    await generateCandidate('product_abc')

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/internal/product-enrichment/preview')
  })
})
