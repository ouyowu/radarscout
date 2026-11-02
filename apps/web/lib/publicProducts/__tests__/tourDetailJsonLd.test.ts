import { describe, expect, it } from 'vitest'
import { loadReviewedViatorProducts } from '@/lib/viator/reviewedViatorProducts'
import { tourDetailSeoCandidates } from '../tourDetailSeoCandidates'
import { buildTourDetailJsonLd } from '../tourDetailJsonLd'

const SITE = 'https://www.radarscout.io'

function reviewedInput(id: string) {
  const product = loadReviewedViatorProducts().find(candidate => candidate.id === id)
  if (!product) throw new Error(`Missing reviewed product ${id}`)

  return {
    id: product.id,
    title: product.title,
    city: product.city,
    summary: product.shortSummary,
    reviewedEnrichment: {
      cleanedTitle: product.title,
      shortSummary: product.shortSummary,
      suggestedTags: product.tags,
    },
    supplierName: null,
  }
}

describe('tour detail JSON-LD', () => {
  it('emits breadcrumb and TouristTrip data only for the six SEO candidates', () => {
    expect(tourDetailSeoCandidates).toHaveLength(6)

    for (const candidate of tourDetailSeoCandidates) {
      const product = reviewedInput(candidate.publicProductId)
      const jsonLd = buildTourDetailJsonLd(product, SITE)
      const serialized = JSON.stringify(jsonLd)

      expect(jsonLd, candidate.publicProductId).toMatchObject({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: product.city,
                item: `${SITE}/thailand/${product.city.toLowerCase().replaceAll(' ', '-')}`,
              },
              { '@type': 'ListItem', position: 3, name: product.title },
            ],
          },
          {
            '@type': 'TouristTrip',
            name: product.title,
            description: product.summary,
            touristType: [...product.reviewedEnrichment.suggestedTags],
            url: `${SITE}/tours/${product.id}`,
          },
        ],
      })
      expect(serialized).not.toContain('aggregateRating')
      expect(serialized).not.toContain('"review"')
      expect(serialized).not.toContain('offers')
      expect(serialized).not.toContain('price')
      expect(serialized).not.toContain('provider')
    }
  })

  it('does not emit JSON-LD for a noindex product', () => {
    expect(buildTourDetailJsonLd({
      id: 'prod_cm_1',
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A reviewed day.',
      reviewedEnrichment: {
        cleanedTitle: 'Chiang Mai Elephant Sanctuary',
        shortSummary: 'A reviewed day.',
        suggestedTags: ['nature'],
      },
    }, SITE)).toBeNull()
  })

  it('omits missing reviewed fields instead of inventing them', () => {
    const jsonLd = buildTourDetailJsonLd({
      id: 'viator_6467bkknight',
      title: 'Bangkok by Night',
      city: 'Unknown City',
      summary: '   ',
      reviewedEnrichment: {
        cleanedTitle: '  ',
        shortSummary: '',
        suggestedTags: [' ', ''],
      },
      supplierName: '   ',
    }, SITE)

    const trip = (jsonLd?.['@graph'] as Record<string, unknown>[])[1]
    const crumbs = (jsonLd?.['@graph'] as { itemListElement: { name: string }[] }[])[0].itemListElement

    expect(trip.name).toBe('Bangkok by Night')
    expect(trip).not.toHaveProperty('description')
    expect(trip).not.toHaveProperty('touristType')
    expect(trip).not.toHaveProperty('provider')
    expect(crumbs.map(item => item.name)).toEqual(['Home', 'Bangkok by Night'])
  })

  it('includes a provider only when reviewed data has a supplier name', () => {
    const jsonLd = buildTourDetailJsonLd({
      ...reviewedInput('viator_44720p2'),
      supplierName: 'Reviewed Local Operator',
    }, SITE)
    const trip = (jsonLd?.['@graph'] as Record<string, unknown>[])[1]

    expect(trip.provider).toEqual({
      '@type': 'Organization',
      name: 'Reviewed Local Operator',
    })
    expect(JSON.stringify(jsonLd)).not.toContain('aggregateRating')
  })
})
