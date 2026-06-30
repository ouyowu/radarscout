import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const aiTripPlannerDir = join(process.cwd(), 'app', 'ai-trip-planner')

function readAiTripPlannerSource(fileName: string) {
  return readFileSync(join(aiTripPlannerDir, fileName), 'utf8')
}

describe('AI trip planner public copy safety', () => {
  it('keeps public planner copy free of backend, checkout, and payment wording', () => {
    const publicCopy = [
      readAiTripPlannerSource('page.tsx'),
      readAiTripPlannerSource('IntentParserDemo.tsx'),
      readAiTripPlannerSource('IntentParserPanels.tsx'),
      readAiTripPlannerSource('ItineraryPlaceholderShell.tsx'),
    ].join('\n')

    expect(publicCopy).toContain('booking-partner product catalog')
    expect(publicCopy).toContain('partner handoff')
    expect(publicCopy).toContain('Reservation workflow')
    expect(publicCopy).toMatch(/transparent planning mode/i)

    expect(publicCopy).not.toMatch(/Bókun/i)
    expect(publicCopy).not.toMatch(/\bcheckout\b/i)
    expect(publicCopy).not.toMatch(/\bpayment\b/i)
    expect(publicCopy).not.toMatch(/\bpreview\b/i)
    expect(publicCopy).not.toMatch(/book and pay/i)
    expect(publicCopy).not.toMatch(/\bbookable\b/i)
    expect(publicCopy).not.toMatch(/create bookings/i)
    expect(publicCopy).not.toMatch(/Bókun-backed/i)
    expect(publicCopy).not.toMatch(/Bókun catalog/i)
    expect(publicCopy).not.toMatch(/Bókun backend/i)
    expect(publicCopy).not.toMatch(/Bókun database/i)
    expect(publicCopy).not.toMatch(/Bókun-powered/i)
  })
})
