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

const featureFlagsMock = vi.hoisted(() => ({
  isIssueFlagsEnabled: vi.fn(),
}))

vi.mock('@/lib/featureFlags', () => featureFlagsMock)

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

// ---- DISABLED MODE (default) ----

describe('GET /api/internal/product-enrichment/navigation — disabled mode (default)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(false)
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
  })

  it('does not include issueFlag filter in prev/next queries', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    expect(calls.length).toBeGreaterThanOrEqual(3)

    const prevCallWhere = calls[1][0].where
    const nextCallWhere = calls[2][0].where
    expect(prevCallWhere).not.toHaveProperty('issueFlag')
    expect(nextCallWhere).not.toHaveProperty('issueFlag')
  })

  it('still filters by enrichment: { is: null } for prev/next without issueFlag', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findFirst.mock.calls
    const prevCallWhere = calls[1][0].where
    expect(prevCallWhere.enrichment).toEqual({ is: null })
    expect(prevCallWhere).not.toHaveProperty('issueFlag')
  })

  it('returns 200 with navigation results normally when disabled', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body).toHaveProperty('previousMissingProductId')
    expect(body).toHaveProperty('nextMissingProductId')
  })
})

// ---- ENABLED MODE (PRODUCT_ISSUE_FLAGS_ENABLED=true) ----

describe('GET /api/internal/product-enrichment/navigation — enabled mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(true)
    dbMock.bokunProduct.findFirst
      .mockResolvedValueOnce(CURRENT_PRODUCT)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
  })

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

  it('queries only missing products with issueFlag: { is: null } filter for prev/next', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const calls = dbMock.bokunProduct.findFirst.mock.calls
    expect(calls.length).toBeGreaterThanOrEqual(3)
    const prevCallWhere = calls[1][0].where
    const nextCallWhere = calls[2][0].where
    expect(prevCallWhere.enrichment).toEqual({ is: null })
    expect(prevCallWhere.issueFlag).toEqual({ is: null })
    expect(nextCallWhere.enrichment).toEqual({ is: null })
    expect(nextCallWhere.issueFlag).toEqual({ is: null })
  })

  it('prev/next queries do not include enrichment filter on current product lookup', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await GET(makeRequest({ productId: 'product_current' }, VALID_SECRET))
    const currentLookupWhere = dbMock.bokunProduct.findFirst.mock.calls[0][0].where
    expect(currentLookupWhere).not.toHaveProperty('enrichment')
  })

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
