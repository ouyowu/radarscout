export type WorldCupHostCity = {
  countrySlug: 'usa' | 'canada' | 'mexico'
  countryName: string
  citySlug: string
  cityName: string
  stadiumName: string
  heroTitle: string
  shortDescription: string
  matchDayEssentials: string[]
  popularTourTypes: string[]
  nearbyDayTrips: string[]
  hasLiveInventory: boolean
  comingSoon: boolean
  airportTips: string[]
  stadiumTransferNotes: string[]
  bestAreasToStay: string[]
  matchDayPlan: string[]
  twoDayFanItinerary: string[]
  threeDayFanItinerary: string[]
  foodExperienceIdeas: string[]
  privateTourIdeas: string[]
  nearbyDayTripIdeas: string[]
  faq: Array<{ question: string; answer: string }>
  internalLinks: Array<{ label: string; href: string }>
  seoTitle: string
  seoDescription: string
}

type BaseWorldCupHostCity = Omit<
  WorldCupHostCity,
  | 'airportTips'
  | 'stadiumTransferNotes'
  | 'bestAreasToStay'
  | 'matchDayPlan'
  | 'twoDayFanItinerary'
  | 'threeDayFanItinerary'
  | 'foodExperienceIdeas'
  | 'privateTourIdeas'
  | 'nearbyDayTripIdeas'
  | 'faq'
  | 'internalLinks'
  | 'seoTitle'
  | 'seoDescription'
>

export type WorldCupHostCountry = {
  slug: WorldCupHostCity['countrySlug']
  name: string
  heroTitle: string
  shortDescription: string
}

export type WorldCupCountryRouteIdea = {
  countrySlug: WorldCupHostCity['countrySlug']
  title: string
  description: string
  citySlugs: string[]
}

export const worldCupHostCountries: WorldCupHostCountry[] = [
  {
    slug: 'usa',
    name: 'United States',
    heroTitle: 'World Cup 2026 travel planning across U.S. host cities',
    shortDescription:
      'Plan match-day transfers, private city tours, food experiences, and nearby day trips across America’s host cities as partner inventory expands.',
  },
  {
    slug: 'canada',
    name: 'Canada',
    heroTitle: 'World Cup 2026 city guides for Toronto and Vancouver',
    shortDescription:
      'Build Canada match trips with airport transfers, stadium timing, city highlights, food routes, and future Bókun partner tours.',
  },
  {
    slug: 'mexico',
    name: 'Mexico',
    heroTitle: 'World Cup 2026 planning for Mexico’s host cities',
    shortDescription:
      'Compare Mexico City, Guadalajara, and Monterrey routes with match-day logistics, food experiences, private guides, and coming partner tours.',
  },
]

export const worldCupCountryRouteIdeas: WorldCupCountryRouteIdea[] = [
  {
    countrySlug: 'usa',
    title: 'New York / New Jersey + Boston + Philadelphia',
    description: 'A compact East Coast route for fans who want history, food, and multiple host-city options with shorter intercity hops.',
    citySlugs: ['new-york-new-jersey', 'boston', 'philadelphia'],
  },
  {
    countrySlug: 'usa',
    title: 'Los Angeles + San Francisco + Seattle',
    description: 'A West Coast route for beach, food, city views, and nature day trips between match days.',
    citySlugs: ['los-angeles', 'san-francisco', 'seattle'],
  },
  {
    countrySlug: 'usa',
    title: 'Dallas + Houston + Kansas City',
    description: 'A central U.S. football route built around stadium transfers, barbecue, space, music, and private driving logistics.',
    citySlugs: ['dallas', 'houston', 'kansas-city'],
  },
  {
    countrySlug: 'usa',
    title: 'Miami + Atlanta',
    description: 'A warmer-weather route pairing beach and nightlife with Southern food, history, and high-energy match days.',
    citySlugs: ['miami', 'atlanta'],
  },
  {
    countrySlug: 'canada',
    title: 'Toronto + Niagara Falls',
    description: 'Use Toronto as the match base, then place Niagara Falls on a non-match day with a clean transfer window.',
    citySlugs: ['toronto'],
  },
  {
    countrySlug: 'canada',
    title: 'Vancouver + Whistler',
    description: 'Pair downtown match logistics with a mountain or coastal nature day when the football schedule allows.',
    citySlugs: ['vancouver'],
  },
  {
    countrySlug: 'mexico',
    title: 'Mexico City + Teotihuacan',
    description: 'Balance stadium timing, food neighborhoods, museums, and a non-match-day archaeology route.',
    citySlugs: ['mexico-city'],
  },
  {
    countrySlug: 'mexico',
    title: 'Guadalajara + Tequila region',
    description: 'Use Guadalajara for match logistics and add Tequila as a separate day trip, not a rushed pre-match stop.',
    citySlugs: ['guadalajara'],
  },
  {
    countrySlug: 'mexico',
    title: 'Monterrey mountain day trip',
    description: 'Plan mountain scenery around non-match days, with stadium transfers kept simple and heat-aware.',
    citySlugs: ['monterrey'],
  },
]

const baseWorldCupHostCities: BaseWorldCupHostCity[] = [
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'new-york-new-jersey',
    cityName: 'New York / New Jersey',
    stadiumName: 'MetLife Stadium',
    heroTitle: 'New York / New Jersey World Cup 2026 travel guide',
    shortDescription:
      'Plan stadium transfers, airport timing, Manhattan highlights, food routes, and realistic day trips around the New York / New Jersey host area.',
    matchDayEssentials: ['Choose airport and hotel zones early', 'Keep stadium transfers separate from sightseeing', 'Reserve extra time for rail or private transport'],
    popularTourTypes: ['Private city highlights', 'Food tours', 'Airport transfers', 'Stadium transfers'],
    nearbyDayTrips: ['Hudson Valley', 'Philadelphia', 'Jersey Shore'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'los-angeles',
    cityName: 'Los Angeles',
    stadiumName: 'SoFi Stadium',
    heroTitle: 'Los Angeles World Cup 2026 city and match-day planner',
    shortDescription:
      'Plan Los Angeles match days with airport transfers, beach time, food routes, studio areas, and private driving windows that respect traffic.',
    matchDayEssentials: ['Plan around LAX traffic', 'Keep beach days and match days separate', 'Use private transfers when hotel zones are far apart'],
    popularTourTypes: ['Private drivers', 'Hollywood highlights', 'Food tours', 'Coastal day trips'],
    nearbyDayTrips: ['Malibu', 'Santa Barbara', 'Orange County'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'dallas',
    cityName: 'Dallas',
    stadiumName: 'AT&T Stadium',
    heroTitle: 'Dallas World Cup 2026 match-trip planner',
    shortDescription:
      'Build Dallas and Arlington match plans with stadium transfers, airport timing, food experiences, and Fort Worth day routes.',
    matchDayEssentials: ['Separate Dallas and Arlington timing', 'Confirm pickup points before match day', 'Allow buffer time for large-event traffic'],
    popularTourTypes: ['Stadium transfers', 'Food tours', 'Private city tours', 'Fort Worth day trips'],
    nearbyDayTrips: ['Fort Worth Stockyards', 'Grapevine', 'Waco'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'miami',
    cityName: 'Miami',
    stadiumName: 'Hard Rock Stadium',
    heroTitle: 'Miami World Cup 2026 travel and beach-city guide',
    shortDescription:
      'Plan Miami match days with airport transfers, beach time, food, nightlife, Everglades routes, and realistic stadium transport.',
    matchDayEssentials: ['Avoid tight beach-to-stadium timing', 'Confirm hotel zone pickup windows', 'Keep nightlife plans flexible after matches'],
    popularTourTypes: ['Beach city highlights', 'Food tours', 'Everglades day trips', 'Private transfers'],
    nearbyDayTrips: ['Everglades', 'Key Largo', 'Fort Lauderdale'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'seattle',
    cityName: 'Seattle',
    stadiumName: 'Lumen Field',
    heroTitle: 'Seattle World Cup 2026 city, food, and nature planner',
    shortDescription:
      'Plan Seattle match trips with downtown highlights, airport transfers, food routes, waterfront time, and nearby nature day trips.',
    matchDayEssentials: ['Base near downtown or transit lines', 'Keep nature day trips off match days', 'Account for airport-to-city travel time'],
    popularTourTypes: ['Food tours', 'City highlights', 'Nature day trips', 'Airport transfers'],
    nearbyDayTrips: ['Mount Rainier', 'Bainbridge Island', 'Woodinville'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'san-francisco',
    cityName: 'San Francisco Bay Area',
    stadiumName: 'Levi’s Stadium',
    heroTitle: 'San Francisco Bay Area World Cup 2026 planner',
    shortDescription:
      'Compare San Francisco, Silicon Valley, and Santa Clara timing for match days, airport transfers, food, and coastal day trips.',
    matchDayEssentials: ['Do not treat San Francisco and Santa Clara as one short hop', 'Plan hotel zone around match priorities', 'Keep coastal routes for non-match days'],
    popularTourTypes: ['Private drivers', 'City highlights', 'Wine day trips', 'Coastal routes'],
    nearbyDayTrips: ['Napa Valley', 'Monterey', 'Muir Woods'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'houston',
    cityName: 'Houston',
    stadiumName: 'NRG Stadium',
    heroTitle: 'Houston World Cup 2026 match-day and city guide',
    shortDescription:
      'Plan Houston match days with airport transfers, stadium timing, food routes, space-center day trips, and private city options.',
    matchDayEssentials: ['Choose between IAH and Hobby logistics', 'Leave heat-aware buffers', 'Confirm stadium transfer timing before payment'],
    popularTourTypes: ['Food tours', 'Space Center day trips', 'Private transfers', 'City highlights'],
    nearbyDayTrips: ['Space Center Houston', 'Galveston', 'Brazos Bend'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'atlanta',
    cityName: 'Atlanta',
    stadiumName: 'Mercedes-Benz Stadium',
    heroTitle: 'Atlanta World Cup 2026 travel planner',
    shortDescription:
      'Build Atlanta match trips with airport transfers, stadium timing, food routes, civil-rights history, and private day options.',
    matchDayEssentials: ['Use downtown timing carefully on match days', 'Plan airport transfers around traffic peaks', 'Keep food routes close to hotel zones'],
    popularTourTypes: ['History tours', 'Food tours', 'Private drivers', 'City highlights'],
    nearbyDayTrips: ['North Georgia wine country', 'Stone Mountain', 'Athens'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'boston',
    cityName: 'Boston',
    stadiumName: 'Gillette Stadium',
    heroTitle: 'Boston World Cup 2026 city and stadium planner',
    shortDescription:
      'Plan Boston and Foxborough logistics with airport transfers, history walks, food routes, and day trips beyond match days.',
    matchDayEssentials: ['Treat Foxborough as a dedicated transfer plan', 'Stay realistic with airport-to-stadium timing', 'Keep city walks for non-match windows'],
    popularTourTypes: ['Historic walks', 'Food tours', 'Private transfers', 'Coastal day trips'],
    nearbyDayTrips: ['Cape Cod', 'Salem', 'Newport'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'philadelphia',
    cityName: 'Philadelphia',
    stadiumName: 'Lincoln Financial Field',
    heroTitle: 'Philadelphia World Cup 2026 travel guide',
    shortDescription:
      'Plan Philadelphia match days with stadium transfers, history routes, food experiences, and easy East Coast add-on trips.',
    matchDayEssentials: ['Keep stadium timing separate from historic center visits', 'Plan airport pickup windows clearly', 'Use nearby cities only on non-match days'],
    popularTourTypes: ['Historic city tours', 'Food tours', 'Private transfers', 'East Coast day trips'],
    nearbyDayTrips: ['New York City', 'Washington DC', 'Lancaster County'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'usa',
    countryName: 'United States',
    citySlug: 'kansas-city',
    cityName: 'Kansas City',
    stadiumName: 'Arrowhead Stadium',
    heroTitle: 'Kansas City World Cup 2026 match-trip planner',
    shortDescription:
      'Plan Kansas City match trips with stadium transfers, barbecue routes, jazz history, and private city touring options.',
    matchDayEssentials: ['Confirm stadium transfer pickup points', 'Keep barbecue and match timing realistic', 'Plan airport transfers with extra event buffers'],
    popularTourTypes: ['Food tours', 'Music history', 'Private transfers', 'City highlights'],
    nearbyDayTrips: ['Lawrence', 'Weston', 'Overland Park'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'canada',
    countryName: 'Canada',
    citySlug: 'toronto',
    cityName: 'Toronto',
    stadiumName: 'BMO Field',
    heroTitle: 'Toronto World Cup 2026 city and match-day guide',
    shortDescription:
      'Plan Toronto match days with airport transfers, stadium timing, food neighborhoods, Niagara day trips, and private city tours.',
    matchDayEssentials: ['Plan Pearson airport transfers carefully', 'Keep Niagara Falls for non-match days', 'Use downtown hotel zones for easier city touring'],
    popularTourTypes: ['Food tours', 'Niagara Falls day trips', 'City highlights', 'Private transfers'],
    nearbyDayTrips: ['Niagara Falls', 'Niagara wine country', 'Prince Edward County'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'canada',
    countryName: 'Canada',
    citySlug: 'vancouver',
    cityName: 'Vancouver',
    stadiumName: 'BC Place',
    heroTitle: 'Vancouver World Cup 2026 travel planner',
    shortDescription:
      'Build Vancouver match trips with airport transfers, downtown highlights, food, mountains, and water-based day routes.',
    matchDayEssentials: ['Use downtown timing around BC Place', 'Keep mountain days separate from match days', 'Confirm airport and cruise-port transfer needs'],
    popularTourTypes: ['City highlights', 'Food tours', 'Nature day trips', 'Private transfers'],
    nearbyDayTrips: ['Whistler', 'Victoria', 'North Shore mountains'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'mexico',
    countryName: 'Mexico',
    citySlug: 'mexico-city',
    cityName: 'Mexico City',
    stadiumName: 'Estadio Azteca',
    heroTitle: 'Mexico City World Cup 2026 travel guide',
    shortDescription:
      'Plan Mexico City match days with airport transfers, stadium timing, food routes, museums, and nearby archaeology day trips.',
    matchDayEssentials: ['Account for altitude and traffic', 'Keep Teotihuacan for non-match days', 'Confirm stadium transfer pickup zones early'],
    popularTourTypes: ['Food tours', 'Museum routes', 'Archaeology day trips', 'Private transfers'],
    nearbyDayTrips: ['Teotihuacan', 'Puebla', 'Xochimilco'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'mexico',
    countryName: 'Mexico',
    citySlug: 'guadalajara',
    cityName: 'Guadalajara',
    stadiumName: 'Estadio Akron',
    heroTitle: 'Guadalajara World Cup 2026 travel planner',
    shortDescription:
      'Plan Guadalajara match trips with stadium transfers, food, tequila-region day trips, and private city highlights.',
    matchDayEssentials: ['Separate Tequila day trips from match days', 'Confirm suburban stadium transport', 'Keep food routes near hotel zones'],
    popularTourTypes: ['Food tours', 'Tequila day trips', 'Private transfers', 'City highlights'],
    nearbyDayTrips: ['Tequila', 'Lake Chapala', 'Tlaquepaque'],
    hasLiveInventory: false,
    comingSoon: true,
  },
  {
    countrySlug: 'mexico',
    countryName: 'Mexico',
    citySlug: 'monterrey',
    cityName: 'Monterrey',
    stadiumName: 'Estadio BBVA',
    heroTitle: 'Monterrey World Cup 2026 city and nature planner',
    shortDescription:
      'Plan Monterrey match days with stadium transfers, mountain scenery, food routes, and private day trips outside the city.',
    matchDayEssentials: ['Plan heat-aware timing', 'Keep mountain excursions off match days', 'Confirm transfer times to Guadalupe'],
    popularTourTypes: ['Mountain day trips', 'Food tours', 'Private transfers', 'City highlights'],
    nearbyDayTrips: ['Chipinque', 'Santiago', 'Grutas de García'],
    hasLiveInventory: false,
    comingSoon: true,
  },
]

const countryDestinationSlug: Record<WorldCupHostCity['countrySlug'], string> = {
  usa: 'united-states',
  canada: 'canada',
  mexico: 'mexico',
}

const cityProfiles: Record<string, {
  bestAreasToStay: string[]
  foodExperienceIdeas: string[]
  privateTourIdeas: string[]
}> = {
  'new-york-new-jersey': {
    bestAreasToStay: ['Midtown Manhattan for first-time visitors', 'Downtown Jersey City for easier New Jersey access', 'Newark airport area only for short transfer stays'],
    foodExperienceIdeas: ['New York pizza and bagel route', 'Lower East Side food walk', 'Pre-match casual dining near transit hubs'],
    privateTourIdeas: ['Manhattan highlights by private guide', 'Brooklyn neighborhood route', 'New Jersey stadium transfer plus short city orientation'],
  },
  'los-angeles': {
    bestAreasToStay: ['Santa Monica or Venice for beach time', 'Hollywood or West Hollywood for sightseeing', 'LAX or South Bay for easier airport logistics'],
    foodExperienceIdeas: ['Taco and street-food crawl', 'Koreatown dinner route', 'Beachside casual dining before a non-match evening'],
    privateTourIdeas: ['Hollywood and Griffith Observatory route', 'Malibu coastal drive', 'Private driver route linking beach, studio, and stadium zones'],
  },
  dallas: {
    bestAreasToStay: ['Downtown Dallas for city access', 'Arlington for stadium priority', 'Las Colinas for airport and business-hotel convenience'],
    foodExperienceIdeas: ['Texas barbecue route', 'Tex-Mex dinner plan', 'Fort Worth casual dining day'],
    privateTourIdeas: ['Dallas and Arlington highlights', 'Fort Worth Stockyards day route', 'Private stadium transfer with post-match return'],
  },
  miami: {
    bestAreasToStay: ['South Beach for nightlife and beach time', 'Downtown or Brickell for city access', 'Aventura or north Miami for stadium-side priorities'],
    foodExperienceIdeas: ['Cuban food route', 'Wynwood casual dining and street art', 'Seafood and beach evening plan'],
    privateTourIdeas: ['Miami Beach and Wynwood highlights', 'Everglades private day route', 'Private transfer linking beach hotels and stadium timing'],
  },
  seattle: {
    bestAreasToStay: ['Downtown for stadium and waterfront access', 'Capitol Hill for food and nightlife', 'Airport area only for short layovers'],
    foodExperienceIdeas: ['Pike Place Market tasting route', 'Coffee and neighborhood food walk', 'Waterfront dinner after light sightseeing'],
    privateTourIdeas: ['Seattle highlights and viewpoints', 'Bainbridge Island day route', 'Private nature day outside match windows'],
  },
  'san-francisco': {
    bestAreasToStay: ['San Francisco for sightseeing', 'San Jose or Santa Clara for stadium priority', 'Airport corridor for transfer-heavy stays'],
    foodExperienceIdeas: ['Mission-style food route', 'Chinatown and North Beach walk', 'Wine-country dining on a non-match day'],
    privateTourIdeas: ['Golden Gate and city viewpoints', 'Silicon Valley and Santa Clara timing route', 'Private Napa or Monterey day trip'],
  },
  houston: {
    bestAreasToStay: ['Downtown for city access', 'Medical Center or NRG area for stadium priority', 'Galleria for shopping and dining'],
    foodExperienceIdeas: ['Tex-Mex and barbecue route', 'International food neighborhoods', 'Casual pre-match dining near hotel zones'],
    privateTourIdeas: ['Houston city highlights', 'Space Center day trip', 'Private stadium and airport transfer plan'],
  },
  atlanta: {
    bestAreasToStay: ['Downtown for stadium access', 'Midtown for restaurants and culture', 'Buckhead for hotel comfort and dining'],
    foodExperienceIdeas: ['Southern food route', 'Ponce City Market evening', 'Casual pre-match dining near downtown'],
    privateTourIdeas: ['Civil-rights history route', 'Atlanta city highlights', 'North Georgia private day trip'],
  },
  boston: {
    bestAreasToStay: ['Back Bay for classic city access', 'Downtown for history and transit', 'Foxborough only for stadium-first stays'],
    foodExperienceIdeas: ['North End food walk', 'Seafood and harbor route', 'Pub-style post-match evening'],
    privateTourIdeas: ['Boston history and harbor route', 'Private Foxborough transfer plan', 'Salem or Newport day trip'],
  },
  philadelphia: {
    bestAreasToStay: ['Center City for history and food', 'University City for easier west-side access', 'Airport or stadium area for transfer-heavy trips'],
    foodExperienceIdeas: ['Cheesesteak and market route', 'Old City casual dining', 'South Philly food evening'],
    privateTourIdeas: ['Historic Philadelphia highlights', 'Private stadium transfer and city orientation', 'Lancaster or East Coast add-on day'],
  },
  'kansas-city': {
    bestAreasToStay: ['Downtown for city touring', 'Country Club Plaza for dining and hotels', 'Airport area only for short match stays'],
    foodExperienceIdeas: ['Kansas City barbecue route', 'Jazz district evening', 'Casual pre-match dining plan'],
    privateTourIdeas: ['Kansas City highlights', 'Private stadium transfer plan', 'Music and barbecue night route'],
  },
  toronto: {
    bestAreasToStay: ['Downtown Toronto for stadium and food', 'Waterfront for easier match-day movement', 'Airport area only for short transfer stays'],
    foodExperienceIdeas: ['Kensington Market food walk', 'Waterfront dining route', 'Pre-match casual dining near downtown'],
    privateTourIdeas: ['Toronto highlights and waterfront route', 'Niagara Falls private day trip', 'Private airport and stadium transfer plan'],
  },
  vancouver: {
    bestAreasToStay: ['Downtown Vancouver for BC Place access', 'Coal Harbour for waterfront comfort', 'Richmond for airport convenience'],
    foodExperienceIdeas: ['Granville Island tasting route', 'Asian food neighborhoods', 'Waterfront casual dining after sightseeing'],
    privateTourIdeas: ['Vancouver city and Stanley Park route', 'North Shore nature day', 'Whistler private day trip'],
  },
  'mexico-city': {
    bestAreasToStay: ['Roma or Condesa for food and nightlife', 'Polanco for comfort and dining', 'Historic Center for museums and classic sights'],
    foodExperienceIdeas: ['Taco and market route', 'Roma and Condesa dining walk', 'Pre-match casual food plan with buffer time'],
    privateTourIdeas: ['Mexico City highlights and museums', 'Teotihuacan private day trip', 'Private airport and stadium transfer route'],
  },
  guadalajara: {
    bestAreasToStay: ['Centro for classic sights', 'Providencia for comfort and restaurants', 'Zapopan for stadium-side priorities'],
    foodExperienceIdeas: ['Birria and local market route', 'Tlaquepaque dining evening', 'Tequila-region lunch day'],
    privateTourIdeas: ['Guadalajara city highlights', 'Tequila region private day trip', 'Private stadium transfer plan'],
  },
  monterrey: {
    bestAreasToStay: ['San Pedro for comfort and dining', 'Centro for city access', 'Guadalupe only for stadium-first logistics'],
    foodExperienceIdeas: ['Northern Mexican grill route', 'Barrio Antiguo evening', 'Casual food plan near hotel zones'],
    privateTourIdeas: ['Monterrey city and mountain viewpoints', 'Santiago private day route', 'Private stadium and airport transfer plan'],
  },
}

function buildFanFaq(city: BaseWorldCupHostCity): Array<{ question: string; answer: string }> {
  const firstDayTrip = city.nearbyDayTrips[0]
  const firstFood = cityProfiles[city.citySlug]?.foodExperienceIdeas[0] ?? 'a local food experience'

  return [
    {
      question: `How should I plan match-day transport in ${city.cityName}?`,
      answer: `Plan ${city.stadiumName} transfers as a dedicated logistics block. Keep airport, hotel, and stadium timing separate from long tours, and add extra buffer time on match days.`,
    },
    {
      question: `Are partner tours available in ${city.cityName} yet?`,
      answer: 'Not yet through this page. Bookable products will appear only after local Bókun supplier partners are signed and synced.',
    },
    {
      question: `Can I book private transfers for ${city.stadiumName}?`,
      answer: 'Private transfer ideas are shown for planning, but bookable transfer options will appear only when signed local Bókun suppliers are onboarded.',
    },
    {
      question: `What can I do before a match in ${city.cityName}?`,
      answer: `Choose a short city walk, light sightseeing, or ${firstFood}. Avoid distant day trips before kickoff because crowds and traffic can compress the schedule.`,
    },
    {
      question: `What can I do after the match in ${city.cityName}?`,
      answer: 'Use a simple post-match return plan first. If your hotel zone is convenient, add a low-stress food or nightlife stop after the crowd clears.',
    },
    {
      question: `How many days should I stay in ${city.cityName}?`,
      answer: `Two days can cover arrival plus one match. Three days gives you room for city highlights or a nearby day trip such as ${firstDayTrip}.`,
    },
  ]
}

function enhanceCity(city: BaseWorldCupHostCity): WorldCupHostCity {
  const profile = cityProfiles[city.citySlug]
  const countryPath = `/world-cup-2026/${city.countrySlug}`

  return {
    ...city,
    airportTips: [
      `Confirm your arrival airport, hotel zone, luggage needs, and transfer timing before adding tours in ${city.cityName}.`,
      'Avoid placing a long day trip immediately after an international arrival.',
      'Partner airport transfer options will be added only when local Bókun suppliers are onboarded.',
    ],
    stadiumTransferNotes: [
      `Treat ${city.stadiumName} as the anchor of the day, not a quick stop between tours.`,
      'Arrive earlier on match days and keep buffer time for crowds, security, and post-match exits.',
      'Private transfers can reduce planning stress when hotel zones and stadium zones are far apart.',
    ],
    bestAreasToStay: profile.bestAreasToStay,
    matchDayPlan: [
      'Morning: light breakfast, short nearby walk, and final ticket and bag checks.',
      'Pre-match: keep food or sightseeing close to the hotel or transfer route.',
      `Match window: arrive at ${city.stadiumName} with a clear pickup or return plan.`,
      'Post-match: return safely first, then add food or nightlife only if timing is comfortable.',
    ],
    twoDayFanItinerary: [
      `Day 1: arrive in ${city.cityName}, check into a practical hotel zone, do a short city orientation, and keep dinner close.`,
      `Day 2: use a dedicated match-day transfer to ${city.stadiumName}, arrive early, then return safely before any optional night food plan.`,
    ],
    threeDayFanItinerary: [
      `Day 1: arrival, hotel-area check, and a relaxed city orientation in ${city.cityName}.`,
      `Day 2: city highlights, ${profile.foodExperienceIdeas[0].toLowerCase()}, or a private tour with flexible timing.`,
      `Day 3: match day at ${city.stadiumName}, or use the day for ${city.nearbyDayTrips[0]} if your match is on a different date.`,
    ],
    foodExperienceIdeas: profile.foodExperienceIdeas,
    privateTourIdeas: profile.privateTourIdeas,
    nearbyDayTripIdeas: city.nearbyDayTrips.map(dayTrip => `${dayTrip} as a non-match-day add-on with realistic transfer buffers.`),
    faq: buildFanFaq(city),
    internalLinks: [
      { label: 'World Cup 2026 hub', href: '/world-cup-2026' },
      { label: `${city.countryName} host country guide`, href: countryPath },
      { label: `${city.countryName} destination guide`, href: `/destinations/${countryDestinationSlug[city.countrySlug]}` },
      { label: 'Thailand live partner tours', href: '/tours' },
    ],
    seoTitle: `World Cup 2026 ${city.cityName} Travel Guide | Match-Day Transfers & Day Tours`,
    seoDescription: `Plan your World Cup 2026 trip in ${city.cityName} with match-day transfer ideas, private city tours, food experiences, nearby day trips, and local partner tours as our Bókun supplier network expands.`,
  }
}

export const worldCupHostCities: WorldCupHostCity[] = baseWorldCupHostCities.map(enhanceCity)

export function getWorldCupCountry(countrySlug: string): WorldCupHostCountry | undefined {
  return worldCupHostCountries.find(country => country.slug === countrySlug)
}

export function getWorldCupCity(countrySlug: string, citySlug: string): WorldCupHostCity | undefined {
  return worldCupHostCities.find(city => city.countrySlug === countrySlug && city.citySlug === citySlug)
}

export function getWorldCupCitiesByCountry(countrySlug: string): WorldCupHostCity[] {
  return worldCupHostCities.filter(city => city.countrySlug === countrySlug)
}
