import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'

const homepageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')

describe('homepage public copy safety', () => {
  it('uses traveler-facing homepage metadata without Bókun-heavy wording', () => {
    expect(metadata.title).toBe('RadarScout | AI-guided Thailand Experience Planner')
    expect(metadata.description).toBe(
      'Plan Thailand experiences with guided discovery for elephant care, cooking, nature, family-friendly days, and trusted booking partner handoff.',
    )

    const metadataCopy = [
      metadata.title,
      metadata.description,
      metadata.openGraph?.title,
      metadata.openGraph?.description,
    ].join(' ')

    expect(metadataCopy).not.toMatch(/Bókun/i)
    expect(metadataCopy).not.toMatch(/DMC Portal/i)
    expect(metadataCopy).not.toMatch(/live availability/i)
    expect(metadataCopy).not.toMatch(/available now/i)
    expect(metadataCopy).not.toMatch(/instant confirmation/i)
    expect(metadataCopy).not.toMatch(/\bcheckout\b/i)
    expect(metadataCopy).not.toMatch(/\bpayment\b/i)
  })

  it('does not use available-now wording in visible FAQ copy', () => {
    expect(homepageSource).not.toMatch(/available now/i)
    expect(homepageSource).toContain('Is RadarScout a marketplace with every country currently shown?')
  })

  it('links to the Chiang Mai finder with safe guided-planner copy', () => {
    expect(homepageSource).toContain('href="/chiang-mai/elephant-camp-finder"')
    expect(homepageSource).toContain('Plan a Chiang Mai elephant day')
    expect(homepageSource).toContain('Plan with RadarScout')
    expect(homepageSource).toContain('guided planner')
    expect(homepageSource).toContain('compare experiences')
    expect(homepageSource).toContain('booking partner')
  })

  it('does not introduce forbidden booking or availability claims in homepage copy', () => {
    expect(homepageSource).not.toMatch(/Bókun/i)
    expect(homepageSource).not.toMatch(/DMC Portal/i)
    expect(homepageSource).not.toMatch(/live inventory/i)
    expect(homepageSource).not.toMatch(/live tours/i)
    expect(homepageSource).not.toMatch(/live availability/i)
    expect(homepageSource).not.toMatch(/available now/i)
    expect(homepageSource).not.toMatch(/instant confirmation/i)
    expect(homepageSource).not.toMatch(/\bcheckout\b/i)
    expect(homepageSource).not.toMatch(/\bpayment\b/i)
    expect(homepageSource).not.toMatch(/booking complete/i)
    expect(homepageSource).not.toMatch(/Bókun backend/i)
    expect(homepageSource).not.toMatch(/Bókun database/i)
    expect(homepageSource).not.toMatch(/Bókun-powered/i)
    expect(homepageSource).not.toMatch(/partner rate/i)
    expect(homepageSource).not.toMatch(/supplier net rate/i)
    expect(homepageSource).not.toMatch(/\bcommission\b/i)
  })
})
