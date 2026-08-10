import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const listMock = vi.hoisted(() => ({
  listPublicThailandProducts: vi.fn(),
}))

vi.mock('@/lib/publicProducts/listPublicThailandProducts', () => listMock)

import sitemap from '../sitemap'
import robots from '../robots'

const BASE = 'https://www.radarscout.io'
const APPROVED_TOUR_URLS = [
  `${BASE}/tours/viator_6467bkknight`,
  `${BASE}/tours/viator_163642p1`,
  `${BASE}/tours/viator_191442p6`,
  `${BASE}/tours/viator_163642p25`,
  `${BASE}/tours/viator_160694p9`,
  `${BASE}/tours/viator_44720p2`,
] as const

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

  it('always includes the controlled static routes and Thailand city hubs', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}`)
    expect(urls).toContain(`${BASE}/thailand-trip-planner`)
    expect(urls).toContain(`${BASE}/thailand/bangkok`)
    expect(urls).toContain(`${BASE}/thailand/chiang-mai`)
    expect(urls).toContain(`${BASE}/thailand/phuket`)
    expect(urls).toContain(`${BASE}/guides`)
    expect(urls).toContain(`${BASE}/guides/bangkok`)
    expect(urls).toContain(`${BASE}/guides/chiang-mai`)
    expect(urls).toContain(`${BASE}/guides/phuket`)
    expect(urls).toContain(`${BASE}/guides/bangkok/best-areas-to-stay-first-time-visitors`)
    expect(urls).toContain(`${BASE}/guides/bangkok/ayutthaya-vs-floating-market-day-trip`)
    expect(urls).toContain(`${BASE}/guides/bangkok/food-tour-vs-temple-day`)
    expect(urls).toContain(`${BASE}/guides/chiang-mai/how-to-choose-an-elephant-sanctuary`)
    expect(urls).toContain(`${BASE}/guides/chiang-mai/doi-inthanon-vs-chiang-rai-day-trip`)
    expect(urls).toContain(`${BASE}/guides/chiang-mai/old-city-vs-nimman-where-to-stay`)
    expect(urls).toContain(`${BASE}/guides/phuket/phi-phi-vs-james-bond-island`)
    expect(urls).toContain(`${BASE}/guides/phuket/old-town-vs-island-day`)
    expect(urls).toContain(`${BASE}/guides/phuket/private-vs-shared-island-tour`)
    expect(urls).toContain(`${BASE}/contact`)
    expect(urls).toContain(`${BASE}/privacy-policy`)
    expect(urls).toContain(`${BASE}/terms-of-service`)
  })

  it('excludes unapproved eligible product URLs from the sitemap', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('bkk_tour_123'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/bkk_tour_123`)
    expect(urls.filter(url => url.includes('/tours/')).sort()).toEqual([...APPROVED_TOUR_URLS].sort())
  })

  it('includes exactly the six approved tour detail SEO candidates', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls.filter(url => url.includes('/tours/')).sort()).toEqual([...APPROVED_TOUR_URLS].sort())
  })

  it('does not include unsafe tour detail URLs even when product IDs require encoding', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('tour id with spaces'),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/${encodeURIComponent('tour id with spaces')}`)
    expect(urls.filter(url => url.includes('/tours/')).sort()).toEqual([...APPROVED_TOUR_URLS].sort())
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

  it('returns only static routes and controlled SEO candidates when listPublicThailandProducts returns empty array', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()

    expect(entries).toHaveLength(29)
    expect(entries.map(entry => entry.url)).toEqual(expect.arrayContaining([...APPROVED_TOUR_URLS]))
  })

  it('excludes product from Chiang Rai even when it would be Thailand-eligible', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([
      makeProduct('cr_tour_456', { city: 'Chiang Rai' }),
    ])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/tours/cr_tour_456`)
    expect(urls.filter(url => url.includes('/tours/')).sort()).toEqual([...APPROVED_TOUR_URLS].sort())
  })

  it('includes the Chiang Mai finder as the single controlled-opening SEO candidate', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).toContain(`${BASE}/chiang-mai/elephant-camp-finder`)
    expect(urls).toContain(`${BASE}/phuket/island-day-selector`)
    expect(urls).toContain(`${BASE}/thailand-trip-planner`)
  })

  it('does not include other noindex public pages while they remain closed to indexing', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/ai-trip-planner`)
    expect(urls).not.toContain(`${BASE}/partners`)
    expect(urls).not.toContain(`${BASE}/suppliers`)
    expect(urls).not.toContain(`${BASE}/destination-partners`)
  })

  it('does not include destination pages until destination SEO expansion is explicitly approved', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/destinations`)
    expect(urls.some(url => url.includes('/destinations/'))).toBe(false)
  })

  it('keeps non-Thailand planning-only destination slugs out of the sitemap', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([])

    const entries = await sitemap()
    const urls = entries.map(e => e.url)

    expect(urls).not.toContain(`${BASE}/destinations/united-states`)
    expect(urls).not.toContain(`${BASE}/destinations/canada`)
    expect(urls).not.toContain(`${BASE}/destinations/japan`)
  })

  it('keeps intended robots.txt disallow rules while sitemap is narrowed', () => {
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
            '/comparisons/',
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
