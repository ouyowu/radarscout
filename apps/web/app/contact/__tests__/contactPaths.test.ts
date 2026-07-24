import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'

const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')

describe('RadarScout contact paths', () => {
  it('offers real contact paths for travelers and partners', () => {
    expect(metadata.title).toBe('Contact RadarScout | Travel Feedback and Partnerships')
    expect(source).toContain('Traveler feedback')
    expect(source).toContain('Affiliate and content partners')
    expect(source).toContain('mailto:hello@radarscout.io')
    expect(source).toContain('RadarScout%20traveler%20feedback')
    expect(source).toContain('RadarScout%20partnership%20inquiry')
  })

  it('does not pretend to accept a message through an unhandled form', () => {
    expect(source).not.toContain('<form')
    expect(source).not.toContain('Send Message')
    expect(source).not.toContain('type="submit"')
  })

  it('routes transaction support back to the booking partner', () => {
    expect(source).toContain('Booking, payment, change, or cancellation')
    expect(source).toContain('Contact the platform that handled the transaction')
    expect(source).toContain('RadarScout does not access partner booking records')
  })
})
