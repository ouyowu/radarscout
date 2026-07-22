import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

const aiTripPlannerDir = join(process.cwd(), 'app', 'ai-trip-planner')

function readAiTripPlannerSource(fileName: string) {
  return readFileSync(join(aiTripPlannerDir, fileName), 'utf8')
}

describe('AI trip planner public copy safety', () => {
  it('positions the page as a visible Thailand trip planner MVP without over-claiming AI', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('AiSearchProductCard.tsx'),
      readAiTripPlannerSource('DayTripItineraryPanel.tsx'),
    ].join('\n')

    expect(publicCopy).toMatch(/Thailand trip planner/i)
    // Honest-naming guard: the planner runs deterministic local intent parsing plus
    // keyword product search — it must NOT market itself as a generative "AI" planner.
    expect(publicCopy).not.toMatch(/\bAI trip planner\b/i)
    expect(publicCopy).not.toMatch(/AI-powered/i)
    expect(publicCopy).not.toMatch(/AI-guided/i)
    expect(publicCopy).not.toMatch(/aria-label=["']AI Trip/i)
    expect(publicCopy).toMatch(/Bangkok/i)
    expect(publicCopy).toMatch(/Chiang Mai/i)
    expect(publicCopy).toMatch(/Pattaya/i)
    expect(publicCopy).toMatch(/Phuket/i)
    expect(publicCopy).toMatch(/Search real Thailand experiences/i)
    expect(publicCopy).toMatch(/View details/i)
    expect(publicCopy).not.toMatch(/View experience/i)
    expect(publicCopy).toMatch(/buildAiTripPlannerDetailHref\(detailHref, id, \{ hasDates: handoffContext\.hasDates \}\)/)
    expect(publicCopy).toMatch(/params\.set\('source', 'ai-trip-planner'\)/)
  })

  it('keeps public planner copy free of backend, checkout, and payment wording', () => {
    const pageSource = readAiTripPlannerSource('page.tsx')
    const publicCopy = [
      pageSource,
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('IntentParserPanels.tsx'),
      readAiTripPlannerSource('ItineraryPlaceholderShell.tsx'),
      readAiTripPlannerSource('DayTripItineraryPanel.tsx'),
      readAiTripPlannerSource('resultFitSummary.ts'),
      readFileSync(join(process.cwd(), 'lib', 'ai-trip', 'placeholder-itinerary.ts'), 'utf8'),
    ].join('\n')

    expect(publicCopy).toContain('Thailand experience catalog')
    expect(publicCopy).toContain('Booking partner handoff')
    expect(publicCopy).toContain('Current product details')
    expect(publicCopy).toContain('Structured day-trip itinerary')
    expect(publicCopy).toContain('Suggested planning outline')
    expect(publicCopy).toContain('rule-based planning guide')
    expect(publicCopy).toContain('Planner safety status')
    expect(publicCopy).toContain('Product page only')
    expect(publicCopy).toContain('Read-only comparison')
    expect(publicCopy).toContain('Product-page details')
    expect(publicCopy).toContain('Thailand-only matching')
    expect(publicCopy).toContain('Reviewed coverage first')
    expect(publicCopy).toContain('Shown')
    expect(publicCopy).toContain('Result fit summary')
    expect(publicCopy).toContain('Why these experiences match')
    expect(publicCopy).toContain('Why this fits')
    expect(publicCopy).toContain('Current details stay on product pages')
    expect(publicCopy).toContain('reviewed handoff-ready results')
    expect(publicCopy).toContain('reviewed Thailand partner products with a safe public handoff')
    expect(publicCopy).toContain('Planner form loaded')
    expect(publicCopy).toContain('Product search only runs after you choose to search real Thailand experiences')
    expect(publicCopy).toContain('Local planning summary')
    expect(publicCopy).toContain('Planner notes')
    expect(publicCopy).toContain('Add detail')
    expect(publicCopy).toContain('Planning notes')
    expect(publicCopy).toContain('Trip details')
    expect(publicCopy).toMatch(/transparent planning mode/i)
    expect(publicCopy).toMatch(/read-only Thailand product search/i)
    expect(publicCopy).toMatch(/comparison-only product results/i)

    expect(publicCopy).not.toMatch(/Product search comes later/i)
    expect(publicCopy).not.toMatch(/Product search'[,\n]/i)
    expect(publicCopy).not.toMatch(/No products are loaded/i)
    expect(publicCopy).not.toMatch(/This page does not load products/i)
    expect(publicCopy).not.toMatch(/before any product matching exists/i)

    expectNoForbiddenPublicCopy(publicCopy)
    expect(publicCopy).not.toMatch(/\bpreview\b/i)
    expect(publicCopy).not.toMatch(/book and pay/i)
    expect(publicCopy).not.toMatch(/create bookings/i)
    expect(publicCopy).not.toMatch(/Bókun-backed/i)
    expect(publicCopy).not.toMatch(/Bókun catalog/i)
    expect(pageSource).not.toMatch(/availability/i)
    expect(publicCopy).not.toMatch(/availability checks/i)
    expect(publicCopy).not.toMatch(/availability check/i)
    expect(publicCopy).not.toMatch(/current-detail checks/i)
    expect(publicCopy).not.toMatch(/partner workflow/i)
    expect(publicCopy).not.toMatch(/partner workflows/i)
    expect(publicCopy).not.toMatch(/reservation handoff/i)
    expect(publicCopy).not.toMatch(/Reservation workflow/i)
    expect(publicCopy).not.toMatch(/No fake availability/i)
    expect(publicCopy).not.toMatch(/fake booking links/i)
    expect(publicCopy).not.toMatch(/No fake products or suppliers/i)
    expect(publicCopy).not.toMatch(/\bfake\b/i)
    expect(publicCopy).not.toMatch(/\binvented\b/i)
    expect(publicCopy).not.toMatch(/claimed current status/i)
    expect(publicCopy).not.toMatch(/unsupported product links/i)
    expect(publicCopy).not.toMatch(/Raw structured JSON/i)
    expect(publicCopy).not.toMatch(/Raw JSON/i)
    expect(publicCopy).not.toMatch(/debugging/i)
    expect(publicCopy).not.toMatch(/Missing fields \/ warnings/i)
    expect(publicCopy).not.toMatch(/Missing fields:/i)
    expect(publicCopy).not.toMatch(/No missing required fields or parser warnings detected/i)
    expect(publicCopy).not.toMatch(/Deterministic outline/i)
    expect(publicCopy).not.toMatch(/deterministic planning guidance/i)
    expect(publicCopy).not.toMatch(/Local deterministic planner/i)
    expect(publicCopy).not.toMatch(/Structured trip details/i)
    expect(publicCopy).not.toMatch(/Capability status/i)
    expect(publicCopy).not.toMatch(/Not connected/i)
    expect(publicCopy).not.toMatch(/['"`]Enabled['"`]/i)
    expect(publicCopy).not.toMatch(/['"`]Disabled['"`]/i)
  })

  it('makes the Thailand-only product matching boundary explicit', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
    ].join('\n')

    expect(publicCopy).toContain('Product matching is currently limited to Thailand experience records')
    expect(publicCopy).toContain('Non-Thailand ideas can still be structured as planning text')
    expect(publicCopy).toMatch(/product matching stays Thailand-only/i)
    expect(publicCopy).not.toMatch(/global product matching/i)
    expect(publicCopy).not.toMatch(/worldwide/i)
    expect(publicCopy).not.toMatch(/any destination/i)
    expect(publicCopy).not.toMatch(/all destinations/i)
    expect(publicCopy).not.toMatch(/every destination/i)
    expect(publicCopy).not.toMatch(/every country/i)
  })

  it('describes the live itinerary and external handoff capabilities consistently', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
    ].join('\n')

    expect(publicCopy).toContain('Structured day-trip itinerary')
    expect(publicCopy).toContain('After search')
    expect(publicCopy).toContain('Check availability opens the external booking partner')
    expect(publicCopy).not.toMatch(/does not generate an itinerary/i)
    expect(publicCopy).not.toMatch(/AI-generated itinerary/i)
    expect(publicCopy).not.toMatch(/no booking partner handoff starts from this planner page/i)
    expect(publicCopy).not.toMatch(/No booking partner action or current status claim/i)
  })

  it('keeps product result cards compact on mobile after adding fit signals', () => {
    const productCardSource = readAiTripPlannerSource('AiSearchProductCard.tsx')

    expect(productCardSource).toContain('p-4 sm:p-5')
    expect(productCardSource).toContain('mt-2 sm:mt-3')
    expect(productCardSource).toContain('gap-1.5 sm:gap-2')
    expect(productCardSource).toContain('px-2.5 py-1.5 sm:px-3 sm:py-2')
  })
})
