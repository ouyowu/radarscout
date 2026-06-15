import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { toReadOnlyBokunCatalogProduct } from './bokunCatalog'

describe('toReadOnlyBokunCatalogProduct', () => {
  it('returns a read-only public shape with disabled booking flags', () => {
    const product = toReadOnlyBokunCatalogProduct({
      id: 'prod_1',
      title: 'River dinner cruise',
      description: '<p>Buffet dinner on board</p>',
      excerpt: 'Buffet dinner on board',
      city: 'Bangkok',
      location: 'Chao Phraya River',
      retailPrice: { toString: () => '49.00 USD' },
      currency: 'USD',
      rawJson: {
        summary: '<p>Evening cruise</p>',
        keyPhoto: {
          originalUrl: 'https://cdn.example.com/photo.jpg',
        },
      },
      lastSyncedAt: new Date('2026-06-15T11:10:00.000Z'),
      supplier: { title: 'Real Supplier' },
    })

    expect(product.bookingEnabled).toBe(false)
    expect(product.availabilityEnabled).toBe(false)
    expect(product.source).toBe('bokun-read-only-catalog')
    expect(product.destination).toBe('Bangkok')
    expect(product.imageUrl).toBe('https://cdn.example.com/photo.jpg')
    expect(product.supplierName).toBe('Real Supplier')
    expect(product).not.toHaveProperty('rawJson')
  })

  it('does not invent destination or missing fields', () => {
    const product = toReadOnlyBokunCatalogProduct({
      id: 'prod_2',
      title: 'Unnamed transfer',
      description: null,
      excerpt: null,
      city: null,
      location: null,
      retailPrice: null,
      currency: null,
      rawJson: {},
      lastSyncedAt: null,
      supplier: null,
    })

    expect(product.destination).toBeNull()
    expect(product.location).toBeNull()
    expect(product.retailPrice).toBeNull()
    expect(product.retailPriceText).toBeNull()
    expect(product.supplierName).toBeNull()
    expect(product.imageUrl).toBeNull()
    expect(product.lastSyncedAt).toBeNull()
    expect(product).not.toHaveProperty('rawJson')
    expect(JSON.stringify(product)).not.toContain('Thailand')
  })
})
