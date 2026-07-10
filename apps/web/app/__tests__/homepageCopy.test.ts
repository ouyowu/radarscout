import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'
import { expectNoForbiddenPublicCopy } from './publicSafetyPatterns'

const homepageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const promptHeroSource = readFileSync(new URL('../_components/PromptHero.tsx', import.meta.url), 'utf8')
const promptHeroHelperSource = readFileSync(new URL('../_components/promptHero.helpers.ts', import.meta.url), 'utf8')
const homepageVisibleCopySources = [
  homepageSource,
  promptHeroSource,
  promptHeroHelperSource,
  readFileSync(new URL('../_components/AdventureHero.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/TrackedLink.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/PartnerInventoryNotice.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/SupplierPartnerCTA.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../../lib/global-destinations.ts', import.meta.url), 'utf8'),
].join('\n')

describe('homepage public copy safety', () => {
  it('uses traveler-facing homepage metadata without Bókun-heavy wording', () => {
    expect(metadata.title).toBe('RadarScout | Personalized Thailand Experience Planner')
    expect(metadata.description).toBe(
      'Describe your ideal Thailand day and compare hand-picked experiences for elephant care, cooking, nature, and family-friendly days, then continue with a trusted booking partner.',
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
    expect(homepageSource).toContain('How broad is RadarScout coverage today?')
    expect(homepageSource).toContain('RadarScout is Thailand-first')
    expect(homepageSource).toContain('Other destination pages stay planning-only')
    expect(homepageSource).not.toContain('marketplace for every destination')
  })

  it('presents reviewed experiences without internal test language', () => {
    expect(homepageSource).toContain('Featured Thailand experiences')
    expect(homepageSource).not.toContain('for the first traveler test')
  })

  it('links to the Trip Planner with safe prompt-first copy', () => {
    expect(promptHeroSource).toContain('Tell us your ideal Thailand day. We match it to real, reviewed experiences.')
    expect(promptHeroSource).toContain('Plan my trip')
    expect(promptHeroSource).toContain('Thailand-first · Personalized matching · Trusted booking partner handoff')
    expect(promptHeroSource).not.toContain('AI-guided Thailand Experience Planner')
    expect(promptHeroSource).not.toContain('Tell RadarScout the kind of Thailand day you want')
    expect(promptHeroSource).not.toContain('Start planning')
    expect(homepageVisibleCopySources).toContain('trusted booking partner handoff')
  })

  it('shows safe homepage planner prompt chips without booking or availability claims', () => {
    expect(promptHeroSource).toContain('buildIdeaHref(nextIdea)')
    expect(promptHeroHelperSource).toContain("const target = '/ai-trip-planner'")
    expect(promptHeroHelperSource).toContain("const hash = '#intent-demo'")
    expect(promptHeroHelperSource).toContain('encodeURIComponent(trimmed)')
    expect(promptHeroHelperSource).toContain('Gentle elephant day in Chiang Mai')
    expect(promptHeroHelperSource).toContain('Family-friendly elephant sanctuary in Chiang Mai')
    expect(promptHeroHelperSource).toContain('Chiang Mai cooking and local food day')
    expect(promptHeroHelperSource).toContain('Chiang Mai nature and elephant day trip')
    expect(promptHeroSource).not.toContain('Start with a travel idea')
    expect(promptHeroSource).not.toContain('Use a prompt, then compare matching experiences.')
    expect(promptHeroHelperSource).not.toContain('Bangkok or Pattaya elephant day')
    expect(homepageVisibleCopySources).not.toContain('Prompt links load the planner form only')
  })

  it('positions the homepage destination rollout as Thailand-first', () => {
    expect(homepageSource).toContain('Thailand-first rollout')
    expect(homepageSource).toContain('Thailand is live first. Other destinations stay planning-only.')
    expect(homepageSource).toContain('Thailand first, then selected destinations')
    expect(homepageSource).toContain('current product coverage on Thailand experiences')
    expect(homepageSource).not.toContain('Selected top travel destinations, not worldwide noise.')
    expect(homepageSource).not.toContain('selected high-demand travel destinations')
    expect(homepageSource).not.toContain('selected top travel destinations')
    expect(homepageSource).not.toContain('more selected high-demand destinations')
    expect(homepageVisibleCopySources).not.toMatch(/selected top travel destinations/i)
    expect(homepageVisibleCopySources).not.toMatch(/selected high-demand destinations/i)
    expect(homepageVisibleCopySources).not.toMatch(/worldwide marketplace/i)
  })

  it('keeps supplier partner copy aligned with Thailand-first coverage', () => {
    expect(homepageVisibleCopySources).toContain('onboarding trusted Thailand suppliers')
    expect(homepageVisibleCopySources).toContain('future destination partners')
    expect(homepageVisibleCopySources).not.toContain('onboarding trusted suppliers in selected top travel destinations')
  })

  it('links to the Chiang Mai finder with safe guided-planner copy', () => {
    expect(homepageSource).toContain("const chiangMaiPlannerHref = '/chiang-mai/elephant-camp-finder#plan-with-radarscout'")
    expect(homepageSource).toContain('href={chiangMaiPlannerHref}')
    expect(homepageSource).toContain('Plan a Chiang Mai elephant day')
    expect(homepageSource).toContain('Plan with RadarScout')
    expect(homepageSource).toContain('guided planner')
    expect(homepageSource).toContain('compare experiences')
    expect(homepageSource).toContain('booking partner')
  })

  it('instruments the existing RAD-3 Chiang Mai finder entry without adding a new route or changing the href', () => {
    expect(homepageSource).toContain("const chiangMaiPlannerHref = '/chiang-mai/elephant-camp-finder#plan-with-radarscout'")
    expect(promptHeroSource).toContain("track('homepage_finder_entry_clicked', { source })")
    expect(promptHeroSource).toContain("go(idea, 'hero_prompt')")
    expect(promptHeroSource).toContain("go(chip, 'hero_chip')")
    expect(homepageSource).toContain('event="homepage_finder_entry_clicked"')
    expect(homepageSource).toContain('eventProps={{ source: \'section\' }}')
    expect(homepageVisibleCopySources).toContain('track(event, eventProps)')
    expect(homepageVisibleCopySources).not.toMatch(/navigator\.sendBeacon/i)
    expect(homepageVisibleCopySources).not.toMatch(/google-analytics|gtag|plausible|vercel analytics/i)
  })

  it('keeps homepage Trip planning use cases focused on Thailand routes', () => {
    expect(homepageSource).toContain('Trip planning use cases')
    expect(homepageSource).not.toContain('AI planning use cases')
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
