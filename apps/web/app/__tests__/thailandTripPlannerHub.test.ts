import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from './publicSafetyPatterns'
import { metadata } from '../thailand-trip-planner/page'

const hubSource = readFileSync(
  new URL('../thailand-trip-planner/page.tsx', import.meta.url),
  'utf8',
)

describe('Thailand trip planner SEO hub', () => {
  it('owns the Thailand AI trip-planner search intent with honest indexable metadata', () => {
    expect(metadata.title).toBe(
      'AI Trip Planner Thailand Guide | Realistic Itineraries | RadarScout',
    )
    expect(metadata.description).toBe(
      'Looking for an AI trip planner for Thailand? Build a realistic route from reviewed day tours, local trade-offs, and trusted booking-partner handoffs.',
    )
    expect(metadata.alternates?.canonical).toBe(
      'https://www.radarscout.io/thailand-trip-planner',
    )
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
  })

  it('explains the planner honestly and links to the existing tool and reviewed inventory', () => {
    expect(hubSource).toContain('Plan a realistic Thailand trip')
    expect(hubSource).toContain('Looking for an AI trip planner for Thailand?')
    expect(hubSource).toContain('href="/planner"')
    expect(hubSource).toContain('href="/tours"')
    expect(hubSource).toContain('featuredViatorExperiences')
    expect(hubSource).toContain('Why RadarScout is different')
    expect(hubSource).toContain('Why recommended')
    expect(hubSource).toContain('Best for')
    expect(hubSource).toContain('What to check')
    expect(hubSource).toContain("href: '/thailand/bangkok'")
    expect(hubSource).toContain("href: '/thailand/chiang-mai'")
    expect(hubSource).toContain("href: '/thailand/phuket'")
    expect(hubSource).toContain('RadarScout Editorial Team')
  })

  it('uses original decision-support copy without unsafe commerce claims', () => {
    expectNoForbiddenPublicCopy(hubSource)
    expect(hubSource).not.toMatch(/\bcheapest\b|lowest price|best[- ]selling|sales rank/i)
    expect(hubSource).not.toContain('viatorUniqueContent')
    expect(hubSource).not.toContain('AggregateRating')
    expect(hubSource).not.toContain('"offers"')
  })

  it('publishes WebPage and breadcrumb semantics without invented product offers', () => {
    expect(hubSource).toContain("'@type': 'WebPage'")
    expect(hubSource).toContain("'@type': 'BreadcrumbList'")
    expect(hubSource).toContain('buildRadarScoutOrganization()')
    expect(hubSource).toContain('dateModified: editorialUpdatedAt')
    expect(hubSource).toContain("author: { '@id': `${base}/#organization` }")
    expect(hubSource).toContain("publisher: { '@id': `${base}/#organization` }")
    expect(hubSource).toContain('RadarScout&apos;s Thailand activity comparison')
    expect(hubSource).not.toContain("'@type': 'Product'")
    expect(hubSource).not.toContain("'@type': 'Offer'")
  })
})
