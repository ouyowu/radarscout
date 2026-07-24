import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

const plannerDir = join(process.cwd(), 'app', 'planner')

describe('Planner itinerary workspace', () => {
  const source = readFileSync(join(plannerDir, 'PlannerItineraryWorkspace.tsx'), 'utf8')
  const studioSource = readFileSync(join(plannerDir, 'PlannerStudio.tsx'), 'utf8')
  const pageSource = readFileSync(join(plannerDir, 'page.tsx'), 'utf8')
  const mapSource = readFileSync(
    join(process.cwd(), 'app', 'itineraries', 'thailand', '[city]', '[duration]', 'MapLibreDayMap.tsx'),
    'utf8',
  )

  it('links day tabs, the selected product card, and the reviewed MapLibre route', () => {
    expect(source).toMatch(/Choose itinerary day/)
    expect(source).toMatch(/setSelectedDay/)
    expect(source).toMatch(/MapLibreDayMap/)
    expect(source).toMatch(/getReviewedPlannerMapDay\(itinerary\.tripSpec\.destination, selectedDay, selectedProduct\)/)
    expect(source).toMatch(/precision=\{mapDay\.precision\}/)
    expect(source).toMatch(/Review product details/)
    expect(source).toMatch(/Check availability/)
  })

  it('labels regional map pins as orientation rather than an exact product route', () => {
    expect(mapSource).toMatch(/reviewed regional orientation/)
    expect(mapSource).toMatch(/not its exact route, pickup or meeting point/)
  })

  it('loads MapLibre styles and constrains the planner map to a viewport-height workspace', () => {
    expect(pageSource).toMatch(/maplibre-gl\/dist\/maplibre-gl\.css/)
    expect(source).toMatch(/lg:h-\[calc\(100vh-12rem\)\]/)
    expect(source).toMatch(/lg:max-h-\[760px\]/)
  })

  it('provides local pace and theme controls without another product request', () => {
    expect(source).toMatch(/Choose itinerary pace/)
    expect(source).toMatch(/Filter reviewed experiences by theme/)
    expect(source).toMatch(/Chill/)
    expect(source).toMatch(/Balanced/)
    expect(source).toMatch(/Packed/)
    expect(source).toMatch(/filterPlannerProductsByThemes/)
    expect(source).toMatch(/adaptPlannerDecisionSignals/)
    expect(source).not.toMatch(/\bfetch\s*\(/)
  })

  it('renders one selectable day for every requested day without inventing map coordinates', () => {
    expect(source).toMatch(/itinerary\.tripSpec\.durationDays/)
    expect(source).toMatch(/No reviewed map coverage/)
    expect(source).not.toMatch(/products\.find/)
    expect(source).not.toMatch(/geocod/i)
    expect(source).not.toMatch(/Math\.random/)
  })

  it('keeps public copy and the external handoff safe', () => {
    expect(source).toMatch(/decisionSignals\?\.whyRecommended/)
    expect(source).toMatch(/decisionSignals\?\.bestFor/)
    expect(source).toMatch(/decisionSignals\?\.watchOut/)
    expect(source).toMatch(/nofollow sponsored noopener noreferrer/)
    expect(source).toMatch(/booking_partner_handoff_clicked/)
    expectNoForbiddenPublicCopy(source)
  })

  it('shares bounded trip context across handoffs without adding dates to provider URLs', () => {
    expect(studioSource).toMatch(/startDate: searchState\?\.intent\?\.startDate \?\? null/)
    expect(studioSource).toMatch(/tripContext=\{handoffTripContext\}/)
    expect(studioSource).toMatch(/Remembered for this plan/)
    expect(source).toMatch(/tripContext: AffiliateTripContext/)
    expect(source).toMatch(/provider: 'viator'/)
    expect(source).toMatch(/city:/)
    expect(source).toMatch(/buildSafeAffiliateAnalyticsContext\(tripContext\)/)
    expect(source).toMatch(/selectedProductId \?\? undefined,\s*safeTripContext,/)
    expect(source).toMatch(/buildAiTripPlannerDetailHref\(product\.detailHref, product\.id, safeTripContext\)/)
    expect(source).not.toMatch(/\{ hasDates: safeTripContext\.hasDates \}/)
    expect(source).not.toMatch(/searchParams\.set\(['\"](?:startDate|endDate)/)
  })

  it('offers the reviewed GetYourGuide city handoff for the confirmed Planner destination', () => {
    expect(source).toMatch(/buildGetYourGuideCityGuideOffer\(itinerary\.tripSpec\.destination\)/)
    expect(source).toMatch(/provider=\{cityGuideOffer\.provider\}/)
    expect(source).toMatch(/placement=\{cityGuideOffer\.placement\}/)
    expect(source).toMatch(/tripContext=\{tripContext\}/)
    expect(source).toMatch(/Compare more .* activities on GetYourGuide/)
    expect(source).toMatch(/cannot prefill GetYourGuide dates or traveler details/)
  })
})
