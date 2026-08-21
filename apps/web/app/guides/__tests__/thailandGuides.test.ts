import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'

// The stay-area guides render a server-only Agoda offer builder.
vi.mock('server-only', () => ({}))

import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'
import { AGODA_AREA_CITY_NAMES } from '@/lib/affiliates/agodaAreaRecommendations'
import { reviewedAgodaAreaRecommendations } from '@/lib/affiliates/seed/reviewedAgodaAreas'
import {
  guideCitySlugs,
  thailandGuideArticles,
} from '@/lib/guides/thailandGuides'
import { metadata as guidesHubMetadata } from '../page'
import {
  generateMetadata as generateGuideCityMetadata,
  generateStaticParams as generateGuideCityParams,
} from '../[city]/page'
import {
  generateMetadata as generateArticleMetadata,
  generateStaticParams as generateArticleParams,
} from '../[city]/[slug]/page'

const BASE = 'https://www.radarscout.io'
const guideSources = [
  fs.readFileSync(path.resolve(__dirname, '../page.tsx'), 'utf8'),
  fs.readFileSync(path.resolve(__dirname, '../[city]/page.tsx'), 'utf8'),
  fs.readFileSync(path.resolve(__dirname, '../[city]/[slug]/page.tsx'), 'utf8'),
  fs.readFileSync(path.resolve(__dirname, '../../../lib/guides/thailandGuides.ts'), 'utf8'),
].join('\n')

describe('Thailand travel guides editorial catalogue', () => {
  it('publishes the reviewed original guide catalogue for approved cities', () => {
    expect(guideCitySlugs).toEqual(['bangkok', 'chiang-mai', 'phuket'])
    expect(thailandGuideArticles).toHaveLength(11)
    expect(thailandGuideArticles.filter(article => article.citySlug === 'chiang-mai')).toHaveLength(5)
    expect(thailandGuideArticles.filter(article => article.citySlug === 'bangkok')).toHaveLength(3)
    expect(thailandGuideArticles.filter(article => article.citySlug === 'phuket')).toHaveLength(3)

    expect(thailandGuideArticles.map(article => article.slug)).toEqual(
      expect.arrayContaining([
        'ayutthaya-vs-floating-market-day-trip',
        'doi-inthanon-vs-chiang-rai-day-trip',
        'old-town-vs-island-day',
        'food-tour-vs-temple-day',
        'old-city-vs-nimman-where-to-stay',
        'private-vs-shared-island-tour',
        'best-elephant-sanctuary-for-kids',
        'doi-inthanon-vs-elephant-sanctuary',
      ]),
    )

    const canonicalUrls = thailandGuideArticles.map(article => article.canonicalUrl)
    expect(new Set(canonicalUrls).size).toBe(canonicalUrls.length)

    for (const article of thailandGuideArticles) {
      expect(article.canonicalUrl).toBe(`${BASE}${article.href}`)
      expect(article.author.name).toBe('RadarScout Editorial Team')
      expect(article.reviewedBy).toBe('RadarScout Thailand desk')
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.sections.length).toBeGreaterThanOrEqual(4)
      expect(article.reviewMethod.length).toBeGreaterThan(80)
    }
  })

  it('publishes self-canonical, indexable metadata for the hub, cities, and articles', () => {
    expect(guidesHubMetadata.alternates?.canonical).toBe(`${BASE}/guides`)
    expect(guidesHubMetadata.robots).toMatchObject({ index: true, follow: true })
    expect(generateGuideCityParams()).toEqual(guideCitySlugs.map(city => ({ city })))
    expect(generateArticleParams()).toEqual(
      thailandGuideArticles.map(article => ({ city: article.citySlug, slug: article.slug })),
    )

    for (const city of guideCitySlugs) {
      const metadata = generateGuideCityMetadata({ params: { city } })
      expect(metadata.alternates?.canonical).toBe(`${BASE}/guides/${city}`)
      expect(metadata.robots).toMatchObject({ index: true, follow: true })
    }

    for (const article of thailandGuideArticles) {
      const metadata = generateArticleMetadata({
        params: { city: article.citySlug, slug: article.slug },
      })
      expect(metadata.alternates?.canonical).toBe(article.canonicalUrl)
      expect(metadata.robots).toMatchObject({ index: true, follow: true })
      expect(metadata.authors).toEqual([
        { name: article.author.name, url: `${BASE}${article.author.href}` },
      ])
    }
  })

  it('server-renders Article and Breadcrumb schema with transparent editorial review', () => {
    expect(guideSources).toContain("'Article'")
    expect(guideSources).toContain("'CollectionPage'")
    expect(guideSources).toContain("'BreadcrumbList'")
    expect(guideSources).toContain("'Organization'")
    expect(guideSources).toContain('datePublished: article.publishedAt')
    expect(guideSources).toContain('dateModified: article.updatedAt')
    expect(guideSources).toContain('Editorial review and sources')
    expect(guideSources).toContain('How RadarScout reviews guides')
    expect(guideSources).not.toContain("'Offer'")
    expect(guideSources).not.toContain("'AggregateRating'")
    expect(guideSources).not.toMatch(/['"]use client['"]/)
    expectNoForbiddenPublicCopy(guideSources)
  })

  it('offers reviewed Agoda stay areas only on stay-area guides', () => {
    const stayGuides = thailandGuideArticles.filter(article => article.stayAreaCitySlug)
    const otherGuides = thailandGuideArticles.filter(article => !article.stayAreaCitySlug)

    // The two stay-area decision guides are the ones whose reader is choosing
    // where to book, so they carry the accommodation handoff.
    expect(stayGuides.map(article => article.slug).sort()).toEqual([
      'best-areas-to-stay-first-time-visitors',
      'old-city-vs-nimman-where-to-stay',
    ])

    // Each flagged guide must point at a city that actually has reviewed areas,
    // otherwise the panel would render empty.
    for (const article of stayGuides) {
      const cityName = AGODA_AREA_CITY_NAMES[article.stayAreaCitySlug!]
      expect(
        reviewedAgodaAreaRecommendations.some(area => area.city === cityName),
      ).toBe(true)
    }

    // Guides about activities, not lodging, stay free of an accommodation CTA.
    expect(otherGuides.length).toBeGreaterThan(0)

    const articleSource = fs.readFileSync(
      path.resolve(__dirname, '../[city]/[slug]/page.tsx'),
      'utf8',
    )
    expect(articleSource).toContain('article.stayAreaCitySlug ?')
    // No invented dates or occupancy: a guide reader has no confirmed trip.
    expect(articleSource).toContain('startDate: null')
    expect(articleSource).toContain('adultCount: null')
  })
})
