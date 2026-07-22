import 'server-only'

const TIQETS_PRODUCTS_URL = 'https://api.tiqets.com/v2/products'
const TIQETS_USER_AGENT = 'RadarScout'
const REQUEST_TIMEOUT_MS = 8_000

type JsonRecord = Record<string, unknown>

export type TiqetsProductCandidate = {
  id: string
  title: string
  cityName: string
  countryName: 'Thailand'
  tagline?: string
  productUrl: string
  image?: {
    url: string
    altText?: string
    credit?: string
  }
  coordinates?: {
    latitude: number
    longitude: number
  }
  fromPrice?: number
  currency?: string
  rating?: {
    average: number
    total: number
  }
  saleStatus?: 'available' | 'unavailable'
}

export type TiqetsProductSearchInput = {
  countryName: 'Thailand'
  cityName?: string
  query?: string
  page?: number
  pageSize?: number
}

export type TiqetsProductSearchResult =
  | {
      ok: true
      products: TiqetsProductCandidate[]
      page: number
      pageSize: number
      total: number
    }
  | {
      ok: false
      reason: 'invalid_request' | 'not_configured' | 'upstream_error'
      status?: number
    }

type TiqetsClientDependencies = {
  apiToken?: string
  fetchFn?: typeof fetch
}

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : null
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function asFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function asNonNegativeInteger(value: unknown): number | null {
  const number = asFiniteNumber(value)
  return number !== null && Number.isInteger(number) && number >= 0 ? number : null
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function isTrackedTiqetsProductUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && (url.hostname === 'tiqets.com' || url.hostname === 'www.tiqets.com')
      && Boolean(url.searchParams.get('partner')?.trim())
  } catch {
    return false
  }
}

function selectImage(product: JsonRecord): TiqetsProductCandidate['image'] {
  const images = Array.isArray(product.images) ? product.images : []

  for (const value of images) {
    const image = asRecord(value)
    if (!image) continue

    const url = [image.extra_large, image.large, image.medium, image.small]
      .map(asNonEmptyString)
      .find((candidate): candidate is string => Boolean(candidate && isSafeHttpsUrl(candidate)))

    if (!url) continue

    const altText = asNonEmptyString(image.alt_text)
    const credit = asNonEmptyString(image.credit)

    return {
      url,
      ...(altText ? { altText } : {}),
      ...(credit ? { credit } : {}),
    }
  }

  return undefined
}

function selectCoordinates(product: JsonRecord): TiqetsProductCandidate['coordinates'] {
  const geolocation = asRecord(product.geolocation)
  const latitude = asFiniteNumber(geolocation?.lat)
  const longitude = asFiniteNumber(geolocation?.lng)

  if (
    latitude === null
    || longitude === null
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) return undefined

  return { latitude, longitude }
}

function selectRating(product: JsonRecord): TiqetsProductCandidate['rating'] {
  const ratings = asRecord(product.ratings)
  const average = asFiniteNumber(ratings?.average)
  const total = asNonNegativeInteger(ratings?.total)

  if (average === null || average < 0 || average > 5 || total === null) return undefined
  return { average, total }
}

function toCandidate(value: unknown): TiqetsProductCandidate | null {
  const product = asRecord(value)
  if (!product) return null

  const id = asNonEmptyString(product.id)
  const title = asNonEmptyString(product.title)
  const cityName = asNonEmptyString(product.city_name)
  const countryName = asNonEmptyString(product.country_name)
  const productUrl = asNonEmptyString(product.product_url)

  if (
    !id
    || !/^\d+$/.test(id)
    || !title
    || !cityName
    || countryName !== 'Thailand'
    || !productUrl
    || !isTrackedTiqetsProductUrl(productUrl)
  ) return null

  const tagline = asNonEmptyString(product.tagline)
  const image = selectImage(product)
  const coordinates = selectCoordinates(product)
  const fromPrice = asFiniteNumber(product.price)
  const currency = asNonEmptyString(product.currency)
  const rating = selectRating(product)
  const saleStatus = product.sale_status === 'available' || product.sale_status === 'unavailable'
    ? product.sale_status
    : null

  return {
    id,
    title,
    cityName,
    countryName: 'Thailand',
    productUrl,
    ...(tagline ? { tagline } : {}),
    ...(image ? { image } : {}),
    ...(coordinates ? { coordinates } : {}),
    ...(fromPrice !== null && fromPrice >= 0 ? { fromPrice } : {}),
    ...(currency && /^[A-Z]{3}$/.test(currency) ? { currency } : {}),
    ...(rating ? { rating } : {}),
    ...(saleStatus ? { saleStatus } : {}),
  }
}

function normalizeInput(input: TiqetsProductSearchInput) {
  if (input.countryName !== 'Thailand') return null

  const page = input.page ?? 1
  const pageSize = input.pageSize ?? 20
  const cityName = input.cityName?.trim() || null
  const query = input.query?.trim() || null

  if (!Number.isInteger(page) || page < 1) return null
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null
  if (cityName && cityName.length > 100) return null
  if (query && query.length > 200) return null

  return { page, pageSize, cityName, query }
}

export async function searchTiqetsProducts(
  input: TiqetsProductSearchInput,
  dependencies: TiqetsClientDependencies = {},
): Promise<TiqetsProductSearchResult> {
  const normalized = normalizeInput(input)
  if (!normalized) return { ok: false, reason: 'invalid_request' }

  const apiToken = dependencies.apiToken ?? process.env.TIQETS_API_TOKEN
  if (!apiToken?.trim()) return { ok: false, reason: 'not_configured' }

  const url = new URL(TIQETS_PRODUCTS_URL)
  url.searchParams.set('country_name', 'Thailand')
  url.searchParams.set('currency', 'THB')
  url.searchParams.set('lang', 'en')
  url.searchParams.set('page', String(normalized.page))
  url.searchParams.set('page_size', String(normalized.pageSize))
  url.searchParams.set('sort', 'popularity desc')
  url.searchParams.set('exclude_packages', 'true')
  if (normalized.cityName) url.searchParams.set('city_name', normalized.cityName)
  if (normalized.query) url.searchParams.set('query', normalized.query)

  const fetchFn = dependencies.fetchFn ?? fetch
  let response: Response

  try {
    response = await fetchFn(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${apiToken.trim()}`,
        'User-Agent': TIQETS_USER_AGENT,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch {
    return { ok: false, reason: 'upstream_error' }
  }

  if (!response.ok) return { ok: false, reason: 'upstream_error', status: response.status }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: 'upstream_error', status: response.status }
  }

  const record = asRecord(body)
  const pagination = asRecord(record?.pagination)
  const products = Array.isArray(record?.products) ? record.products : []

  return {
    ok: true,
    products: products.map(toCandidate).filter((product): product is TiqetsProductCandidate => product !== null),
    page: asNonNegativeInteger(pagination?.page) || normalized.page,
    pageSize: asNonNegativeInteger(pagination?.page_size) || normalized.pageSize,
    total: asNonNegativeInteger(pagination?.total) ?? products.length,
  }
}
