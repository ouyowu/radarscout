import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

import { GET } from '../route'

function makeRequest(query: Record<string, string> = {}) {
  const params = new URLSearchParams({ destination: 'thailand', ...query })
  return new NextRequest(`http://localhost/api/products?${params.toString()}`)
}

function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'product_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    description: null,
    excerpt: null,
    city: 'Chiang Mai',
    location: 'Mae Rim',
    retailPrice: null,
    currency: null,
    rawJson: {},
    lastSyncedAt: null,
    supplier: null,
    ...overrides,
  }
}

function makeProductWithImage(overrides: Record<string, unknown> = {}) {
  return makeProduct({
    rawJson: { keyPhoto: { originalUrl: 'https://cdn.example.com/photo.jpg' } },
    ...overrides,
  })
}

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty list without DB call when destination is not thailand', async () => {
    const response = await GET(new NextRequest('http://localhost/api/products?destination=japan'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toEqual([])
    expect(body.meta.count).toBe(0)
    expect(dbMock.bokunProduct.findMany).not.toHaveBeenCalled()
  })

  it('returns empty list without DB call when city filter is unrecognized', async () => {
    const response = await GET(makeRequest({ city: 'tokyo' }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toEqual([])
    expect(dbMock.bokunProduct.findMany).not.toHaveBeenCalled()
  })

  it('returns eligible products with geographic signal (city)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([makeProduct()])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('product_abc')
    expect(body.products[0]).not.toHaveProperty('rawJson')
  })

  it('returns eligible products filtered by city', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'bkk_1', city: 'Bangkok', title: 'Bangkok Temple Tour' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ city: 'bangkok', take: '1' }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('bkk_1')
    expect(body.meta.filters.city).toBe('Bangkok')
  })

  it('returns correct count in meta', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'p1' }),
      makeProduct({ id: 'p2', title: 'Bangkok River Tour' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '5' }))
    const body = await response.json()

    expect(body.meta.count).toBe(2)
    expect(body.meta.resultCount).toBe(2)
  })

  it('defaults to take=12 when not specified', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(new NextRequest('http://localhost/api/products?destination=thailand'))
    await response.json()

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    )
  })

  it('clamps take to 50 maximum', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '200' }))
    await response.json()

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    )
  })

  it('excludes product with foreign signal in title', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ title: 'Singapore Cooking Class', city: 'Bangkok' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('excludes product with foreign signal in location', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ title: 'City Transfer', city: 'Bangkok', location: 'Kuala Lumpur Airport' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('excludes product with "Thai" only and no geographic signal', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ title: 'Thai Cooking Class', city: null, location: null }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('excludes destination-mismatched product (city=Bangkok, title mentions Singapore)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ title: 'Singapore Night Tour', city: 'Bangkok' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('hasImage=true returns only products with imageUrl', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'no_image' }),
      makeProductWithImage({ id: 'has_image', title: 'Phuket Snorkeling' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ hasImage: 'true', take: '5' }))
    const body = await response.json()

    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('has_image')
    expect(body.products[0].imageUrl).toBeTruthy()
  })

  it('hasImage=false returns only products without imageUrl', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'no_image' }),
      makeProductWithImage({ id: 'has_image', title: 'Phuket Snorkeling' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ hasImage: 'false', take: '5' }))
    const body = await response.json()

    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('no_image')
    expect(body.products[0].imageUrl).toBeNull()
  })

  it('scan loop fetches next batch when first batch yields no eligible products', async () => {
    const ineligibleBatch = Array.from({ length: 50 }, (_, i) => makeProduct({
      id: `ineligible_${i}`,
      title: 'Japan Tour',
      city: 'Bangkok',
    }))
    const eligibleProduct = makeProduct({ id: 'eligible_1', title: 'Chiang Mai Day Tour', city: 'Chiang Mai' })

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(ineligibleBatch)
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([eligibleProduct])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const body = await response.json()

    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('eligible_1')
    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(2)
    expect(dbMock.bokunProduct.findMany).toHaveBeenNthCalledWith(1, expect.objectContaining({ skip: 0 }))
    expect(dbMock.bokunProduct.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({ skip: 50 }))
  })

  it('scan loop stops when batch returns fewer rows than batch size (end of table)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'p1' }),
      makeProduct({ id: 'p2', title: 'Bangkok Temple Walk' }),
    ])

    const response = await GET(makeRequest({ take: '12' }))
    const body = await response.json()

    expect(body.products).toHaveLength(2)
    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(1)
  })

  it('does not expose rawJson in response body', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProductWithImage({ id: 'p1' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const serialized = JSON.stringify(await response.json())

    expect(serialized).not.toContain('"rawJson"')
  })

  it('returns PRODUCTS_UNAVAILABLE on DB error', async () => {
    dbMock.bokunProduct.findMany.mockRejectedValue(new Error('DB failure'))

    const response = await GET(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toEqual([])
    expect(body.error).toBe('PRODUCTS_UNAVAILABLE')
  })

  it('returns only eligible products from a mix of eligible and ineligible', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'eligible_1', city: 'Bangkok', title: 'Grand Palace Tour' }),
      makeProduct({ id: 'ineligible_1', city: 'Bangkok', title: 'Tokyo Transfer' }),
      makeProduct({ id: 'eligible_2', city: 'Phuket', title: 'Phuket Sunset Cruise' }),
      makeProduct({ id: 'ineligible_2', title: 'Thai Cooking', city: null, location: null }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '5' }))
    const body = await response.json()

    expect(body.products).toHaveLength(2)
    expect(body.products.map((p: { id: string }) => p.id)).toEqual(['eligible_1', 'eligible_2'])
  })
})

describe('GET /api/products — deterministic ordering and query contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const EXPECTED_ORDER_BY = [{ city: 'asc' }, { title: 'asc' }, { id: 'asc' }]

  it('A: every batch query sends the complete orderBy contract including id tie-breaker', async () => {
    const ineligibleBatch = Array.from({ length: 50 }, (_, i) => makeProduct({
      id: `ineligible_${i}`,
      title: 'Japan Tour',
      city: 'Bangkok',
    }))

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(ineligibleBatch)
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([makeProduct({ id: 'eligible_1' })])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ take: '1' }))

    const callCount = dbMock.bokunProduct.findMany.mock.calls.length
    expect(callCount).toBeGreaterThanOrEqual(2)
    for (let i = 1; i <= callCount; i++) {
      expect(dbMock.bokunProduct.findMany).toHaveBeenNthCalledWith(
        i,
        expect.objectContaining({ orderBy: EXPECTED_ORDER_BY }),
      )
    }
  })

  it('B: preserves ID-ascending order for rows sharing city and title; no duplicates, no omissions', async () => {
    // 49 ineligible + island_a in first batch of 50 triggers next batch
    const shared = { city: 'Phuket', title: 'Island Tour' }
    const batchOne = [
      ...Array.from({ length: 49 }, (_, i) => makeProduct({
        id: `ineligible_${i}`,
        title: 'Japan Tour',
        city: 'Bangkok',
      })),
      makeProduct({ id: 'island_a', ...shared }),
    ]
    const batchTwo = [
      makeProduct({ id: 'island_b', ...shared }),
      makeProduct({ id: 'island_c', ...shared }),
    ]

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(batchOne)
    dbMock.bokunProduct.findMany.mockResolvedValueOnce(batchTwo)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '5' }))
    const body = await response.json()

    const ids: string[] = body.products.map((p: { id: string }) => p.id)
    expect(ids).toContain('island_a')
    expect(ids).toContain('island_b')
    expect(ids).toContain('island_c')
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.indexOf('island_a')).toBeLessThan(ids.indexOf('island_b'))
    expect(ids.indexOf('island_b')).toBeLessThan(ids.indexOf('island_c'))
  })

  it('C: multi-batch calls use identical orderBy; skip advances by 50; take stays 50', async () => {
    const ineligibleBatch = Array.from({ length: 50 }, (_, i) => makeProduct({
      id: `ineligible_${i}`,
      title: 'Japan Tour',
      city: 'Bangkok',
    }))

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(ineligibleBatch)
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([makeProduct({ id: 'eligible_1' })])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await GET(makeRequest({ take: '1' }))

    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(2)

    const first = dbMock.bokunProduct.findMany.mock.calls[0][0]
    const second = dbMock.bokunProduct.findMany.mock.calls[1][0]

    expect(first.orderBy).toEqual(EXPECTED_ORDER_BY)
    expect(second.orderBy).toEqual(EXPECTED_ORDER_BY)
    expect(first.skip).toBe(0)
    expect(second.skip).toBe(50)
    expect(first.take).toBe(50)
    expect(second.take).toBe(50)
  })

  it('D: foreign products remain excluded across multiple batches', async () => {
    const foreignBatch = Array.from({ length: 50 }, (_, i) => makeProduct({
      id: `foreign_${i}`,
      title: 'Japan Tour',
      city: 'Bangkok',
    }))

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(foreignBatch)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '5' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('D: "Thai" without geographic evidence remains excluded', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProduct({ id: 'cultural_only', title: 'Thai Massage Course', city: null, location: null }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '5' }))
    const body = await response.json()

    expect(body.products).toHaveLength(0)
  })

  it('D: eligible rows in a later batch still fill the requested take', async () => {
    const ineligibleBatch = Array.from({ length: 50 }, (_, i) => makeProduct({
      id: `ineligible_${i}`,
      title: 'Vietnam Tour',
      city: 'Bangkok',
    }))
    const eligibleBatch = [
      makeProduct({ id: 'late_1', city: 'Krabi', title: 'Krabi Rock Climbing' }),
      makeProduct({ id: 'late_2', city: 'Krabi', title: 'Krabi Kayaking' }),
    ]

    dbMock.bokunProduct.findMany.mockResolvedValueOnce(ineligibleBatch)
    dbMock.bokunProduct.findMany.mockResolvedValueOnce(eligibleBatch)
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '2' }))
    const body = await response.json()

    expect(body.products).toHaveLength(2)
    expect(body.products[0].id).toBe('late_1')
    expect(body.products[1].id).toBe('late_2')
  })

  it('D: response does not expose eligibility internals or rawJson', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeProductWithImage({ id: 'p1', title: 'Phuket Diving' }),
    ])
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const response = await GET(makeRequest({ take: '1' }))
    const serialized = JSON.stringify(await response.json())

    expect(serialized).not.toContain('"rawJson"')
    expect(serialized).not.toContain('"eligible"')
    expect(serialized).not.toContain('"foreignSignals"')
    expect(serialized).not.toContain('"thailandSignals"')
    expect(serialized).not.toContain('"reasons"')
  })
})
