import 'server-only'

import {
  AGODA_SUPPORTED_CITIES,
  type AgodaHotelResult,
  type AgodaHotelSearchInput,
  type AgodaSupportedCity,
  isAgodaSupportedCity,
} from './agoda-contract'

const CONTENT_FEED_PATH = '/datafeeds/feed/getfeed'
const MAX_RESULTS = 6
const REQUEST_TIMEOUT_MS = 8_000
const AGODA_PARTNER_SEARCH = 'https://www.agoda.com/partners/partnersearch.aspx'

type JsonRecord = Record<string, unknown>

export type AgodaAccommodationConfig = {
  siteId: string
  contentToken: string
  searchApiKey: string
  affiliateCid: string
  contentBaseUrl: string
  searchApiUrl: string
  cityIds: Readonly<Partial<Record<AgodaSupportedCity, string>>>
}

type SearchOptions = {
  config?: AgodaAccommodationConfig
  fetchImpl?: typeof fetch
}

type ContentHotel = {
  hotelId: string
  name: string
  starRating: number | null
  reviewScore: number | null
  reviewCount: number
  latitude: number
  longitude: number
  popularityScore: number
}

type LivePrice = NonNullable<AgodaHotelResult['price']>

type LiveOffer = {
  price: LivePrice
  handoffUrl: string | null
}

function stringValue(record: JsonRecord, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return null
}

function numberValue(record: JsonRecord, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
      return Number(value)
    }
  }
  return null
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function recordList(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function parseCityIds(value: string | undefined): Partial<Record<AgodaSupportedCity, string>> {
  if (!value) return {}

  try {
    const parsed: unknown = JSON.parse(value)
    if (!isRecord(parsed)) return {}

    const entries = Object.entries(parsed).filter(
      (entry): entry is [AgodaSupportedCity, string] =>
        isAgodaSupportedCity(entry[0]) && typeof entry[1] === 'string' && entry[1].trim().length > 0,
    )
    return Object.fromEntries(entries)
  } catch {
    return {}
  }
}

function readConfig(): AgodaAccommodationConfig | null {
  const siteId = process.env.AGODA_API_SITE_ID?.trim()
  const contentToken = process.env.AGODA_CONTENT_API_TOKEN?.trim()
  const searchApiKey = process.env.AGODA_SEARCH_API_KEY?.trim()
  const affiliateCid = process.env.AGODA_AFFILIATE_CID?.trim()
  const contentBaseUrl = process.env.AGODA_CONTENT_BASE_URL?.trim()
  const searchApiUrl = process.env.AGODA_SEARCH_API_URL?.trim()
  const cityIds = parseCityIds(process.env.AGODA_CONTENT_CITY_IDS)

  if (!siteId || !contentToken || !searchApiKey || !affiliateCid || !contentBaseUrl || !searchApiUrl) return null
  if (Object.keys(cityIds).length === 0) return null

  try {
    if (new URL(contentBaseUrl).protocol !== 'https:') return null
    if (new URL(searchApiUrl).protocol !== 'https:') return null
  } catch {
    return null
  }

  return {
    siteId,
    contentToken,
    searchApiKey,
    affiliateCid,
    contentBaseUrl,
    searchApiUrl,
    cityIds,
  }
}

export function isAgodaAccommodationConfigured(): boolean {
  return readConfig() !== null
}

export function getConfiguredAgodaCities(): AgodaSupportedCity[] {
  const config = readConfig()
  if (!config) return []
  return AGODA_SUPPORTED_CITIES.filter(city => Boolean(config.cityIds[city]))
}

function assertConfig(config: AgodaAccommodationConfig | undefined): AgodaAccommodationConfig {
  const resolved = config ?? readConfig()
  if (!resolved) throw new Error('provider_not_configured')
  return resolved
}

function isThailandCoordinate(latitude: number, longitude: number): boolean {
  return latitude >= 5.5 && latitude <= 20.6 && longitude >= 97 && longitude <= 106
}

function extractContentHotels(payload: unknown): JsonRecord[] {
  if (!isRecord(payload)) return []
  const feed = payload.hotelInformationFeed
  if (!isRecord(feed) || !isRecord(feed.hotelInformations)) return []
  return recordList(feed.hotelInformations.hotelInformation)
}

function mapContentHotel(record: JsonRecord): ContentHotel | null {
  const hotelId = stringValue(record, 'hotelId')
  const name = stringValue(record, 'translatedName', 'hotelName')
  const latitude = numberValue(record, 'latitude')
  const longitude = numberValue(record, 'longitude')
  const numericId = hotelId ? Number(hotelId) : Number.NaN

  if (!hotelId || !name || !Number.isSafeInteger(numericId)) return null
  if (latitude == null || longitude == null || !isThailandCoordinate(latitude, longitude)) return null

  const rawStarRating = numberValue(record, 'starRating')
  const rawReviewScore = numberValue(record, 'ratingAverage', 'reviewScore')

  return {
    hotelId,
    name,
    starRating: rawStarRating == null ? null : Math.max(0, Math.min(5, rawStarRating)),
    reviewScore: rawReviewScore == null || rawReviewScore <= 0
      ? null
      : Math.max(0, Math.min(10, rawReviewScore)),
    reviewCount: Math.max(0, numberValue(record, 'numberOfReviews', 'reviewCount') ?? 0),
    latitude,
    longitude,
    popularityScore: Math.max(0, numberValue(record, 'popularityScore') ?? 0),
  }
}

function extractPictureUrl(payload: unknown): string | null {
  if (!isRecord(payload) || !isRecord(payload.pictureFeed) || !isRecord(payload.pictureFeed.pictures)) {
    return null
  }

  for (const picture of recordList(payload.pictureFeed.pictures.picture)) {
    const rawUrl = stringValue(picture, 'URL', 'url')
    if (!rawUrl) continue
    try {
      const url = new URL(rawUrl)
      const isAgodaImage = url.hostname === 'agoda.net' || url.hostname.endsWith('.agoda.net')
      if (url.protocol === 'https:' && isAgodaImage) return url.toString()
    } catch {
      // Ignore malformed upstream image URLs.
    }
  }

  return null
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const start = Date.parse(`${checkIn}T00:00:00Z`)
  const end = Date.parse(`${checkOut}T00:00:00Z`)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0
  return Math.round((end - start) / 86_400_000)
}

function positiveNumber(record: JsonRecord, key: string): number | null {
  const value = numberValue(record, key)
  return value != null && value > 0 ? value : null
}

function safeAgodaUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    const isAgodaHost = url.hostname === 'agoda.com' || url.hostname.endsWith('.agoda.com')
    return url.protocol === 'https:' && isAgodaHost ? url.toString() : null
  } catch {
    return null
  }
}

function mapLiveOffers(payload: unknown, nights: number): Map<string, LiveOffer> {
  const results = new Map<string, LiveOffer>()
  if (!isRecord(payload)) return results

  for (const property of recordList(payload.properties)) {
    const hotelId = stringValue(property, 'propertyId')
    if (!hotelId) continue

    const candidates = recordList(property.rooms).flatMap(room => {
      const totalPayment = isRecord(room.totalPayment) ? room.totalPayment : {}
      const rate = isRecord(room.rate) ? room.rate : {}
      const perRoomPerNightRate = isRecord(room.perRoomPerNightRate) ? room.perRoomPerNightRate : {}
      const total = positiveNumber(totalPayment, 'inclusive') ?? positiveNumber(rate, 'inclusive')
      const perNight = positiveNumber(perRoomPerNightRate, 'inclusive') ?? (total ? total / nights : null)
      const currency = stringValue(perRoomPerNightRate, 'currency') ?? stringValue(rate, 'currency')
      if (!total || !perNight || !currency) return []
      return [{
        price: { currency, total, perNight, nights },
        handoffUrl: safeAgodaUrl(stringValue(room, 'landingUrl')),
      }]
    }).sort((a, b) => a.price.total - b.price.total)

    if (candidates[0]) results.set(hotelId, candidates[0])
  }

  return results
}

function buildHandoffUrl(input: AgodaHotelSearchInput, hotelId: string, cid: string): string {
  const url = new URL(AGODA_PARTNER_SEARCH)
  url.search = new URLSearchParams({
    cid,
    hid: hotelId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    NumberofAdults: String(input.adults),
    NumberofChildren: String(input.children),
    Rooms: '1',
    currencyCode: 'THB',
  }).toString()
  return url.toString()
}

async function fetchJson(fetchImpl: typeof fetch, url: string | URL, init: RequestInit): Promise<unknown> {
  const response = await fetchImpl(url, {
    ...init,
    redirect: 'error',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error('agoda_upstream_error')
  return response.json()
}

async function fetchContentFeed(
  fetchImpl: typeof fetch,
  config: AgodaAccommodationConfig,
  params: Record<string, string>,
): Promise<unknown> {
  const url = new URL(CONTENT_FEED_PATH, config.contentBaseUrl)
  url.search = new URLSearchParams({
    ...params,
    token: config.contentToken,
    site_id: config.siteId,
  }).toString()
  return fetchJson(fetchImpl, url, { method: 'GET' })
}

export async function searchAgodaHotels(
  input: AgodaHotelSearchInput,
  options: SearchOptions = {},
): Promise<AgodaHotelResult[]> {
  if (!isAgodaSupportedCity(input.city)) throw new Error('unsupported_city')
  const config = assertConfig(options.config)
  const cityId = config.cityIds[input.city]
  if (!cityId) throw new Error('unsupported_city')

  const nights = nightsBetween(input.checkIn, input.checkOut)
  if (nights < 1 || nights > 30) throw new Error('invalid_stay')

  const fetchImpl = options.fetchImpl ?? fetch
  const contentPayload = await fetchContentFeed(fetchImpl, config, {
    feed_id: '5',
    mcity_id: cityId,
  })
  const contentHotels = extractContentHotels(contentPayload)
    .map(mapContentHotel)
    .filter((hotel): hotel is ContentHotel => hotel !== null)
    .sort((a, b) => b.popularityScore - a.popularityScore || b.reviewCount - a.reviewCount)
    .slice(0, MAX_RESULTS)

  if (contentHotels.length === 0) return []

  const picturePayloads = await Promise.all(contentHotels.map(hotel =>
    fetchContentFeed(fetchImpl, config, { feed_id: '7', mhotel_id: hotel.hotelId })
      .catch(() => null),
  ))

  const searchPayload = await fetchJson(fetchImpl, config.searchApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `${config.siteId}:${config.searchApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      waitTime: 30,
      criteria: {
        propertyIds: contentHotels.map(hotel => Number(hotel.hotelId)),
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        rooms: 1,
        adults: input.adults,
        children: input.children,
        ...(input.children > 0
          ? { childrenAges: Array.from({ length: input.children }, () => 0) }
          : {}),
        language: 'en-us',
        currency: 'THB',
      },
      features: { ratesPerProperty: 1, extra: ['content', 'metaSearch'] },
    }),
  })
  const offers = mapLiveOffers(searchPayload, nights)

  return contentHotels.map((hotel, index) => {
    const offer = offers.get(hotel.hotelId)
    return {
      provider: 'agoda',
      hotelId: hotel.hotelId,
      name: hotel.name,
      city: input.city,
      starRating: hotel.starRating,
      reviewScore: hotel.reviewScore,
      reviewCount: hotel.reviewCount,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      imageUrl: extractPictureUrl(picturePayloads[index]),
      ...(offer ? { price: offer.price } : {}),
      handoffUrl: offer?.handoffUrl ?? buildHandoffUrl(input, hotel.hotelId, config.affiliateCid),
      handoffRel: 'nofollow sponsored noopener noreferrer',
    }
  })
}
