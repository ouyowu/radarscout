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
    suggestedTags: 'Elephants, Nature',
    seoTitle: 'Best Elephant Sanctuary Chiang Mai',
    seoDescription: 'Visit rescued elephants ethically in Chiang Mai.',
    reviewedBy: 'editor@radarscout.com',
    ...overrides,
  }
}

function mockWriteSuccess() {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  })
}

describe('saveEnrichment — navigation and search context redirect', () => {
  beforeEach(() => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', SECRET)
    mockWriteSuccess()
    redirectMock.mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  // --- Default redirect (no nextProductId) ---

  it('redirects to current product with saved=1 when no nextProductId is provided', async () => {
    await saveEnrichment(null, makeFormData(validFields()))

    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining('productId=product_abc'),
    )
    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining('saved=1'),
    )
  })

  it('preserves q in redirect when q is in formData', async () => {
    await saveEnrichment(null, makeFormData(validFields({ q: 'elephant' })))

    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining('q=elephant'),
    )
  })

  it('preserves city in redirect when city is in formData', async () => {
    await saveEnrichment(null, makeFormData(validFields({ city: 'Phuket' })))

    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining('city=Phuket'),
    )
  })

  it('preserves status in redirect when status is in formData', async () => {
    await saveEnrichment(null, makeFormData(validFields({ status: 'missing' })))

    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining('status=missing'),
    )
  })

  it('preserves all search context fields in redirect when provided', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ q: 'elephant', city: 'Phuket', status: 'missing' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('q=elephant')
    expect(redirectUrl).toContain('city=Phuket')
    expect(redirectUrl).toContain('status=missing')
    expect(redirectUrl).toContain('saved=1')
  })

  // --- Redirect with nextProductId ---

  it('redirects to nextProductId when valid nextProductId is provided', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_next')
    expect(redirectUrl).not.toContain('saved=1')
  })

  it('does not include saved=1 when redirecting to nextProductId', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).not.toContain('saved=1')
  })

  it('preserves search context when redirecting to nextProductId', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', city: 'Phuket', status: 'missing' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_next')
    expect(redirectUrl).toContain('city=Phuket')
    expect(redirectUrl).toContain('status=missing')
  })

  // --- nextProductId safety validation ---

  it('falls back to current product when nextProductId contains a slash', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: '../etc/passwd' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_abc')
    expect(redirectUrl).toContain('saved=1')
    expect(redirectUrl).not.toContain('passwd')
  })

  it('falls back to current product when nextProductId contains a space', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product bad id' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_abc')
    expect(redirectUrl).toContain('saved=1')
  })

  it('falls back to current product when nextProductId is empty string', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: '' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_abc')
    expect(redirectUrl).toContain('saved=1')
  })

  it('accepts valid UUID-style nextProductId', async () => {
    const uuid = 'abc123-def456-789ghi'
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: uuid })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain(`productId=${uuid}`)
    expect(redirectUrl).not.toContain('saved=1')
  })

  it('accepts nextProductId with underscores and hyphens', async () => {
    await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next-001' })),
    )

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).toContain('productId=product_next-001')
  })

  // --- Does not expose secret in redirect URL ---

  it('does not include INTERNAL_ENRICHMENT_REVIEW_SECRET in redirect URL', async () => {
    await saveEnrichment(null, makeFormData(validFields({ nextProductId: 'product_next' })))

    const redirectUrl: string = redirectMock.mock.calls[0][0]
    expect(redirectUrl).not.toContain(SECRET)
  })
})
