import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchActiveBokunActivities: vi.fn(),
  supplierUpsert: vi.fn(),
  productUpsert: vi.fn(),
}))

vi.mock('@/lib/bokun', () => ({
  fetchActiveBokunActivities: mocks.fetchActiveBokunActivities,
}))

vi.mock('@reddit-monitor/db', () => ({
  db: {
    bokunSupplier: { upsert: mocks.supplierUpsert },
    bokunProduct: { upsert: mocks.productUpsert },
  },
}))

import { syncBokunCatalog } from './bokunSync'

function product(
  id: string,
  title: string,
  vendorId: number,
  rawExtras: Record<string, unknown> = {},
) {
  return {
    id,
    title,
    excerpt: null,
    location: null,
    retailPrice: null,
    netSettlementPrice: null,
    commissionPercent: 20,
    raw: {
      id: Number(id),
      title,
      vendor: { id: vendorId, title: `Supplier ${vendorId}` },
      photos: [{ originalUrl: `https://images.example.test/${id}.jpg` }],
      ...rawExtras,
    },
  }
}

describe('syncBokunCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.supplierUpsert.mockResolvedValue({ id: 'supplier-row' })
    mocks.productUpsert.mockResolvedValue({ id: 'product-row' })
  })

  it('writes only clear Thailand products and classifies additional Thai destinations', async () => {
    mocks.fetchActiveBokunActivities.mockResolvedValue({
      ok: true,
      status: 200,
      body: {
        count: 2,
        items: [
          product('776417', 'Khao Lak: Phi Phi Island Snorkeling Day Tour', 10),
          product('791731', 'Singapore: Adventure Cove Waterpark Entrance Ticket', 20),
        ],
      },
    })

    const result = await syncBokunCatalog({
      queries: ['khao lak'],
      pageSize: 100,
      maxPages: 1,
    })

    expect(result.fetchedUniqueProducts).toBe(2)
    expect(result.productsUpserted).toBe(1)
    expect(result.skippedProducts).toBe(1)
    expect(mocks.supplierUpsert).toHaveBeenCalledOnce()
    expect(mocks.productUpsert).toHaveBeenCalledOnce()
    expect(mocks.productUpsert.mock.calls[0][0].create.city).toBe('Khao Lak')
  })

  it('uses Bókun place metadata when the product title omits the destination', async () => {
    mocks.fetchActiveBokunActivities.mockResolvedValue({
      ok: true,
      status: 200,
      body: {
        count: 1,
        items: [
          product('501999', 'A Personal Shopper', 30, {
            places: [{ title: 'Bangkok', location: { countryCode: 'TH' } }],
          }),
        ],
      },
    })

    const result = await syncBokunCatalog({
      queries: ['bangkok'],
      pageSize: 100,
      maxPages: 1,
    })

    expect(result.productsUpserted).toBe(1)
    expect(mocks.productUpsert.mock.calls[0][0].create.city).toBe('Bangkok')
  })
})
