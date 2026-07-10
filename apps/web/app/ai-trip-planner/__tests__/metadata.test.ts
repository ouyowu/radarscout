import { describe, expect, it } from 'vitest'

import { metadata } from '../page'

describe('AI trip planner metadata', () => {
  it('keeps the preview planner closed to indexing while product matching is still guarded', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('keeps the canonical URL on the AI trip planner route', () => {
    expect(metadata.alternates).toMatchObject({
      canonical: 'https://www.radarscout.io/ai-trip-planner',
    })
  })

  it('publishes honest page-specific social metadata with the self-hosted share card', () => {
    expect(metadata.openGraph).toMatchObject({
      title: 'Thailand Trip Planner | RadarScout',
      type: 'website',
      url: 'https://www.radarscout.io/ai-trip-planner',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'RadarScout Thailand Experience Planner' }],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Thailand Trip Planner | RadarScout',
      images: [{ url: '/opengraph-image', alt: 'RadarScout Thailand Experience Planner' }],
    })

    const socialCopy = JSON.stringify({ openGraph: metadata.openGraph, twitter: metadata.twitter })
    expect(socialCopy).not.toMatch(/AI concierge|live availability|instant confirmation|checkout|payment/i)
  })
})
