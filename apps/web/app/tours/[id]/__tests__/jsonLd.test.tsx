import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({ get: vi.fn(() => null) })),
}))

const productLoaderMock = vi.hoisted(() => ({
  getPublicThailandProduct: vi.fn(),
  loadPublicThailandProductDetail: vi.fn(),
}))

vi.mock('@/lib/publicProducts/getPublicThailandProduct', () => productLoaderMock)

import TourDetailPage from '../page'

function product(id: string) {
  return {
    id,
    title: `Tour ${id}`,
    city: 'Bangkok',
    location: 'Bangkok',
    destination: 'Bangkok',
    imageUrl: null,
    summary: 'A reviewed Bangkok night tour.',
    description: null,
    retailPrice: '89.00',
    currency: 'USD',
    detailHref: `/tours/${id}`,
    facts: {
      duration: null,
      meetingPoint: null,
      pickupAvailable: false,
      cancellationPolicy: null,
    },
    reviewedEnrichment: {
      cleanedTitle: `Tour ${id}`,
      shortSummary: 'A reviewed Bangkok night tour.',
      suggestedTags: ['food', 'night'],
      reviewedBy: 'operator_manual_review',
      reviewedAt: '2026-07-16T00:00:00.000Z',
    },
  }
}

describe('tour detail JSON-LD rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('React', React)
    process.env.NEXT_PUBLIC_BASE_URL = 'https://www.radarscout.io'
  })

  it('renders JSON-LD for an allowlisted product without rating, review, or price', async () => {
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: product('viator_6467bkknight'),
    })

    const markup = renderToStaticMarkup(await TourDetailPage({ params: { id: 'viator_6467bkknight' } }))
    const jsonLd = markup.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? ''

    expect(jsonLd).toContain('TouristTrip')
    expect(jsonLd).toContain('https://www.radarscout.io/thailand/bangkok')
    expect(jsonLd).not.toContain('aggregateRating')
    expect(jsonLd).not.toContain('"review"')
    expect(jsonLd).not.toContain('offers')
    expect(jsonLd).not.toContain('89.00')
    expect(jsonLd).not.toContain('price')
    expect(markup).not.toContain('89.00')
  })

  it('does not render JSON-LD for a noindex product', async () => {
    productLoaderMock.loadPublicThailandProductDetail.mockResolvedValue({
      status: 'found',
      product: product('prod_not_indexed'),
    })

    const markup = renderToStaticMarkup(await TourDetailPage({ params: { id: 'prod_not_indexed' } }))

    expect(markup).toContain('Tour prod_not_indexed')
    expect(markup).not.toContain('application/ld+json')
    expect(markup).not.toContain('TouristTrip')
    expect(markup).not.toContain('aggregateRating')
  })
})
