import type { DayTripItinerary } from './itinerary-contract'

// Schematic map model for reviewed Thailand itineraries. City-level only:
// exact meeting and pickup details stay on product pages, so the map never
// claims venue precision beyond the reviewed destination city.

export type ThailandRouteMapStop = {
  city: string
  dayNumbers: number[]
  x: number
  y: number
}

export type ThailandRouteMapModel = {
  stops: ThailandRouteMapStop[]
  segments: Array<{ from: ThailandRouteMapStop; to: ThailandRouteMapStop }>
  unmappedCities: string[]
}

export const THAILAND_MAP_VIEWBOX = { width: 300, height: 500 } as const

const MAP_BOUNDS = {
  minLat: 5.5,
  maxLat: 20.6,
  minLng: 97,
  maxLng: 106,
} as const

// Well-known city centers, projected at render time. City-level accuracy only.
const THAILAND_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  ayutthaya: { lat: 14.3532, lng: 100.5689 },
  bangkok: { lat: 13.7563, lng: 100.5018 },
  'chiang mai': { lat: 18.7883, lng: 98.9853 },
  'koh samui': { lat: 9.512, lng: 100.0136 },
  krabi: { lat: 8.0863, lng: 98.9063 },
  pattaya: { lat: 12.9236, lng: 100.8825 },
  phuket: { lat: 7.8804, lng: 98.3923 },
}

// Simplified national outline for the schematic backdrop (lat, lng pairs).
const THAILAND_OUTLINE: Array<[number, number]> = [
  [20.4, 99.9],
  [19.5, 97.8],
  [18, 97.4],
  [16, 98.6],
  [15, 98.2],
  [14, 99.1],
  [13, 99.2],
  [12, 99],
  [10.5, 98.7],
  [9, 98.3],
  [8, 98.3],
  [7, 99.5],
  [6.5, 100.1],
  [6, 101],
  [6.2, 102.1],
  [7.5, 100.5],
  [9.2, 99.9],
  [10.5, 99.3],
  [12, 100],
  [13, 100.1],
  [13.4, 100.6],
  [13.2, 101.5],
  [12.7, 101.9],
  [12.2, 102.6],
  [11.7, 102.9],
  [13.5, 102.4],
  [14.4, 103],
  [14.4, 105.2],
  [15.5, 105.6],
  [16.5, 104.7],
  [17.5, 104.4],
  [18.2, 103.9],
  [18.4, 103],
  [17.9, 102.6],
  [18, 101.2],
  [19.5, 100.5],
  [20.4, 100.5],
]

export function projectToMap(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * THAILAND_MAP_VIEWBOX.width
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * THAILAND_MAP_VIEWBOX.height

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

export function getThailandOutlinePoints(): string {
  return THAILAND_OUTLINE
    .map(([lat, lng]) => {
      const { x, y } = projectToMap(lat, lng)
      return `${x},${y}`
    })
    .join(' ')
}

export function lookupThailandCity(city: string): { x: number; y: number } | null {
  const coordinates = THAILAND_CITY_COORDINATES[city.trim().toLowerCase()]
  if (!coordinates) return null

  return projectToMap(coordinates.lat, coordinates.lng)
}

export function buildThailandRouteMapModel(itinerary: DayTripItinerary): ThailandRouteMapModel {
  const stopsByCity = new Map<string, ThailandRouteMapStop>()
  const orderedStops: ThailandRouteMapStop[] = []
  const unmappedCities: string[] = []
  const seenUnmapped = new Set<string>()

  for (const day of itinerary.days) {
    const city = day.experience.city?.trim()
    if (!city) continue

    const key = city.toLowerCase()
    const existing = stopsByCity.get(key)

    if (existing) {
      existing.dayNumbers.push(day.dayNumber)
      continue
    }

    const point = lookupThailandCity(city)

    if (!point) {
      if (!seenUnmapped.has(key)) {
        seenUnmapped.add(key)
        unmappedCities.push(city)
      }
      continue
    }

    const stop: ThailandRouteMapStop = {
      city,
      dayNumbers: [day.dayNumber],
      x: point.x,
      y: point.y,
    }
    stopsByCity.set(key, stop)
    orderedStops.push(stop)
  }

  const segments: ThailandRouteMapModel['segments'] = []
  for (let index = 1; index < orderedStops.length; index += 1) {
    segments.push({ from: orderedStops[index - 1], to: orderedStops[index] })
  }

  return { stops: orderedStops, segments, unmappedCities }
}
