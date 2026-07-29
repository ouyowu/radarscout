import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'
import { expectNoForbiddenPublicCopy } from './publicSafetyPatterns'
import { featuredViatorExperiences } from '../_content/homepageFeaturedExperiences'
import { listTourDetailSeoCandidates } from '@/lib/publicProducts/tourDetailSeoCandidates'

const homepageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const publicSiteShellSource = readFileSync(new URL('../_components/PublicSiteShell.tsx', import.meta.url), 'utf8')
const promptHeroSource = readFileSync(new URL('../_components/PromptHero.tsx', import.meta.url), 'utf8')
const promptHeroHelperSource = readFileSync(new URL('../_components/promptHero.helpers.ts', import.meta.url), 'utf8')
const homepageFeaturedExperiencesSource = readFileSync(
  new URL('../_content/homepageFeaturedExperiences.ts', import.meta.url),
  'utf8',
)
const publicSiteContentSource = readFileSync(new URL('../_content/publicSite.ts', import.meta.url), 'utf8')
const homepageVisibleCopySources = [
  homepageSource,
  promptHeroSource,
  promptHeroHelperSource,
  publicSiteShellSource,
  publicSiteContentSource,
  readFileSync(new URL('../_components/SiteNav.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/SiteFooter.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/TrackedLink.tsx', import.meta.url), 'utf8'),
].join('\n')

describe('homepage public copy safety', () => {
  it('uses traveler-facing homepage metadata without Bókun-heavy wording', () => {
    expect(metadata.title).toBe('RadarScout | Personalized Thailand Experience Planner')
    expect(metadata.description).toBe(
      'Describe your ideal Thailand day and choose from a hand-reviewed Viator shortlist, then continue to Viator for current product details.',
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
    expect(publicSiteContentSource).toContain('What does RadarScout help me plan?')
    expect(publicSiteContentSource).toContain('Coverage expands city by city')
    expect(homepageSource).not.toContain('marketplace for every destination')
  })

  it('presents reviewed Viator experiences across Thailand cities without legacy products', () => {
    expect(homepageSource).toContain("RadarScout's Viator shortlist")
    expect(homepageSource).toContain('Skip the endless sorting. Start with day tours we have already narrowed down.')
    expect(homepageFeaturedExperiencesSource).toContain('loadReviewedViatorPublicCatalogue')
    expect(homepageFeaturedExperiencesSource).toContain('listTourDetailSeoCandidates')
    expect(homepageSource).toContain('featuredViatorExperiences')
    expect(homepageSource).not.toContain('pilotPartnerProducts')
    expect(homepageSource).not.toContain('partner_cm_')
    expect(homepageSource).not.toContain('for the first traveler test')
    expect(homepageSource).toContain('whyRecommended={product.summary}')
    expect(homepageSource).toContain('bestFor={product.tags.slice(0, 3)}')
    expect(homepageSource).toContain('watchOut=')
  })

  it('links every approved SEO pilot product from the indexable homepage', () => {
    const approvedCandidates = listTourDetailSeoCandidates()

    expect(featuredViatorExperiences.map(product => product.id)).toEqual(
      approvedCandidates.map(candidate => candidate.publicProductId),
    )
    expect(featuredViatorExperiences.map(product => product.detailHref)).toEqual(
      approvedCandidates.map(candidate => candidate.expectedCanonicalPath),
    )
  })

  it('uses the shared public site shell and keeps the homepage Thailand day-trip focused', () => {
    expect(homepageSource).toContain('<PublicSiteShell>')
    expect(publicSiteShellSource).toContain('<SiteNav />')
    expect(publicSiteShellSource).toContain('<SiteFooter />')
    expect(homepageSource).not.toContain("destination.slug === 'japan'")
    expect(homepageSource).not.toContain("destination.slug === 'france'")
    expect(homepageSource).not.toContain('Plan 7 days in Thailand')
    expect(homepageSource).not.toContain('other destinations')
  })

  it('links to the Trip Planner with safe prompt-first copy', () => {
    expect(promptHeroSource).toContain('Your Thailand day,')
    expect(promptHeroSource).toContain('planned around you.')
    expect(promptHeroSource).toContain('src="/images/thailand-planner-hero.png"')
    expect(promptHeroSource).toContain('Curated Viator shortlist')
    expect(promptHeroSource).toContain('Plan my trip')
    expect(promptHeroSource).toContain('Thailand-first · Personalized matching · Trusted booking partner handoff')
    expect(promptHeroSource).not.toContain('AI-guided Thailand Experience Planner')
    expect(promptHeroSource).not.toContain('Tell RadarScout the kind of Thailand day you want')
    expect(promptHeroSource).not.toContain('Start planning')
    expect(homepageVisibleCopySources).toMatch(/trusted booking partner handoff/i)
  })

  it('shows safe homepage planner prompt chips without booking or availability claims', () => {
    expect(promptHeroSource).toContain('buildIdeaHref(nextIdea)')
    expect(promptHeroHelperSource).toContain("const target = '/planner'")
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
    expect(promptHeroSource).toContain('Thailand-first')
    expect(homepageVisibleCopySources).toContain('Thailand day-trip discovery')
    expect(publicSiteContentSource).toContain('Coverage expands city by city')
    expect(homepageSource).not.toContain('Selected top travel destinations, not worldwide noise.')
    expect(homepageSource).not.toContain('selected high-demand travel destinations')
    expect(homepageSource).not.toContain('selected top travel destinations')
    expect(homepageSource).not.toContain('more selected high-demand destinations')
    expect(homepageVisibleCopySources).not.toMatch(/selected top travel destinations/i)
    expect(homepageVisibleCopySources).not.toMatch(/selected high-demand destinations/i)
    expect(homepageVisibleCopySources).not.toMatch(/worldwide marketplace/i)
  })

  it('keeps supplier partner copy aligned with Thailand-first coverage', () => {
    expect(publicSiteContentSource).toContain('Supplier partners')
    expect(publicSiteContentSource).toContain('RadarScout%20Supplier%20Partnership%20Inquiry')
    expect(homepageVisibleCopySources).not.toContain('onboarding trusted suppliers in selected top travel destinations')
  })

  it('links to the shared Planner with safe Thailand-wide copy', () => {
    expect(homepageSource).toContain("const thailandPlannerHref = '/planner'")
    expect(homepageSource).toContain('href={thailandPlannerHref}')
    expect(homepageSource).toContain('Build a Thailand day plan from your city.')
    expect(homepageSource).toContain('Plan my Thailand day')
    expect(homepageSource).toContain('guided planner')
    expect(homepageSource).toContain('compare reviewed matches')
    expect(homepageSource).toContain('booking partner')
    expect(homepageSource).not.toContain('elephant-camp-finder')
  })

  it('links the indexable homepage to the Thailand trip planner SEO hub', () => {
    expect(homepageSource).toContain('href="/thailand-trip-planner"')
    expect(homepageSource).toContain('Read the Thailand planning guide')
    expect(publicSiteContentSource).toContain(
      "{ href: '/thailand-trip-planner', label: 'Thailand planner' }",
    )
  })

  it('keeps the shared Planner entry instrumented without restoring the legacy finder path', () => {
    expect(homepageSource).toContain("const thailandPlannerHref = '/planner'")
    expect(promptHeroSource).toContain("track('homepage_finder_entry_clicked', { source })")
    expect(promptHeroSource).toContain("go(idea, 'hero_prompt')")
    expect(promptHeroSource).toContain("go(chip, 'hero_chip')")
    expect(homepageSource).toContain('event="homepage_finder_entry_clicked"')
    expect(homepageSource).toContain("eventProps={{ source: 'thailand_planner_section' }}")
    expect(homepageVisibleCopySources).toContain('track(event, eventProps)')
    expect(homepageSource).not.toContain('elephant-camp-finder')
    expect(homepageVisibleCopySources).not.toMatch(/navigator\.sendBeacon/i)
    expect(homepageVisibleCopySources).not.toMatch(/google-analytics|gtag|plausible|vercel analytics/i)
  })

  it('keeps homepage planning examples focused on Thailand day trips', () => {
    expect(publicSiteContentSource).toContain('Describe your ideal day')
    expect(publicSiteContentSource).toContain('Compare reviewed matches')
    expect(publicSiteContentSource).toContain('Check current details')
    expect(homepageSource).not.toContain('Plan 7 days in Thailand')
    expect(homepageSource).not.toContain('Build an Austria + Germany + France route')
    expect(homepageSource).not.toContain('Prepare a World Cup 2026 travel plan')
  })

  it('keeps public navigation focused on traveler tasks', () => {
    expect(publicSiteContentSource).toContain(
      "{ href: '/thailand-trip-planner', label: 'Thailand planner' }",
    )
    expect(publicSiteContentSource).not.toContain("{ href: '/ai-trip-planner', label: 'Plan a day' }")
    expect(homepageVisibleCopySources).not.toContain('href="/ai-trip-planner"')
    expect(publicSiteContentSource).toContain("{ href: '/tours', label: 'Experiences' }")
    expect(publicSiteContentSource).toContain("{ href: '/destinations', label: 'Destinations' }")
    expect(publicSiteContentSource).not.toContain('AI Planner')
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
    expect(homepageVisibleCopySources).not.toMatch(/\bcheapest\b|lowest price|best[- ]selling|sales rank/i)
  })

  it('positions RadarScout as a reviewed shortlist instead of an unproven ranking service', () => {
    expect(homepageSource).toContain('Skip the endless sorting. Start with day tours we have already narrowed down.')
    expect(homepageSource).toContain('selected for clear destination fit, useful themes, and a verified Viator handoff')
    expect(homepageSource).toContain('Current price, inclusions, and booking terms are confirmed on Viator.')
    expect(homepageVisibleCopySources).not.toMatch(/\bcheapest\b|lowest price|best[- ]selling|sales rank/i)
  })
})
