import { describe, expect, it } from 'vitest'
import type { DayTripItinerary } from './itinerary-contract'
import {
  buildThailandRouteMapModel,
  getThailandOutlinePoints,
  lookupThailandCity,
  projectToMap,
  THAILAND_MAP_VIEWBOX,
} from './thailand-route-map'

function itineraryWithCities(cities: Array<string | null>): DayTripItinerary {
  return {
    days: cities.map((city, index) => ({
      dayNumber: index + 1,
      experience: { city },
    })),
  } as DayTripItinerary
}

describe('thailand route map model', () => {
  it('projects known cities inside the schematic viewBox', () => {
    for (const city of ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi', 'Koh Samui', 'Ayutthaya']) {
      const point = lookupThailandCity(city)
      expect(point).not.toBeNull()
      expect(point!.x).toBeGreaterThan(0)
      expect(point!.x).toBeLessThan(THAILAND_MAP_VIEWBOX.width)
      expect(point!.y).toBeGreaterThan(0)
      expect(point!.y).toBeLessThan(THAILAND_MAP_VIEWBOX.height)
    }
  })

  it('keeps north above south in projected coordinates', () => {
    const chiangMai = lookupThailandCity('Chiang Mai')!
    const bangkok = lookupThailandCity('Bangkok')!
    const phuket = lookupThailandCity('Phuket')!

    expect(chiangMai.y).toBeLessThan(bangkok.y)
    expect(bangkok.y).toBeLessThan(phuket.y)
  })

  it('matches city names case-insensitively and rejects unknown cities', () => {
    expect(lookupThailandCity('chiang mai')).toEqual(lookupThailandCity('Chiang Mai'))
    expect(lookupThailandCity('Paris')).toBeNull()
  })

  it('groups repeated cities into one stop with all day numbers', () => {
    const model = buildThailandRouteMapModel(itineraryWithCities(['Chiang Mai', 'Chiang Mai', 'Bangkok']))

    expect(model.stops).toHaveLength(2)
    expect(model.stops[0]).toMatchObject({ city: 'Chiang Mai', dayNumbers: [1, 2] })
    expect(model.stops[1]).toMatchObject({ city: 'Bangkok', dayNumbers: [3] })
    expect(model.segments).toHaveLength(1)
    expect(model.segments[0].from.city).toBe('Chiang Mai')
    expect(model.segments[0].to.city).toBe('Bangkok')
  })

  it('preserves return legs when a route revisits a city', () => {
    const model = buildThailandRouteMapModel(itineraryWithCities(['Chiang Mai', 'Bangkok', 'Chiang Mai']))

    expect(model.stops).toHaveLength(2)
    expect(model.stops[0]).toMatchObject({ city: 'Chiang Mai', dayNumbers: [1, 3] })
    expect(model.segments.map(segment => [segment.from.city, segment.to.city])).toEqual([
      ['Chiang Mai', 'Bangkok'],
      ['Bangkok', 'Chiang Mai'],
    ])
  })

  it('lists unknown cities separately instead of guessing coordinates', () => {
    const model = buildThailandRouteMapModel(itineraryWithCities(['Chiang Mai', 'Chiang Rai', null]))

    expect(model.stops.map(stop => stop.city)).toEqual(['Chiang Mai'])
    expect(model.unmappedCities).toEqual(['Chiang Rai'])
  })

  it('builds a closed-looking outline with every point inside the viewBox', () => {
    const points = getThailandOutlinePoints().split(' ')

    expect(points.length).toBeGreaterThan(20)
    for (const pair of points) {
      const [x, y] = pair.split(',').map(Number)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(THAILAND_MAP_VIEWBOX.width)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(THAILAND_MAP_VIEWBOX.height)
    }
  })

  it('rounds projected coordinates to one decimal place', () => {
    const point = projectToMap(13.7563, 100.5018)

    expect(point.x).toBe(Math.round(point.x * 10) / 10)
    expect(point.y).toBe(Math.round(point.y * 10) / 10)
  })
})
