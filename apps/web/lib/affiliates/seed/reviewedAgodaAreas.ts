import {
  validateAgodaAreaRecommendationCatalogue,
  type AgodaAreaRecommendation,
} from '../agodaAreaRecommendations'

const reviewedAreas = [
    {
      id: "bangkok-asok-phrom-phong",
      citySlug: "bangkok",
      city: "Bangkok",
      areaSlug: "asok-phrom-phong",
      name: "Asok & Phrom Phong",
      bestFor: "First-time visitors, convenient transit, shopping and dining",
      summary: "A central Sukhumvit base with access to BTS, MRT, shopping and a broad range of everyday services.",
      tradeoffs: [
        "Road traffic and pavements can feel busy.",
        "Properties close on a map may sit on long side streets.",
        "The atmosphere is commercial rather than historic."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:43:57Z"
    },
    {
      id: "bangkok-ari",
      citySlug: "bangkok",
      city: "Bangkok",
      areaSlug: "ari",
      name: "Ari",
      bestFor: "Remote workers, cafe time and quieter evenings",
      summary: "A residential-feeling BTS neighbourhood north of the busiest Sukhumvit core, with cafes and smaller-scale streets.",
      tradeoffs: [
        "Fewer major visitor landmarks are within walking distance.",
        "Some accommodation sits deeper inside residential lanes.",
        "Late-night options are less extensive than central Sukhumvit."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:43:57Z"
    },
    {
      id: "bangkok-riverside",
      citySlug: "bangkok",
      city: "Bangkok",
      areaSlug: "riverside",
      name: "Riverside",
      bestFor: "Couples, slower stays and hotel-led breaks",
      summary: "A scenic base along the Chao Phraya where the property, river view and on-site facilities can be central to the experience.",
      tradeoffs: [
        "Convenience varies by pier and river bank.",
        "Cross-city journeys may require boat, rail and road combinations.",
        "Nearby street life differs greatly between properties."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:43:57Z"
    },
    {
      id: "chiang-mai-old-city",
      citySlug: "chiang-mai",
      city: "Chiang Mai",
      areaSlug: "old-city",
      name: "Old City",
      bestFor: "First-time visitors, temples and walkable cultural days",
      summary: "The historic moated centre places temples, markets and small restaurants within a compact urban area.",
      tradeoffs: [
        "Traffic noise varies by gate and main road.",
        "Walking conditions and heat can limit midday distances.",
        "Trips to Nimman and the river still require local transport."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:46:35Z"
    },
    {
      id: "chiang-mai-nimman",
      citySlug: "chiang-mai",
      city: "Chiang Mai",
      areaSlug: "nimman",
      name: "Nimman",
      bestFor: "Remote work, cafes and contemporary city life",
      summary: "A compact modern district around Nimmanhaemin Road with cafes, dining, shopping and work-friendly routines.",
      tradeoffs: [
        "Aircraft and road noise can affect some properties.",
        "It does not provide the same historic atmosphere as the Old City.",
        "Popular streets can feel busy at night."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:46:35Z"
    },
    {
      id: "chiang-mai-riverside",
      citySlug: "chiang-mai",
      city: "Chiang Mai",
      areaSlug: "riverside",
      name: "Riverside",
      bestFor: "Families, more space and quieter evenings",
      summary: "A lower-density base near the Ping River with a mix of resort-style hotels, larger rooms and dining-led stays.",
      tradeoffs: [
        "The riverside label covers a broad area.",
        "Walking to Old City sights may not be practical.",
        "Some properties have limited convenience outside their grounds."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:46:35Z"
    },
    {
      id: "pattaya-jomtien",
      citySlug: "pattaya",
      city: "Pattaya",
      areaSlug: "jomtien",
      name: "Jomtien",
      bestFor: "Families, longer stays and a calmer beach routine",
      summary: "A long beachfront district south of central Pattaya with resorts, condominiums and everyday services.",
      tradeoffs: [
        "The district is long, so location labels can be imprecise.",
        "Beach-road traffic affects some walking routes.",
        "Central Pattaya trips require transport."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:47:32Z"
    },
    {
      id: "pattaya-north-pattaya",
      citySlug: "pattaya",
      city: "Pattaya",
      areaSlug: "north-pattaya",
      name: "North Pattaya",
      bestFor: "Convenience, established resorts and city amenities",
      summary: "A developed northern base near shopping, dining and several resort-style hotel zones.",
      tradeoffs: [
        "Large roads and intersections can interrupt walking routes.",
        "The atmosphere remains urban and busy.",
        "North Pattaya and Naklua labels can cover different beach access."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:47:32Z"
    },
    {
      id: "pattaya-pratumnak",
      citySlug: "pattaya",
      city: "Pattaya",
      areaSlug: "pratumnak",
      name: "Pratumnak",
      bestFor: "Quieter couples trips, villas and residential stays",
      summary: "A hilly residential district between central Pattaya and Jomtien with smaller beaches and a quieter evening feel.",
      tradeoffs: [
        "Hills and discontinuous pavements make some walks difficult.",
        "Public shared transport is less straightforward.",
        "Dining and beach access vary by exact lane."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:47:32Z"
    },
    {
      id: "phuket-kata-karon",
      citySlug: "phuket",
      city: "Phuket",
      areaSlug: "kata-karon",
      name: "Kata & Karon",
      bestFor: "First beach trips, families and balanced resort days",
      summary: "Two established west-coast beach districts with visitor services, restaurants and a range of resort and apartment stays.",
      tradeoffs: [
        "Hills affect some inland properties.",
        "Beach access may require a road crossing or longer walk.",
        "Journeys to the airport and northern Phuket remain substantial."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:48:28Z"
    },
    {
      id: "phuket-bang-tao",
      citySlug: "phuket",
      city: "Phuket",
      areaSlug: "bang-tao",
      name: "Bang Tao",
      bestFor: "Villas, longer stays and property-led holidays",
      summary: "A broad north-west coast area combining a long beach, resort developments, villas and newer dining zones.",
      tradeoffs: [
        "The area is spread out and not uniformly walkable.",
        "Beach, village and inland locations feel very different.",
        "A transport budget is important for exploring beyond the immediate area."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:48:28Z"
    },
    {
      id: "phuket-old-town",
      citySlug: "phuket",
      city: "Phuket",
      areaSlug: "old-town",
      name: "Phuket Old Town",
      bestFor: "Food, architecture and short urban stays",
      summary: "A colourful historic centre with markets, local dining and Sino-Portuguese streets rather than a beachfront setting.",
      tradeoffs: [
        "It is not a beach base.",
        "Beach days require road transport.",
        "Some streets become busier around markets and events."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:48:28Z"
    },
    {
      id: "koh-samui-bophut",
      citySlug: "koh-samui",
      city: "Koh Samui",
      areaSlug: "bophut",
      name: "Bophut",
      bestFor: "Couples, first stays and dining within reach",
      summary: "A north-coast base centred on Fisherman's Village, with restaurants, boutique stays and larger resorts nearby.",
      tradeoffs: [
        "The wider Bophut label extends beyond the walkable village.",
        "Beach conditions vary by exact frontage and season.",
        "Popular evenings can feel busy."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:49:29Z"
    },
    {
      id: "koh-samui-chaweng",
      citySlug: "koh-samui",
      city: "Koh Samui",
      areaSlug: "chaweng",
      name: "Chaweng",
      bestFor: "Nightlife, convenience and an energetic beach stay",
      summary: "Samui's busiest visitor area, combining a long beach with extensive dining, shopping and nightlife.",
      tradeoffs: [
        "Noise varies sharply by street and property.",
        "Traffic is busy around the centre.",
        "It is not the right base for a quiet island retreat."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:49:29Z"
    },
    {
      id: "koh-samui-maenam",
      citySlug: "koh-samui",
      city: "Koh Samui",
      areaSlug: "maenam",
      name: "Maenam",
      bestFor: "Families, villas and a quieter north coast",
      summary: "A lower-key northern beach area with villas, resorts and a more residential pace than Chaweng.",
      tradeoffs: [
        "The district is spread out.",
        "Walkable dining depends on the exact property.",
        "Cross-island nightlife trips require transport."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:49:29Z"
    },
    {
      id: "krabi-ao-nang",
      citySlug: "krabi",
      city: "Krabi",
      areaSlug: "ao-nang",
      name: "Ao Nang",
      bestFor: "First visits, island day trips and convenient visitor services",
      summary: "A well-established visitor base with dining, accommodation and practical access to a broad range of Krabi day-trip options.",
      tradeoffs: [
        "The central area can feel busy.",
        "Some accommodation sits farther from the waterfront than the map suggests.",
        "Travelers seeking a quiet resort stay should check the exact location carefully."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:50:28Z"
    },
    {
      id: "krabi-railay",
      citySlug: "krabi",
      city: "Krabi",
      areaSlug: "railay",
      name: "Railay",
      bestFor: "Couples, limestone scenery and a car-free beach stay",
      summary: "A compact coastal stay framed by limestone cliffs, with beaches and walking routes separated from Krabi's road network.",
      tradeoffs: [
        "Access is by boat.",
        "Moving luggage between land and boat can require extra effort.",
        "Daytime visitor traffic and a smaller range of everyday services may not suit every stay."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:50:28Z"
    },
    {
      id: "krabi-krabi-town",
      citySlug: "krabi",
      city: "Krabi",
      areaSlug: "krabi-town",
      name: "Krabi Town",
      bestFor: "Local food, short stopovers and a lower-key urban base",
      summary: "A practical town base with markets, local dining and everyday city routines for travelers who do not need to stay beside the beach.",
      tradeoffs: [
        "It is not a beach base.",
        "Ao Nang and many coastal activities require road transport.",
        "The accommodation experience is more urban than resort-led."
      ],
      reviewedBy: "ouyowu",
      reviewedAt: "2026-07-22T17:50:28Z"
    }
  ] as const

const validation = validateAgodaAreaRecommendationCatalogue(reviewedAreas)

if (!validation.ok) {
  throw new Error(`Invalid reviewed Agoda area seed: ${validation.error}`)
}

export const reviewedAgodaAreaRecommendations: readonly AgodaAreaRecommendation[] = validation.data
