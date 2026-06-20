import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'host') return 'localhost:3000'
      return null
    },
  })),
}))

const redirectMock = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ redirect: redirectMock }))

const fetchMock = vi.hoisted(() => vi.fn())
vi.stubGlobal('fetch', fetchMock)

import { saveEnrichment } from '../actions'

const SECRET = 'test-enrichment-secret'

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

function validFields(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    productId: 'product_abc',
    cleanedTitle: 'Ethical Elephant Sanctuary',
    shortSummary: 'A responsible half-day elephant experience.',
    suggestedTags: 'Elephants, Nature, Families',
    seoTitle: 'Best Elephant Sanctuary Chiang Mai',
    seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
    reviewedBy: 'editor@radarscout.com',
    ...overrides,
  }
}

function mockWriteSuccess() {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      ok: true,
      productId: 'product_abc',
      reviewedEnrichment: { cleanedTitle: 'Ethical Elephant Sanctuary' },
    }),
  })
}

describe('saveEnrichment server action', () => {
  beforeEach(() => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', SECRET)
    mockWriteSuccess()
    redirectMock.mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('returns not_configured when INTERNAL_ENRICHMENT_REVIEW_SECRET is not set', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result).toEqual({ ok: false, error: 'not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns invalid_product_id when productId is empty', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ productId: '' })))

    expect(result).toEqual({ ok: false, error: 'invalid_product_id' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns invalid_product_id when productId is whitespace only', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ productId: '   ' })))

    expect(result).toEqual({ ok: false, error: 'invalid_product_id' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('calls the write endpoint with the correct URL and method', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/internal/product-enrichment/reviewed')
    expect(options.method).toBe('POST')
  })

  it('passes INTERNAL_ENRICHMENT_REVIEW_SECRET in the request header', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers['x-internal-enrichment-review-secret']).toBe(SECRET)
  })

  it('does not include reviewedAt in the request body (server sets it)', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body).not.toHaveProperty('reviewedAt')
  })

  it('parses comma-separated suggestedTags into an array', async () => {
    await saveEnrichment(null, makeFormData(validFields({ suggestedTags: 'Elephants, Nature , Families' })))

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.suggestedTags).toEqual(['Elephants', 'Nature', 'Families'])
  })

  it('sends empty suggestedTags array when field is blank', async () => {
    await saveEnrichment(null, makeFormData(validFields({ suggestedTags: '' })))

    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.suggestedTags).toEqual([])
  })

  it('returns ok:true with redirectTo pointing to list with savedFrom on success', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result).not.toBeNull()
    expect(result!.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('productId=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
    }
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('returns the error from the write endpoint on validation failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: 'invalid_reviewer' }),
    })

    const result = await saveEnrichment(null, makeFormData(validFields({ reviewedBy: '' })))

    expect(result).toEqual({ ok: false, error: 'invalid_reviewer' })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('returns fields list when write endpoint returns forbidden_fields', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: 'forbidden_fields', fields: ['rawJson', 'price'] }),
    })

    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result).toEqual({ ok: false, error: 'forbidden_fields', fields: ['rawJson', 'price'] })
  })

  it('returns save_unavailable when fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'))

    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result).toEqual({ ok: false, error: 'save_unavailable' })
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('does not call local AI (fetch called exactly once, to write endpoint only)', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain('/api/internal/product-enrichment/reviewed')
    expect(url).not.toContain('ollama')
    expect(url).not.toContain('localai')
    expect(url).not.toContain('openwebui')
  })

  it('does not expose INTERNAL_ENRICHMENT_REVIEW_SECRET in request body or URL', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).not.toContain(SECRET)
    expect(options.body).not.toContain(SECRET)
  })

  it('does not include forbidden fields in the request body', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    const [, options] = fetchMock.mock.calls[0]
    const bodyStr = options.body
    const forbidden = ['rawJson', 'price', 'availability', 'supplier', 'bookingUrl', 'checkout', 'payment', 'candidate', 'aiRawResponse']
    for (const key of forbidden) {
      expect(bodyStr).not.toContain(`"${key}"`)
    }
  })

  describe('suggestedTags server-side enforcement', () => {
    it('returns too_many_tags when 9 unique tags are submitted', async () => {
      const nineTags = 'Tag1, Tag2, Tag3, Tag4, Tag5, Tag6, Tag7, Tag8, Tag9'
      const result = await saveEnrichment(null, makeFormData(validFields({ suggestedTags: nineTags })))

      expect(result).toEqual({ ok: false, error: 'too_many_tags', fields: ['suggestedTags'] })
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('does not call the write endpoint when tag count exceeds 8', async () => {
      const tenTags = 'A, B, C, D, E, F, G, H, I, J'
      await saveEnrichment(null, makeFormData(validFields({ suggestedTags: tenTags })))

      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('allows exactly 8 tags and forwards them to the write endpoint', async () => {
      const eightTags = 'Tag1, Tag2, Tag3, Tag4, Tag5, Tag6, Tag7, Tag8'
      await saveEnrichment(null, makeFormData(validFields({ suggestedTags: eightTags })))

      expect(fetchMock).toHaveBeenCalledOnce()
      const [, options] = fetchMock.mock.calls[0]
      const body = JSON.parse(options.body)
      expect(body.suggestedTags).toHaveLength(8)
      expect(body.suggestedTags).toEqual(['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6', 'Tag7', 'Tag8'])
    })

    it('deduplicates case-insensitive tags before counting', async () => {
      // "Elephants" and "elephants" are duplicates — should collapse to 1, well under limit
      const tagsWithDupes = 'Elephants, elephants, ELEPHANTS, Nature'
      await saveEnrichment(null, makeFormData(validFields({ suggestedTags: tagsWithDupes })))

      expect(fetchMock).toHaveBeenCalledOnce()
      const [, options] = fetchMock.mock.calls[0]
      const body = JSON.parse(options.body)
      expect(body.suggestedTags).toEqual(['Elephants', 'Nature'])
    })

    it('filters blank tags before counting, so 8 non-blank + blanks does not trigger too_many_tags', async () => {
      const tagsWithBlanks = 'Tag1, , Tag2, , Tag3, Tag4, Tag5, Tag6, Tag7, Tag8, , '
      await saveEnrichment(null, makeFormData(validFields({ suggestedTags: tagsWithBlanks })))

      expect(fetchMock).toHaveBeenCalledOnce()
      const [, options] = fetchMock.mock.calls[0]
      const body = JSON.parse(options.body)
      expect(body.suggestedTags).toHaveLength(8)
    })
  })
})
