import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findFirst: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

import { GET } from '../route'

const VALID_SECRET = 'test-enrichment-secret'

const FORBIDDEN_FIELDS = [
  'rawJson',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
  'bookingUrl',
  'checkout',
  'payment',
  'availability',
  'supplier',
]

function makeRequest(params: Record<string, string> = {}, secret?: string) {
  const url = new URL('http://localhost/api/internal/product-enrichment/navigation')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString(), {
    headers: secret ? { 'x-internal-enrichment-review-secret': secret } : {},
  })
}

const CURRENT_PRODUCT = { id: 'product_current', title: 'Elephant Sanctuary Tour' }
const PREV_PRODUCT = { id: 'product_prev', title: 'Ayutthaya Temple Tour' }
const NEXT_PRODUCT = { id: 'product_next', title: 'Tiger Kingdom Tour' }

describe('GET /api/internal/product-enrichment/navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    // Default: current product found, no prev/next
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(null)  // prev
      .mockResolvedValueOnce(null)  // next
  })

  // --- Auth tests ---

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('navigation_not_configured')
  })

  it('returns 401 when secret header is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({ productId: 'product_current' }))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  it('returns 401 when secret header is wrong', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({ productId: 'product_current' }, 'wrong-secret'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  // --- Missing productId ---

  it('returns 400 when productId is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('productId_required')
  })

  it('returns 400 when productId is whitespace only', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({ productId: '   ' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('productId_required')
  })

  // --- Product not found ---

  it('returns 404 when product is not found', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockReset()
    dbMock.bokunProduct.findFirst.mockResolvedValueOnce(null)

    const response = await GET(makeRequest({ productId: 'unknown_product' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('product_not_found')
  })

  // --- Happy path ---

  it('returns 200 with null prev/next when no neighbors exist', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.previousMissingProductId).toBeNull()
    expect(body.nextMissingProductId).toBeNull()
  })

  it('returns previousMissingProductId when a previous missing product exists', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockReset()
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(PREV_PRODUCT)
      .mockResolvedValueOnce(null)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(body.previousMissingProductId).toBe('product_prev')
    expect(body.nextMissingProductId).toBeNull()
  })

  it('returns nextMissingProductId when a next missing product exists', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockReset()
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(NEXT_PRODUCT)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(body.previousMissingProductId).toBeNull()
    expect(body.nextMissingProductId).toBe('product_next')
  })

  it('returns both prev and next when both exist', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockReset()
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(PREV_PRODUCT)
      .mockResolvedValueOnce(NEXT_PRODUCT)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(body.previousMissingProductId).toBe('product_prev')
    expect(body.nextMissingProductId).toBe('product_next')
  })

  // --- Only missing products considered ---

  it('queries only missing products (enrichment is null) for prev/next', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))

    // First call is to find current product (no enrichment filter)
    // 2nd and 3rd calls are for prev/next (must include enrichment: { is: null })
    const calls = dbMock.bokunProduct.findFirst.mock.calls
    expect(calls.length).toBeGreaterThanOrEqual(3)

    const prevCallWhere = calls[1][0].where
    const nextCallWhere = calls[2][0].where
    expect(prevCallWhere.enrichment).toEqual({ is: null })
    expect(nextCallWhere.enrichment).toEqual({ is: null })
  })

  it('prev/next queries do not include enrichment filter on current product lookup', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))

    const currentLookupWhere = dbMock.bokunProduct.findFirst.mock.calls[0][0].where
    expect(currentLookupWhere).not.toHaveProperty('enrichment')
  })

  // --- City filter ---

  it('applies city filter to prev/next queries when city param matches a Thailand city', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current', city: 'Phuket' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    const prevCallWhere = calls[1][0].where
    expect(prevCallWhere.city).toEqual({ in: ['Phuket'] })
  })

  it('falls back to all Thailand cities when city is not a valid Thailand city', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current', city: 'London' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    const prevCallWhere = calls[1][0].where
    expect(prevCallWhere.city.in).toHaveLength(7)
  })

  // --- Keyword filter ---

  it('applies q filter to prev/next queries when q is provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current', q: 'elephant' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    const prevCallWhere = calls[1][0].where
    expect(prevCallWhere.title).toEqual({ contains: 'elephant', mode: 'insensitive' })
  })

  it('does not include title filter when q is empty', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    const prevCallWhere = calls[1][0].where
    expect(prevCallWhere).not.toHaveProperty('title')
  })

  // --- backHref ---

  it('returns backHref as base URL when no search params provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(body.backHref).toBe('/internal/reviewed-enrichment')
  })

  it('includes q in backHref when q is provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current', q: 'elephant' }, VALID_SECRET))
    const body = await response.json()

    expect(body.backHref).toContain('q=elephant')
  })

  it('includes city in backHref when city is provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current', city: 'Phuket' }, VALID_SECRET))
    const body = await response.json()

    expect(body.backHref).toContain('city=Phuket')
  })

  it('includes status in backHref when status is provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current', status: 'missing' }, VALID_SECRET))
    const body = await response.json()

    expect(body.backHref).toContain('status=missing')
  })

  it('preserves all search context in backHref', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(
      makeRequest({ productId: 'product_current', q: 'elephant', city: 'Phuket', status: 'missing' }, VALID_SECRET),
    )
    const body = await response.json()

    expect(body.backHref).toContain('q=elephant')
    expect(body.backHref).toContain('city=Phuket')
    expect(body.backHref).toContain('status=missing')
  })

  // --- Forbidden fields ---

  it('does not include forbidden fields in response', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const serialized = JSON.stringify(await response.json())

    for (const field of FORBIDDEN_FIELDS) {
      expect(serialized).not.toContain(`"${field}"`)
    }
  })

  it('response contains only allowed fields', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(body).toHaveProperty('ok')
    expect(body).toHaveProperty('previousMissingProductId')
    expect(body).toHaveProperty('nextMissingProductId')
    expect(body).toHaveProperty('backHref')
    expect(Object.keys(body)).toHaveLength(4)
  })

  // --- Error handling ---

  it('returns 500 when an unexpected error occurs', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findFirst.mockReset()
    dbMock.bokunProduct.findFirst.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('navigation_unavailable')
  })
})
