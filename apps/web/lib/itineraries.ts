export type ItineraryDay = {
  day: number
  title: string
  location: string
  summary: string
}

export type ItineraryFaq = {
  question: string
  answer: string
}

export type ItineraryLink = {
  label: string
  href: string
}

export type Itinerary = {
  slug: string
  title: string
  seoTitle: string
  seoDescription: string
  destinations: string[]
  countries: string[]
  days: number
  travelStyle: string
  whoThisIsFor: string
  routeSummary: string
  dayByDayPlan: ItineraryDay[]
  bestExperienceTypes: string[]
  estimatedPlanningTimeSaved: string
  hasLiveInventory: boolean
  partnerToursComingSoon: boolean
  faq: ItineraryFaq[]
  relatedLinks: ItineraryLink[]
}

export const itineraries: Itinerary[] = [
  {
    slug: 'thailand-7-days',
    title: 'Thailand 7 Days Itinerary',
    seoTitle: 'Thailand 7 Days Itinerary | AI Travel Planner & Partner Day Tours',
    seoDescription:
      'Plan 7 days in Thailand with Bangkok, Chiang Mai, and Phuket route ideas plus live partner day tours from signed Bókun suppliers.',
    destinations: ['Bangkok', 'Chiang Mai', 'Phuket'],
    countries: ['Thailand'],
    days: 7,
    travelStyle: 'Culture, food, islands, and relaxed private planning',
    whoThisIsFor: 'First-time Thailand travelers who want real partner tours without overloading each day.',
    routeSummary:
      'Use Bangkok for arrival, temples, canals, and food; add Chiang Mai for elephants and northern culture; finish in Phuket with one full island or boat day.',
    dayByDayPlan: [
      { day: 1, title: 'Arrival and easy Bangkok orientation', location: 'Bangkok', summary: 'Keep the first day light with hotel check-in, a neighborhood walk, and a simple dinner route.' },
      { day: 2, title: 'Temples, canals, and old-town food', location: 'Bangkok', summary: 'Use one well-paced city route instead of stitching multiple half-day products together.' },
      { day: 3, title: 'Flexible Bangkok day or transfer north', location: 'Bangkok / Chiang Mai', summary: 'Add a market, cooking, or private transfer day depending on flight timing.' },
      { day: 4, title: 'Ethical elephant or culture day', location: 'Chiang Mai', summary: 'Choose one standalone elephant care, temple, or food experience with clear pickup timing.' },
      { day: 5, title: 'Northern culture and evening food', location: 'Chiang Mai', summary: 'Keep the day balanced with old city, Doi Suthep, or a single food-led experience.' },
      { day: 6, title: 'Fly to Phuket and reset pace', location: 'Phuket', summary: 'Use this as a transfer and beach buffer day rather than forcing a rushed tour.' },
      { day: 7, title: 'Island day or coastal highlights', location: 'Phuket', summary: 'Pick one full-day island tour or one standalone half-day coastal route.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private city tour', 'Food tour', 'Temple route', 'Elephant care', 'Island day tour'],
    estimatedPlanningTimeSaved: '4-7 hours',
    hasLiveInventory: true,
    partnerToursComingSoon: false,
    faq: [
      { question: 'Are Thailand tours bookable now?', answer: 'Yes. Thailand is RadarScout’s first live inventory destination with bookable tours from signed Bókun supplier partners.' },
      { question: 'Should I do two half-day tours in one day?', answer: 'No. RadarScout planning keeps each day to one full-day tour or one standalone half-day tour to avoid pickup and traffic conflicts.' },
      { question: 'Can this route be made private?', answer: 'Some days can be shaped around private transfers or private city touring where partner options are available.' },
      { question: 'Is Phuket better at the start or end?', answer: 'For many travelers it works better at the end, because island days are easier after city and culture stops.' },
      { question: 'Where do I see available tours?', answer: 'Use the Thailand destination page or the tours page to browse current signed Bókun partner inventory.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Thailand destination guide', href: '/destinations/thailand' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'japan-7-days',
    title: 'Japan 7 Days Itinerary',
    seoTitle: 'Japan 7 Days Itinerary | Travel Planning Guide & Partner Tours Coming Soon',
    seoDescription:
      'Plan a 7 day Japan route across Tokyo, Kyoto, and Osaka. Partner tours are coming soon as RadarScout onboards signed Bókun suppliers.',
    destinations: ['Tokyo', 'Kyoto', 'Osaka'],
    countries: ['Japan'],
    days: 7,
    travelStyle: 'Food, culture, neighborhoods, temples, and train-based routing',
    whoThisIsFor: 'First-time Japan travelers who want a classic route without cramming too many cities into one week.',
    routeSummary:
      'Start in Tokyo for neighborhoods and food, use Kyoto for temples and culture, then finish with Osaka food or a flexible day trip.',
    dayByDayPlan: [
      { day: 1, title: 'Arrive and settle into Tokyo', location: 'Tokyo', summary: 'Stay light with a neighborhood walk and simple food plan near the hotel.' },
      { day: 2, title: 'Tokyo highlights by area', location: 'Tokyo', summary: 'Group nearby neighborhoods together so the day is not lost to cross-city transfers.' },
      { day: 3, title: 'Food, culture, or Mount Fuji buffer', location: 'Tokyo', summary: 'Choose one theme for the day, then leave room for train timing.' },
      { day: 4, title: 'Train to Kyoto and evening walk', location: 'Kyoto', summary: 'Use transfer time as part of the plan instead of forcing a full tour day.' },
      { day: 5, title: 'Kyoto temples and old streets', location: 'Kyoto', summary: 'Plan one coherent temple and neighborhood route with realistic walking time.' },
      { day: 6, title: 'Osaka food or Nara day idea', location: 'Osaka / Nara', summary: 'Keep Osaka food as an evening anchor or use Nara as a single day trip.' },
      { day: 7, title: 'Departure buffer', location: 'Osaka / Tokyo', summary: 'Protect final-day logistics and avoid long sightseeing commitments.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private guide', 'Food walk', 'Temple route', 'Cultural workshop', 'Train planning'],
    estimatedPlanningTimeSaved: '3-6 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Are Japan tours bookable on RadarScout now?', answer: 'Not yet. This page is a travel planning guide while signed Bókun suppliers are onboarded for Japan.' },
      { question: 'Is 7 days enough for Japan?', answer: 'It is enough for Tokyo, Kyoto, and Osaka if the route stays disciplined and avoids too many side trips.' },
      { question: 'Should Mount Fuji be included?', answer: 'Only if weather, season, and transfer timing make sense. It should not crowd out Kyoto or Osaka basics.' },
      { question: 'What should be planned first?', answer: 'Plan airport arrival, hotel zones, rail transfers, and city order before adding tours.' },
      { question: 'Will partner tours appear later?', answer: 'Yes. Bookable products will appear only after trusted local Bókun suppliers are signed and synced.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Japan destination guide', href: '/destinations/japan' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'austria-5-days',
    title: 'Austria 5 Days Itinerary',
    seoTitle: 'Austria 5 Days Itinerary | Travel Planning Guide & Partner Tours Coming Soon',
    seoDescription:
      'Plan 5 days in Austria with Vienna, Salzburg, Hallstatt, and alpine route ideas. Partner tours are coming soon.',
    destinations: ['Vienna', 'Salzburg', 'Hallstatt'],
    countries: ['Austria'],
    days: 5,
    travelStyle: 'Elegant city culture, music, lake towns, and alpine scenery',
    whoThisIsFor: 'Travelers who want Austria’s classic cities and scenery without rushing every transfer.',
    routeSummary:
      'Start in Vienna for palaces and culture, move to Salzburg for music and old town, then use one clean lake or alpine day idea.',
    dayByDayPlan: [
      { day: 1, title: 'Vienna arrival and old city orientation', location: 'Vienna', summary: 'Keep arrival day easy with a central walk, cafe stop, and dinner.' },
      { day: 2, title: 'Palaces, museums, or classical evening', location: 'Vienna', summary: 'Choose one culture-heavy route and avoid overstacking museum time.' },
      { day: 3, title: 'Transfer to Salzburg', location: 'Vienna / Salzburg', summary: 'Treat this as a scenic transfer day with an evening old-town walk.' },
      { day: 4, title: 'Salzburg culture and viewpoints', location: 'Salzburg', summary: 'Use a compact route for music history, old town, and hilltop views.' },
      { day: 5, title: 'Hallstatt or alpine day idea', location: 'Hallstatt / Alps', summary: 'Choose one full-day lake or alpine route with clean transport timing.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private city tour', 'Palace route', 'Lake town day trip', 'Classical music evening', 'Alpine drive'],
    estimatedPlanningTimeSaved: '3-5 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Are Austria tours bookable now?', answer: 'Not yet. Austria is a planning page until signed Bókun supplier inventory is onboarded.' },
      { question: 'Is Hallstatt worth adding?', answer: 'Yes for scenery, but it works best as one dedicated day rather than a rushed add-on.' },
      { question: 'Should Vienna or Salzburg get more time?', answer: 'Vienna usually deserves more time for museums and palaces; Salzburg works well as a compact base.' },
      { question: 'Can this connect to Germany?', answer: 'Yes. Salzburg to Munich is a practical next step for a multi-country route.' },
      { question: 'What bookable inventory is live today?', answer: 'Current bookable RadarScout partner inventory is live in Thailand only.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Austria destination guide', href: '/destinations/austria' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'germany-3-days',
    title: 'Germany 3 Days Itinerary',
    seoTitle: 'Germany 3 Days Itinerary | Travel Planning Guide & Partner Tours Coming Soon',
    seoDescription:
      'Plan a 3 day Germany city break with Munich or Berlin route ideas. Partner tours are coming soon as local Bókun suppliers are onboarded.',
    destinations: ['Munich', 'Berlin'],
    countries: ['Germany'],
    days: 3,
    travelStyle: 'Compact city highlights, food, history, and one possible day trip',
    whoThisIsFor: 'Travelers adding Germany as a short stop inside a larger Europe route.',
    routeSummary:
      'Pick one base city rather than splitting three days across multiple German cities. Add one private city route or one nearby day trip.',
    dayByDayPlan: [
      { day: 1, title: 'Arrival and city orientation', location: 'Munich or Berlin', summary: 'Use the first day for hotel zone, old town or neighborhood orientation, and food.' },
      { day: 2, title: 'History, museums, or beer and food route', location: 'Munich or Berlin', summary: 'Choose one city theme and keep transfers compact.' },
      { day: 3, title: 'Nearby day trip or deeper city route', location: 'Munich or Berlin', summary: 'Use one full-day castle, history, or city route depending on your base.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private city tour', 'History tour', 'Food route', 'Castle day trip', 'Museum day'],
    estimatedPlanningTimeSaved: '2-4 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Can I visit Berlin and Munich in 3 days?', answer: 'It is possible but not recommended. One base city will produce a better trip with less transfer waste.' },
      { question: 'Are Germany products bookable here?', answer: 'Not yet. Germany partner tours will appear only after signed Bókun suppliers are onboarded.' },
      { question: 'Which city is better for first-timers?', answer: 'Munich is strong for Bavaria and castles; Berlin is stronger for history, museums, and nightlife.' },
      { question: 'Should I add a castle day trip?', answer: 'Only if Munich is your base and you can dedicate a full day to it.' },
      { question: 'Where can I book live tours now?', answer: 'Thailand is currently the live RadarScout Bókun inventory destination.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Germany destination guide', href: '/destinations/germany' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'france-3-days',
    title: 'France 3 Days Itinerary',
    seoTitle: 'France 3 Days Itinerary | Travel Planning Guide & Partner Tours Coming Soon',
    seoDescription:
      'Plan 3 days in France with a Paris-focused route, food, museums, and private day trip ideas. Partner tours are coming soon.',
    destinations: ['Paris'],
    countries: ['France'],
    days: 3,
    travelStyle: 'Paris highlights, food, museums, and one optional nearby day trip',
    whoThisIsFor: 'Travelers who want France as a focused short stop instead of a rushed country-wide plan.',
    routeSummary:
      'Use Paris as the base, group major sights by area, and add one food, museum, or nearby day trip only if timing is comfortable.',
    dayByDayPlan: [
      { day: 1, title: 'Arrival and central Paris walk', location: 'Paris', summary: 'Keep it simple with the Seine, cafes, and a low-pressure neighborhood route.' },
      { day: 2, title: 'Museum or classic city highlights', location: 'Paris', summary: 'Pick one anchor museum or classic route and avoid crossing the city too often.' },
      { day: 3, title: 'Food route or nearby day idea', location: 'Paris / nearby', summary: 'Choose food, Versailles-style planning, or a quieter neighborhood route before departure.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private city tour', 'Food tour', 'Museum route', 'Wine bar route', 'Nearby day trip'],
    estimatedPlanningTimeSaved: '2-4 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Is 3 days enough for France?', answer: 'It is enough for a Paris-focused route. It is not enough for a broad France itinerary.' },
      { question: 'Are France tours bookable now?', answer: 'Not yet. This page provides planning guidance while Bókun suppliers are onboarded.' },
      { question: 'Should Versailles be included?', answer: 'Only if you dedicate a day or a clear half-day to it and do not overload the same date.' },
      { question: 'What should I avoid?', answer: 'Avoid stacking museums, food tours, and long transfers into one day.' },
      { question: 'Does RadarScout show affiliate tours?', answer: 'No. Bookable tours must come from signed Bókun supplier partners.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'France destination guide', href: '/destinations/france' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'austria-germany-france-11-days',
    title: 'Austria, Germany, France 11 Days Itinerary',
    seoTitle: 'Austria Germany France 11 Days Itinerary | Travel Planning Guide & Partner Tours Coming Soon',
    seoDescription:
      'Plan an 11 day Europe route through Austria, Germany, and France with realistic transfer days and partner tours coming soon.',
    destinations: ['Vienna', 'Salzburg', 'Munich', 'Paris'],
    countries: ['Austria', 'Germany', 'France'],
    days: 11,
    travelStyle: 'Multi-country Europe route with culture, food, scenery, and clean transfer buffers',
    whoThisIsFor: 'Travelers who want Austria 5 days, Germany 3 days, and France 3 days without building a rushed schedule.',
    routeSummary:
      'Start with Austria for culture and scenery, continue to Germany with one focused base, then finish in Paris with food and classic city highlights.',
    dayByDayPlan: [
      { day: 1, title: 'Vienna arrival', location: 'Vienna', summary: 'Use arrival day for hotel check-in, old city orientation, and a light dinner.' },
      { day: 2, title: 'Vienna palace or museum route', location: 'Vienna', summary: 'Pick one cultural anchor and avoid overloading the day.' },
      { day: 3, title: 'Vienna food, music, or private city idea', location: 'Vienna', summary: 'Keep one theme for the day and leave the evening flexible.' },
      { day: 4, title: 'Transfer to Salzburg', location: 'Salzburg', summary: 'Use this as a clean transfer and old-town evening day.' },
      { day: 5, title: 'Salzburg or lake region', location: 'Salzburg / Hallstatt', summary: 'Choose one full-day Salzburg or lake route with realistic timing.' },
      { day: 6, title: 'Move to Munich', location: 'Munich', summary: 'Treat the transfer as part of the plan and avoid a full tour on arrival.' },
      { day: 7, title: 'Munich highlights', location: 'Munich', summary: 'Use one city route for old town, food, or history.' },
      { day: 8, title: 'Castle, history, or food day', location: 'Munich region', summary: 'Choose one day trip or one deeper city route.' },
      { day: 9, title: 'Transfer to Paris', location: 'Paris', summary: 'Protect rail or flight timing and keep the evening light.' },
      { day: 10, title: 'Paris classics', location: 'Paris', summary: 'Group sights by area and choose one museum or city route.' },
      { day: 11, title: 'Paris food or departure buffer', location: 'Paris', summary: 'Use the final day for food, neighborhoods, or airport timing.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Private city tour', 'Food tour', 'Palace route', 'Castle day trip', 'Museum route', 'Rail transfer planning'],
    estimatedPlanningTimeSaved: '5-8 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Is Austria, Germany, and France in 11 days realistic?', answer: 'Yes, if the route uses a small number of bases and treats transfer days honestly.' },
      { question: 'Are these Europe tours bookable now?', answer: 'Not yet. These itinerary pages are planning guides until signed Bókun suppliers are onboarded.' },
      { question: 'Where should the route start?', answer: 'Vienna is a strong start because it connects naturally to Salzburg and Munich before Paris.' },
      { question: 'Should I add Switzerland or Italy?', answer: 'Not in this 11 day version. Extra countries would likely make the route too rushed.' },
      { question: 'What live inventory exists today?', answer: 'Bookable RadarScout partner tours are currently available in Thailand only.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Austria destination guide', href: '/destinations/austria' },
      { label: 'Germany destination guide', href: '/destinations/germany' },
      { label: 'France destination guide', href: '/destinations/france' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'world-cup-2026-usa-7-days',
    title: 'World Cup 2026 USA 7 Days Itinerary',
    seoTitle: 'World Cup 2026 USA 7 Days Itinerary | Host Cities, Transfers & Partner Tours Coming Soon',
    seoDescription:
      'Plan a 7 day World Cup 2026 USA route with host city ideas, match-day transfers, food routes, and partner tours coming soon.',
    destinations: ['New York / New Jersey', 'Boston', 'Philadelphia'],
    countries: ['United States'],
    days: 7,
    travelStyle: 'Football travel, host city logistics, food, transfers, and flexible sightseeing',
    whoThisIsFor: 'World Cup travelers who want a compact East Coast route around match days.',
    routeSummary:
      'Use New York / New Jersey as the main base, then connect Boston or Philadelphia only if match dates and transfer timing allow.',
    dayByDayPlan: [
      { day: 1, title: 'Arrive and settle near your hotel zone', location: 'New York / New Jersey', summary: 'Confirm airport transfer, hotel area, and stadium access before adding sightseeing.' },
      { day: 2, title: 'City highlights and food', location: 'New York City', summary: 'Use one compact city route grouped by neighborhoods.' },
      { day: 3, title: 'Match-day logistics', location: 'MetLife Stadium area', summary: 'Keep stadium transfer separate from long sightseeing or day trips.' },
      { day: 4, title: 'Recovery day or food route', location: 'New York / New Jersey', summary: 'Use a lighter post-match day with food, parks, or museums.' },
      { day: 5, title: 'Boston or Philadelphia add-on', location: 'Boston / Philadelphia', summary: 'Choose one city add-on, not both, unless match dates demand it.' },
      { day: 6, title: 'Second host-city route', location: 'Boston / Philadelphia', summary: 'Plan city highlights around rail or transfer timing.' },
      { day: 7, title: 'Departure buffer', location: 'New York / New Jersey', summary: 'Protect flight timing and avoid a long day trip before departure.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Stadium transfer', 'Private city tour', 'Food tour', 'Museum route', 'Match-day transfer'],
    estimatedPlanningTimeSaved: '4-7 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Are World Cup USA tours bookable now?', answer: 'Not yet. USA World Cup pages are planning guides while local Bókun suppliers are onboarded.' },
      { question: 'Should I book stadium transfers separately?', answer: 'Yes. Match-day transfers should be planned as dedicated logistics blocks.' },
      { question: 'Can I visit multiple host cities in 7 days?', answer: 'Yes, but only with realistic buffers between match days and transfers.' },
      { question: 'Does RadarScout sell match tickets?', answer: 'No. This itinerary is for travel planning, transfers, city experiences, and future partner tours.' },
      { question: 'Where is live inventory available today?', answer: 'Thailand is currently RadarScout’s first live Bókun supplier destination.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'United States destination guide', href: '/destinations/united-states' },
      { label: 'World Cup 2026 hub', href: '/world-cup-2026' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
  {
    slug: 'world-cup-2026-mexico-5-days',
    title: 'World Cup 2026 Mexico 5 Days Itinerary',
    seoTitle: 'World Cup 2026 Mexico 5 Days Itinerary | Host Cities, Transfers & Partner Tours Coming Soon',
    seoDescription:
      'Plan 5 days in Mexico for World Cup 2026 with Mexico City, match-day logistics, food routes, and partner tours coming soon.',
    destinations: ['Mexico City', 'Guadalajara', 'Monterrey'],
    countries: ['Mexico'],
    days: 5,
    travelStyle: 'Football travel, food, culture, airport transfers, and match-day planning',
    whoThisIsFor: 'World Cup travelers who want Mexico host-city planning without overloading match days.',
    routeSummary:
      'Use Mexico City as the simplest base for a 5 day route, then add Guadalajara or Monterrey only if the match schedule requires it.',
    dayByDayPlan: [
      { day: 1, title: 'Arrival and hotel zone setup', location: 'Mexico City', summary: 'Confirm airport transfer, hotel area, and stadium route before sightseeing.' },
      { day: 2, title: 'Food and city highlights', location: 'Mexico City', summary: 'Plan one food or city route with heat, traffic, and neighborhood timing in mind.' },
      { day: 3, title: 'Match-day plan', location: 'Mexico City', summary: 'Keep stadium transfer separate from long tours or archaeology day trips.' },
      { day: 4, title: 'Culture or archaeology day idea', location: 'Mexico City region', summary: 'Use a dedicated day for museums, neighborhoods, or Teotihuacan-style planning.' },
      { day: 5, title: 'Departure or second host city buffer', location: 'Mexico City / second host city', summary: 'Protect airport timing or use the day to transfer cleanly to the next match base.' },
    ],
    bestExperienceTypes: ['Airport transfer', 'Stadium transfer', 'Food tour', 'Private city tour', 'Archaeology day trip', 'Match-day transfer'],
    estimatedPlanningTimeSaved: '3-6 hours',
    hasLiveInventory: false,
    partnerToursComingSoon: true,
    faq: [
      { question: 'Are Mexico World Cup tours bookable now?', answer: 'Not yet. Mexico itinerary pages are planning guides until signed Bókun suppliers are onboarded.' },
      { question: 'Is 5 days enough for multiple Mexico host cities?', answer: 'Usually one main base is more realistic unless match tickets require another city.' },
      { question: 'Should Teotihuacan be on a match day?', answer: 'No. Treat archaeology day trips as dedicated non-match days.' },
      { question: 'Does this page include ticket sales?', answer: 'No. RadarScout does not sell World Cup tickets.' },
      { question: 'Will bookable tours be added later?', answer: 'Only after trusted local Bókun suppliers are signed and synced into the RadarScout catalog.' },
    ],
    relatedLinks: [
      { label: 'AI Trip Planner', href: '/ai-trip-planner' },
      { label: 'All destinations', href: '/destinations' },
      { label: 'Mexico destination guide', href: '/destinations/mexico' },
      { label: 'World Cup 2026 hub', href: '/world-cup-2026' },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
  },
]

export function getItinerary(slug: string): Itinerary | undefined {
  return itineraries.find(itinerary => itinerary.slug === slug)
}
