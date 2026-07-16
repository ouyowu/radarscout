import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

export function buildDeterministicRouteOverview(itinerary: DayTripItinerary): string {
  const matchCount = itinerary.days.length
  const routeDays = itinerary.days
    .map(day => {
      const city = day.experience.city ? ` in ${day.experience.city}` : ''
      return `Day ${day.dayNumber}, ${day.experience.title}${city}`
    })
    .join('; ')

  const overview =
    `Your ${itinerary.tripSpec.durationDays}-day ${itinerary.tripSpec.destination} route currently includes ` +
    `${matchCount} reviewed day-tour ${pluralize(matchCount, 'match', 'matches')}: ${routeDays}.`

  const unfilled = itinerary.unfilledDayCount > 0
    ? ` ${itinerary.unfilledDayCount} ${pluralize(itinerary.unfilledDayCount, 'day')} ${
      itinerary.unfilledDayCount === 1 ? 'remains' : 'remain'
    } unfilled because RadarScout only uses reviewed matches.`
    : ''

  return `${overview}${unfilled} Review each product page for current details.`
}
