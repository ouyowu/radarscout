import { describe, expect, it } from 'vitest'
import {
  ELEPHANT_FINDER_HANDOFF_COPY,
  ELEPHANT_FINDER_HERO_COPY,
  ELEPHANT_FINDER_INTRO_COPY,
  ELEPHANT_FINDER_PROMPT_CHIPS,
} from '../copy'
import { metadata } from '../page'

describe('Chiang Mai elephant camp finder metadata', () => {
  it('uses a clean string browser title', () => {
    expect(metadata.title).toBe('Find the right Chiang Mai experience | RadarScout')
    expect(String(metadata.title)).not.toContain('[object Object]')
  })

  it('uses a safe SEO-ready description while robots remain closed', () => {
    expect(metadata.description).toBe(
      'Compare Chiang Mai elephant care, cooking, nature, and family-friendly experiences with a guided planner. RadarScout helps you choose a fit, then continue with a booking partner.',
    )

    const description = String(metadata.description)
    expect(description).not.toMatch(/live availability/i)
    expect(description).not.toMatch(/available now/i)
    expect(description).not.toMatch(/instant confirmation/i)
    expect(description).not.toMatch(/\bcheckout\b/i)
    expect(description).not.toMatch(/\bpayment\b/i)
    expect(description).not.toMatch(/booking complete/i)
    expect(description).not.toMatch(/Bókun backend/i)
    expect(description).not.toMatch(/Bókun database/i)
    expect(description).not.toMatch(/Bókun-powered/i)
    expect(description).not.toMatch(/partner rate/i)
    expect(description).not.toMatch(/supplier net rate/i)
    expect(description).not.toMatch(/\bcommission\b/i)
  })

  it('opens the finder metadata for the controlled Chiang Mai SEO candidate', () => {
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
  })

  it('publishes honest page-specific social metadata', () => {
    const title = 'Find the right Chiang Mai experience | RadarScout'
    const description =
      'Compare Chiang Mai elephant care, cooking, nature, and family-friendly experiences with a guided planner. RadarScout helps you choose a fit, then continue with a booking partner.'

    expect(metadata.openGraph).toMatchObject({
      title,
      description,
      type: 'website',
      url: 'https://www.radarscout.io/chiang-mai/elephant-camp-finder',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'RadarScout Thailand Experience Planner' }],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: '/opengraph-image', alt: 'RadarScout Thailand Experience Planner' }],
    })

    const socialCopy = JSON.stringify({ openGraph: metadata.openGraph, twitter: metadata.twitter })
    expect(socialCopy).not.toMatch(/AI concierge/i)
    expect(socialCopy).not.toMatch(/live availability|available now|instant confirmation|checkout|payment/i)
  })

  it('does not expose forbidden live availability copy in the public intro', () => {
    const publicCopy = [
      ELEPHANT_FINDER_HERO_COPY,
      ELEPHANT_FINDER_INTRO_COPY,
      ELEPHANT_FINDER_HANDOFF_COPY,
      ...ELEPHANT_FINDER_PROMPT_CHIPS,
    ].join(' ')

    expect(publicCopy).not.toMatch(/live slots/i)
    expect(publicCopy).not.toMatch(/live availability/i)
    expect(publicCopy).not.toMatch(/available now/i)
    expect(publicCopy).not.toMatch(/guaranteed slot/i)
    expect(publicCopy).not.toMatch(/instant confirmation/i)
    expect(publicCopy).not.toMatch(/\bcheckout\b/i)
    expect(publicCopy).not.toMatch(/\bpayment\b/i)
    expect(publicCopy).not.toMatch(/partner rate/i)
    expect(publicCopy).not.toMatch(/supplier net rate/i)
    expect(publicCopy).not.toMatch(/\bcommission\b/i)
    expect(publicCopy).not.toMatch(/\brating\b/i)
    expect(publicCopy).not.toMatch(/\breviews\b/i)
  })

  it('exposes lightweight prompt chips for planning inspiration', () => {
    expect(ELEPHANT_FINDER_PROMPT_CHIPS).toEqual([
      'Gentle elephant day',
      'Family-friendly half day',
      'Cooking + local food',
      'Nature day trip',
      'Low-intensity experience',
    ])
  })

  it('keeps public handoff copy within RadarScout discovery boundaries', () => {
    expect(ELEPHANT_FINDER_HANDOFF_COPY).toBe(
      'RadarScout helps you compare experiences. Final availability and booking details are handled by the booking partner.',
    )
    expect(ELEPHANT_FINDER_HANDOFF_COPY).not.toMatch(/Bókun backend/i)
    expect(ELEPHANT_FINDER_HANDOFF_COPY).not.toMatch(/Bókun-powered/i)
  })
})
