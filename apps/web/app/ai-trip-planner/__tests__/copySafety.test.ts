import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

const aiTripPlannerDir = join(process.cwd(), 'app', 'ai-trip-planner')

function readAiTripPlannerSource(fileName: string) {
  return readFileSync(join(aiTripPlannerDir, fileName), 'utf8')
}

describe('AI trip planner public copy safety', () => {
  it('positions the page as a visible Thailand AI trip planner MVP', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('AiSearchProductCard.tsx'),
    ].join('\n')

    expect(publicCopy).toMatch(/Thailand AI trip planner/i)
    expect(publicCopy).toMatch(/Bangkok/i)
    expect(publicCopy).toMatch(/Chiang Mai/i)
    expect(publicCopy).toMatch(/Pattaya/i)
    expect(publicCopy).toMatch(/Phuket/i)
    expect(publicCopy).toMatch(/Search real Thailand experiences/i)
    expect(publicCopy).toMatch(/View details/i)
    expect(publicCopy).not.toMatch(/View experience/i)
    expect(publicCopy).toMatch(/href=\{detailHref\}/)
  })

  it('keeps public planner copy free of backend, checkout, and payment wording', () => {
    const pageSource = readAiTripPlannerSource('page.tsx')
    const publicCopy = [
      pageSource,
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('IntentParserPanels.tsx'),
      readAiTripPlannerSource('ItineraryPlaceholderShell.tsx'),
      readAiTripPlannerSource('resultFitSummary.ts'),
    ].join('\n')

    expect(publicCopy).toContain('partner product catalog')
    expect(publicCopy).toContain('partner workflow')
    expect(publicCopy).toContain('Partner workflow')
    expect(publicCopy).toContain('Result fit summary')
    expect(publicCopy).toContain('Why these experiences match')
    expect(publicCopy).toContain('Why this fits')
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
    expect(publicCopy).not.toMatch(/reservation handoff/i)
    expect(publicCopy).not.toMatch(/Reservation workflow/i)
    expect(publicCopy).not.toMatch(/No fake availability/i)
    expect(publicCopy).not.toMatch(/fake booking links/i)
  })

  it('keeps product result cards compact on mobile after adding fit signals', () => {
    const productCardSource = readAiTripPlannerSource('AiSearchProductCard.tsx')

    expect(productCardSource).toContain('p-4 sm:p-5')
    expect(productCardSource).toContain('mt-2 sm:mt-3')
    expect(productCardSource).toContain('gap-1.5 sm:gap-2')
    expect(productCardSource).toContain('px-2.5 py-1.5 sm:px-3 sm:py-2')
  })
})
