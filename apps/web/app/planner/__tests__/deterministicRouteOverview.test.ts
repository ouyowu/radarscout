import { describe, expect, it } from 'vitest'
import type { DayTripItinerary } from '@/lib/ai-trip/itinerary-contract'
import { buildDeterministicRouteOverview } from '../deterministicRouteOverview'

const itinerary: DayTripItinerary = {
  version: 1,
  tripSpec: {
    destination: 'Chiang Mai',
    durationDays: 3,
    interests: ['elephants', 'food'],
    pace: 'relaxed',
    travelerType: 'family',
    groupSize: 4,
    contentScope: 'day_tours_only',
  },
  days: [
    {
      dayNumber: 1,
      experience: {
        productId: 'reviewed-1',
        title: 'Gentle elephant care day',
        city: 'Chiang Mai',
        summary: 'A reviewed day-tour experience.',
        imageUrl: null,
        imageAlt: null,
        tags: ['Elephants', 'Family'],
        detailHref: '/tours/reviewed-1',
        handoff: {
          label: 'Check availability',
          href: 'https://widgets.bokun.io/example',
          rel: 'nofollow sponsored noopener noreferrer',
        },
      },
    },
  ],
  unfilledDayCount: 2,
  safety: {
    availabilityChecked: false,
    bookingCompleted: false,
    paymentHandled: false,
  },
}

describe('deterministic route overview', () => {
  it('summarizes reviewed route days locally without inventing missing plans', () => {
    expect(buildDeterministicRouteOverview(itinerary)).toBe(
      'Your 3-day Chiang Mai route currently includes 1 reviewed day-tour match: Day 1, Gentle elephant care day in Chiang Mai. 2 days remain unfilled because RadarScout only uses reviewed matches. Review each product page for current details.',
    )
  })

  it('uses the correct plural form for multiple reviewed day-tour matches', () => {
    const twoDayItinerary: DayTripItinerary = {
      ...itinerary,
      days: [
        ...itinerary.days,
        {
          ...itinerary.days[0],
          dayNumber: 2,
        },
      ],
      unfilledDayCount: 1,
    }

    expect(buildDeterministicRouteOverview(twoDayItinerary)).toContain(
      '2 reviewed day-tour matches:',
    )
    expect(buildDeterministicRouteOverview(twoDayItinerary)).toContain(
      '1 day remains unfilled',
    )
  })

  it('does not repeat a city already present at the end of an experience title', () => {
    const titledWithCity: DayTripItinerary = {
      ...itinerary,
      days: [
        {
          ...itinerary.days[0],
          experience: {
            ...itinerary.days[0].experience,
            title: 'Gentle elephant care day in Chiang Mai',
          },
        },
      ],
    }

    expect(buildDeterministicRouteOverview(titledWithCity)).toContain(
      'Day 1, Gentle elephant care day in Chiang Mai.',
    )
  })
})
