import type { TripIntent, TripPace, TravelerType } from './intent-schema'

export type ProductRecommendationSignals = {
  whyRecommended: string
  bestFor: string[]
  watchOut: string
}

export type ProductRecommendationContext = Pick<
  TripIntent,
  'destination' | 'interests' | 'travelerType' | 'pace'
> & {
  month: number | null
}

type RecommendationProduct = {
  title: string
  city: string | null
  summary?: string | null
  shortSummary?: string | null
  tags: readonly string[]
}

const MONTHS: ReadonlyArray<readonly [number, readonly string[]]> = [
  [1, ['january', 'jan']],
  [2, ['february', 'feb']],
  [3, ['march', 'mar']],
  [4, ['april', 'apr']],
  [5, ['may']],
  [6, ['june', 'jun']],
  [7, ['july', 'jul']],
  [8, ['august', 'aug']],
  [9, ['september', 'sept', 'sep']],
  [10, ['october', 'oct']],
  [11, ['november', 'nov']],
  [12, ['december', 'dec']],
]

const INTEREST_ALIASES: Record<string, readonly string[]> = {
  adventure: ['adventure', 'rafting', 'zipline', 'atv', 'kayak', 'trek', 'hike'],
  beach: ['beach', 'island', 'snorkel', 'boat', 'sea'],
  culture: ['culture', 'cultural', 'heritage', 'history', 'temple'],
  elephant: ['elephant'],
  elephants: ['elephant'],
  food: ['food', 'cooking', 'cuisine', 'market', 'dining', 'meal'],
  nature: ['nature', 'national park', 'waterfall', 'forest', 'mountain', 'wildlife'],
  temple: ['temple', 'culture', 'heritage'],
  temples: ['temple', 'culture', 'heritage'],
}

const TRAVELER_LABELS: Record<Exclude<TravelerType, 'unspecified'>, string> = {
  solo: 'Solo travelers comparing this route',
  couple: 'Couples comparing this route',
  family: 'Families comparing this route',
  friends: 'Friends planning together',
  business: 'Travelers fitting a day tour around work',
}

const PACE_LABELS: Record<Exclude<TripPace, 'unspecified'>, string> = {
  relaxed: 'A relaxed itinerary',
  moderate: 'A balanced itinerary',
  packed: 'A packed itinerary',
}

const OUTDOOR_TERMS = [
  'adventure',
  'beach',
  'boat',
  'forest',
  'hike',
  'island',
  'mountain',
  'national park',
  'outdoor',
  'rafting',
  'snorkel',
  'waterfall',
]

const WATER_TERMS = ['beach', 'boat', 'island', 'kayak', 'rafting', 'river', 'sea', 'snorkel']
const LONG_ROUTE_TERMS = [
  'ang thong',
  'ayutthaya',
  'doi inthanon',
  'james bond',
  'kanchanaburi',
  'national park',
  'phi phi',
  'similan',
]

function normalize(value: string | null | undefined): string {
  return value?.trim().toLowerCase().replace(/\s+/g, ' ') ?? ''
}

function containsAny(text: string, terms: readonly string[]): boolean {
  return terms.some(term => text.includes(term))
}

function sentenceList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? ''
  if (values.length === 2) return `${values[0]} and ${values[1]}`
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`
}

function matchedInterests(productText: string, interests: readonly string[]): string[] {
  const matches: string[] = []

  for (const interest of interests) {
    const normalizedInterest = normalize(interest)
    if (!normalizedInterest) continue

    const aliases = INTEREST_ALIASES[normalizedInterest] ?? [normalizedInterest]
    if (containsAny(productText, aliases) && !matches.includes(normalizedInterest)) {
      matches.push(normalizedInterest)
    }
  }

  return matches.slice(0, 2)
}

export function extractTravelMonth(prompt: string): number | null {
  const normalizedPrompt = normalize(prompt)

  for (const [month, names] of MONTHS) {
    if (names.some(name => new RegExp(`\\b${name}\\b`, 'i').test(normalizedPrompt))) {
      return month
    }
  }

  return null
}

export function buildProductRecommendationSignals(
  product: RecommendationProduct,
  context: ProductRecommendationContext,
): ProductRecommendationSignals {
  const city = product.city?.trim() || null
  const summary = product.summary ?? product.shortSummary ?? ''
  const productText = normalize([product.title, city, summary, ...product.tags].filter(Boolean).join(' '))
  const interests = matchedInterests(productText, context.interests)
  const destination = context.destination?.trim() || city || 'Thailand'

  let whyRecommended: string
  if (interests.length > 0 && city) {
    whyRecommended = `This reviewed ${city} experience matches your interest in ${sentenceList(interests)}.`
  } else if (interests.length > 0) {
    whyRecommended = `This reviewed experience matches your interest in ${sentenceList(interests)}.`
  } else if (city) {
    whyRecommended = `This reviewed ${city} option matches the confirmed ${destination} route.`
  } else if (product.tags.length > 0) {
    whyRecommended = `This reviewed option supports themes such as ${sentenceList(product.tags.slice(0, 2))}.`
  } else {
    whyRecommended = 'This is a reviewed Thailand day-trip option for comparison.'
  }

  const bestFor: string[] = []
  if (context.travelerType !== 'unspecified') {
    bestFor.push(TRAVELER_LABELS[context.travelerType])
  }
  if (context.pace !== 'unspecified') {
    bestFor.push(PACE_LABELS[context.pace])
  }
  if (interests.length > 0) {
    bestFor.push(`Travelers interested in ${sentenceList(interests)}`)
  } else if (product.tags.length > 0) {
    bestFor.push(`Travelers comparing ${product.tags[0].toLowerCase()} experiences`)
  }
  if (bestFor.length === 0) {
    bestFor.push('Travelers comparing reviewed Thailand day trips')
  }

  const isOutdoor = containsAny(productText, OUTDOOR_TERMS)
  const isWaterBased = containsAny(productText, WATER_TERMS)
  const mayBeLongRoute = containsAny(productText, LONG_ROUTE_TERMS)
  const isEvening = containsAny(productText, ['evening', 'night', 'sunset'])
  const mayNeedParticipationCheck = containsAny(productText, ['adventure', 'atv', 'hike', 'kayak', 'rafting', 'snorkel', 'trek', 'zipline'])

  let watchOut: string
  if (context.travelerType === 'family' && mayNeedParticipationCheck) {
    watchOut = 'Families should review age, mobility, and participation requirements on the Viator product page before choosing.'
  } else if (context.month !== null && context.month >= 5 && context.month <= 10 && isOutdoor) {
    watchOut = 'Rainy-season conditions may affect outdoor comfort or routing; review current operator details on Viator before choosing.'
  } else if (context.month !== null && context.month >= 3 && context.month <= 5 && isOutdoor) {
    watchOut = 'Hot-season conditions can make outdoor days feel more demanding; review timing and participation details before choosing.'
  } else if (isWaterBased) {
    watchOut = 'Sea, river, and weather conditions can affect this kind of experience; review current operator details on Viator.'
  } else if (mayBeLongRoute) {
    watchOut = 'This kind of route can involve substantial travel time; confirm duration and meeting details on Viator.'
  } else if (isEvening) {
    watchOut = 'Check the current finish time and return arrangements on the Viator product page.'
  } else if (context.pace === 'packed') {
    watchOut = 'A packed plan leaves less buffer; confirm duration, meeting details, and current terms before choosing.'
  } else {
    watchOut = 'Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.'
  }

  return {
    whyRecommended,
    bestFor: bestFor.slice(0, 3),
    watchOut,
  }
}
