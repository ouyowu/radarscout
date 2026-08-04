import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../../__tests__/publicSafetyPatterns'

vi.mock('server-only', () => ({}))

const catalogueMock = vi.hoisted(() => ({
  loadReviewedViatorPublicCatalogue: vi.fn(() => []),
}))

vi.mock('@/lib/viator/reviewedViatorPublicCatalogue', () => catalogueMock)

import {
  generateMetadata,
  generateStaticParams,
} from '../page'
import { cityHubSlugs } from '../../cityHubContent'

const BASE = 'https://www.radarscout.io'

describe('Thailand city SEO hubs', () => {
  it('publishes only the three reviewed launch cities', () => {
    expect(cityHubSlugs).toEqual(['bangkok', 'chiang-mai', 'phuket'])
    expect(generateStaticParams()).toEqual(cityHubSlugs.map(city => ({ city })))
  })

  it.each(cityHubSlugs)('uses a unique self-canonical and indexable metadata for %s', city => {
    const metadata = generateMetadata({ params: { city } })

    expect(metadata.alternates?.canonical).toBe(`${BASE}/thailand/${city}`)
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(metadata.title).toContain('Day Trips')
  })

  it('server-renders editorial review and schema content without gated client interaction', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../page.tsx'), 'utf8')

    expect(source).toContain('RadarScout Editorial Team')
    expect(source).toContain('How we review')
    expect(source).toContain("'WebPage'")
    expect(source).toContain("'BreadcrumbList'")
    expect(source).toContain('buildRadarScoutOrganization()')
    expect(source).toContain("author: { '@id': `${base}/#organization` }")
    expect(source).toContain("publisher: { '@id': `${base}/#organization` }")
    expect(source).toContain('city.brandEntityStatement')
    expect(source).toContain('href={`/guides/${params.city}`}')
    expect(source).not.toContain("'Offer'")
    expect(source).not.toContain("'AggregateRating'")
    expect(source).not.toMatch(/['"]use client['"]/)
    expectNoForbiddenPublicCopy(source)
  })
})
