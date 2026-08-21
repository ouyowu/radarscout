import type { AgodaAreaCitySlug } from '../affiliates/agodaAreaRecommendations'

const BASE = 'https://www.radarscout.io'

export const guideCitySlugs = ['bangkok', 'chiang-mai', 'phuket'] as const

export type GuideCitySlug = (typeof guideCitySlugs)[number]

export type ThailandGuideSection = {
  heading: string
  paragraphs: readonly string[]
  checklist?: readonly string[]
}

export type ThailandGuideArticle = {
  citySlug: GuideCitySlug
  cityName: string
  slug: string
  /**
   * Set on stay-area decision guides. A reader who has just compared
   * neighbourhoods is choosing where to book, so those guides show the
   * reviewed Agoda area panel. Guides that are not about where to stay leave
   * this unset and render no accommodation handoff.
   */
  stayAreaCitySlug?: AgodaAreaCitySlug
  href: string
  canonicalUrl: string
  title: string
  seoTitle: string
  description: string
  eyebrow: string
  quickAnswer: string
  bestFor: readonly string[]
  notIdealFor: readonly string[]
  sections: readonly ThailandGuideSection[]
  takeaway: string
  plannerHref: string
  plannerLabel: string
  officialSources: readonly { label: string; href: string }[]
  author: { name: string; href: string }
  reviewedBy: string
  publishedAt: string
  updatedAt: string
  reviewMethod: string
}

export type ThailandGuideCity = {
  slug: GuideCitySlug
  name: string
  title: string
  description: string
  intro: string
  plannerHref: string
}

export const thailandGuideCities: Record<GuideCitySlug, ThailandGuideCity> = {
  bangkok: {
    slug: 'bangkok',
    name: 'Bangkok',
    title: 'Bangkok Travel Guides',
    description:
      'Original Bangkok planning guides for choosing a stay area, grouping neighborhoods, and building realistic day-trip plans.',
    intro:
      'Bangkok decisions are usually about location and travel time, not a lack of options. These guides compare the trade-offs that matter before you choose a base or add another day tour.',
    plannerHref: '/planner?idea=Bangkok%203%20days%20food%20temples%20canals',
  },
  'chiang-mai': {
    slug: 'chiang-mai',
    name: 'Chiang Mai',
    title: 'Chiang Mai Travel Guides',
    description:
      'Original Chiang Mai planning guides for elephant experiences, mountain-day pacing, pickup coverage, and traveler fit.',
    intro:
      'Chiang Mai rewards slower planning. These guides help you compare animal-care expectations, transfer time, activity intensity, and the practical limits hidden behind similar-looking tours.',
    plannerHref: '/planner?idea=Chiang%20Mai%203%20days%20nature%20cooking%20temples',
  },
  phuket: {
    slug: 'phuket',
    name: 'Phuket',
    title: 'Phuket Travel Guides',
    description:
      'Original Phuket planning guides for island-day choices, pier transfers, sea-day intensity, and weather-flexible itineraries.',
    intro:
      'In Phuket, the headline island is only part of the decision. These guides compare route character, boat time, transfer burden, and who will actually enjoy the day.',
    plannerHref: '/planner?idea=Phuket%203%20days%20islands%20snorkeling%20culture',
  },
}

const sharedEditorial = {
  author: { name: 'RadarScout Editorial Team', href: '/about-us' },
  reviewedBy: 'RadarScout Thailand desk',
  publishedAt: '2026-08-03',
  updatedAt: '2026-08-03',
  reviewMethod:
    'RadarScout compares stable destination trade-offs, traveler fit, transfer burden, activity intensity, and questions to confirm with the transaction partner. We do not present changing stock status, operator promises, or copied partner descriptions as editorial fact.',
} as const

const dailyEditorial = {
  ...sharedEditorial,
  publishedAt: '2026-08-04',
  updatedAt: '2026-08-04',
} as const

const dailyEditorialAugust5 = {
  ...sharedEditorial,
  publishedAt: '2026-08-05',
  updatedAt: '2026-08-05',
} as const

const articleDrafts: readonly Omit<ThailandGuideArticle, 'href' | 'canonicalUrl'>[] = [
  {
    citySlug: 'chiang-mai',
    cityName: 'Chiang Mai',
    slug: 'how-to-choose-an-elephant-sanctuary',
    title: 'How to Choose an Elephant Sanctuary in Chiang Mai',
    seoTitle: 'How to Choose a Chiang Mai Elephant Sanctuary | RadarScout',
    description:
      'A practical Chiang Mai elephant sanctuary decision guide covering animal contact, group fit, transfer time, half-day versus full-day formats, and questions to ask.',
    eyebrow: 'Chiang Mai decision guide',
    quickAnswer:
      'Start with the experience rules, not the photos. Decide how much animal contact you are comfortable with, confirm what the day actually includes, then compare transfer time, group needs, walking conditions, and the operator details shown by the transaction partner.',
    bestFor: [
      'First-time visitors comparing several similar-looking elephant experiences',
      'Families who need to understand walking, changing, and transfer demands',
      'Travelers who want an observation-led day rather than a photo-led decision',
    ],
    notIdealFor: [
      'Travelers expecting guaranteed close contact with elephants',
      'Anyone who has not checked mobility, clothing, and pickup requirements',
      'A packed day that already includes another long mountain transfer',
    ],
    sections: [
      {
        heading: 'Begin with the animal-contact policy',
        paragraphs: [
          'The word sanctuary is not a complete description of an experience. Two products can use similar language while offering very different levels of observation, feeding, bathing, photography, or guided interpretation. Read the current activity description and rules before treating the label as evidence.',
          'A useful first decision is personal: do you want quiet observation, limited guided interaction, or a more hands-on format? RadarScout recommends choosing the contact level first, then comparing products that fit that boundary. This keeps a striking photo from making the decision for you.',
        ],
        checklist: [
          'What types of contact are described, and which are optional?',
          'How does the operator explain elephant care and visitor behavior?',
          'Are group size, guide support, and the daily sequence explained clearly?',
        ],
      },
      {
        heading: 'Half day or full day is really a transfer-and-energy choice',
        paragraphs: [
          'A half-day format can be the better fit when Chiang Mai is only one stop in a wider Thailand itinerary, when children tire quickly, or when you want a lighter old-city evening. A full day may suit travelers who prefer a slower program and do not want to rush the return journey.',
          'Do not compare only the advertised program length. Ask how much of the day is hotel pickup, shared transport, waiting, walking, changing clothes, and returning through traffic. The same headline duration can feel very different depending on the location and pickup sequence.',
        ],
        checklist: [
          'Confirm the pickup zone and approximate transfer burden.',
          'Leave the evening flexible after a mountain or rural day.',
          'Avoid stacking another fixed-time activity immediately after the expected return.',
        ],
      },
      {
        heading: 'Match the day to the least mobile person in the group',
        paragraphs: [
          'Mud, slopes, steps, heat, rain, changing areas, and basic rural facilities can matter more than the headline activity. Families, older travelers, pregnant travelers, and anyone with mobility concerns should ask for current accessibility details directly from the transaction partner before committing.',
          'Clothing expectations also affect comfort. Closed shoes, quick-dry clothing, sun protection, insect protection, and a dry change of clothes may be useful depending on the program. Treat packing guidance as a question to verify, not a promise that every site provides the same facilities.',
        ],
      },
      {
        heading: 'Use a five-question comparison instead of a popularity ranking',
        paragraphs: [
          'The most useful comparison is not which experience is universally best. It is which one best fits your contact preference, group needs, available time, pickup area, and tolerance for a long rural transfer. Those five answers produce a more defensible shortlist than ratings or social-media popularity alone.',
          'Before the external handoff, RadarScout uses reviewed public product fields to explain fit and trade-offs. Current inclusions, operational rules, cancellation terms, and transaction details remain on the partner page and should be checked there.',
        ],
        checklist: [
          'Contact level: observation, feeding, bathing, or another format?',
          'Traveler fit: children, mobility, heat, rain, and changing facilities?',
          'Time fit: pickup zone, road time, and realistic return window?',
          'Program clarity: what is explicitly included in the current description?',
          'Decision confidence: which unanswered question must be confirmed before proceeding?',
        ],
      },
    ],
    takeaway:
      'Choose the experience whose rules and daily rhythm fit your group. “Sanctuary” should begin your questions, not end them.',
    plannerHref: '/chiang-mai/elephant-camp-finder',
    plannerLabel: 'Compare Chiang Mai elephant experiences',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Chiang Mai destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101',
      },
    ],
    ...sharedEditorial,
  },
  {
    citySlug: 'phuket',
    cityName: 'Phuket',
    slug: 'phi-phi-vs-james-bond-island',
    title: 'Phi Phi vs James Bond Island: Which Phuket Day Trip Fits You?',
    seoTitle: 'Phi Phi vs James Bond Island from Phuket | RadarScout',
    description:
      'Compare Phi Phi and James Bond Island day trips by scenery, boat time, activity style, transfer burden, and traveler fit before choosing a Phuket sea day.',
    eyebrow: 'Phuket island-day comparison',
    quickAnswer:
      'Choose Phi Phi when open-sea scenery, beaches, and snorkeling are the priority. Choose the Phang Nga Bay and James Bond Island route when limestone scenery, sheltered-water cruising, caves, or village stops matter more. The right answer still depends on pier transfer, boat type, sea tolerance, and the current route.',
    bestFor: [
      'Travelers choosing one major island day during a Phuket stay',
      'Couples, families, and friends comparing sea time with sightseeing time',
      'Visitors who want to understand the route before comparing individual products',
    ],
    notIdealFor: [
      'Anyone treating all island tours as interchangeable',
      'Travelers who have not checked boat type or hotel-to-pier transfer',
      'People with strong motion sensitivity who have not discussed the route with the operator',
    ],
    sections: [
      {
        heading: 'The two routes deliver different kinds of scenery',
        paragraphs: [
          'Phi Phi is an Andaman Sea island route associated with dramatic bays, beaches, and water-focused stops. A typical decision centers on how much snorkeling, beach time, open-water travel, and stop density you want. It is usually the more obvious choice for travelers whose mental picture of Phuket is a bright sea day.',
          'James Bond Island is part of a Phang Nga Bay decision. The attraction is the limestone karst landscape and a route that may combine viewpoints, caves, canoeing, or community stops. It can feel more like a scenic journey through a bay than a beach-first island day.',
        ],
      },
      {
        heading: 'Boat time and boat type change the experience',
        paragraphs: [
          'A speedboat, larger vessel, and long-tail boat do not create the same ride. Boarding, seating, spray, shade, noise, restroom access, and the amount of open-water travel can matter to children, older travelers, and anyone sensitive to motion. Compare the current vessel information instead of assuming the destination tells you how the day will feel.',
          'The closest-looking departure time may also hide a long hotel pickup. Phuket traffic and the location of the pier can turn a nominally early start into a much earlier hotel departure. Check both ends of the route: hotel to pier, then pier to destination.',
        ],
        checklist: [
          'Which pier does the trip use, and is your hotel inside the stated pickup area?',
          'What boat type is listed for the current product?',
          'How many planned stops compete for the same day?',
        ],
      },
      {
        heading: 'Pick by traveler fit, not only by the famous name',
        paragraphs: [
          'Strong swimmers and travelers prioritizing snorkeling may lean toward a Phi Phi route with clearly described water stops. Travelers who prefer landscape, photography, and a varied sightseeing sequence may lean toward Phang Nga Bay. Families should inspect age, mobility, life-jacket, and boarding information before treating either route as automatically family-friendly.',
          'Neither option is universally calmer or better. Conditions, route design, vessel choice, and operational decisions shape the day. Keep claims about current conditions on the operator or transaction partner page, where they can be checked closest to the handoff.',
        ],
      },
      {
        heading: 'A simple decision rule for a three-day Phuket stay',
        paragraphs: [
          'Set aside one day for the sea, one for Phuket itself, and one as a flexible day rather than booking multiple long boat trips back to back. If snorkeling and beaches are the central goal, compare Phi Phi products first. If scenery and a mixed bay route are more appealing, compare James Bond Island and Phang Nga Bay products first.',
          'After choosing the route family, compare only products that match your pier, boat, group, and activity requirements. This two-stage decision is faster and more reliable than scanning a large product grid without a route preference.',
        ],
        checklist: [
          'Route first: Phi Phi or Phang Nga Bay?',
          'Fit second: boat, pickup, mobility, swimming, and stop sequence?',
          'Partner check last: current details, terms, and transaction information?',
        ],
      },
    ],
    takeaway:
      'Pick the route character first, then the product. Phi Phi and James Bond Island solve different travel goals even when both are sold as a Phuket island day.',
    plannerHref: '/phuket/island-day-selector',
    plannerLabel: 'Find your Phuket island day',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Ko Phi Phi overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Ko-Phi-Phi/359',
      },
      {
        label: 'Tourism Authority of Thailand: Phang Nga route overview',
        href: 'https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/phang-nga-go-green-2-days-1-night',
      },
    ],
    ...sharedEditorial,
  },
  {
    citySlug: 'bangkok',
    cityName: 'Bangkok',
    slug: 'best-areas-to-stay-first-time-visitors',
    stayAreaCitySlug: 'bangkok',
    title: 'Best Bangkok Areas to Stay for First-Time Visitors',
    seoTitle: 'Best Areas to Stay in Bangkok for First-Timers | RadarScout',
    description:
      'Compare Bangkok Riverside, Old Town, and Sukhumvit by sightseeing style, transport trade-offs, evening plans, and day-trip fit before choosing a base.',
    eyebrow: 'Bangkok stay-area decision',
    quickAnswer:
      'Choose Riverside for river atmosphere and a slower scenic base, Old Town for temple-heavy days and historic context, or Sukhumvit for rail access, dining, and flexible evenings. The best area is the one that reduces travel for your highest-priority days.',
    bestFor: [
      'First-time Bangkok visitors choosing a base before comparing hotels',
      'Travelers balancing temples, food, nightlife, and regional day trips',
      'Couples or families who want location trade-offs explained without a hotel ranking',
    ],
    notIdealFor: [
      'Travelers looking for a universal “best hotel” answer',
      'Anyone choosing only by straight-line distance on a map',
      'A stay planned without considering late-night transport or early tour meeting points',
    ],
    sections: [
      {
        heading: 'Riverside: choose atmosphere and river access',
        paragraphs: [
          'The Chao Phraya shapes many of Bangkok’s historic and cultural routes. A Riverside base can make river travel, evening views, and a slower return to the hotel feel central to the trip. It suits travelers who want the setting to be part of the stay rather than simply a place to sleep.',
          'The trade-off is that rail access and cross-city journeys vary by exact location. A hotel described as Riverside may sit close to a useful pier, far from one, or on the opposite bank from your main plans. Check the real walking and transfer sequence instead of relying on the district label alone.',
        ],
      },
      {
        heading: 'Old Town: choose temples and historic neighborhoods',
        paragraphs: [
          'Old Town can be a strong fit when the Grand Palace area, Wat Pho, river temples, museums, and historic streets dominate the itinerary. It reduces the temptation to cross the city repeatedly for a temple-focused first day and gives early sightseeing a practical advantage.',
          'The trade-off is that late-evening rail convenience and access to some modern shopping or nightlife areas may be weaker. Travelers planning several nights around Sukhumvit or a sequence of suburban meeting points should compare the transport burden before choosing Old Town for the entire stay.',
        ],
      },
      {
        heading: 'Sukhumvit: choose rail access and flexible evenings',
        paragraphs: [
          'Sukhumvit is useful when BTS or MRT access, restaurants, shopping, and flexible evenings matter more than waking up beside the historic core. The exact station is more important than the broad district name: a short, comfortable walk to useful rail can save more time than a famous neighborhood label.',
          'The trade-off is that temple and river days still require deliberate routing. A low map distance does not guarantee a quick journey in traffic. Group old-city sights into one or two focused days rather than commuting back and forth for individual stops.',
        ],
      },
      {
        heading: 'Choose the base by your hardest day, not your easiest evening',
        paragraphs: [
          'Write down the two days that would be most frustrating from the wrong location: perhaps an early old-city start, a regional tour meeting point, a river-heavy day, or several late evenings. Choose the area that makes those days easier, then confirm the exact property location and transport options on Agoda.',
          'RadarScout recommends areas, not individual hotel inventory. The accommodation partner remains responsible for current property details and the transaction. This keeps the decision layer focused on why a district fits while the hotel platform handles the changing commercial information.',
        ],
        checklist: [
          'Mark the two highest-priority days on a map.',
          'Check the exact walk to rail, pier, or meeting point.',
          'Consider the return journey, not only the morning departure.',
          'Compare the final property details on Agoda before proceeding.',
        ],
      },
    ],
    takeaway:
      'Bangkok’s best area is itinerary-dependent. Reduce the travel burden for your most important days, then let hotel selection happen inside that area.',
    plannerHref: '/thailand/bangkok',
    plannerLabel: 'Plan a realistic Bangkok stay',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Bangkok destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/bangkok/219',
      },
      {
        label: 'Tourism Authority of Thailand: Kudi Chin riverside community',
        href: 'https://www.tourismthailand.org/Articles/wander-through-kudi-chin-en',
      },
    ],
    ...sharedEditorial,
  },
  {
    citySlug: 'bangkok',
    cityName: 'Bangkok',
    slug: 'ayutthaya-vs-floating-market-day-trip',
    title: 'Ayutthaya vs Floating Market: Which Bangkok Day Trip Fits You?',
    seoTitle: 'Ayutthaya vs Floating Market Day Trip | RadarScout',
    description:
      'Compare Ayutthaya and floating-market day trips from Bangkok by history, route style, transfer burden, walking, and traveler fit.',
    eyebrow: 'Bangkok day-trip comparison',
    quickAnswer:
      'Choose Ayutthaya when historic temples, ruins, and a site-to-site cultural route are the priority. Choose a floating-market route when canals, market activity, and a shorter list of concentrated stops matter more. The practical decision depends on departure time, road transfer, walking, boat access, and the exact market included.',
    bestFor: [
      'First-time visitors choosing one major day trip from Bangkok',
      'Travelers deciding between history-led sightseeing and a market-led morning',
      'Families and couples who want to compare route intensity before selecting a product',
    ],
    notIdealFor: [
      'Travelers expecting every floating market to operate on the same schedule',
      'Anyone adding a long regional day trip without checking pickup and return timing',
      'Visitors who have not considered heat, walking, steps, or boat boarding',
    ],
    sections: [
      {
        heading: 'Choose the kind of day before choosing the product',
        paragraphs: [
          'Ayutthaya is a history-first decision. The former capital sits north of Bangkok, and a typical visit connects several temple or palace sites rather than one single attraction. It suits travelers who enjoy architectural context, outdoor ruins, and a day that develops through a sequence of stops.',
          'A floating-market trip is a market-and-waterway decision. The experience can focus on a canal community, food, boat movement, or a wider route that adds another attraction. The market name matters because location, operating pattern, and atmosphere are not interchangeable. Confirm the exact market instead of booking from the generic phrase alone.',
        ],
      },
      {
        heading: 'Transfer time and start time shape both options',
        paragraphs: [
          'Neither choice is simply a quick extension of central Bangkok. Ayutthaya involves a regional road or rail journey and movement between historic sites. Floating-market routes also leave the city and may require an early departure to reach the market during its useful visiting window.',
          'Compare the complete day, not only the advertised attraction time. Hotel pickup, shared collection, traffic, rest stops, transfers between sites, and the return to Bangkok determine whether the route fits an evening reservation. Keep the evening flexible unless the current partner itinerary gives you enough margin.',
        ],
        checklist: [
          'Confirm the pickup point and realistic departure window.',
          'Check how many stops are included and how long each receives.',
          'Do not place a fixed evening activity immediately after an uncertain return.',
        ],
      },
      {
        heading: 'Match the physical rhythm to your group',
        paragraphs: [
          'Ayutthaya can involve exposed outdoor areas, uneven surfaces, steps, and repeated vehicle exits. It may suit travelers comfortable with walking in heat, while visitors with mobility concerns should ask about the current route and access at each stop.',
          'Floating-market trips replace some walking with boarding, narrow access points, or time in small boats. That is not automatically easier. Families, older travelers, and anyone uncomfortable on water should confirm boarding assistance, seating, shade, and whether a boat ride is optional or central to the product.',
        ],
      },
      {
        heading: 'Use a simple decision rule',
        paragraphs: [
          'Pick Ayutthaya if your Bangkok plan still lacks a substantial historic day and you are happy to spend more time moving among cultural sites. Pick a floating-market route if you want a market-and-canal experience and the exact market, timing, and boat format fit your group.',
          'After selecting the route family, compare only reviewed products that match your transfer, pace, and access needs. RadarScout explains the decision; the transaction partner remains responsible for current inclusions, cancellation terms, and operational details.',
        ],
        checklist: [
          'Priority: historic sites or market-and-canal atmosphere?',
          'Tolerance: outdoor walking or boat boarding?',
          'Schedule: full regional day or concentrated market route?',
          'Final check: current pickup, inclusions, and terms on the partner page?',
        ],
      },
    ],
    takeaway:
      'Ayutthaya and a floating market are not substitutes. Choose the day character first, then compare the products that deliver it with a realistic route.',
    plannerHref: '/planner?idea=Bangkok%203%20days%20Ayutthaya%20markets%20temples',
    plannerLabel: 'Compare Bangkok day-trip ideas',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Ayutthaya destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Phra-Nakhon-Si-Ayutthaya/229',
      },
      {
        label: 'Tourism Authority of Thailand: Samut Songkhram destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/samut-songkhram/236',
      },
    ],
    ...dailyEditorial,
  },
  {
    citySlug: 'chiang-mai',
    cityName: 'Chiang Mai',
    slug: 'doi-inthanon-vs-chiang-rai-day-trip',
    title: 'Doi Inthanon vs Chiang Rai: Which Day Trip from Chiang Mai Fits You?',
    seoTitle: 'Doi Inthanon vs Chiang Rai from Chiang Mai | RadarScout',
    description:
      'Compare Doi Inthanon and Chiang Rai day trips from Chiang Mai by scenery, road time, climate, activity intensity, and traveler fit.',
    eyebrow: 'Chiang Mai regional-day comparison',
    quickAnswer:
      'Choose Doi Inthanon for a mountain-and-nature day with changing elevation and outdoor stops. Choose Chiang Rai only when its temples and regional sights are a high priority and your group accepts a much longer road-led day. If your Chiang Mai stay is short, Doi Inthanon is usually easier to fit without sacrificing as much city time.',
    bestFor: [
      'Travelers choosing one regional excursion during a Chiang Mai stay',
      'Visitors comparing mountain nature with a long cultural sightseeing route',
      'Groups that want road time and physical comfort included in the decision',
    ],
    notIdealFor: [
      'Anyone treating Chiang Rai as a nearby Chiang Mai neighborhood',
      'Travelers stacking a long excursion beside another fixed late-night plan',
      'Visitors who have not prepared for cooler or changing mountain conditions',
    ],
    sections: [
      {
        heading: 'The two trips solve different travel goals',
        paragraphs: [
          'Doi Inthanon is a mountain-and-nature route within Chiang Mai province. The appeal comes from elevation, forest, viewpoints, waterfalls, walking, and the contrast with the city. Individual products combine those elements differently, so the exact stop sequence still matters.',
          'Chiang Rai is a separate northern province. From Chiang Mai, it is a road-intensive cultural excursion built around selected temples or regional sights. It makes sense when those places are important enough to justify the transfer, not simply because there is an unused day in the itinerary.',
        ],
      },
      {
        heading: 'Road time is the decisive difference',
        paragraphs: [
          'Both options require leaving central Chiang Mai, but Chiang Rai asks for a larger commitment to the road. A product may present an attractive list of landmarks while giving less attention to how much of the day happens in transit. Read the full sequence and compare the time allocated to stops with the transfer burden.',
          'Doi Inthanon also needs an early, organized day, yet the route remains a Chiang Mai mountain excursion rather than an inter-province sightseeing run. Whichever you choose, avoid placing a non-refundable evening plan directly after the expected return.',
        ],
        checklist: [
          'Count the meaningful stops, not just the names in the title.',
          'Ask whether the vehicle and break pattern fit your group.',
          'Leave a recovery window after either regional day.',
        ],
      },
      {
        heading: 'Prepare for different kinds of physical demand',
        paragraphs: [
          'Doi Inthanon can bring cooler temperatures, rain, slopes, steps, and outdoor walking. Clothing that works in Chiang Mai city may not feel sufficient at higher elevation. Confirm the current route and bring layers and rain protection appropriate to the season.',
          'Chiang Rai may involve less continuous nature walking but more sitting, repeated vehicle exits, temple dress requirements, and a very long overall day. Travelers with back, motion, or fatigue concerns should treat vehicle time as part of accessibility, not as empty space between attractions.',
        ],
      },
      {
        heading: 'Decide by stay length and priority',
        paragraphs: [
          'For a short Chiang Mai visit, protect enough time for the old city, food, and a slower local day before adding a distant route. Doi Inthanon fits travelers who want nature without turning the day into a separate destination visit. Chiang Rai fits travelers who would otherwise regret missing its specific cultural sights.',
          'Once the destination is chosen, compare reviewed products by pickup area, vehicle, stop sequence, walking demands, and return expectations. Current operating details and transaction terms must be confirmed with the partner at handoff.',
        ],
        checklist: [
          'Nature and elevation: start with Doi Inthanon.',
          'Specific Chiang Rai landmarks: accept the longer road day deliberately.',
          'Only one or two full days in Chiang Mai: consider staying closer.',
          'Unclear return or accessibility details: confirm before proceeding.',
        ],
      },
    ],
    takeaway:
      'Doi Inthanon is a Chiang Mai mountain day; Chiang Rai is a long regional excursion. Choose by the experience you value enough to justify the road time.',
    plannerHref: '/planner?idea=Chiang%20Mai%204%20days%20mountains%20temples%20nature',
    plannerLabel: 'Compare Chiang Mai regional days',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Doi Inthanon mountain overview',
        href: 'https://www.tourismthailand.org/Articles/mountain-savouring-the-greens-at-doi-inthanon',
      },
      {
        label: 'Tourism Authority of Thailand: Chiang Rai destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Chiang-Rai/102',
      },
    ],
    ...dailyEditorial,
  },
  {
    citySlug: 'phuket',
    cityName: 'Phuket',
    slug: 'old-town-vs-island-day',
    title: 'Phuket Old Town vs Island Day: Which Belongs in Your Itinerary?',
    seoTitle: 'Phuket Old Town vs Island Day | RadarScout',
    description:
      'Compare a Phuket Old Town day with an island day by food, culture, sea time, transfers, weather flexibility, and traveler fit.',
    eyebrow: 'Phuket itinerary decision',
    quickAnswer:
      'Choose Phuket Old Town when food, architecture, local streets, and a flexible land day are the priority. Choose an island day when the sea is the main reason for visiting and your group accepts the pier transfer, boat ride, and current marine conditions. On a three-day stay, protect one flexible day rather than booking long boat routes back to back.',
    bestFor: [
      'First-time Phuket visitors balancing the island itself with an offshore trip',
      'Travelers deciding how to use one weather-flexible day',
      'Families and couples comparing a self-paced land day with a structured boat day',
    ],
    notIdealFor: [
      'Anyone assuming Phuket is only a launch point for other islands',
      'Travelers booking a boat route without checking pier and transfer details',
      'A tightly packed schedule with no room for changing marine conditions',
    ],
    sections: [
      {
        heading: 'Old Town and an island day create different memories',
        paragraphs: [
          'Phuket Old Town is a land-based culture and food decision. Streets, historic architecture, cafés, museums, markets, and nearby viewpoints can be combined at a slower pace. The day is easier to shorten, reorder, or pause when weather or energy changes.',
          'An island day is a sea-and-route decision. The destination name matters, but the boat, pier, stop sequence, swimming expectations, and time on the water determine the actual experience. It is a more structured commitment and usually offers less freedom to change the day after departure.',
        ],
      },
      {
        heading: 'Use flexibility as part of the value calculation',
        paragraphs: [
          'A land day can absorb a late start, a long lunch, or a passing shower more easily. That flexibility can be valuable after arrival, before departure, or between two intensive excursions. It also gives travelers who do not enjoy boats a meaningful Phuket experience without treating the day as a compromise.',
          'A sea day may be the trip highlight, but it depends more heavily on current marine conditions and operator decisions. RadarScout does not claim live conditions. Keep the latest operational guidance, suitability rules, and any route changes with the transaction partner.',
        ],
        checklist: [
          'Which day has the best schedule flexibility?',
          'Does the current product explain the boat, pier, and pickup clearly?',
          'Can your group board, sit, swim, and transfer comfortably?',
        ],
      },
      {
        heading: 'Compare the full transfer burden',
        paragraphs: [
          'Old Town still requires planning because Phuket is spread out and traffic can affect a cross-island route. Group nearby land stops and avoid treating every attraction as a quick detour. The exact hotel location changes how easy the day feels.',
          'For an island trip, add the hotel-to-pier journey to the boat route itself. An attractive departure time can hide a much earlier pickup. Travelers staying far from the selected pier should compare that burden before deciding that two similar island products are equivalent.',
        ],
      },
      {
        heading: 'Build a balanced short Phuket stay',
        paragraphs: [
          'With three days, a practical structure is one sea day, one Phuket land day, and one flexible day for rest, food, beaches, or a weather-dependent choice. If you have only one full day, choose the experience that matches the reason you came: local Phuket character or an offshore route.',
          'After making that choice, use reviewed product details to narrow the island route or use the city guide to group a realistic land day. The goal is not to collect the most famous names. It is to avoid spending the trip moving between activities that do not fit together.',
        ],
        checklist: [
          'One full day: choose land character or sea experience.',
          'Three days: avoid placing long boat days back to back.',
          'Keep one day flexible when conditions or energy may change.',
          'Confirm current partner details before the external transaction handoff.',
        ],
      },
    ],
    takeaway:
      'Phuket Old Town is not the backup plan for an island day. It is a different, more flexible experience that belongs in the itinerary when local food and place matter.',
    plannerHref: '/planner?idea=Phuket%203%20days%20old%20town%20islands%20food',
    plannerLabel: 'Balance a Phuket itinerary',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: recommended Phuket one-day route',
        href: 'https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/recommended-route-for-one-day-3',
      },
      {
        label: 'Tourism Authority of Thailand: Ko Phi Phi overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Ko-Phi-Phi/359',
      },
    ],
    ...dailyEditorial,
  },
  {
    citySlug: 'bangkok',
    cityName: 'Bangkok',
    slug: 'food-tour-vs-temple-day',
    title: 'Bangkok Food Tour vs Temple Day: Which First Day Fits You?',
    seoTitle: 'Bangkok Food Tour vs Temple Day | RadarScout',
    description:
      'Compare a Bangkok food day with a temple-led day by walking, heat, timing, neighborhood structure, and traveler fit before choosing a first outing.',
    eyebrow: 'Bangkok first-day decision guide',
    quickAnswer:
      'Choose a temple-led day when Bangkok history, architecture, and river landmarks are your priority. Choose a food-led day when local flavors, markets, and neighborhood atmosphere matter more. Both can work for first-time visitors, but the walking, start time, dress expectations, and heat exposure are different.',
    bestFor: [
      'First-time visitors deciding what kind of Bangkok day to start with',
      'Travelers balancing temples, street food, markets, and a flexible evening',
      'Families and couples who want to match the day to energy and comfort',
    ],
    notIdealFor: [
      'Travelers treating every temple or food route as interchangeable',
      'Anyone who has not considered heat, walking, dress, or meal timing',
      'A packed arrival day with no margin for transport delays',
    ],
    sections: [
      {
        heading: 'Start with the memory you want from Bangkok',
        paragraphs: [
          'A temple-led day gives Bangkok a historical and architectural frame. The route may connect major riverside and old-city landmarks, but the quality of the day depends on how much walking, waiting, and moving between sites your group can comfortably handle.',
          'A food-led day is a neighborhood and appetite decision. Markets, small shops, street stalls, and local dishes can reveal a different Bangkok, but the route may involve standing, short walks between stops, unfamiliar ingredients, and a schedule shaped by meal times rather than monument opening hours.',
        ],
      },
      {
        heading: 'The practical difference is rhythm, not importance',
        paragraphs: [
          'Temple routes often benefit from an earlier start and a clear dress plan. Shoulders, knees, heat, stairs, and outdoor waiting can matter more than the number of landmarks in the title. Check the current route and access details before assuming a temple day is easy for every traveler.',
          'Food routes may feel more flexible, but they still require appetite, patience, and willingness to eat at several small stops. Travelers with allergies, dietary restrictions, or young children should ask how the current experience handles those needs rather than relying on a generic “food tour” label.',
        ],
        checklist: [
          'Temple day: confirm dress, heat, walking, stairs, and start time.',
          'Food day: confirm dietary handling, stop sequence, and meal portions.',
          'Leave the evening flexible until the route and return timing are clear.',
        ],
      },
      {
        heading: 'Match the choice to the rest of your stay',
        paragraphs: [
          'If your itinerary already includes a market-heavy evening or a cooking experience, a temple-led first day may add more variety. If you plan to visit several formal sights later, a food and neighborhood route can make the opening day feel less repetitive.',
          'Arrival time matters. A long, fixed activity is a fragile choice immediately after a flight, while a short neighborhood plan can be easier to adjust. RadarScout recommends protecting a margin before committing to a partner handoff with a fixed start time.',
        ],
      },
      {
        heading: 'Use a two-step comparison',
        paragraphs: [
          'First choose the day character: history and architecture, or food and neighborhood life. Then compare reviewed products by pickup or meeting point, walking, schedule, group needs, and what the current partner description explicitly includes.',
          'RadarScout explains fit and trade-offs using stable editorial guidance. Current operating details, inclusions, cancellation terms, and transaction information belong on the partner page and should be checked there before proceeding.',
        ],
        checklist: [
          'Priority: temples and history, or food and neighborhood atmosphere?',
          'Comfort: walking, heat, dress, diet, and meal timing?',
          'Schedule: fixed early route or more adaptable local outing?',
          'Final check: current details and terms at the partner handoff?',
        ],
      },
    ],
    takeaway:
      'Choose the Bangkok day that fits your energy and curiosity first. The most famous route is not automatically the best first route for your group.',
    plannerHref: '/planner?idea=Bangkok%203%20days%20food%20temples%20markets',
    plannerLabel: 'Compare Bangkok day ideas',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Bangkok destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/bangkok/219',
      },
      {
        label: 'Tourism Authority of Thailand: Banglamphu one-day route',
        href: 'https://www.tourismthailand.org/Articles/1-day-at-banglamphu',
      },
    ],
    ...dailyEditorialAugust5,
  },
  {
    citySlug: 'chiang-mai',
    cityName: 'Chiang Mai',
    slug: 'old-city-vs-nimman-where-to-stay',
    stayAreaCitySlug: 'chiang-mai',
    title: 'Chiang Mai Old City vs Nimman: Which Area Fits Your Stay?',
    seoTitle: 'Chiang Mai Old City vs Nimman: Where to Stay | RadarScout',
    description:
      'Compare Chiang Mai Old City and Nimman by atmosphere, walking, food, evening plans, airport access, and day-trip convenience before choosing a base.',
    eyebrow: 'Chiang Mai stay-area decision',
    quickAnswer:
      'Choose the Old City for temple walks, historic atmosphere, and a compact first-visit base. Choose Nimman for cafés, contemporary dining, creative spaces, and an easy urban evening rhythm. Neither area is universally better: the right base reduces travel for the days you care about most.',
    bestFor: [
      'First-time visitors choosing between Chiang Mai’s two familiar base areas',
      'Travelers balancing temples and local atmosphere with cafés and evening dining',
      'Visitors planning both city time and one or more rural day trips',
    ],
    notIdealFor: [
      'Travelers choosing only from hotel photos without checking daily routes',
      'Anyone assuming every attraction is walkable from either neighborhood',
      'A group with different evening preferences that has not discussed transport',
    ],
    sections: [
      {
        heading: 'Old City and Nimman answer different needs',
        paragraphs: [
          'The Old City is the natural fit for travelers who want to step into historic Chiang Mai, visit temples, walk smaller streets, and build days around the moat and central landmarks. It creates a more traditional first impression, although the exact hotel location still affects comfort and noise.',
          'Nimman is a contemporary base built around cafés, restaurants, creative businesses, shopping, and a more modern evening scene. It can suit travelers who want a lively urban rhythm and easy access to airport-side routes, but it is not a substitute for being beside every Old City landmark.',
        ],
      },
      {
        heading: 'Choose by your repeated trips, not one attraction',
        paragraphs: [
          'A hotel area matters because you repeat the journey every day. If your mornings begin with temple walks, Sunday markets, or Old City food, staying closer can reduce transfers. If your evenings are built around cafés, design shops, and contemporary restaurants, Nimman may remove more friction from the part of the day you use most.',
          'Day tours complicate the decision. Pickup coverage, meeting points, traffic, and return timing vary by product. Do not assume an area is “central” enough without checking the current partner details for the experience you actually plan to take.',
        ],
        checklist: [
          'List the three places or experiences you will repeat most often.',
          'Check walking comfort and late-evening transport for your group.',
          'Confirm day-tour pickup or meeting rules before treating a base as convenient.',
        ],
      },
      {
        heading: 'Comfort and atmosphere are part of the trade-off',
        paragraphs: [
          'The Old City can feel calmer and more atmospheric, but historic streets, older buildings, and narrow lanes do not guarantee the facilities or quiet you expect. Read the property details and location carefully, especially if mobility, sleep, or family space matters.',
          'Nimman can feel easier for dining and short evening plans, while its popular streets may be busier and more modern than the Chiang Mai image you had in mind. The best area is not the one with the strongest online identity; it is the one that fits your actual daily pattern.',
        ],
      },
      {
        heading: 'A simple rule for a first Chiang Mai visit',
        paragraphs: [
          'Pick the Old City when temples, walking, and historic atmosphere are the main reason for the trip. Pick Nimman when cafés, contemporary food, and a flexible urban evening matter more. If your stay is short and your priorities are split, choose the area that reduces the most repeated transfers rather than trying to stay halfway between both.',
          'RadarScout can help compare the activity side of the plan, but hotel availability, current room details, and booking terms remain with the accommodation partner at handoff.',
        ],
        checklist: [
          'Old City: temples, walking, historic atmosphere, compact sightseeing.',
          'Nimman: cafés, dining, creative spaces, contemporary evenings.',
          'Short stay: optimize for the area you will use repeatedly.',
          'Before booking: verify current property and partner details.',
        ],
      },
    ],
    takeaway:
      'Chiang Mai’s best base is the one that makes your repeated days easier. Choose the neighborhood around your actual rhythm, not a generic “best area” ranking.',
    plannerHref: '/planner?idea=Chiang%20Mai%203%20days%20temples%20cafes%20nature',
    plannerLabel: 'Plan a Chiang Mai stay',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Chiang Mai destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101',
      },
    ],
    ...dailyEditorialAugust5,
  },
  {
    citySlug: 'phuket',
    cityName: 'Phuket',
    slug: 'private-vs-shared-island-tour',
    title: 'Private vs Shared Phuket Island Tour: Which Fits Your Group?',
    seoTitle: 'Private vs Shared Phuket Island Tour | RadarScout',
    description:
      'Compare private and shared Phuket island tours by flexibility, group rhythm, transfer expectations, boat format, and traveler fit before choosing a sea day.',
    eyebrow: 'Phuket boat-day decision guide',
    quickAnswer:
      'Choose a private trip when your group values control over timing, stops, and pace. Choose a shared trip when a defined route and simpler group logistics are acceptable. The decision is not only about privacy: boat type, pier, weather, swimming, pickup zone, and the operator’s current route still determine the day.',
    bestFor: [
      'Families and friends deciding whether flexibility is worth the extra complexity',
      'Travelers comparing a fixed shared route with a more adaptable private day',
      'Groups that need to discuss motion, swimming, boarding, and transfer comfort',
    ],
    notIdealFor: [
      'Travelers expecting a private boat to guarantee a specific marine condition',
      'Anyone choosing only by the word “private” without checking the inclusions',
      'Groups that have not agreed on pace, stops, or time on the water',
    ],
    sections: [
      {
        heading: 'Private means control, not a universal upgrade',
        paragraphs: [
          'A private route may give your group more influence over start time, stop duration, and the balance between swimming, scenery, and rest. That flexibility is valuable when travelers have different energy levels, young children, or a strong preference for a slower day.',
          'It does not automatically change the sea, the pier, the boat’s physical limits, or the current route. Read what the product actually says about the vessel, inclusions, crew, and route before treating private as a guarantee of a particular experience.',
        ],
      },
      {
        heading: 'Shared trips trade control for a clearer structure',
        paragraphs: [
          'A shared tour can work well when the published route suits your group and you prefer a defined schedule. It may simplify meeting, transport, and cost expectations, but the day has to move at the group’s pace. Waiting, boarding, and stop timing are shared parts of the experience.',
          'Families, older travelers, and people sensitive to motion should check the current boat and boarding details rather than assuming a shared route is easier. A structured day is only comfortable when the structure fits the group.',
        ],
        checklist: [
          'Private: confirm which timing or route choices are actually flexible.',
          'Shared: confirm group size, vessel, stops, and meeting or pickup rules.',
          'Both: check boarding, shade, restrooms, swimming expectations, and transfer time.',
        ],
      },
      {
        heading: 'Compare the whole day, not the boat label',
        paragraphs: [
          'The hotel-to-pier transfer can be a large part of the day, especially when the hotel is far from the selected departure point. Add pickup, check-in, boarding, sea time, stops, and the return journey before deciding which option gives your group more usable time.',
          'Private trips may make it easier to pause or return early, while shared trips may have less room to change the sequence. Neither removes the need to follow safety instructions or the operator’s decisions about marine conditions.',
        ],
      },
      {
        heading: 'Use your group’s strongest constraint as the tie-breaker',
        paragraphs: [
          'Choose private when different travelers need different pacing, when a child or older guest needs more control, or when the group has a clear route preference. Choose shared when the published itinerary already fits and a predictable group format is more important than changing the day.',
          'After choosing the format, compare reviewed products by pier, boat, pickup area, stop sequence, and traveler fit. Current inclusions, cancellation terms, and operational guidance remain on the partner page at handoff.',
        ],
        checklist: [
          'Strongest constraint: flexibility, budget, motion, mobility, or route?',
          'Private: verify the promised flexibility in the current details.',
          'Shared: verify the group rhythm and fixed route before proceeding.',
          'Leave room for conditions and partner-led operational decisions.',
        ],
      },
    ],
    takeaway:
      'Private and shared tours solve different group problems. Decide whether control or a defined route matters more, then verify the boat and handoff details.',
    plannerHref: '/planner?idea=Phuket%203%20days%20islands%20snorkeling%20family',
    plannerLabel: 'Compare Phuket sea days',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: recommended Phuket one-day route',
        href: 'https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/recommended-route-for-one-day-3',
      },
      {
        label: 'Tourism Authority of Thailand: Ko Phi Phi overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Ko-Phi-Phi/359',
      },
    ],
    ...dailyEditorialAugust5,
  },
  {
    citySlug: 'chiang-mai',
    cityName: 'Chiang Mai',
    slug: 'best-elephant-sanctuary-for-kids',
    title: 'Best Chiang Mai Elephant Sanctuary for Kids: What to Check First',
    seoTitle: 'Best Chiang Mai Elephant Sanctuary for Kids | RadarScout',
    description:
      'Choose a Chiang Mai elephant experience for children by checking contact expectations, walking, transfer time, facilities, and the questions to confirm before a partner handoff.',
    eyebrow: 'Chiang Mai family decision guide',
    quickAnswer:
      'For a family, start with the least mobile traveler and the clearest care rules. Compare contact expectations, walking and heat, pickup burden, changing facilities, child guidance, and a realistic return time before comparing individual products.',
    bestFor: [
      'Parents comparing a first elephant experience in Chiang Mai',
      'Families deciding between a lighter half-day and a longer rural program',
      'Travelers who want fit and care questions answered before choosing a partner listing',
    ],
    notIdealFor: [
      'Families expecting every product to offer the same type of contact',
      'Groups that have not checked walking, heat, mud, or changing requirements',
      'A tightly scheduled day that cannot absorb a long pickup or return journey',
    ],
    sections: [
      {
        heading: 'The best family option is the clearest fit, not the most dramatic photo',
        paragraphs: [
          'Children can enjoy an elephant-care day, but the right choice depends on what the experience actually asks them to do. Look for a clear description of observation, feeding, bathing, walking, guide support, and visitor behavior rather than assuming that the word sanctuary explains the program.',
          'A family-friendly decision also protects the animals and the adults. Choose an experience whose contact rules, group rhythm, and care explanation are understandable before you treat it as a good fit for your child.',
        ],
        checklist: [
          'What contact is explicitly described, and what is not promised?',
          'Can the child follow the operator’s safety and behavior guidance?',
          'Does the product explain the group sequence and guide support?',
        ],
      },
      {
        heading: 'Check the physical day before checking the headline activity',
        paragraphs: [
          'Heat, mud, slopes, steps, walking, rain, changing, and rural facilities can decide whether a child remembers the day fondly. Ask about the least mobile member of the group first, and treat missing accessibility details as an unanswered question rather than a reassuring assumption.',
          'A half-day may suit a younger child, a shorter Chiang Mai stay, or a family that wants an easy evening afterward. A longer program can work when the group is comfortable with more travel and a slower return, but the extra hours should be understood before choosing.',
        ],
        checklist: [
          'Confirm walking, stairs, mud, heat, rain, and changing expectations.',
          'Check whether children need specific clothing, shoes, or supervision.',
          'Leave recovery time after a rural pickup and return.',
        ],
      },
      {
        heading: 'Pickup time is part of the family experience',
        paragraphs: [
          'A product can look close on a map while the hotel pickup and shared collection sequence make the morning long. Confirm whether your Chiang Mai hotel area is covered, when the group must be ready, and how the stated return time is described by the current partner.',
          'Families should avoid placing a fixed evening reservation immediately after an out-of-town experience. A realistic plan keeps a margin for traffic, stops, changing, and the energy of the child who has just spent a full day outdoors.',
        ],
      },
      {
        heading: 'Use RadarScout to narrow the choice, then verify the partner details',
        paragraphs: [
          'RadarScout compares reviewed public fields and explains why an option may fit a family. It does not invent a current price, promise availability, or replace the partner’s live product terms. If a field is not confirmed, the page should leave it open for you to check rather than fill the gap with a guess.',
          'Before continuing, compare the final product details on the partner page: current inclusions, age rules, pickup coverage, cancellation terms, and the exact contact or care format. The best choice is the one that leaves the fewest important questions unanswered for your group.',
        ],
        checklist: [
          'Fit: care rules, child comfort, walking, heat, and transfer burden.',
          'Avoid if: your group cannot meet the stated physical or timing demands.',
          'Final check: current product details and terms at the Viator handoff.',
          'Price: confirm the current partner price; RadarScout does not publish an unverified amount.',
        ],
      },
    ],
    takeaway:
      'For children, the best Chiang Mai elephant experience is the one with clear care rules, manageable physical demands, and a transfer plan your family can actually enjoy.',
    plannerHref: '/chiang-mai/elephant-camp-finder',
    plannerLabel: 'Compare Chiang Mai elephant experiences',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Chiang Mai destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101',
      },
    ],
    ...sharedEditorial,
    publishedAt: '2026-08-11',
    updatedAt: '2026-08-11',
  },
  {
    citySlug: 'chiang-mai',
    cityName: 'Chiang Mai',
    slug: 'doi-inthanon-vs-elephant-sanctuary',
    title: 'Doi Inthanon vs an Elephant Experience: Which Chiang Mai Day Fits You?',
    seoTitle: 'Doi Inthanon vs Elephant Experience in Chiang Mai | RadarScout',
    description:
      'Choose between a Doi Inthanon mountain day and a Chiang Mai elephant experience by comparing transfer burden, physical pace, weather exposure, family fit, and the details to confirm before booking.',
    eyebrow: 'Chiang Mai day-trip decision',
    quickAnswer:
      'Choose Doi Inthanon when waterfalls, mountain scenery, and a full outdoor day are the priority. Choose an elephant experience when your group wants a clearer care-focused visit with a pace and contact level that can be checked in advance. The better option is the one whose transfer, walking, weather exposure, and return time fit your group.',
    bestFor: [
      'First-time Chiang Mai visitors with one open full-day slot',
      'Families deciding between a scenery-led day and an animal-care experience',
      'Travelers who want to compare practical fit before browsing individual partner listings',
    ],
    notIdealFor: [
      'Travelers who plan to fit both long rural days into an already packed short stay',
      'Groups that have not checked heat, rain, walking, or road-time tolerance',
      'Anyone expecting either category to guarantee the same pickup or activity format',
    ],
    sections: [
      {
        heading: 'These days solve different travel goals',
        paragraphs: [
          'Doi Inthanon is a mountain-day decision: the appeal is scenery, waterfalls, altitude, and time outdoors. The experience is shaped by the road journey, the weather, the walking conditions, and the sequence of stops as much as by any one viewpoint.',
          'An elephant experience is a care-and-contact decision: the important questions are the stated interaction rules, guide support, pickup burden, physical setting, and whether the pace is right for the least mobile person in your group. The word sanctuary alone does not answer those questions.',
        ],
      },
      {
        heading: 'Compare the physical day, not only the headline',
        paragraphs: [
          'Both choices can be full rural days, but the effort is distributed differently. A mountain itinerary can involve road time, changes in temperature, uneven ground, rain, and multiple short stops. An elephant experience can involve heat, mud, slopes, standing, changing facilities, and a different kind of outdoor exposure.',
          'For children, older travelers, or anyone who prefers a gentler day, use the least mobile person as the decision-maker. A program that sounds exciting may still be the wrong fit if the group cannot comfortably manage the transport or physical setting.',
        ],
        checklist: [
          'How much shared pickup and road time is described for your hotel area?',
          'What walking, weather, clothing, and changing conditions should the group expect?',
          'Can your group keep the evening flexible after the expected return?',
        ],
      },
      {
        heading: 'Use the weather and trip rhythm as a tie-breaker',
        paragraphs: [
          'Choose a mountain day when the group wants scenery and can accept a longer outdoor route. Choose an elephant experience when the group wants to focus on one care-oriented visit and can first confirm the stated interaction boundaries and daily rhythm.',
          'Do not try to make both choices fit into consecutive days simply because they are famous. A balanced Chiang Mai stay often keeps one substantial out-of-town day, one lighter old-city or food-focused day, and one flexible window for rest or weather changes.',
        ],
      },
      {
        heading: 'Make the final decision only after checking the live partner details',
        paragraphs: [
          'RadarScout compares reviewed public product fields and stable traveler trade-offs. It does not promise current price, availability, operator practices, or weather conditions. Those details belong on the partner page and should be checked immediately before you continue.',
          'For Doi Inthanon, confirm pickup, itinerary stops, walking expectations, weather policy, and return time. For an elephant experience, confirm the current contact rules, child guidance, pickup coverage, physical conditions, and what is explicitly included. If the answer to a priority question is unclear, keep it unresolved rather than guessing.',
        ],
        checklist: [
          'Doi Inthanon: route, road time, walking, weather, and return window.',
          'Elephant experience: visitor rules, group rhythm, child fit, and transfer burden.',
          'Partner handoff: current product details, terms, and final transaction information.',
        ],
      },
    ],
    takeaway:
      'Choose the Chiang Mai day whose real-world rhythm suits your group. Mountain scenery and an elephant experience are both strong options, but they ask different things of the same limited day.',
    plannerHref: '/planner?idea=Chiang%20Mai%203%20days%20nature%20family%20easy%20pace',
    plannerLabel: 'Plan a realistic Chiang Mai day',
    officialSources: [
      {
        label: 'Tourism Authority of Thailand: Doi Inthanon National Park',
        href: 'https://www.tourismthailand.org/Attraction/doi-inthanon-national-park',
      },
      {
        label: 'Tourism Authority of Thailand: Chiang Mai destination overview',
        href: 'https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101',
      },
    ],
    ...sharedEditorial,
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
  },
]

export const thailandGuideArticles: readonly ThailandGuideArticle[] = articleDrafts.map(article => {
  const href = `/guides/${article.citySlug}/${article.slug}`
  return { ...article, href, canonicalUrl: `${BASE}${href}` }
})

export function isGuideCitySlug(value: string): value is GuideCitySlug {
  return guideCitySlugs.includes(value as GuideCitySlug)
}

export function getThailandGuideCity(value: string) {
  return isGuideCitySlug(value) ? thailandGuideCities[value] : null
}

export function listThailandGuidesByCity(citySlug: GuideCitySlug) {
  return thailandGuideArticles.filter(article => article.citySlug === citySlug)
}

export function getThailandGuideArticle(citySlug: string, articleSlug: string) {
  if (!isGuideCitySlug(citySlug)) return null
  return thailandGuideArticles.find(
    article => article.citySlug === citySlug && article.slug === articleSlug,
  ) ?? null
}
