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
