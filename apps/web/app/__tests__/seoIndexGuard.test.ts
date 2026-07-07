import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({ get: vi.fn(() => null) })),
}))

const listMock = vi.hoisted(() => ({
  listPublicThailandProducts: vi.fn(),
}))

const productLoaderMock = vi.hoisted(() => ({
  getPublicThailandProduct: vi.fn(),
}))

vi.mock('@/lib/publicProducts/listPublicThailandProducts', () => listMock)
vi.mock('@/lib/publicProducts/getPublicThailandProduct', () => productLoaderMock)

import robots from '../robots'
import sitemap from '../sitemap'
import { metadata as aiTripPlannerMetadata } from '../ai-trip-planner/page'
import { metadata as chiangMaiFinderMetadata } from '../chiang-mai/elephant-camp-finder/page'
import { generateMetadata as generateTourDetailMetadata } from '../tours/[id]/page'

const BASE = 'https://www.radarscout.io'

function makePublicProduct(id: string) {
  return {
    id,
    title: `Tour ${id}`,
    city: 'Chiang Mai',
    location: 'Chiang Mai',
    imageUrl: null,
    summary: 'Reviewed Thailand tour.',
    description: null,
    retailPrice: null,
    currency: null,
    detailHref: `/tours/${id}`,
    reviewedEnrichment: null,
  }
}

describe('controlled SEO opening guard', () => {
  it('keeps the Chiang Mai finder as the only indexed marketing planner route', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(makePublicProduct('prod_cm_1'))
    listMock.listPublicThailandProducts.mockResolvedValue([makePublicProduct('prod_cm_1')])
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    const tourDetailMetadata = await generateTourDetailMetadata({ params: { id: 'prod_cm_1' } })
    const urls = (await sitemap()).map(entry => entry.url)

    expect(chiangMaiFinderMetadata.robots).toMatchObject({ index: true, follow: true })
    expect(aiTripPlannerMetadata.robots).toMatchObject({ index: false, follow: false })
    expect(tourDetailMetadata.robots).toMatchObject({ index: false, follow: false })

    expect(urls).toContain(`${BASE}/chiang-mai/elephant-camp-finder`)
    expect(urls).not.toContain(`${BASE}/ai-trip-planner`)
    expect(urls).not.toContain(`${BASE}/tours/prod_cm_1`)
    expect(urls.some(url => url.includes('/tours/'))).toBe(false)
  })

  it('keeps reddit-tool marketing routes disallowed in robots.txt', () => {
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    const rules = robots().rules
    const firstRule = Array.isArray(rules) ? rules[0] : rules
    const disallow = firstRule?.disallow

    expect(disallow).toEqual(expect.arrayContaining([
      '/reddit-monitoring-tool',
      '/reddit-keyword-monitor',
      '/reddit-mention-alerts',
      '/reddit-lead-finder',
      '/social-listening-reddit',
      '/reddit-competitor-monitoring',
      '/reddit-customer-discovery',
    ]))
  })
})
