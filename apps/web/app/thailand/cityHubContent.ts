export const cityHubSlugs = ['bangkok', 'chiang-mai', 'phuket'] as const

export type CityHubSlug = (typeof cityHubSlugs)[number]

type CityHubContent = {
  name: string
  catalogueCity: string
  title: string
  description: string
  eyebrow: string
  intro: string
  bestFor: string[]
  planningAdvice: string[]
  watchOut: string[]
  plannerIdea: string
}

export const cityHubContent: Record<CityHubSlug, CityHubContent> = {
  bangkok: {
    name: 'Bangkok',
    catalogueCity: 'bangkok',
    title: 'Bangkok Day Trips & Trip Planner',
    description:
      'Plan Bangkok day trips with reviewed food, canal, temple, and regional experiences, plus clear fit reasons and practical trade-offs.',
    eyebrow: 'Bangkok trip planning',
    intro:
      'Bangkok rewards travelers who group experiences by area. A realistic plan leaves room for traffic, heat, temple dress rules, and the time needed to cross the city.',
    bestFor: [
      'First-time Thailand travelers balancing food and culture',
      'Couples and friends who want guided neighborhood context',
      'Short stays that need a practical city-first route',
    ],
    planningAdvice: [
      'Keep temples and old-city stops together instead of crossing Bangkok repeatedly.',
      'Treat floating-market and regional trips as full-day commitments.',
      'Confirm the meeting point and return time before adding an evening plan.',
    ],
    watchOut: [
      'Peak-hour traffic can make short map distances take much longer.',
      'Temple visits may require covered shoulders and knees.',
      'Boat, food, and nightlife experiences suit different mobility and family needs.',
    ],
    plannerIdea: 'Bangkok 3 days food temples canals',
  },
  'chiang-mai': {
    name: 'Chiang Mai',
    catalogueCity: 'chiang-mai',
    title: 'Chiang Mai Day Trips & Trip Planner',
    description:
      'Plan Chiang Mai day trips with reviewed nature, cooking, temple, and cultural experiences, plus honest traveler-fit guidance.',
    eyebrow: 'Chiang Mai trip planning',
    intro:
      'Chiang Mai works best at a slower pace than Bangkok. Mountain drives, early pickups, cooking sessions, and nature activities should not be stacked as if they were neighboring city stops.',
    bestFor: [
      'Families and couples looking for a slower Thailand itinerary',
      'Travelers interested in cooking, crafts, temples, and nature',
      'Visitors who want reviewed day trips beyond the old city',
    ],
    planningAdvice: [
      'Use one major out-of-town experience per day.',
      'Check whether hotel pickup covers your accommodation area.',
      'Balance active mountain or nature days with a lighter city day.',
    ],
    watchOut: [
      'Mountain transfers can take several hours across a full day.',
      'Seasonal smoke and rain can change the comfort of outdoor plans.',
      'Animal-related experiences require extra review of care practices and contact expectations.',
    ],
    plannerIdea: 'Chiang Mai 3 days nature cooking temples',
  },
  phuket: {
    name: 'Phuket',
    catalogueCity: 'phuket',
    title: 'Phuket Day Trips & Trip Planner',
    description:
      'Plan Phuket day trips with reviewed island, snorkeling, sightseeing, and cultural experiences, plus clear sea-day trade-offs.',
    eyebrow: 'Phuket trip planning',
    intro:
      'Phuket planning depends on where you stay, which pier an activity uses, and whether the day is built around the sea or the island itself. Transfer time matters as much as the headline destination.',
    bestFor: [
      'Couples, families, and friends comparing island-day options',
      'Travelers choosing between snorkeling, sightseeing, and beach time',
      'Visitors who want to separate water days from land-based touring',
    ],
    planningAdvice: [
      'Avoid placing two full island excursions on consecutive days unless the group prefers a packed pace.',
      'Check hotel-to-pier transfer details before comparing departure times.',
      'Keep one weather-flexible land day in a longer Phuket stay.',
    ],
    watchOut: [
      'Sea conditions and operator decisions can affect the day.',
      'A product title may not explain the full transfer and pier sequence.',
      'Snorkeling, speedboats, and long sea days are not equally suitable for every traveler.',
    ],
    plannerIdea: 'Phuket 3 days islands snorkeling culture',
  },
}

export function isCityHubSlug(value: string): value is CityHubSlug {
  return cityHubSlugs.includes(value as CityHubSlug)
}
