import { describe, expect, it } from 'vitest'
import {
  THAILAND_COORDINATE_BOUNDS,
  getThailandItineraryTemplate,
  listThailandItineraryTemplates,
} from '../thailandTemplates'

describe('Thailand itinerary templates', () => {
  it('keeps every template day-complete with reviewed Thailand coordinates', () => {
    const templates = listThailandItineraryTemplates()

    expect(templates).not.toHaveLength(0)

    for (const template of templates) {
      expect(template.dayPlans).toHaveLength(template.days)

      for (const dayPlan of template.dayPlans) {
        expect(dayPlan.stops).toHaveLength(4)

        for (const stop of dayPlan.stops) {
          expect(Number.isFinite(stop.lat)).toBe(true)
          expect(Number.isFinite(stop.lng)).toBe(true)
          expect(stop.lat).toBeGreaterThanOrEqual(THAILAND_COORDINATE_BOUNDS.minLat)
          expect(stop.lat).toBeLessThanOrEqual(THAILAND_COORDINATE_BOUNDS.maxLat)
          expect(stop.lng).toBeGreaterThanOrEqual(THAILAND_COORDINATE_BOUNDS.minLng)
          expect(stop.lng).toBeLessThanOrEqual(THAILAND_COORDINATE_BOUNDS.maxLng)
          expect([stop.lat, stop.lng]).not.toEqual([0, 0])
        }
      }
    }
  })

  it('starts with the Bangkok three-day vertical slice', () => {
    const template = getThailandItineraryTemplate('bangkok', 3)

    expect(template?.cityName).toBe('Bangkok')
    expect(template?.dayPlans.map(day => day.day)).toEqual([1, 2, 3])
  })
})
