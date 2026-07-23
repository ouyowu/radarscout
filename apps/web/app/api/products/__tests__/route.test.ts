import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

import { GET } from '../route'

const routeSource = readFileSync(new URL('../route.ts', import.meta.url), 'utf8')

function makeRequest(query: Record<string, string> = {}) {
  const params = new URLSearchParams({ destination: 'thailand', ...query })
  return new NextRequest(`http://localhost/api/products?${params.toString()}`)
}

describe('GET /api/products — reviewed Viator public catalogue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-23T12:00:00.000Z'))
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the first page of reviewed Viator products with safe affiliate handoffs', async () => {
    const response = await GET(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.products).toHaveLength(12)
    expect(body.meta).toMatchObject({
      source: 'reviewed-viator-affiliate-products',
      catalogueScope: 'thailand-reviewed',
      bookingEnabled: false,
      availabilityEnabled: false,
      count: 12,
      resultCount: 12,
      totalCount: 205,
      page: 1,
      pageSize: 12,
      totalPages: 18,
    })

    for (const product of body.products) {
      expect(product.id).toMatch(/^viator_/)
      expect(product.detailHref).toBe(`/tours/${product.id}`)
      if (product.retailPrice !== null) {
        expect(Number(product.retailPrice)).toBeGreaterThan(0)
        expect(product.currency).toMatch(/^(THB|USD)$/)
        expect(product.priceFetchedAt).toBe('2026-07-23T08:52:26.057Z')
      } else {
        expect(product.currency).toBeNull()
        expect(product.priceFetchedAt).toBeNull()
      }
      expect(product.bookingPartnerHandoff).toMatchObject({
        label: 'Check availability',
        rel: 'nofollow sponsored noopener noreferrer',
        source: 'operator_verified_public_link',
      })
      expect(product.bookingPartnerHandoff.href).toMatch(/^https:\/\/(?:[^/]+\.)?viator\.com\//)
    }

    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('partner_cm_')
    expect(serialized).not.toContain('widgets.bokun.io')
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('supplierName')
    expect(serialized).not.toMatch(/partnerNet|commission|markup|rawResponse/)
  })

  it('filters all 19 reviewed city slugs without falling back to legacy products', async () => {
    const response = await GET(makeRequest({ city: 'ko-pha-ngan', take: '50' }))
    const body = await response.json()

    expect(body.products).toHaveLength(2)
    expect(body.products.every((product: { destination: string }) => (
      product.destination === 'Ko Pha Ngan'
    ))).toBe(true)
    expect(body.meta.filters.city).toBe('ko-pha-ngan')
    expect(body.meta.totalCount).toBe(2)
  })

  it('paginates the complete reviewed catalogue deterministically', async () => {
    const firstResponse = await GET(makeRequest({ page: '1', take: '12' }))
    const secondResponse = await GET(makeRequest({ page: '2', take: '12' }))
    const firstBody = await firstResponse.json()
    const secondBody = await secondResponse.json()
    const firstIds = firstBody.products.map((product: { id: string }) => product.id)
    const secondIds = secondBody.products.map((product: { id: string }) => product.id)

    expect(secondBody.meta.page).toBe(2)
    expect(secondBody.meta.totalCount).toBe(205)
    expect(secondBody.products).toHaveLength(12)
    expect(firstIds.some((id: string) => secondIds.includes(id))).toBe(false)
  })

  it('returns an empty safe result for unsupported destinations and cities', async () => {
    const japanResponse = await GET(new NextRequest('http://localhost/api/products?destination=japan'))
    const tokyoResponse = await GET(makeRequest({ city: 'tokyo' }))
    const japanBody = await japanResponse.json()
    const tokyoBody = await tokyoResponse.json()

    expect(japanBody.products).toEqual([])
    expect(japanBody.meta.totalCount).toBe(0)
    expect(tokyoBody.products).toEqual([])
    expect(tokyoBody.meta.totalCount).toBe(0)
  })

  it('keeps the legacy Bókun and database catalogue paths out of the public route', () => {
    expect(routeSource).toContain('loadReviewedViatorPublicCatalogue')
    expect(routeSource).not.toContain('@reddit-monitor/db')
    expect(routeSource).not.toContain('pilotPartnerProducts')
    expect(routeSource).not.toContain('bokunProduct')
    expect(routeSource).not.toContain('signed-bokun-supplier-products')
  })
})
