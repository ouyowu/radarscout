import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'
import { expectNoForbiddenPublicCopy } from './publicSafetyPatterns'

const homepageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const homepageVisibleCopySources = [
  homepageSource,
  readFileSync(new URL('../_components/AdventureHero.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/PartnerInventoryNotice.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/SupplierPartnerCTA.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../../lib/global-destinations.ts', import.meta.url), 'utf8'),
].join('\n')

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

  it('links to the AI trip planner with safe planning-first copy', () => {
    expect(homepageSource).toContain("href: '/ai-trip-planner'")
    expect(homepageSource).toContain('Start planning with AI')
    expect(homepageSource).toContain('AI-guided Thailand Experience Planner')
    expect(homepageSource).toContain('trusted booking partner handoff')
  })

  it('positions the homepage destination rollout as Thailand-first', () => {
    expect(homepageSource).toContain('Thailand-first rollout')
    expect(homepageSource).toContain('Thailand is live first. Other destinations stay planning-only.')
    expect(homepageSource).toContain('Thailand first, then selected destinations')
    expect(homepageSource).toContain('current product coverage on Thailand experiences')
    expect(homepageSource).not.toContain('Selected top travel destinations, not worldwide noise.')
  })

  it('links to the Chiang Mai finder with safe guided-planner copy', () => {
    expect(homepageSource).toContain('href="/chiang-mai/elephant-camp-finder"')
    expect(homepageSource).toContain('Plan a Chiang Mai elephant day')
    expect(homepageSource).toContain('Plan with RadarScout')
    expect(homepageSource).toContain('guided planner')
    expect(homepageSource).toContain('compare experiences')
    expect(homepageSource).toContain('booking partner')
  })

  it('keeps homepage AI planning use cases focused on Thailand routes', () => {
    expect(homepageSource).toContain('Plan 7 days in Thailand')
    expect(homepageSource).toContain('Compare Bangkok and Chiang Mai day tours')
    expect(homepageSource).toContain('Plan elephant care, cooking, and nature days')
    expect(homepageSource).toContain('Prepare Pattaya or Phuket day-trip ideas')
    expect(homepageSource).toContain('Find food, culture, transfers, and local Thailand activities')
    expect(homepageSource).toContain('Match Thailand routes to realistic daily timing')
    expect(homepageSource).not.toContain('Build an Austria + Germany + France route')
    expect(homepageSource).not.toContain('Prepare a World Cup 2026 travel plan')
  })

  it('exposes safe homepage entry points for B2B partner paths', () => {
    expect(homepageSource).toContain('<SupplierPartnerCTA showPartnerPathLinks />')
    expect(homepageVisibleCopySources).toContain("href: '/partners'")
    expect(homepageVisibleCopySources).toContain("href: '/suppliers'")
    expect(homepageVisibleCopySources).toContain("href: '/destination-partners'")
    expect(homepageVisibleCopySources).toContain('Choose a partner path')
    expect(homepageVisibleCopySources).toContain('For travel partners')
    expect(homepageVisibleCopySources).toContain('For local suppliers')
    expect(homepageVisibleCopySources).toContain('For destination partners')
  })

  it('uses a structured mailto intake for homepage supplier interest', () => {
    expect(homepageVisibleCopySources).toContain('supplierPartnerMailtoBody')
    expect(homepageVisibleCopySources).toContain('[RadarScout homepage supplier interest]')
    expect(homepageVisibleCopySources).toContain('Destination focus:')
    expect(homepageVisibleCopySources).toContain('Public experience or partner page:')
    expect(homepageVisibleCopySources).toContain('Traveler audience:')
    expect(homepageVisibleCopySources).toContain('Best contact path:')
    expect(homepageVisibleCopySources).toContain('What you want RadarScout to check:')
    expect(homepageVisibleCopySources).toContain('encodeURIComponent(supplierPartnerMailtoBody)')
  })

  it('does not introduce forbidden booking or availability claims in homepage copy', () => {
    expectNoForbiddenPublicCopy(homepageVisibleCopySources)
    expect(homepageVisibleCopySources).not.toMatch(/Bókun/i)
    expect(homepageVisibleCopySources).not.toMatch(/DMC Portal/i)
    expect(homepageVisibleCopySources).not.toMatch(/live inventory/i)
    expect(homepageVisibleCopySources).not.toMatch(/live tours/i)
    expect(homepageVisibleCopySources).not.toMatch(/live availability/i)
    expect(homepageVisibleCopySources).not.toMatch(/available now/i)
    expect(homepageVisibleCopySources).not.toMatch(/instant confirmation/i)
    expect(homepageVisibleCopySources).not.toMatch(/\bcheckout\b/i)
    expect(homepageVisibleCopySources).not.toMatch(/\bpayment\b/i)
    expect(homepageVisibleCopySources).not.toMatch(/booking complete/i)
    expect(homepageVisibleCopySources).not.toMatch(/Bókun backend/i)
    expect(homepageVisibleCopySources).not.toMatch(/Bókun database/i)
    expect(homepageVisibleCopySources).not.toMatch(/\bbackend\b/i)
    expect(homepageVisibleCopySources).not.toMatch(/\bdatabase\b/i)
    expect(homepageVisibleCopySources).not.toMatch(/Bókun-powered/i)
    expect(homepageVisibleCopySources).not.toMatch(/partner rate/i)
    expect(homepageVisibleCopySources).not.toMatch(/supplier net rate/i)
    expect(homepageVisibleCopySources).not.toMatch(/\bcommission\b/i)
  })
})
