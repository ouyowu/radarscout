import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const componentPath = join(process.cwd(), 'app', 'ai-trip-planner', 'DayTripItineraryPanel.tsx')

describe('DayTripItineraryPanel', () => {
  it('renders an honest day-tour sequence without commerce or transport claims', () => {
    const source = readFileSync(componentPath, 'utf8')

    expect(source).toContain('Your suggested Thailand day trips')
    expect(source).toContain('Day {day.dayNumber}')
    expect(source).toContain('itinerary.unfilledDayCount')
    expect(source).toContain('day-tour suggestions')
    expect(source).toContain('buildAiTripPlannerDetailHref(day.experience.detailHref, day.experience.productId)')
    expect(source).not.toMatch(/hotel|flight|airport|price|checkout|payment|instant confirmation/i)
  })
})
