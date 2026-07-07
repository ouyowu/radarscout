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
import { metadata as contactMetadata } from '../contact/page'
import { metadata as demoMetadata } from '../demo/page'
import { metadata as homeMetadata } from '../page'
import { metadata as privacyMetadata } from '../privacy-policy/page'
import { metadata as termsMetadata } from '../terms-of-service/page'
import { generateMetadata as generateTourDetailMetadata } from '../tours/[id]/page'

const BASE = 'https://www.radarscout.io'
const CURRENT_INDEXABLE_SITEMAP_URLS = [
  BASE,
  `${BASE}/chiang-mai/elephant-camp-finder`,
  `${BASE}/contact`,
  `${BASE}/privacy-policy`,
  `${BASE}/terms-of-service`,
] as const

const REDDIT_TOOL_MARKETING_ROUTES = [
  '/f5bot-alternative',
  '/gummysearch-alternative',
  '/reddit-monitoring-tool',
  '/reddit-keyword-monitor',
  '/reddit-mention-alerts',
  '/reddit-lead-finder',
  '/social-listening-reddit',
  '/reddit-competitor-monitoring',
  '/reddit-customer-discovery',
] as const

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
  it('keeps the sitemap indexable URL set pinned to the current allowlist', async () => {
    listMock.listPublicThailandProducts.mockResolvedValue([makePublicProduct('prod_cm_1')])
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    const urls = (await sitemap()).map(entry => entry.url).sort()

    expect(urls).toEqual([...CURRENT_INDEXABLE_SITEMAP_URLS].sort())
    expect(urls).not.toContain(`${BASE}/ai-trip-planner`)
    expect(urls).not.toContain(`${BASE}/tours/prod_cm_1`)
    expect(urls.some(url => url.includes('/tours/'))).toBe(false)
  })

  it('keeps only allowlisted route metadata open to indexing', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(makePublicProduct('prod_cm_1'))
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    const tourDetailMetadata = await generateTourDetailMetadata({ params: { id: 'prod_cm_1' } })

    expect(homeMetadata.robots).toBeUndefined()
    expect(contactMetadata.robots).toBeUndefined()
    expect(privacyMetadata.robots).toBeUndefined()
    expect(termsMetadata.robots).toBeUndefined()
    expect(chiangMaiFinderMetadata.robots).toMatchObject({ index: true, follow: true })
    expect(aiTripPlannerMetadata.robots).toMatchObject({ index: false, follow: false })
    expect(demoMetadata.robots).toMatchObject({ index: false, follow: false })
    expect(tourDetailMetadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('keeps reddit-tool marketing routes disallowed in robots.txt', () => {
    process.env.NEXT_PUBLIC_BASE_URL = BASE

    const rules = robots().rules
    const firstRule = Array.isArray(rules) ? rules[0] : rules
    const disallow = firstRule?.disallow

    expect(disallow).toEqual(expect.arrayContaining([...REDDIT_TOOL_MARKETING_ROUTES]))
  })
})
