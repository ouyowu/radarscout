import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

const plannerDir = join(process.cwd(), 'app', 'planner')

describe('Planner itinerary workspace', () => {
  const source = readFileSync(join(plannerDir, 'PlannerItineraryWorkspace.tsx'), 'utf8')
  const pageSource = readFileSync(join(plannerDir, 'page.tsx'), 'utf8')

  it('links day tabs, the selected product card, and the reviewed MapLibre route', () => {
    expect(source).toMatch(/Choose itinerary day/)
    expect(source).toMatch(/setSelectedDay/)
    expect(source).toMatch(/MapLibreDayMap/)
    expect(source).toMatch(/getReviewedPlannerMapDay/)
    expect(source).toMatch(/Review product details/)
    expect(source).toMatch(/Check availability/)
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
})
