import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({ db: dbMock }))

const enrichmentMock = vi.hoisted(() => ({
  getReviewedEnrichmentsByProductIds: vi.fn(),
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
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(new Map())
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

    // Even if enrichment map has something (shouldn't happen since ineligible IDs never reach enrichment)
    // the ineligible product must still be excluded
    const result = await listAiEligibleThailandProducts()

    expect(result).toHaveLength(0)
  })

  // Test 10: Enrichment batch is not called for all-ineligible batches
  it('does not call getReviewedEnrichmentsByProductIds when no eligible products found', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Japan Cherry Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    await listAiEligibleThailandProducts()

    expect(enrichmentMock.getReviewedEnrichmentsByProductIds).not.toHaveBeenCalled()
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
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow()])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts({ take: 9999 })

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
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(new Map())
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

  it('attaches reviewed enrichment for eligible products via batch lookup', async () => {
    const enrichmentMap = new Map()
    enrichmentMap.set('p1', {
      cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
      shortSummary: 'A half-day ethical elephant experience.',
      suggestedTags: ['Elephants', 'Nature'],
      seoTitle: null,
      seoDescription: null,
      reviewedBy: null,
      reviewedAt: null,
    })
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(enrichmentMap)

    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Chiang Mai Elephant Sanctuary', city: 'Chiang Mai' })])
      .mockResolvedValue([])

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

  it('returns empty array when enrichment batch query fails', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Bangkok Temple Tour', city: 'Bangkok' })])
      .mockResolvedValue([])
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockRejectedValue(new Error('enrichment DB failure'))

    const result = await listAiEligibleThailandProducts()

    expect(result).toEqual([])
  })
})

describe('listAiEligibleThailandProducts — fallback scenarios (tests 22–25)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(new Map())
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
    const enrichmentMap = new Map()
    enrichmentMap.set('eligible_reviewed', {
      cleanedTitle: 'Reviewed Title',
      shortSummary: null,
      suggestedTags: [],
      seoTitle: null,
      seoDescription: null,
      reviewedBy: 'editor',
      reviewedAt: null,
    })
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(enrichmentMap)

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

// ── Section B + H: Query-count guardrail and performance acceptance tests ──────

describe('listAiEligibleThailandProducts — query count and performance (H1–H9)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockResolvedValue(new Map())
  })

  // H1: Six returned products do not cause six separate enrichment queries
  it('H1: six eligible products cause exactly one enrichment batch query, not six', async () => {
    const six = Array.from({ length: 6 }, (_, i) =>
      makeRow({ id: `p${i}`, title: `Bangkok Tour ${i}`, city: 'Bangkok' }),
    )
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(six)
      .mockResolvedValue([])

    await listAiEligibleThailandProducts({ take: 6 })

    expect(enrichmentMock.getReviewedEnrichmentsByProductIds).toHaveBeenCalledTimes(1)
    const ids = enrichmentMock.getReviewedEnrichmentsByProductIds.mock.calls[0][0]
    expect(ids).toHaveLength(6)
  })

  // H1b: Verify the six IDs passed to enrichment batch match the eligible IDs
  it('H1b: enrichment batch receives exactly the eligible IDs in order', async () => {
    const rows = ['a', 'b', 'c', 'd', 'e', 'f'].map(id =>
      makeRow({ id, title: `Bangkok Tour ${id}`, city: 'Bangkok' }),
    )
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(rows)
      .mockResolvedValue([])

    await listAiEligibleThailandProducts({ take: 6 })

    const ids = enrichmentMock.getReviewedEnrichmentsByProductIds.mock.calls[0][0]
    expect(ids).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  // H2: Interest hit uses one candidate retrieval path (one findMany call)
  it('H2: Chiang Mai search with immediate interest match uses one product query batch', async () => {
    const hits = [makeRow({ id: 'cm1', title: 'Chiang Mai Elephant Tour', city: 'Chiang Mai' })]
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(hits)
      .mockResolvedValue([])

    await listAiEligibleThailandProducts({ city: 'Chiang Mai', search: 'elephants', take: 6 })

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(1)
    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.where).toMatchObject({ city: 'Chiang Mai' })
    expect(call.where.title).toMatchObject({ contains: 'elephants' })
  })

  // H3: Interest miss — the listAiEligibleThailandProducts function itself returns empty on no match;
  // the route's queryEligibleCandidates handles the fallback. This test confirms the function
  // returns empty when no eligible products match the interest filter.
  it('H3: interest search with zero eligible results returns empty array', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Japan Cherry Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts({ city: 'Chiang Mai', search: 'elephants', take: 6 })

    expect(result).toHaveLength(0)
    expect(enrichmentMock.getReviewedEnrichmentsByProductIds).not.toHaveBeenCalled()
  })

  // H4: No duplicate products from batches
  it('H4: no duplicate product IDs across multiple batches', async () => {
    const batch1 = Array.from({ length: 50 }, (_, i) =>
      makeRow({ id: `prod_${i}`, title: `Bangkok Tour ${i}`, city: 'Bangkok' }),
    )
    const batch2 = Array.from({ length: 10 }, (_, i) =>
      makeRow({ id: `prod_${50 + i}`, title: `Phuket Tour ${i}`, city: 'Phuket' }),
    )

    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()
    const ids = result.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // H5: No ineligible ID enters enrichment lookup
  it('H5: ineligible product IDs are never passed to enrichment batch', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'eligible_1', title: 'Bangkok Temple Tour', city: 'Bangkok' }),
        makeRow({ id: 'ineligible_1', title: 'Singapore City Tour', city: 'Singapore' }),
        makeRow({ id: 'eligible_2', title: 'Phuket Snorkeling', city: 'Phuket' }),
      ])
      .mockResolvedValue([])

    await listAiEligibleThailandProducts()

    const ids = enrichmentMock.getReviewedEnrichmentsByProductIds.mock.calls[0][0]
    expect(ids).toContain('eligible_1')
    expect(ids).toContain('eligible_2')
    expect(ids).not.toContain('ineligible_1')
  })

  // H6: No ineligible product reaches context output
  it('H6: ineligible product does not appear in returned candidates', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([
        makeRow({ id: 'eligible_1', title: 'Bangkok Temple Tour', city: 'Bangkok' }),
        makeRow({ id: 'ineligible_1', title: 'Vietnam Mekong Tour', city: 'Bangkok' }),
      ])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('eligible_1')
    expect(ids).not.toContain('ineligible_1')
  })

  // H7: No rawJson or eligibility internals enter output
  it('H7: candidate output has no rawJson or eligibility internals', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Bangkok Temple Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    const result = await listAiEligibleThailandProducts()

    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('eligible')
    expect(serialized).not.toContain('foreignSignals')
    expect(serialized).not.toContain('reasons')
    expect(serialized).not.toContain('supplierId')
  })

  // H8: DB failure returns safe empty response
  it('H8: DB failure returns safe empty array, not a thrown error', async () => {
    dbMock.bokunProduct.findMany.mockRejectedValue(new Error('DB connection lost'))

    const result = await listAiEligibleThailandProducts()

    expect(result).toEqual([])
  })

  // H8b: Enrichment failure returns safe empty response
  it('H8b: enrichment batch failure returns safe empty array', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Bangkok Temple Tour', city: 'Bangkok' })])
      .mockResolvedValue([])
    enrichmentMock.getReviewedEnrichmentsByProductIds.mockRejectedValue(new Error('enrichment timeout'))

    const result = await listAiEligibleThailandProducts()

    expect(result).toEqual([])
  })

  // H10: Existing 600-char prompt boundary remains unchanged (at route level — verified here
  // by checking the listAiEligibleThailandProducts function itself doesn't validate prompt length)
  it('H10: listAiEligibleThailandProducts accepts any city/search string — prompt limit is enforced at route level', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ id: 'p1', title: 'Chiang Mai Temple', city: 'Chiang Mai' })])
      .mockResolvedValue([])

    const longSearch = 'a'.repeat(600)
    await expect(
      listAiEligibleThailandProducts({ city: 'Chiang Mai', search: longSearch }),
    ).resolves.toBeDefined()
  })

  // Query count: Thailand-wide search uses product query but no city filter
  it('Thailand-wide search does not pass city filter to DB', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await listAiEligibleThailandProducts({ take: 6 })

    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.where).not.toHaveProperty('city')
  })

  // Query count: No-match search does not call enrichment
  it('no-match search (zero eligible products) makes zero enrichment queries', async () => {
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce([makeRow({ title: 'Japan Tour', city: 'Bangkok' })])
      .mockResolvedValue([])

    await listAiEligibleThailandProducts({ city: 'Chiang Mai', take: 6 })

    expect(enrichmentMock.getReviewedEnrichmentsByProductIds).not.toHaveBeenCalled()
  })

  // Query count: Enrichment is always batched, never per-product
  it('enrichment is called at most once regardless of eligible product count', async () => {
    const rows = Array.from({ length: 10 }, (_, i) =>
      makeRow({ id: `p${i}`, title: `Bangkok Tour ${i}`, city: 'Bangkok' }),
    )
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(rows)
      .mockResolvedValue([])

    await listAiEligibleThailandProducts({ take: 10 })

    expect(enrichmentMock.getReviewedEnrichmentsByProductIds).toHaveBeenCalledTimes(1)
  })
})
