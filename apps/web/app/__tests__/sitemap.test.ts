import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const listMock = vi.hoisted(() => ({
  listPublicThailandProducts: vi.fn(),
}))

vi.mock('@/lib/publicProducts/listPublicThailandProducts', () => listMock)

import sitemap from '../sitemap'
import robots from '../robots'

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

  it('excludes eligible product URLs from the sitemap until tour pages are public-safe', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('bkk_tour_123'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/bkk_tour_123`)
    expect(urls.some(url => url.includes('/tours/'))).toBe(false)
  })

  it('does not include unsafe tour detail URLs even when product IDs require encoding', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('tour id with spaces'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/${encodeURIComponent('tour id with spaces')}`)
    expect(urls.some(url => url.includes('/tours/'))).toBe(false)
  })

  it('returns no duplicate URLs when multiple products are returned but excluded', async () => {
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

  it('excludes product from Chiang Rai even when it would be Thailand-eligible', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('cr_tour_456', { city: 'Chiang Rai' }),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/cr_tour_456`)
    expect(urls.some(url => url.includes('/tours/'))).toBe(false)
  })

  it('does not include noindex public pages while they remain closed to indexing', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/chiang-mai/elephant-camp-finder`)
    expect(urls).not.toContain(`${BASE}/partners`)
    expect(urls).not.toContain(`${BASE}/suppliers`)
    expect(urls).not.toContain(`${BASE}/destination-partners`)
  })

  it('keeps robots.txt behavior unchanged while sitemap is narrowed', () => {
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    expect(robots()).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
            '/dashboard',
            '/auth/',
            '/demo',
            '/use-cases',
            '/pricing',
            '/f5bot-alternative',
            '/gummysearch-alternative',
            '/reddit-monitoring-tool',
            '/reddit-keyword-monitor',
            '/reddit-mention-alerts',
            '/reddit-lead-finder',
            '/social-listening-reddit',
            '/reddit-competitor-monitoring',
            '/reddit-customer-discovery',
          ],
        },
      ],
      sitemap: `${BASE}/sitemap.xml`,
    })
  })
})
