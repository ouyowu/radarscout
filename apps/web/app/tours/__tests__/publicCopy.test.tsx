import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

import ToursMarketplacePreviewPage from '../page'
import TourDetailPage from '../[id]/page'

const FORBIDDEN_TOUR_COPY = [
  /live availability/i,
  /live inventory/i,
  /available now/i,
  /guaranteed slot/i,
  /instant confirmation/i,
  /\bcheckout\b/i,
  /\bpayment\b/i,
  /reservation complete/i,
  /Bókun/i,
  /Bokun/i,
  /Bókun-powered/i,
  /Bókun backend/i,
  /Bókun database/i,
  /Bókun supplier partner product database/i,
  /supplier net rate/i,
  /partner rate/i,
  /\bcommission\b/i,
  /supplier rates/i,
]

function expectSafeTourCopy(markup: string) {
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

    const element = await ToursMarketplacePreviewPage({
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
    expectSafeTourCopy(markup)
  })
})
