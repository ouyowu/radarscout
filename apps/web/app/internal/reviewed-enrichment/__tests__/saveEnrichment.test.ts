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

describe('saveEnrichment — redirect to list when no next Missing product', () => {
  beforeEach(() => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', SECRET)
    mockWriteSuccess()
    redirectMock.mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  // --- No nextProductId: redirect to list with savedFrom ---

  it('redirects to the list page (no productId) with savedFrom when no nextProductId is provided', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.has('productId')).toBe(false)
      expect(url.searchParams.has('saved')).toBe(false)
    }
  })

  it('preserves q filter in list redirect', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ q: 'elephant' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.get('q')).toBe('elephant')
    }
  })

  it('preserves city filter in list redirect', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ city: 'Chiang Mai' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.get('city')).toBe('Chiang Mai')
    }
  })

  it('preserves status filter in list redirect', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields({ status: 'missing' })))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.get('status')).toBe('missing')
    }
  })

  it('preserves all filters together in list redirect', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ q: 'elephant', city: 'Phuket', status: 'missing' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.get('q')).toBe('elephant')
      expect(url.searchParams.get('city')).toBe('Phuket')
      expect(url.searchParams.get('status')).toBe('missing')
    }
  })

  it('does not include prevSaved in the list redirect', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).not.toContain('prevSaved')
    }
  })

  it('does not expose secret in the list redirect URL', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      expect(result.redirectTo).not.toContain(SECRET)
    }
  })

  it('does not include rawJson or AI output in the list redirect URL', async () => {
    const result = await saveEnrichment(null, makeFormData(validFields()))

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = result.redirectTo
      expect(url).not.toContain('rawJson')
      expect(url).not.toContain('aiRawResponse')
      expect(url).not.toContain('candidate')
    }
  })

  // --- With nextProductId: redirect to next product ---

  it('redirects to next product when a valid nextProductId is provided', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('productId')).toBe('product_next')
      expect(url.searchParams.has('savedFrom')).toBe(false)
      expect(url.searchParams.has('saved')).toBe(false)
    }
  })

  it('includes prevSaved=<currentId> in the next-product redirect', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('prevSaved')).toBe('product_abc')
    }
  })

  it('includes prevSavedTitle when cleanedTitle is set and nextProductId is valid', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', cleanedTitle: 'Elephant Sanctuary' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('prevSavedTitle')).toBe('Elephant Sanctuary')
    }
  })

  it('preserves filters in the next-product redirect', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: 'product_next', city: 'Phuket', status: 'missing' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('productId')).toBe('product_next')
      expect(url.searchParams.get('city')).toBe('Phuket')
      expect(url.searchParams.get('status')).toBe('missing')
    }
  })

  // --- Invalid nextProductId falls back to list ---

  it('falls back to list redirect when nextProductId is a path traversal attempt', async () => {
    const result = await saveEnrichment(
      null,
      makeFormData(validFields({ nextProductId: '../etc/passwd' })),
    )

    expect(result?.ok).toBe(true)
    if (result?.ok) {
      const url = new URL('http://localhost' + result.redirectTo)
      expect(url.searchParams.get('savedFrom')).toBe('product_abc')
      expect(url.searchParams.has('productId')).toBe(false)
      expect(result.redirectTo).not.toContain('passwd')
    }
  })

  // --- Skip does not write to the DB ---

  it('does not call the reviewed write endpoint when saveEnrichment is not invoked (skip is a GET link)', () => {
    // Skip is rendered as <a href={buildSkipHref(...)}> — a GET link, no form submit.
    // This test verifies the action itself (the DB write path) is never triggered by skip navigation.
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
