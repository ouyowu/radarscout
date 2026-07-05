import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const siteFooterSource = readFileSync(new URL('../_components/SiteFooter.tsx', import.meta.url), 'utf8')

describe('SiteFooter public copy safety', () => {
  it('uses RadarScout-owned supplier partnership mailto wording', () => {
    expect(siteFooterSource).toContain(
      'mailto:hello@radarscout.io?subject=RadarScout%20Supplier%20Partnership%20Inquiry',
    )
    expect(siteFooterSource).toContain('Supplier partners')
    expect(siteFooterSource).not.toMatch(/Bókun Supplier Partnership Inquiry/i)
  })

  it('keeps footer positioning aligned with guided discovery boundaries', () => {
    expect(siteFooterSource).toContain('AI-guided Thailand travel discovery with safe booking partner handoff.')
    expect(siteFooterSource).not.toMatch(/selected top destinations/i)
    expect(siteFooterSource).not.toMatch(/DMC Portal/i)
    expect(siteFooterSource).not.toMatch(/Bókun backend/i)
    expect(siteFooterSource).not.toMatch(/Bókun database/i)
    expect(siteFooterSource).not.toMatch(/Bókun-powered/i)
    expect(siteFooterSource).not.toMatch(/partner rate/i)
    expect(siteFooterSource).not.toMatch(/supplier net rate/i)
    expect(siteFooterSource).not.toMatch(/\bcommission\b/i)
    expect(siteFooterSource).not.toMatch(/live availability/i)
    expect(siteFooterSource).not.toMatch(/available now/i)
    expect(siteFooterSource).not.toMatch(/instant confirmation/i)
    expect(siteFooterSource).not.toMatch(/\bcheckout\b/i)
    expect(siteFooterSource).not.toMatch(/\bpayment\b/i)
  })
})
