import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({ db: dbMock }))

import { listPublicThailandProducts } from '../listPublicThailandProducts'

function makeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_1',
    title: 'Chiang Mai Elephant Sanctuary',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    lastSyncedAt: new Date('2026-06-01T00:00:00Z'),
    ...overrides,
  }
}

describe('listPublicThailandProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array when DB returns no rows', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toEqual([])
  })

  it('includes eligible Bangkok product in results', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow({ id: 'bkk_1', title: 'Bangkok Temple Tour', city: 'Bangkok', location: null }),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('bkk_1')
    expect(result[0].city).toBe('Bangkok')
  })

  it('excludes product with foreign signal in title', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow({ title: 'Singapore City Tour', city: 'Bangkok' }),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(0)
  })

  it('excludes Thai-only title with no geographic signal', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow({ title: 'Thai Cooking Class', city: null, location: null }),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(0)
  })

  it('excludes destination-mismatched product (city=Phuket, title=Bali)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow({ title: 'Bali Yoga Retreat', city: 'Phuket', location: null }),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(0)
  })

  it('returns only public-safe fields (id, title, city, lastSyncedAt)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow(),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(1)
    const item = result[0]
    expect(Object.keys(item).sort()).toEqual(['city', 'id', 'lastSyncedAt', 'title'])
    expect(item).not.toHaveProperty('location')
    expect(item).not.toHaveProperty('rawJson')
    expect(item).not.toHaveProperty('eligibility')
  })

  it('stops collecting at effectiveTake', async () => {
    const rows = Array.from({ length: 3 }, (_, i) =>
      makeRow({ id: `prod_${i}`, title: `Chiang Mai Tour ${i}`, city: 'Chiang Mai', location: 'Mae Rim' }),
    )
    dbMock.bokunProduct.findMany.mockResolvedValueOnce(rows).mockResolvedValue([])

    const result = await listPublicThailandProducts(2)

    expect(result).toHaveLength(2)
  })

  it('spans multiple batches — second batch called with incremented skip after full first batch', async () => {
    // First batch is full (SCAN_BATCH_SIZE = 50), all ineligible → triggers second call
    const firstBatch = Array.from({ length: 50 }, (_, i) =>
      makeRow({ id: `foreign_${i}`, title: 'Vietnam Delta Tour', city: 'Bangkok', location: null }),
    )
    const secondBatch = [
      makeRow({ id: 'eligible_1', title: 'Koh Samui Snorkeling', city: 'Koh Samui', location: null }),
    ]
    dbMock.bokunProduct.findMany
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch)
      .mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('eligible_1')
    // 2 calls: first full batch (50) → continue; second partial batch (1) → break
    expect(dbMock.bokunProduct.findMany).toHaveBeenCalledTimes(2)
    const secondCall = dbMock.bokunProduct.findMany.mock.calls[1][0]
    expect(secondCall.skip).toBe(50)
  })

  it('passes deterministic orderBy (city asc, title asc, id asc) to every query', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await listPublicThailandProducts()

    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.orderBy).toEqual([
      { city: 'asc' },
      { title: 'asc' },
      { id: 'asc' },
    ])
  })

  it('collects eligible products while skipping ineligible in the same batch', async () => {
    const batch = [
      makeRow({ id: 'p1', title: 'Bangkok Float Tour', city: 'Bangkok', location: null }),
      makeRow({ id: 'p2', title: 'Japan Cherry Tour', city: 'Bangkok', location: null }),
      makeRow({ id: 'p3', title: 'Phuket Snorkeling', city: 'Phuket', location: null }),
    ]
    dbMock.bokunProduct.findMany.mockResolvedValueOnce(batch).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('p1')
    expect(ids).not.toContain('p2')
    expect(ids).toContain('p3')
  })

  it('returns empty array on DB error', async () => {
    dbMock.bokunProduct.findMany.mockRejectedValue(new Error('DB failure'))

    const result = await listPublicThailandProducts()

    expect(result).toEqual([])
  })

  it('includes Chiang Rai product (outside original seven-city whitelist)', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([
      makeRow({ id: 'cr_1', title: 'Chiang Rai Temple Tour', city: 'Chiang Rai', location: null }),
    ]).mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('cr_1')
  })

  it('DB query does not filter by city whitelist — relies on eligibility helper only', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValue([])

    await listPublicThailandProducts()

    const call = dbMock.bokunProduct.findMany.mock.calls[0][0]
    expect(call.where).not.toHaveProperty('city')
    expect(call.where).toMatchObject({ active: true })
  })
})
