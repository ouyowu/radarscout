import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { globalDestinations } from '@/lib/global-destinations'
import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
} from '@/lib/viator/reviewedViatorPublicCatalogue'
import { metadata } from '../page'
import { reviewedDestinationCoverage } from '../reviewedDestinationCoverage'

const destinationsPageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const destinationDetailSource = readFileSync(new URL('../[slug]/page.tsx', import.meta.url), 'utf8')

describe('destination scope positioning', () => {
  it('keeps Thailand as the only focused destination with product coverage', () => {
    const focused = globalDestinations.filter(destination => destination.hasLiveInventory)
    const planningOnly = globalDestinations.filter(destination => !destination.hasLiveInventory)

    expect(focused.map(destination => destination.slug)).toEqual(['thailand'])
    expect(planningOnly.length).toBeGreaterThan(0)
    expect(planningOnly.every(destination => destination.comingSoon)).toBe(true)
  })

  it('turns the destination portal into a reviewed Thailand city hub', () => {
    const products = loadReviewedViatorPublicCatalogue()
    const cities = listReviewedViatorPublicCatalogueCities()
    const featuredSlugs = reviewedDestinationCoverage.cities
      .slice(0, 6)
      .map((city) => city.slug)

    expect(metadata.title).toBe('Thailand Destinations | RadarScout Day-Trip Planner')
    expect(metadata.description).toContain('reviewed Thailand day trips')
    expect(reviewedDestinationCoverage.productCount).toBe(products.length)
    expect(reviewedDestinationCoverage.cityCount).toBe(cities.length)
    expect(featuredSlugs).toEqual([
      'bangkok',
      'chiang-mai',
      'phuket',
      'pattaya',
      'krabi',
      'koh-samui',
    ])
    expect(reviewedDestinationCoverage.cities.find((city) => city.slug === 'bangkok')?.href)
      .toBe('/tours?city=bangkok')
    expect(destinationsPageSource).toContain('Choose a Thailand city. Start with experiences already reviewed.')
    expect(destinationsPageSource).toContain('Why RadarScout narrowed it down')
    expect(destinationsPageSource).toContain('Who the experience suits')
    expect(destinationsPageSource).toContain('What to check before choosing')

    expect(destinationsPageSource).not.toContain('selected top travel destinations')
    expect(destinationsPageSource).not.toContain('high-demand travel countries')
    expect(destinationsPageSource).not.toContain('Selected travel countries')
    expect(destinationsPageSource).not.toContain('Planning guides for future partner coverage.')
    expect(destinationsPageSource).not.toContain('SupplierPartnerCTA')
    expect(destinationsPageSource).not.toContain('comingSoonDestinations')
  })

  it('keeps non-Thailand destination detail pages clearly planning-only', () => {
    expect(destinationDetailSource).toContain('Travel Planning Guide | Planning-Only')
    expect(destinationDetailSource).toContain('planning-only destination while RadarScout onboards trusted local suppliers')
    expect(destinationDetailSource).toContain('planning-only route guide')
    expect(destinationDetailSource).toContain('product recommendations stay off until trusted local supplier coverage is reviewed')
    expect(destinationDetailSource).toContain('Planning only — partner tours are coming soon')
    expect(destinationDetailSource).toContain('do not display unsupported products or affiliate links')
  })

  it('adds the reviewed city activity handoff only to Thailand', () => {
    expect(destinationDetailSource).toContain("destination.slug === 'thailand' ? <CityActivityPartnerLinks /> : null")
    expect(destinationDetailSource).toContain('clearly marked affiliate links as optional comparison handoffs')
  })
})
