import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    groupBy: vi.fn(),
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
]

function makeRequest(secret?: string) {
  return new NextRequest('http://localhost/api/internal/product-enrichment/coverage', {
    headers: secret ? { 'x-internal-enrichment-review-secret': secret } : {},
  })
}

function makeTotalRow(city: string, total: number) {
  return { city, _count: { _all: total } }
}

function makeReviewedRow(city: string, reviewed: number) {
  return { city, _count: { _all: reviewed } }
}

describe('GET /api/internal/product-enrichment/coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    // Default: two empty results (totals, then reviewed)
    dbMock.bokunProduct.groupBy
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
  })

  // --- Auth tests ---

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('coverage_not_configured')
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
    const response = await GET(makeRequest('wrong-secret'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('unauthorized')
  })

  // --- Happy path ---

  it('returns 200 with coverage object on valid request', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.coverage).toBeDefined()
  })

  it('returns only aggregate counts — no product-level raw data', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Bangkok', 10)])
      .mockResolvedValueOnce([makeReviewedRow('Bangkok', 4)])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    // Coverage object has only aggregate fields
    expect(body.coverage).toHaveProperty('total')
    expect(body.coverage).toHaveProperty('reviewed')
    expect(body.coverage).toHaveProperty('missing')
    expect(body.coverage).toHaveProperty('pct')
    expect(body.coverage).toHaveProperty('cities')

    // No product ids, titles, prices, rawJson, etc.
    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('"id"')
    expect(serialized).not.toContain('"title"')
    expect(serialized).not.toContain('"retailPrice"')
    expect(serialized).not.toContain('"rawJson"')
  })

  // --- Forbidden field check ---

  it('does not include forbidden fields in serialized response', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Bangkok', 5)])
      .mockResolvedValueOnce([makeReviewedRow('Bangkok', 2)])

    const response = await GET(makeRequest(VALID_SECRET))
    const serialized = JSON.stringify(await response.json())

    for (const key of FORBIDDEN_FIELDS) {
      expect(serialized).not.toContain(`"${key}"`)
    }
  })

  // --- Overall count correctness ---

  it('computes total correctly from city sums', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([
        makeTotalRow('Bangkok', 10),
        makeTotalRow('Phuket', 6),
      ])
      .mockResolvedValueOnce([])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(body.coverage.total).toBe(16)
    expect(body.coverage.reviewed).toBe(0)
    expect(body.coverage.missing).toBe(16)
  })

  it('computes reviewed and missing correctly', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([
        makeTotalRow('Bangkok', 10),
        makeTotalRow('Chiang Mai', 5),
      ])
      .mockResolvedValueOnce([
        makeReviewedRow('Bangkok', 3),
        makeReviewedRow('Chiang Mai', 5),
      ])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(body.coverage.total).toBe(15)
    expect(body.coverage.reviewed).toBe(8)
    expect(body.coverage.missing).toBe(7)
  })

  it('computes overall percentage correctly', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Bangkok', 4)])
      .mockResolvedValueOnce([makeReviewedRow('Bangkok', 1)])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(body.coverage.pct).toBe(25)
  })

  it('returns pct=0 when total is 0', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    // defaults: both groupBy return []

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(body.coverage.total).toBe(0)
    expect(body.coverage.pct).toBe(0)
  })

  // --- City breakdown correctness ---

  it('returns all 7 Thailand cities in breakdown', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(body.coverage.cities).toHaveLength(7)
    const cityNames = body.coverage.cities.map((c: { city: string }) => c.city)
    expect(cityNames).toContain('Bangkok')
    expect(cityNames).toContain('Phuket')
    expect(cityNames).toContain('Chiang Mai')
  })

  it('computes city-level reviewed/missing/pct correctly', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Bangkok', 8)])
      .mockResolvedValueOnce([makeReviewedRow('Bangkok', 2)])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    const bkk = body.coverage.cities.find((c: { city: string }) => c.city === 'Bangkok')
    expect(bkk.total).toBe(8)
    expect(bkk.reviewed).toBe(2)
    expect(bkk.missing).toBe(6)
    expect(bkk.pct).toBe(25)
  })

  it('sets city total/reviewed/missing to 0 for cities not in DB results', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Bangkok', 3)])
      .mockResolvedValueOnce([])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    const krabi = body.coverage.cities.find((c: { city: string }) => c.city === 'Krabi')
    expect(krabi.total).toBe(0)
    expect(krabi.reviewed).toBe(0)
    expect(krabi.missing).toBe(0)
    expect(krabi.pct).toBe(0)
  })

  it('sets city pct to 100 when all products are reviewed', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy
      .mockReset()
      .mockResolvedValueOnce([makeTotalRow('Phuket', 5)])
      .mockResolvedValueOnce([makeReviewedRow('Phuket', 5)])

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    const phuket = body.coverage.cities.find((c: { city: string }) => c.city === 'Phuket')
    expect(phuket.pct).toBe(100)
    expect(phuket.missing).toBe(0)
  })

  // --- Error handling ---

  it('returns 500 when an unexpected DB error occurs', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.bokunProduct.groupBy.mockReset().mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest(VALID_SECRET))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.ok).toBe(false)
    expect(body.error).toBe('coverage_unavailable')
  })
})
