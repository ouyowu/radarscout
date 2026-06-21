import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const listMock = vi.hoisted(() => ({
  listPublicThailandProducts: vi.fn(),
}))

vi.mock('@/lib/publicProducts/listPublicThailandProducts', () => listMock)

import sitemap from '../sitemap'

const BASE = 'https://www.radarscout.io'

function makeProduct(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    title: `Tour ${id}`,
    city: 'Bangkok',
    lastSyncedAt: new Date('2026-06-01T00:00:00Z'),
    ...overrides,
  }
}

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_BASE_URL = BASE
  })

  it('always includes all four static routes', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}`)
    expect(urls).toContain(`${BASE}/contact`)
    expect(urls).toContain(`${BASE}/privacy-policy`)
    expect(urls).toContain(`${BASE}/terms-of-service`)
  })

  it('includes eligible product URLs after the static routes', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('bkk_tour_123'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}/tours/bkk_tour_123`)
  })

  it('encodes product id with encodeURIComponent in the URL', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('tour id with spaces'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}/tours/${encodeURIComponent('tour id with spaces')}`)
    expect(urls.every((url: string) => !url.includes(' '))).toBe(true)
  })

  it('returns no duplicate URLs when multiple products are returned', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('p1'),
      makeProduct('p2'),
      makeProduct('p3'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)
    const unique = new Set(urls)

    expect(unique.size).toBe(urls.length)
  })

  it('returns only static routes when listPublicThailandProducts returns empty array', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()

    expect(entries).toHaveLength(4)
    entries.forEach(entry => {
      expect(entry.url).not.toContain('/tours/')
    })
  })

  it('includes product from Chiang Rai (outside original seven-city whitelist)', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('cr_tour_456', { city: 'Chiang Rai' }),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}/tours/cr_tour_456`)
  })
})
