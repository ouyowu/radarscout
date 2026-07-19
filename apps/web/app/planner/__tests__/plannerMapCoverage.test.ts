import { describe, expect, it } from 'vitest'
import { THAILAND_COORDINATE_BOUNDS } from '@/lib/itineraries/thailandTemplates'
import { getReviewedPlannerMapDay } from '../plannerMapCoverage'

describe('getReviewedPlannerMapDay', () => {
  it('reuses reviewed Bangkok route coordinates for matching planner days', () => {
    const day = getReviewedPlannerMapDay('Bangkok', 2)

    expect(day?.cityName).toBe('Bangkok')
    expect(day?.dayPlan.day).toBe(2)
    expect(day?.dayPlan.stops).not.toHaveLength(0)
    expect(day?.dayPlan.stops.every(stop =>
      stop.lat >= THAILAND_COORDINATE_BOUNDS.minLat
      && stop.lat <= THAILAND_COORDINATE_BOUNDS.maxLat
      && stop.lng >= THAILAND_COORDINATE_BOUNDS.minLng
      && stop.lng <= THAILAND_COORDINATE_BOUNDS.maxLng
      && !(stop.lat === 0 && stop.lng === 0),
    )).toBe(true)
  })

  it('fails closed when a requested day has no reviewed map coverage', () => {
    expect(getReviewedPlannerMapDay('Bangkok', 4)).toBeNull()
    expect(getReviewedPlannerMapDay('Phuket', 1)).toBeNull()
  })
})
