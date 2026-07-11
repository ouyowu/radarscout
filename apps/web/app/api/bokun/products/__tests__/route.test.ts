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

describe('GET /api/bokun/products public safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an explicit public allowlist without commercial or supplier-internal fields', async () => {
    dbMock.bokunProduct.findMany.mockResolvedValueOnce([{
      id: 'product_1',
      bokunActivityId: '1232729',
      title: 'Chiang Mai Elephant Sanctuary',
      excerpt: 'A reviewed Chiang Mai experience.',
      city: 'Chiang Mai',
      location: 'Mae Rim',
      retailPrice: { toString: () => '1200.00' },
      netSettlementPrice: { toString: () => '850.00' },
      currency: 'THB',
      commissionPercent: { toString: () => '29.17' },
      active: true,
      lastSyncedAt: new Date('2026-06-08T16:33:58.786Z'),
      rawJson: {
        summary: '<p>A real sanctuary experience.</p>',
        secretCommercialNote: 'never-public',
      },
      supplier: {
        bokunVendorId: 'supplier_internal_1',
        title: 'Reviewed local operator',
        status: 'CONTRACTED',
      },
    }])

    const response = await GET(new NextRequest('http://localhost/api/bokun/products?take=1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toHaveLength(1)
    expect(body.products[0]).toEqual(expect.objectContaining({
      id: 'product_1',
      title: 'Chiang Mai Elephant Sanctuary',
      retailPrice: '1200.00',
      currency: 'THB',
      supplier: { title: 'Reviewed local operator' },
    }))
    expect(body.products[0]).not.toHaveProperty('bokunActivityId')
    expect(body.products[0]).not.toHaveProperty('netSettlementPrice')
    expect(body.products[0]).not.toHaveProperty('commissionPercent')
    expect(body.products[0]).not.toHaveProperty('rawJson')
    expect(body.products[0].supplier).not.toHaveProperty('bokunVendorId')
    expect(body.products[0].supplier).not.toHaveProperty('status')
    expect(JSON.stringify(body)).not.toContain('never-public')
  })
})
