import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({ db: dbMock }))

const enrichmentMock = vi.hoisted(() => ({
  getReviewedEnrichmentByProductId: vi.fn(),
}))

vi.mock('@/lib/reviewedEnrichmentReader', () => enrichmentMock)

import { listAiEligibleThailandProducts } from '../listAiEligibleThailandProducts'

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_1',
    title: 'Bangkok Temple Tour',
    city: 'Bangkok',
    location: null,
    retailPrice: null,
    currency: null,
    ...overrides,
  }
}

describe('listAiEligibleThailandProducts — retrieval', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)
  })

  // Test 1: Eligible Bangkok product is returned
  it('returns eligible Bangkok product', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'bkk_1', title: 'Bangkok Float Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('bkk_1')
    expect(result[0].city).toBe('Bangkok')
  })

  // Test 2: Eligible Chiang Rai product is returned
  it('returns eligible Chiang Rai product (outside original seven-city list)', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'cr_1', title: 'Chiang Rai Temple Tour', city: 'Chiang Rai' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cr_1')
    expect(result[0].city).toBe('Chiang Rai')
  })

  // Test 3: Eligible city=null + title containing Thailand
  it('returns eligible product with city=null and Thailand in title', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'th_1', title: 'Thailand Private Tour', city: null, location: null })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('th_1')
  })

  // Test 4: Eligible city=null + location containing Phuket, Thailand
  it('returns eligible product with city=null and location "Phuket , Thailand"', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'loc_1', title: 'Beach Tour', city: null, location: 'Phuket , Thailand' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('loc_1')
  })

  // Test 5: Singapore product is excluded
  it('excludes Singapore product', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Singapore City Tour', city: 'Singapore' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 6: Phuket city + Singapore title is excluded
  it('excludes destination-mismatched product (city=Phuket, title=Singapore tour)', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Singapore Day Tour', city: 'Phuket' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 7: Thailand + Singapore mixed product is excluded
  it('excludes mixed Thailand + Singapore product', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Bangkok to Singapore Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 8: Thai-only title with no geography is excluded
  it('excludes Thai-only title with no geographic signal', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Thai Massage', city: null, location: null })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 9: Reviewed enrichment does not override ineligibility
  it('enrichment data does not override product ineligibility', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Vietnam Mekong Tour', city: 'Bangkok' })])
      .mockResolvedValue([])
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue({
      cleanedTitle: 'Bangkok Canal Tour',
      shortSummary: 'A Bangkok experience.',
      suggestedTags: ['Bangkok'],
      seoTitle: null,
      seoDescription: null,
      reviewedBy: null,
      reviewedAt: null,
    })

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 10: Enrichment lookup is not called for ineligible products
  it('does not call getReviewedEnrichmentByProductId for ineligible products', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Japan Cherry Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    await listAiEligibleThailandProducts()

    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  // Test 11: Stable ordering with city/title/id tie-breaker
  it('passes deterministic orderBy (city asc, title asc, id asc) to DB query', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await listAiEligibleThailandProducts()

    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.orderBy).toEqual([
      { city: 'asc' },
      { title: 'asc' },
      { id: 'asc' },
    ])
  })

  // Test 12: Bounded scan cannot exceed configured cap
  it('collects no more than AI_SCAN_LIMIT products even with large take', async () => {
    // Return 1 eligible product per batch; large take capped at 500
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow()])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts({ take: 9999 })

    // Only 1 product in DB mock, but take was capped — result is 1
    expect(result.length).toBeLessThanOrEqual(500)
    expect(result).toHaveLength(1)
  })

  // Test 13: No duplicate IDs
  it('produces no duplicate IDs across batches', async () => {
    const batch1 = Array.from({ length: 50 }, (_, i) =>
      makeRow({ id: `prod_${i}`, title: `Bangkok Tour ${i}`, city: 'Bangkok' }),
    )
    const batch2 = [makeRow({ id: 'prod_50', title: 'Phuket Tour', city: 'Phuket' })]

    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const ids = result.map(r => r.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  // Test 14: No rawJson or eligibility internals in returned AI candidate shape
  it('returned candidate shape has no rawJson, eligibility reasons, or internal fields', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow()])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    const item = result[0]

    expect(item).not.toHaveProperty('rawJson')
    expect(item).not.toHaveProperty('eligible')
    expect(item).not.toHaveProperty('reasons')
    expect(item).not.toHaveProperty('foreignSignals')
    expect(item).not.toHaveProperty('thailandSignals')
    expect(item).not.toHaveProperty('hasDestinationMismatch')
    expect(item).not.toHaveProperty('supplierId')
    expect(item).not.toHaveProperty('supplier')
    expect(item).not.toHaveProperty('lastSyncedAt')
    expect(item).not.toHaveProperty('active')

    expect(Object.keys(item).sort()).toEqual([
      'city',
      'cleanedTitle',
      'currency',
      'detailHref',
      'id',
      'location',
      'retailPrice',
      'suggestedTags',
      'summary',
      'title',
    ])
  })
})

describe('listAiEligibleThailandProducts — multi-batch and enrichment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)
  })

  it('spans multiple batches — second batch called with incremented skip after full first batch', async () => {
    const firstBatch = Array.from({ length: 50 }, (_, i) =>
      makeRow({ id: `foreign_${i}`, title: 'Vietnam Delta Tour', city: 'Bangkok', location: null }),
    )
    const secondBatch = [makeRow({ id: 'eligible_1', title: 'Koh Samui Snorkeling', city: 'Koh Samui' })]

    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch)
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('eligible_1')
    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(2)
    const secondCall = dbMock.bokunProduct.findMany.mock.calls[1][0]
    expect(secondCall.skip).toBe(50)
  })

  it('attaches reviewed enrichment for eligible products', async () => {
    const enrichment = {
      cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
      shortSummary: 'A half-day ethical elephant experience.',
      suggestedTags: ['Elephants', 'Nature'],
      seoTitle: null,
      seoDescription: null,
      reviewedBy: null,
      reviewedAt: null,
    }
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Chiang Mai Elephant Sanctuary', city: 'Chiang Mai' })])
      .mockResolvedValue([])
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(enrichment)

    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].cleanedTitle).toBe('Ethical Elephant Sanctuary Chiang Mai')
    expect(result[0].summary).toBe('A half-day ethical elephant experience.')
    expect(result[0].suggestedTags).toEqual(['Elephants', 'Nature'])
  })

  it('detailHref is computed as /tours/<encoded-id>', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'prod-uuid-123', title: 'Bangkok Temple Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    expect(result[0].detailHref).toBe('/tours/prod-uuid-123')
  })

  it('DB query does not filter by city whitelist — relies on eligibility helper only', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await listAiEligibleThailandProducts()

    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.where).not.toHaveProperty('city')
    expect(call.where).toMatchObject({ active: true })
  })

  it('returns empty array on DB error', async () => {
    dbMock.bokunProduct.findMany.mockRejectedValue(new Error('DB failure'))

    const result = await listAiEligibleThailandProducts()

    expect(result).toEqual([])
  })
})

describe('listAiEligibleThailandProducts — fallback scenarios (tests 22–25)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)
  })

  // Test 22: Popular-products fallback remains Thailand-only
  it('popular-products fallback (no search constraint) still applies eligibility', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'th_1', title: 'Bangkok Float Tour', city: 'Bangkok' }),
        makeRow({ id: 'foreign_1', title: 'Singapore City Tour', city: 'Singapore' }),
        makeRow({ id: 'th_2', title: 'Phuket Snorkeling', city: 'Phuket' }),
      ])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('th_1')
    expect(ids).toContain('th_2')
    expect(ids).not.toContain('foreign_1')
  })

  // Test 23: Empty-search fallback remains Thailand-only
  it('empty-search fallback (no search/city constraint) remains Thailand-only', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'p1', title: 'Chiang Mai Temple', city: 'Chiang Mai' }),
        makeRow({ id: 'p2', title: 'Vietnam Mekong Tour', city: 'Bangkok' }),
      ])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts({})

    const ids = result.map(r => r.id)
    expect(ids).toContain('p1')
    expect(ids).not.toContain('p2')
  })

  // Test 24: Reviewed-only fallback remains Thailand-only
  it('reviewed-only results still exclude ineligible products', async () => {
    const enrichment = { cleanedTitle: 'Reviewed Title', shortSummary: null, suggestedTags: [], seoTitle: null, seoDescription: null, reviewedBy: 'editor', reviewedAt: null }
    enrichmentMock.getReviewedEnrichmentByProductId
      .mockResolvedValueOnce(enrichment)
      .mockResolvedValue(null)

    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'eligible_reviewed', title: 'Koh Samui Beach Tour', city: 'Koh Samui' }),
        makeRow({ id: 'ineligible_reviewed', title: 'Bali Beach Tour', city: 'Phuket' }),
      ])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('eligible_reviewed')
    expect(ids).not.toContain('ineligible_reviewed')
  })

  // Test 25: Mixed eligible/ineligible pool returns eligible items only
  it('mixed pool returns only eligible items', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'p1', title: 'Bangkok Float Tour', city: 'Bangkok' }),
        makeRow({ id: 'p2', title: 'Japan Cherry Tour', city: 'Bangkok' }),
        makeRow({ id: 'p3', title: 'Phuket Snorkeling', city: 'Phuket' }),
        makeRow({ id: 'p4', title: 'Vietnam Cooking Tour', city: 'Chiang Mai' }),
        makeRow({ id: 'p5', title: 'Chiang Rai Temple Tour', city: 'Chiang Rai' }),
      ])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('p1')
    expect(ids).not.toContain('p2')
    expect(ids).toContain('p3')
    expect(ids).not.toContain('p4')
    expect(ids).toContain('p5')
  })
})
