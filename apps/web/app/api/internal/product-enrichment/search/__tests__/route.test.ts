import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

import { GET } from '../route'

const VALID_SECRET = 'test-enrichment-secret'

const FORBIDDEN_FIELDS = [
  'rawJson',
  'supplierName',
  'bookingUrl',
  'bookingStatus',
  'availability',
  'checkout',
  'payment',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
]

function makeRequest(params: Record<string, string> = {}, secret?: string) {
  const url = new URL('http://localhost/api/internal/product-enrichment/search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url.toString(), {
    headers: secret ? { 'x-internal-enrichment-review-secret': secret } : {},
  })
}

function makeProductRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'product_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    retailPrice: { toString: () => '49.00' },
    currency: 'USD',
    enrichment: null,
    ...overrides,
  }
}

function makeEnrichment() {
  return {
    cleanedTitle: 'Ethical Elephant Sanctuary',
    reviewedAt: new Date('2026-06-15T12:00:00.000Z'),
  }
}

describe('GET /api/internal/product-enrichment/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    dbMock.bokunProduct.findMany.mockResolvedValue([])
  })

  // --- Auth tests ---

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('search_not_configured')
  })

  it('returns 401 when secret header is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  it('returns 401 when secret header is wrong', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest({}, 'wrong-secret'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  // --- Default / happy path ---

  it('returns 200 with products array on valid request', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow()])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(Array.isArray(body.products)).toBe(true)
  })

  it('returns empty array when no products match', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.products).toHaveLength(0)
  })

  // --- Allowed fields only ---

  it('returns only allowed product fields', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow()])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()
    const row = body.products[0]

    expect(row).toHaveProperty('id')
    expect(row).toHaveProperty('title')
    expect(row).toHaveProperty('city')
    expect(row).toHaveProperty('location')
    expect(row).toHaveProperty('retailPrice')
    expect(row).toHaveProperty('currency')
    expect(row).toHaveProperty('reviewedStatus')
    expect(row).toHaveProperty('cleanedTitle')
    expect(row).toHaveProperty('reviewedAt')
  })

  it('does not include forbidden fields in response', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow()])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const serialized = JSON.stringify(await response.json())

    for (const key of FORBIDDEN_FIELDS) {
      expect(serialized).not.toContain(`"${key}"`)
    }
  })

  it('does not include rawJson in product fields', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow()])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()
    const serialized = JSON.stringify(body)

    expect(serialized).not.toContain('"rawJson"')
  })

  // --- Reviewed status ---

  it('returns reviewedStatus=missing when enrichment is null', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow({ enrichment: null })])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(body.products[0].reviewedStatus).toBe('missing')
    expect(body.products[0].cleanedTitle).toBeNull()
    expect(body.products[0].reviewedAt).toBeNull()
  })

  it('returns reviewedStatus=reviewed and enrichment fields when enrichment exists', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([
      makeProductRow({ enrichment: makeEnrichment() }),
    ])

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(body.products[0].reviewedStatus).toBe('reviewed')
    expect(body.products[0].cleanedTitle).toBe('Ethical Elephant Sanctuary')
    expect(body.products[0].reviewedAt).toBe('2026-06-15T12:00:00.000Z')
  })

  // --- Keyword filter ---

  it('passes keyword q to DB query title filter when provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ q: 'elephant' }, VALID_SECRET))

    const calls = dbMock.bokunProduct.findMany.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const firstCallWhere = calls[0][0].where
    expect(firstCallWhere.title).toEqual({ contains: 'elephant', mode: 'insensitive' })
  })

  it('does not include title filter when q is empty', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({}, VALID_SECRET))

    const firstCallWhere = dbMock.bokunProduct.findMany.mock.calls[0][0].where
    expect(firstCallWhere).not.toHaveProperty('title')
  })

  // --- City filter ---

  it('passes valid city to DB query when city param is provided', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ city: 'Chiang Mai' }, VALID_SECRET))

    const firstCallWhere = dbMock.bokunProduct.findMany.mock.calls[0][0].where
    expect(firstCallWhere.city).toEqual({ in: ['Chiang Mai'] })
  })

  it('falls back to all Thailand cities when city param is not a valid Thailand city', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ city: 'London' }, VALID_SECRET))

    const firstCallWhere = dbMock.bokunProduct.findMany.mock.calls[0][0].where
    expect(firstCallWhere.city.in).toHaveLength(7)
  })

  // --- Status filter ---

  it('returns 400 for invalid status value', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)

    const response = await GET(makeRequest({ status: 'unknown' }, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('invalid_status')
  })

  it('filters by missing enrichment when status=missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([makeProductRow({ enrichment: null })])

    await GET(makeRequest({ status: 'missing' }, VALID_SECRET))

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledOnce()
    const callWhere = dbMock.bokunProduct.findMany.mock.calls[0][0].where
    expect(callWhere.enrichment).toEqual({ is: null })
  })

  it('filters by existing enrichment when status=reviewed', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([
      makeProductRow({ enrichment: makeEnrichment() }),
    ])

    await GET(makeRequest({ status: 'reviewed' }, VALID_SECRET))

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledOnce()
    const callWhere = dbMock.bokunProduct.findMany.mock.calls[0][0].where
    expect(callWhere.enrichment).toEqual({ isNot: null })
  })

  it('makes two DB calls for status=all to get missing-first ordering', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ status: 'all' }, VALID_SECRET))

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(2)
    const [firstWhere, secondWhere] = dbMock.bokunProduct.findMany.mock.calls.map(
      c => c[0].where,
    )
    expect(firstWhere.enrichment).toEqual({ is: null })
    expect(secondWhere.enrichment).toEqual({ isNot: null })
  })

  it('puts missing products before reviewed products in status=all response', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const missingProduct = makeProductRow({ id: 'missing_1', title: 'Zebra Tour', enrichment: null })
    const reviewedProduct = makeProductRow({
      id: 'reviewed_1',
      title: 'Ant Farm Tour',
      enrichment: makeEnrichment(),
    })
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([missingProduct])
      .mockResolvedValueOnce([reviewedProduct])

    const response = await GET(makeRequest({ status: 'all' }, VALID_SECRET))
    const body = await response.json()

    expect(body.products[0].id).toBe('missing_1')
    expect(body.products[0].reviewedStatus).toBe('missing')
    expect(body.products[1].id).toBe('reviewed_1')
    expect(body.products[1].reviewedStatus).toBe('reviewed')
  })

  // --- Error handling ---

  it('returns 500 when an unexpected error occurs', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.findMany.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest({}, VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('search_unavailable')
  })
})
