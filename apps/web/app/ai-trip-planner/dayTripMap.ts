import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'

export function getItineraryDestinations(itinerary: DayTripItinerary): string[] {
  const destinations: string[] = []
  const seen = new Set<string>()

  for (const day of itinerary.days) {
    const city = day.experience.city?.trim()
    if (!city || seen.has(city.toLowerCase())) continue

    seen.add(city.toLowerCase())
    destinations.push(city)
  }

  return destinations
}

export function buildOpenStreetMapSearchHref(destination: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${destination}, Thailand`)}`
}
