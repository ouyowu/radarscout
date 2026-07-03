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
    expect(publicCopy).toMatch(/View experience/i)
    expect(publicCopy).toMatch(/href=\{detailHref\}/)
  })

  it('keeps public planner copy free of backend, checkout, and payment wording', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('IntentParserPanels.tsx'),
      readAiTripPlannerSource('ItineraryPlaceholderShell.tsx'),
      readAiTripPlannerSource('resultFitSummary.ts'),
    ].join('\n')

    expect(publicCopy).toContain('booking-partner product catalog')
    expect(publicCopy).toContain('partner handoff')
    expect(publicCopy).toContain('Reservation workflow')
    expect(publicCopy).toContain('Result fit summary')
    expect(publicCopy).toContain('Why these experiences match')
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
  })
})
