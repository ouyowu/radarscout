import { describe, expect, it } from 'vitest'
import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import { buildOpenStreetMapSearchHref, getItineraryDestinations } from '../dayTripMap'

const itinerary = {
  days: [
    { dayNumber: 1, experience: { city: 'Chiang Mai' } },
    { dayNumber: 2, experience: { city: 'Chiang Mai' } },
    { dayNumber: 3, experience: { city: 'Bangkok' } },
    { dayNumber: 4, experience: { city: null } },
  ],
} as DayTripItinerary

describe('day-trip destination map links', () => {
  it('returns unique reviewed destination labels in itinerary order', () => {
    expect(getItineraryDestinations(itinerary)).toEqual(['Chiang Mai', 'Bangkok'])
  })

  it('builds an encoded HTTPS OpenStreetMap destination search', () => {
    expect(buildOpenStreetMapSearchHref('Chiang Mai')).toBe(
      'https://www.openstreetmap.org/search?query=Chiang%20Mai%2C%20Thailand',
    )
  })
})
