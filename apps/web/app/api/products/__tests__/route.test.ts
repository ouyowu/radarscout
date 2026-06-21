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
