export const AGODA_AREA_CITY_SLUGS = [
  'bangkok',
  'chiang-mai',
  'phuket',
  'pattaya',
  'koh-samui',
  'krabi',
] as const

export type AgodaAreaCitySlug = typeof AGODA_AREA_CITY_SLUGS[number]

export const AGODA_AREA_CITY_NAMES: Record<AgodaAreaCitySlug, string> = {
  bangkok: 'Bangkok',
  'chiang-mai': 'Chiang Mai',
  phuket: 'Phuket',
  pattaya: 'Pattaya',
  'koh-samui': 'Koh Samui',
  krabi: 'Krabi',
}

export type AgodaAreaRecommendation = {
  id: string
  citySlug: AgodaAreaCitySlug
  city: string
  areaSlug: string
  name: string
  bestFor: string
  summary: string
  tradeoffs: string[]
  reviewedBy: string
  reviewedAt: string
}

type RecordValidation =
  | { ok: true; data: AgodaAreaRecommendation }
  | { ok: false; error: string }

type CatalogueValidation =
  | { ok: true; data: AgodaAreaRecommendation[] }
  | { ok: false; error: string }

const allowedKeys = new Set<keyof AgodaAreaRecommendation>([
  'id',
  'citySlug',
  'city',
  'areaSlug',
  'name',
  'bestFor',
  'summary',
  'tradeoffs',
  'reviewedBy',
  'reviewedAt',
])

const citySlugs = new Set<string>(AGODA_AREA_CITY_SLUGS)
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text || text.length > maxLength) return null
  return text
}

function readTradeoffs(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 4) return null

  const tradeoffs = value.map(item => readText(item, 300))
  if (tradeoffs.some(item => item === null)) return null

  const validTradeoffs = tradeoffs as string[]
  if (new Set(validTradeoffs).size !== validTradeoffs.length) return null
  return validTradeoffs
}

export function validateAgodaAreaRecommendationRecord(value: unknown): RecordValidation {
  if (!isRecord(value)) return { ok: false, error: 'invalid_record' }
  if (Object.keys(value).some(key => !allowedKeys.has(key as keyof AgodaAreaRecommendation))) {
    return { ok: false, error: 'unexpected_field' }
  }

  const id = readText(value.id, 180)
  const citySlug = readText(value.citySlug, 40)
  const city = readText(value.city, 80)
  const areaSlug = readText(value.areaSlug, 80)
  const name = readText(value.name, 120)
  const bestFor = readText(value.bestFor, 300)
  const summary = readText(value.summary, 500)
  const tradeoffs = readTradeoffs(value.tradeoffs)
  const reviewedBy = readText(value.reviewedBy, 100)
  const reviewedAt = readText(value.reviewedAt, 40)

  if (!citySlug || !citySlugs.has(citySlug)) return { ok: false, error: 'invalid_city' }
  const supportedCitySlug = citySlug as AgodaAreaCitySlug
  if (city !== AGODA_AREA_CITY_NAMES[supportedCitySlug]) {
    return { ok: false, error: 'invalid_city_name' }
  }
  if (!areaSlug || !slugPattern.test(areaSlug)) return { ok: false, error: 'invalid_area_slug' }
  if (!id || id !== `${supportedCitySlug}-${areaSlug}`) {
    return { ok: false, error: 'invalid_id' }
  }
  if (!name) return { ok: false, error: 'invalid_name' }
  if (!bestFor) return { ok: false, error: 'invalid_best_for' }
  if (!summary) return { ok: false, error: 'invalid_summary' }
  if (!tradeoffs) return { ok: false, error: 'invalid_tradeoffs' }
  if (!reviewedBy) return { ok: false, error: 'invalid_reviewed_by' }
  if (!reviewedAt || Number.isNaN(Date.parse(reviewedAt))) {
    return { ok: false, error: 'invalid_reviewed_at' }
  }

  return {
    ok: true,
    data: {
      id,
      citySlug: supportedCitySlug,
      city,
      areaSlug,
      name,
      bestFor,
      summary,
      tradeoffs,
      reviewedBy,
      reviewedAt,
    },
  }
}

export function validateAgodaAreaRecommendationCatalogue(value: unknown): CatalogueValidation {
  if (!Array.isArray(value)) return { ok: false, error: 'invalid_catalogue' }

  const records: AgodaAreaRecommendation[] = []
  const seenIds = new Set<string>()
  const seenAreaSlugs = new Set<string>()
  const cityCounts = new Map<AgodaAreaCitySlug, number>()

  for (const record of value) {
    const result = validateAgodaAreaRecommendationRecord(record)
    if (!result.ok) return result

    const areaKey = `${result.data.citySlug}:${result.data.areaSlug}`
    if (seenAreaSlugs.has(areaKey)) {
      return { ok: false, error: 'duplicate_area_slug' }
    }
    if (seenIds.has(result.data.id)) return { ok: false, error: 'duplicate_id' }

    seenAreaSlugs.add(areaKey)
    seenIds.add(result.data.id)
    cityCounts.set(result.data.citySlug, (cityCounts.get(result.data.citySlug) ?? 0) + 1)
    records.push(result.data)
  }

  if (AGODA_AREA_CITY_SLUGS.some(city => !cityCounts.has(city))) {
    return { ok: false, error: 'incomplete_city_coverage' }
  }
  if ([...cityCounts.values()].some(count => count < 2 || count > 4)) {
    return { ok: false, error: 'invalid_area_count' }
  }

  return { ok: true, data: records }
}
