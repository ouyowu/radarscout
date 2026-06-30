import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key: string) => {
      if (key === 'x-forwarded-host' || key === 'host') return 'www.radarscout.io'
      if (key === 'x-forwarded-proto') return 'https'
      return null
    }),
  })),
}))

import ToursExperienceDiscoveryPage from '../page'
import TourDetailPage from '../[id]/page'

const FORBIDDEN_TOUR_COPY = [
  /supplier rates/i,
  /display-only/i,
  /\bpreview\b/i,
]

function expectSafeTourCopy(markup: string) {
  expectNoForbiddenPublicCopy(markup)

  for (const pattern of FORBIDDEN_TOUR_COPY) {
    expect(markup).not.toMatch(pattern)
  }
}

function mockFetchJson(payload: unknown) {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => payload,
  })))
}

describe('tour public copy safety', () => {
  beforeEach(() => {
    vi.stubGlobal('React', React)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders /tours without tourist-facing backend, rate, payment, or availability claims', async () => {
    mockFetchJson({
      products: [
        {
          id: 'tour_without_price',
          title: 'Chiang Mai Elephant Care',
          destination: 'Chiang Mai',
          summary: null,
          imageUrl: null,
          retailPrice: null,
          currency: null,
          tags: [],
          detailHref: '/tours/tour_without_price',
        },
      ],
      meta: {
        source: 'signed-bokun-supplier-products',
        inventoryScope: 'thailand-first',
        bookingEnabled: false,
        availabilityEnabled: false,
        count: 1,
      },
    })

    const element = await ToursExperienceDiscoveryPage({
      searchParams: { hasPrice: 'false' },
    })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Price not listed')
    expect(markup).toContain('trusted partner records')
    expect(markup).toContain('Plan with RadarScout')
    expectSafeTourCopy(markup)
  })

  it('renders /tours/{id} without tourist-facing backend, rate, payment, or availability claims', async () => {
    mockFetchJson({
      product: {
        id: 'tour_without_price',
        title: 'Chiang Mai Elephant Care',
        city: 'Chiang Mai',
        location: 'Mae Rim',
        destination: 'Thailand',
        imageUrl: null,
        summary: null,
        description: null,
        retailPrice: null,
        currency: null,
        detailHref: '/tours/tour_without_price',
        facts: {
          duration: null,
          meetingPoint: null,
          pickupAvailable: false,
          cancellationPolicy: null,
        },
        reviewedEnrichment: null,
      },
      meta: {
        source: 'signed-bokun-supplier-products',
        inventoryScope: 'thailand-first',
        bookingEnabled: false,
        availabilityEnabled: false,
        detailSupported: true,
      },
    })

    const element = await TourDetailPage({ params: { id: 'tour_without_price' } })
    const markup = renderToStaticMarkup(element)
    const normalizedMarkup = markup.toLowerCase()

    expect(markup).toContain('Price not listed')
    expect(normalizedMarkup).toContain('booking partner')
    expect(normalizedMarkup).toContain('trusted partner record')
    expect(markup).not.toContain('Check availability')
    expectSafeTourCopy(markup)
  })

  it('renders a verified product-specific booking partner handoff CTA on /tours/{id}', async () => {
    mockFetchJson({
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
      meta: {
        source: 'signed-bokun-supplier-products',
        inventoryScope: 'thailand-first',
        bookingEnabled: false,
        availabilityEnabled: false,
        detailSupported: true,
      },
    })

    const element = await TourDetailPage({ params: { id: 'tour_with_handoff' } })
    const markup = renderToStaticMarkup(element)

    expect(markup).toContain('Check availability')
    expect(markup).toContain('href="https://booking.example.com/experience/1232729"')
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('rel="nofollow sponsored noopener noreferrer"')
    expect(markup).toContain('Continue with a booking partner')
    expectSafeTourCopy(markup)
  })
})
