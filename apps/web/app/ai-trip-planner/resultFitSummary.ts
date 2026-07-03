import type { AiTripSearchResponse } from '../api/ai-trip/search/route'

export type ResultFitSummary = {
  heading: string
  chips: string[]
  points: string[]
}

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

export function buildResultFitSummary(response: AiTripSearchResponse): ResultFitSummary | null {
  if (response.status !== 'ok' || response.products.length === 0) return null

  const destination = normalizeText(response.intent?.destination) ?? 'Thailand'
  const duration = formatDays(response.intent?.days)
  const interests = summarizeInterests(response.intent?.interests ?? [])
  const cities = uniqueProductCities(response.products)
  const productCount = response.products.length

  return {
    heading: 'Why these experiences match',
    chips: [
      destination,
      duration,
      interests ? `Interest signals: ${interests}` : null,
      cities.length > 0 ? `Result cities: ${cities.join(', ')}` : null,
    ].filter((chip): chip is string => Boolean(chip)),
    points: [
      `${productCount} real Thailand experience${productCount === 1 ? '' : 's'} matched the confirmed destination and trip idea.`,
      interests
        ? `The result set uses intent signals such as ${interests} before showing product cards.`
        : 'The result set uses the confirmed destination before showing product cards.',
      'These are comparison-only product results. Open product pages for current details and continue through the public partner handoff path.',
    ],
  }
}
