import type { AiTripSearchResponse } from '../api/ai-trip/search/route'

export type ResultFitSummary = {
  heading: string
  chips: string[]
  points: string[]
}

export type ResultFitProduct = AiTripSearchResponse['products'][number]

function normalizeText(value: string | null | undefined) {
  return value?.trim() || null
}

function formatDays(days: number | null | undefined) {
  if (!days || !Number.isInteger(days) || days <= 0) return null

  return `${days} day${days === 1 ? '' : 's'}`
}

function summarizeInterests(interests: string[]) {
  const normalized = interests
    .map(interest => interest.trim())
    .filter(Boolean)
    .slice(0, 3)

  if (normalized.length === 0) return null

  return normalized.join(', ')
}

function uniqueProductCities(products: AiTripSearchResponse['products']) {
  return Array.from(new Set(
    products
      .map(product => normalizeText(product.city))
      .filter((city): city is string => Boolean(city)),
  )).slice(0, 3)
}

function normalizedTokens(values: string[]) {
  return values.map(value => value.trim().toLowerCase()).filter(Boolean)
}

const INTEREST_ALIASES: Record<string, string[]> = {
  elephant: ['elephant', 'elephants', 'elephant care'],
  elephants: ['elephant', 'elephants', 'elephant care'],
  food: ['food', 'foods', 'cooking', 'cook', 'culinary', 'local food', 'market', 'meal', 'meals', 'lunch', 'dinner', 'dining', 'cuisine', 'khan toke'],
  cooking: ['cooking', 'cook', 'food', 'culinary', 'local food', 'market', 'meal', 'meals', 'lunch', 'dinner', 'dining', 'cuisine', 'khan toke'],
  temple: ['temple', 'temples', 'wat'],
  temples: ['temple', 'temples', 'wat'],
  nature: ['nature', 'forest', 'outdoor', 'waterfall', 'mountain'],
  family: ['family', 'families', 'kids', 'children', 'child'],
  beaches: ['beach', 'beaches', 'island', 'islands'],
  beach: ['beach', 'beaches', 'island', 'islands'],
}

function singularCandidate(value: string) {
  if (value.endsWith('ies') && value.length > 4) {
    return `${value.slice(0, -3)}y`
  }

  if (value.endsWith('es') && value.length > 3) {
    return value.slice(0, -2)
  }

  if (value.endsWith('s') && value.length > 3) {
    return value.slice(0, -1)
  }

  return value
}

function interestVariants(interest: string) {
  const normalized = interest.trim().toLowerCase()
  if (!normalized) return []

  const singular = singularCandidate(normalized)
  const aliasKeys = [normalized, singular]
  const aliases = aliasKeys.flatMap(key => INTEREST_ALIASES[key] ?? [])

  return Array.from(new Set([normalized, singular, ...aliases].filter(Boolean)))
}

function matchingInterests(product: ResultFitProduct, interests: string[]) {
  const signals = normalizedTokens([
    product.title,
    product.summary ?? '',
    ...product.tags,
  ])
  const signalText = signals.join(' ')
  const matches = interests
    .map(interest => interest.trim())
    .filter(Boolean)
    .filter(interest => interestVariants(interest).some(variant => signalText.includes(variant)))

  return Array.from(new Set(matches)).slice(0, 2)
}

function matchingResultInterests(
  products: AiTripSearchResponse['products'],
  interests: string[],
) {
  const matches = products.flatMap(product => matchingInterests(product, interests))

  return Array.from(new Set(matches)).slice(0, 3)
}

function unmatchedRequestedInterests(interests: string[], matchedInterests: string[]) {
  const matched = new Set(matchedInterests.map(interest => interest.trim().toLowerCase()))

  return interests
    .map(interest => interest.trim())
    .filter(Boolean)
    .filter(interest => !matched.has(interest.toLowerCase()))
    .slice(0, 3)
}

function shortTagList(tags: string[]) {
  const normalized = tags.map(tag => tag.trim()).filter(Boolean).slice(0, 2)
  if (normalized.length === 0) return null

  return normalized.join(', ')
}

export function buildResultFitSummary(response: AiTripSearchResponse): ResultFitSummary | null {
  if (response.status !== 'ok' || response.products.length === 0) return null

  const destination = normalizeText(response.intent?.destination) ?? 'Thailand'
  const duration = formatDays(response.intent?.days)
  const requestedInterests = response.intent?.interests ?? []
  const interests = summarizeInterests(requestedInterests)
  const matchedResultInterests = matchingResultInterests(response.products, requestedInterests)
  const matchedInterests = summarizeInterests(matchedResultInterests)
  const otherRequestedInterests = summarizeInterests(
    unmatchedRequestedInterests(requestedInterests, matchedResultInterests),
  )
  const cities = uniqueProductCities(response.products)
  const productCount = response.products.length

  return {
    heading: 'Why these experiences match',
    chips: [
      destination,
      duration,
      matchedInterests ? `Matched interests: ${matchedInterests}` : null,
      otherRequestedInterests ? `Other requested interests: ${otherRequestedInterests}` : null,
      cities.length > 0 ? `Result cities: ${cities.join(', ')}` : null,
    ].filter((chip): chip is string => Boolean(chip)),
    points: [
      `${productCount} real Thailand experience${productCount === 1 ? '' : 's'} matched the confirmed destination and trip idea.`,
      matchedInterests
        ? 'Matched-interest labels are based on the returned product titles, summaries, and tags.'
        : interests
          ? 'Requested interests are kept separate when the returned cards do not clearly represent them.'
        : 'The result set uses the confirmed destination before showing product cards.',
      'These are comparison-only product results. Open product pages for current details and continue through the public partner handoff path.',
    ],
  }
}

export function buildProductFitReason(
  product: ResultFitProduct,
  intent: AiTripSearchResponse['intent'],
): string {
  const destination = normalizeText(intent?.destination) ?? 'Thailand'
  const productCity = normalizeText(product.city)
  const cityMatchesDestination = productCity
    ? productCity.toLowerCase() === destination.toLowerCase()
    : false
  const interestMatches = matchingInterests(product, intent?.interests ?? [])
  const tagSummary = shortTagList(product.tags)

  if (interestMatches.length > 0 && cityMatchesDestination) {
    return `Why this fits: matches ${destination} and your interest in ${interestMatches.join(', ')}.`
  }

  if (interestMatches.length > 0) {
    return `Why this fits: reflects your interest in ${interestMatches.join(', ')} for a Thailand experience comparison.`
  }

  if (cityMatchesDestination) {
    return `Why this fits: matches the confirmed ${destination} destination for read-only comparison.`
  }

  if (tagSummary) {
    return `Why this fits: uses product tags such as ${tagSummary} to support comparison.`
  }

  return 'Why this fits: included as a read-only Thailand experience comparison result.'
}
