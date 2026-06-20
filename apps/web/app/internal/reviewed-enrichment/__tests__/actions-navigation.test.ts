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

  it('returns redirectTo pointing to the list with savedFrom when no nextProductId is provided', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('productId=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
    }
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('preserves q in redirectTo when q is in formData', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ q: 'elephant' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).toContain('q=elephant')
  })

  it('preserves city in redirectTo when city is in formData', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ city: 'Phuket' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).toContain('city=Phuket')
  })

  it('preserves status in redirectTo when status is in formData', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ status: 'missing' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).toContain('status=missing')
  })

  it('preserves all search context fields in redirectTo when provided', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ q: 'elephant', city: 'Phuket', status: 'missing' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('q=elephant')
      expect(result.redirectTo).toContain('city=Phuket')
      expect(result.redirectTo).toContain('status=missing')
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  // --- Redirect with nextProductId ---

  it('redirects to nextProductId when valid nextProductId is provided', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('productId=product_next')
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  it('does not include saved=1 when redirecting to nextProductId', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).not.toContain('saved=1')
  })

  it('preserves search context when redirecting to nextProductId', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', city: 'Phuket', status: 'missing' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('productId=product_next')
      expect(result.redirectTo).toContain('city=Phuket')
      expect(result.redirectTo).toContain('status=missing')
    }
  })

  // --- nextProductId safety validation ---

  it('falls back to list redirect when nextProductId contains a slash', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: '../etc/passwd' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('productId=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
      expect(result.redirectTo).not.toContain('passwd')
    }
  })

  it('falls back to list redirect when nextProductId contains a space', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product bad id' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('productId=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  it('falls back to list redirect when nextProductId is empty string', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: '' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('productId=product_abc')
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  it('accepts valid UUID-style nextProductId', async () => {
    const uuid = 'abc123-def456-789ghi'
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: uuid })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain(`productId=${uuid}`)
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  it('accepts nextProductId with underscores and hyphens', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next-001' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).toContain('productId=product_next-001')
  })

  // --- Does not expose secret in redirectTo ---

  it('does not include INTERNAL_ENRICHMENT_REVIEW_SECRET in redirectTo', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ nextProductId: 'product_next' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).not.toContain(SECRET)
  })

  // --- prevSaved — notice for next-product redirects ---

  it('includes prevSaved=<currentProductId> in redirectTo when nextProductId is valid', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) expect(result.redirectTo).toContain('prevSaved=product_abc')
  })

  it('includes prevSavedTitle in redirectTo when cleanedTitle is set and nextProductId is valid', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', cleanedTitle: 'Elephant Sanctuary Chiang Mai' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('prevSaved=product_abc')
      const params = new URL('http://localhost' + result.redirectTo).searchParams
      expect(params.get('prevSavedTitle')).toBe('Elephant Sanctuary Chiang Mai')
    }
  })

  it('does not include prevSaved in the list redirect when there is no nextProductId', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('savedFrom=product_abc')
      expect(result.redirectTo).not.toContain('prevSaved')
      expect(result.redirectTo).not.toContain('saved=1')
    }
  })

  it('does not include prevSavedTitle when cleanedTitle is blank and nextProductId is valid', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', cleanedTitle: '' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).toContain('prevSaved=product_abc')
      expect(result.redirectTo).not.toContain('prevSavedTitle')
    }
  })
})
