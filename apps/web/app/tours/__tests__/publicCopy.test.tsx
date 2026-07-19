import React from 'react'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

vi.mock('server-only', () => ({}))

const productLoaderMock = vi.hoisted(() => ({
  getPublicThailandProduct: vi.fn(),
  loadPublicThailandProductDetail: vi.fn(),
}))

vi.mock('@/lib/publicProducts/getPublicThailandProduct', () => productLoaderMock)

import ToursExperienceDiscoveryPage from '../page'
import TourDetailPage from '../[id]/page'

const toursSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')

const FORBIDDEN_TOUR_COPY = [
  /supplier rates/i,
  /display-only/i,
  /\bpreview\b/i,
  /\bdatabase\b/i,
  /\bbackend\b/i,
]

function expectSafeTourCopy(markup: string) {
  expectNoForbiddenPublicCopy(markup)

  for (const pattern of FORBIDDEN_TOUR_COPY) {
    expect(markup).not.toMatch(pattern)
  }
}

function makeTourDetailProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tour_state_test',
    title: 'Chiang Mai Elephant Care',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    destination: 'Thailand',
    imageUrl: null,
    summary: null,
    description: null,
    retailPrice: null,
    currency: null,
    detailHref: '/tours/tour_state_test',
    facts: {
      duration: null,
      meetingPoint: null,
      pickupAvailable: false,
      cancellationPolicy: null,
    },
    reviewedEnrichment: null,
    ...overrides,
  }
}

describe('tour public copy safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('React', React)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the first 12 reviewed Viator products with safe copy and pagination', async () => {
    const element = await ToursExperienceDiscoveryPage({})
    const markup = renderToStaticMarkup(element)

    expect((markup.match(/Review details before partner handoff/g) ?? [])).toHaveLength(12)
    expect(markup).toContain('/tours/viator_')
    expect(markup).toContain('105 reviewed experiences')
    expect(markup).toContain('Page 1 of 9')
    expect(markup).toContain('aria-label="Next catalogue page"')
    expect(markup).toContain('page=2')
    expect(markup).not.toContain('Price not listed')
    expect(markup).not.toContain('All prices')
    expect(markup).not.toContain('Has price')
    expect(markup).toContain('reviewed Viator experience records')
    expect(markup).toContain('Plan my day')
    expect((markup.match(/Why recommended/g) ?? [])).toHaveLength(12)
    expect((markup.match(/Best for/g) ?? [])).toHaveLength(12)
    expect((markup.match(/Before you choose/g) ?? [])).toHaveLength(12)
    expect(markup).toContain('Why are some cities not shown yet?')
    expect(markup).toContain('Coverage expands city by city')
    expect(markup).not.toContain('partner_cm_')
    expect(markup).not.toContain('Bókun')
    expect(markup).not.toContain('Japan, France, and other selected destinations remain planning-only.')
    expect(markup).not.toContain('More selected high-demand destinations will be added')
    expect(markup).not.toContain('Can I compare tours from every destination on this page?')
    expect(markup).not.toContain('does not claim current product coverage for every destination')
    expect((markup.match(/<h1/g) ?? [])).toHaveLength(1)
    expect(markup).toContain('aria-label="Main navigation"')
    expect(markup).toContain('aria-label="Footer navigation"')
    expectSafeTourCopy(markup)
  })

  it('filters all reviewed cities and keeps later catalogue pages reachable', async () => {
    const element = await ToursExperienceDiscoveryPage({
      searchParams: { city: 'phuket', page: '2' },
    })
    const markup = renderToStaticMarkup(element)

    expect((markup.match(/Review details before partner handoff/g) ?? [])).toHaveLength(4)
    expect(markup).toContain('16 reviewed experiences')
    expect(markup).toContain('Page 2 of 2')
    expect(markup).toContain('Ko Pha Ngan')
    expect(markup).toContain('Chiang Rai')
    expect(markup).toContain('Hua Hin')
    expect(markup).toContain('city=phuket')
    expect(markup).not.toContain('partner_cm_')
    expect(markup).not.toContain('Plan with AI')
    expect(markup.indexOf('City')).toBeLessThan(markup.indexOf('Explore by interest'))
    expectSafeTourCopy(markup)
  })

  it('uses the shared reviewed Viator catalogue directly instead of a legacy self-fetch', () => {
    expect(toursSource).toContain('loadReviewedViatorPublicCatalogue')
    expect(toursSource).toContain('listReviewedViatorPublicCatalogueCities')
    expect(toursSource).toContain('paginateReviewedViatorPublicCatalogue')
    expect(toursSource).not.toContain('/api/products')
    expect(toursSource).not.toContain('signed-bokun-supplier-products')
    expect(toursSource).not.toContain('pilotPartnerProducts')
    expect(toursSource).not.toContain('next/headers')
  })

  it('renders /tours/{id} without tourist-facing backend, rate, payment, or availability claims', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: {
        id: 'tour_without_price',
        title: 'Chiang Mai Elephant Care',
        city: 'Chiang Mai',
        location: 'Mae Rim',
        destination: 'Thailand',
        imageUrl: null,
        summary: null,
        description: null,
        retailPrice: '1200',
        currency: 'THB',
        detailHref: '/tours/tour_without_price',
        facts: {
          duration: null,
          meetingPoint: null,
          pickupAvailable: false,
          cancellationPolicy: null,
        },
        reviewedEnrichment: null,
      },
    })

    const element = await TourDetailPage({ params: { id: 'tour_without_price' } })
    const markup = renderToStaticMarkup(element)
    const normalizedMarkup = markup.toLowerCase()

    expect(markup).not.toContain('THB 1200')
    expect(markup).not.toContain('Prices are shown')
    expect(normalizedMarkup).toContain('booking partner')
    expect(normalizedMarkup).toContain('trusted partner record')
    expect(markup).toContain('Planning-only detail')
    expect(markup).toContain('Why recommended')
    expect(markup).toContain('Best for')
    expect(markup).toContain('Before you choose')
    expect(markup).toContain('verified booking partner handoff is not available yet')
    expect(markup).toContain('Use this page for planning and compare other experiences with verified handoff options')
    expect(markup).not.toContain('Trip Planner context')
    expect(markup).not.toContain('Check availability')
    expect(markup).toContain('aria-label="Main navigation"')
    expect(markup).toContain('aria-label="Footer navigation"')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('renders a verified product-specific booking partner handoff CTA on /tours/{id}', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: {
        id: 'tour_with_handoff',
        title: 'Chiang Mai Elephant Care',
        city: 'Chiang Mai',
        location: 'Mae Rim',
        destination: 'Thailand',
        imageUrl: null,
        summary: null,
        description: null,
        retailPrice: null,
        currency: null,
        detailHref: '/tours/tour_with_handoff',
        facts: {
          duration: null,
          meetingPoint: null,
          pickupAvailable: false,
          cancellationPolicy: null,
        },
        reviewedEnrichment: null,
        bookingPartnerHandoff: {
          href: 'https://booking.example.com/experience/1232729',
          label: 'Check availability',
          rel: 'nofollow sponsored noopener noreferrer',
          source: 'owner_managed_profile',
          verifiedBy: 'owner_managed_catalog',
        },
      },
    })

    const element = await TourDetailPage({ params: { id: 'tour_with_handoff' } })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Check availability')
    expect(markup).toContain('href="https://booking.example.com/experience/1232729"')
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('rel="nofollow sponsored noopener noreferrer"')
    expect(markup).toContain('Continue with a booking partner')
    expect((markup.match(/<h1/g) ?? [])).toHaveLength(1)
    expect(markup.indexOf('Check availability')).toBeLessThan(markup.indexOf('Planning boundary'))
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('renders safe trip planner return context when source is ai-trip-planner', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: {
        id: 'tour_from_ai_planner',
        title: 'Chiang Mai Elephant Care',
        city: 'Chiang Mai',
        location: 'Mae Rim',
        destination: 'Thailand',
        imageUrl: null,
        summary: null,
        description: null,
        retailPrice: null,
        currency: null,
        detailHref: '/tours/tour_from_ai_planner',
        facts: {
          duration: null,
          meetingPoint: null,
          pickupAvailable: false,
          cancellationPolicy: null,
        },
        reviewedEnrichment: null,
      },
    })

    const element = await TourDetailPage({
      params: { id: 'tour_from_ai_planner' },
      searchParams: { source: 'ai-trip-planner' },
    })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Trip Planner context')
    expect(markup).toContain('Back to Trip Planner results')
    expect(markup).toContain('You opened this product from RadarScout&#x27;s Trip Planner')
    expect(markup).toContain('return to compare the other planner matches')
    expect(markup).toContain('The return link takes you back to the same Trip Planner results section')
    expect(markup).toContain('No partner action or current status is recorded on this page')
    expect(markup).toContain('href="/ai-trip-planner#ai-trip-results"')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('keeps the trip planner return path when a sourced tour detail is unavailable', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'not-found',
    })

    const element = await TourDetailPage({
      params: { id: 'missing_from_ai_planner' },
      searchParams: { source: 'ai-trip-planner' },
    })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('This product detail is not available.')
    expect(markup).toContain('Return to the Trip Planner results to compare the other matches')
    expect(markup).toContain('No partner action or current status is recorded from this unavailable detail page')
    expect(markup).toContain('Back to Trip Planner results')
    expect(markup).toContain('href="/ai-trip-planner#ai-trip-results"')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('State A renders only a verified booking partner handoff CTA', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: makeTourDetailProduct({
        bookingPartnerHandoff: {
          href: 'https://booking.example.com/experience/1232729',
          label: 'Check availability',
          rel: 'nofollow sponsored noopener noreferrer',
          source: 'owner_managed_profile',
          verifiedBy: 'owner_managed_catalog',
        },
      }),
    })

    const element = await TourDetailPage({ params: { id: 'tour_state_a' } })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Check availability')
    expect(markup).toContain('href="https://booking.example.com/experience/1232729"')
    expect(markup).toContain('rel="nofollow sponsored noopener noreferrer"')
    expect(markup).toContain('Handoff boundary')
    expect(markup).toContain('Compare details before continuing.')
    expect(markup).toContain('Continue with a booking partner')
    expect(markup).toContain('This page does not create a traveler request or order')
    expect(markup).not.toContain('Planning-only detail')
    expect(markup).not.toContain('verified booking partner handoff is not available yet')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('State B renders planning-only fallback copy without Check availability', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: makeTourDetailProduct(),
    })

    const element = await TourDetailPage({ params: { id: 'tour_state_b' } })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Planning-only detail')
    expect(markup).toContain('verified booking partner handoff is not available yet')
    expect(markup).toContain('Use this page for planning and compare other experiences with verified handoff options')
    expect(markup).not.toContain('Check availability')
    expect(markup).not.toContain('href="https://booking.example.com')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })

  it('State C renders unavailable copy without a booking partner CTA', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'not-found',
    })

    const element = await TourDetailPage({ params: { id: 'tour_state_c' } })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('This product detail is not available.')
    expect(markup).toContain('Back to tours')
    expect(markup).not.toContain('Check availability')
    expect(markup).not.toContain('Continue with a booking partner')
    expect(fetchMock).not.toHaveBeenCalled()
    expectSafeTourCopy(markup)
  })
})
