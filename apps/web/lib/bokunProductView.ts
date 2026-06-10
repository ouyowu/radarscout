import type { Prisma } from '@reddit-monitor/db'

export type ProductView = {
  imageUrl: string | null
  images: string[]
  summary: string | null
  description: string | null
  descriptionParagraphs: string[]
  itinerary: string[]
  included: string[]
  excluded: string[]
  additionalInfo: string[]
  cancellationPolicy: string | null
  guidance: string[]
  meetingType: string | null
  difficulty: string | null
  reviewRating: number | null
  reviewCount: number | null
  reviews: Array<{
    author: string | null
    rating: number | null
    title: string | null
    text: string
    date: string | null
  }>
  pickup: string | null
  duration: string | null
}

const OTA_MARKUP_RANGE = {
  min: 1.15,
  max: 1.25,
  default: 1.20,
}

const PRODUCT_TYPE_MARGINS = {
  'day-tour': 1.15,
  'private-tour': 1.20,
  'multi-day': 1.18,
  transfer: 1.12,
  default: 1.15,
}

type ProductType = keyof typeof PRODUCT_TYPE_MARGINS

type SelectionInput = {
  rawJson: Prisma.JsonValue
  title: string
  city?: string | null
  location?: string | null
  retailPrice?: Prisma.Decimal | string | number | null
  netSettlementPrice?: Prisma.Decimal | string | number | null
  description?: string | null
  excerpt?: string | null
  supplier?: { title?: string | null; status?: string | null } | null
  lastSyncedAt?: Date | string | null
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)

  return null
}

function stripHtml(value: string | null): string | null {
  if (!value) return null

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim()
}

function splitText(value: string | null): string[] {
  const stripped = stripHtml(value)
  if (!stripped) return []

  return stripped
    .split(/\n+|(?:^|\s)[•·]\s+|;\s+/)
    .map(item => item.replace(/^[-–—*]\s*/, '').trim())
    .filter(item => item.length > 0)
}

function readStringList(value: unknown): string[] {
  if (typeof value === 'string') return splitText(value)
  if (!Array.isArray(value)) return []

  return value
    .map(item => {
      if (typeof item === 'string') return item
      const record = asRecord(item)
      return readString(record.title) ??
        readString(record.name) ??
        readString(record.excerpt) ??
        readString(record.body) ??
        readString(record.description) ??
        readString(record.text) ??
        readString(asRecord(record.location).wholeAddress)
    })
    .filter((item): item is string => !!item)
    .flatMap(item => splitText(item).length ? splitText(item) : [stripHtml(item) ?? item])
}

function firstNonEmptyList(...lists: string[][]): string[] {
  return lists.find(list => list.length > 0) ?? []
}

function uniqueList(...lists: string[][]): string[] {
  return Array.from(new Set(lists.flat().map(item => item.trim()).filter(Boolean)))
}

function humanizeInfo(value: string): string {
  const labels: Record<string, string> = {
    PUBLIC_TRANSPORTATION_NEARBY: 'Public transportation is available nearby',
    INFANT_SEATS_AVAILABLE: 'Infant seats are available',
    INFANTS_MUST_SIT_ON_LAPS: 'Infants must sit on laps',
    WHEELCHAIR_ACCESSIBLE: 'Wheelchair accessible',
    STROLLER_ACCESSIBLE: 'Stroller accessible',
  }

  return labels[value] ?? value
}

function readNestedNumber(record: Record<string, unknown>, paths: string[][]): number | null {
  for (const path of paths) {
    let current: unknown = record
    for (const segment of path) {
      current = asRecord(current)[segment]
    }

    const value = readNumber(current)
    if (value !== null) return value
  }

  return null
}

function readNestedString(record: Record<string, unknown>, paths: string[][]): string | null {
  for (const path of paths) {
    let current: unknown = record
    for (const segment of path) {
      current = asRecord(current)[segment]
    }

    const value = readString(current)
    if (value) return value
  }

  return null
}

function readGuidanceTypes(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map(item => {
      const record = asRecord(item)
      const type = readString(record.guidanceType)
      const languages = Array.isArray(record.displayLanguages)
        ? record.displayLanguages.filter((language): language is string => typeof language === 'string')
        : []

      return [type, languages.length ? languages.join(', ') : null].filter(Boolean).join(': ')
    })
    .filter(Boolean)
}

function readReviews(raw: Record<string, unknown>): ProductView['reviews'] {
  const candidates = [
    raw.reviews,
    raw.reviewItems,
    raw.customerReviews,
    asRecord(raw.tripadvisorReview).reviews,
  ]
  const values = candidates.find(Array.isArray)

  if (!Array.isArray(values)) return []

  return values
    .map(item => {
      const record = asRecord(item)
      const text = stripHtml(
        readString(record.text) ??
        readString(record.body) ??
        readString(record.comment) ??
        readString(record.review),
      )

      if (!text) return null

      return {
        author: readString(record.author) ?? readString(record.authorName) ?? readString(record.name),
        rating: readNumber(record.rating) ?? readNumber(record.reviewRating),
        title: readString(record.title) ?? readString(record.headline),
        text,
        date: readString(record.date) ?? readString(record.created) ?? readString(record.createdAt),
      }
    })
    .filter((review): review is ProductView['reviews'][number] => Boolean(review))
}

function hasKnownSalesSignal(raw: Record<string, unknown>): boolean {
  return readNestedNumber(raw, [
    ['sold'],
    ['soldCount'],
    ['salesCount'],
    ['bookingCount'],
    ['bookings'],
    ['totalBookings'],
    ['statistics', 'sold'],
    ['statistics', 'bookingCount'],
    ['stats', 'sold'],
    ['stats', 'bookingCount'],
  ]) !== null
}

function findImageUrl(rawJson: Prisma.JsonValue): string | null {
  return findImageUrls(rawJson)[0] ?? null
}

export function findImageUrls(rawJson: Prisma.JsonValue): string[] {
  const raw = asRecord(rawJson)
  const keyPhoto = asRecord(raw.keyPhoto)
  const candidates: string[] = []

  function addPhoto(value: unknown) {
    const photo = asRecord(value)
    const derived = Array.isArray(photo.derived) ? photo.derived.map(asRecord) : []
    const preferred = [
      ...derived.filter(image => readString(image.name) === 'large'),
      ...derived.filter(image => readString(image.name) === 'preview'),
      ...derived,
      photo,
    ]

    for (const image of preferred) {
      const url = readString(image.url) ?? readString(image.cleanUrl) ?? readString(image.originalUrl)
      if (url) candidates.push(url)
    }
  }

  addPhoto(keyPhoto)

  for (const key of ['photos', 'images', 'media']) {
    const values = raw[key]
    if (Array.isArray(values)) values.forEach(addPhoto)
  }

  return [...new Set(candidates)]
}

export function parseMoney(value: Prisma.Decimal | string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.round(parsed) : null
}

export function formatPrice(value: Prisma.Decimal | string | number | null | undefined, currency?: string | null): string {
  const price = parseMoney(value)
  if (price === null) return 'Quote'

  return `${currency ?? 'USD'} ${price}`
}

function detectProductTypeFromText(title?: string | null, description?: string | null, excerpt?: string | null): ProductType {
  const text = `${title ?? ''} ${description ?? ''} ${excerpt ?? ''}`.toLowerCase()

  if (text.includes('private') || text.includes('exclusive')) return 'private-tour'
  if (text.includes('transfer') || text.includes('airport')) return 'transfer'
  if (text.includes('multi-day') || text.includes('overnight')) return 'multi-day'

  return 'day-tour'
}

export function detectProductType(product: Pick<SelectionInput, 'title' | 'description' | 'excerpt'>): ProductType {
  return detectProductTypeFromText(product.title, product.description, product.excerpt)
}

function roundCurrency(value: number): number {
  return Math.round(value)
}

export function publicEstimate(retailPrice: Prisma.Decimal | string | number | null | undefined, netPrice: Prisma.Decimal | string | number | null | undefined, currency?: string | null): string {
  const estimate = marketplaceEstimateValue(retailPrice, netPrice)
  if (estimate === null) return 'Public quote'

  return `${currency ?? 'USD'} ${estimate}`
}

export function marketplaceEstimateValue(retailPrice: Prisma.Decimal | string | number | null | undefined, netPrice: Prisma.Decimal | string | number | null | undefined): number | null {
  const base = parseMoney(retailPrice) ?? parseMoney(netPrice)
  if (base === null) return null

  return roundCurrency(base * OTA_MARKUP_RANGE.default)
}

export function radarScoutOfferValue(
  retailPrice: Prisma.Decimal | string | number | null | undefined,
  netPrice: Prisma.Decimal | string | number | null | undefined,
  productType: ProductType | string = 'default',
): number | null {
  const market = marketplaceEstimateValue(retailPrice, netPrice)
  const net = parseMoney(netPrice)
  const retail = parseMoney(retailPrice)

  if (market === null) return net ?? retail
  if (net === null) return roundCurrency(market * 0.92)

  const targetOffer = roundCurrency(market * 0.92)
  const marginMultiplier = PRODUCT_TYPE_MARGINS[productType as ProductType] ?? PRODUCT_TYPE_MARGINS.default
  const minimumPrice = Math.ceil(net * marginMultiplier)

  return Math.max(targetOffer, minimumPrice)
}

export function radarScoutOffer(
  retailPrice: Prisma.Decimal | string | number | null | undefined,
  netPrice: Prisma.Decimal | string | number | null | undefined,
  currency?: string | null,
  productType: ProductType | string = 'default',
): string {
  const offer = radarScoutOfferValue(retailPrice, netPrice, productType)
  if (offer === null) return 'Quote'

  return `${currency ?? 'USD'} ${offer}`
}

export function priceComparisonLabel(
  retailPrice: Prisma.Decimal | string | number | null | undefined,
  netPrice: Prisma.Decimal | string | number | null | undefined,
  productType: ProductType | string = 'default',
): string {
  const market = marketplaceEstimateValue(retailPrice, netPrice)
  const offer = radarScoutOfferValue(retailPrice, netPrice, productType)

  if (!market || !offer || market <= offer) return 'Direct-rate check'

  const savingsPercent = ((market - offer) / market) * 100

  if (savingsPercent >= 10) {
    return `Save ~${savingsPercent.toFixed(0)}% vs typical OTA prices*`
  }

  if (savingsPercent >= 5) {
    return 'Competitive direct booking rate*'
  }

  return 'Direct supplier rate*'
}

export function getPriceDisclaimer(): string {
  return `* Price comparison based on estimated OTA markup (${Math.round((OTA_MARKUP_RANGE.min - 1) * 100)}-${Math.round((OTA_MARKUP_RANGE.max - 1) * 100)}%). Actual competitor prices may vary by date, season, and availability.`
}

export function productSelectionScore(product: SelectionInput): number {
  const raw = asRecord(product.rawJson)
  const view = productView(product.rawJson, product.description, product.excerpt)
  const retail = parseMoney(product.retailPrice)
  const net = parseMoney(product.netSettlementPrice)
  const salesCount = readNestedNumber(raw, [
    ['sold'],
    ['soldCount'],
    ['salesCount'],
    ['bookingCount'],
    ['bookings'],
    ['totalBookings'],
    ['statistics', 'sold'],
    ['statistics', 'bookingCount'],
    ['stats', 'sold'],
    ['stats', 'bookingCount'],
  ]) ?? 0
  const rating = readNestedNumber(raw, [
    ['rating'],
    ['averageRating'],
    ['reviewRating'],
    ['reviews', 'averageRating'],
    ['reviewStatistics', 'averageRating'],
  ]) ?? 0
  const reviewCount = readNestedNumber(raw, [
    ['reviewCount'],
    ['reviewsCount'],
    ['numberOfReviews'],
    ['reviews', 'count'],
    ['reviewStatistics', 'count'],
  ]) ?? 0
  const rawStatus = readString(raw.status)?.toLowerCase() ?? ''
  const supplierStatus = product.supplier?.status?.toLowerCase() ?? ''
  const text = `${product.title} ${product.description ?? ''} ${product.excerpt ?? ''}`.toLowerCase()
  const descriptionLength = (product.description ?? product.excerpt ?? view.summary ?? '').length
  const directSaving = retail && net && retail > net ? Math.min(25, ((retail - net) / retail) * 100) : 0
  const syncedAt = product.lastSyncedAt ? new Date(product.lastSyncedAt).getTime() : 0
  const daysSinceSync = syncedAt ? Math.max(0, (Date.now() - syncedAt) / 86_400_000) : 999
  const isDayTour = /(day tour|full[- ]day|half[- ]day|island|temple|elephant|boat|floating market|snorkel|private|walking|food)/i.test(text)

  let score = 0
  score += Math.min(40, Math.log10(salesCount + 1) * 16)
  score += Math.min(15, rating > 5 ? rating / 10 : rating * 3)
  score += Math.min(12, Math.log10(reviewCount + 1) * 5)
  score += view.imageUrl ? 12 : 0
  score += product.city ? 8 : 0
  score += product.supplier?.title ? 6 : 0
  score += rawStatus.includes('active') || supplierStatus.includes('active') ? 6 : 0
  score += net || retail ? 8 : 0
  score += directSaving
  score += Math.min(8, descriptionLength / 250)
  score += view.itinerary.length ? 5 : 0
  score += view.included.length ? 4 : 0
  score += view.pickup ? 3 : 0
  score += isDayTour ? 10 : 0
  score -= Math.min(8, daysSinceSync / 30)

  if (!hasKnownSalesSignal(raw)) {
    score += product.city ? 4 : 0
    score += view.imageUrl && descriptionLength > 120 ? 8 : 0
  }

  return Math.round(score * 100) / 100
}

export function sortProductsBySelectionScore<T extends SelectionInput>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const scoreDiff = productSelectionScore(b) - productSelectionScore(a)
    if (scoreDiff !== 0) return scoreDiff

    const aPrice = parseMoney(a.netSettlementPrice) ?? parseMoney(a.retailPrice) ?? Number.MAX_SAFE_INTEGER
    const bPrice = parseMoney(b.netSettlementPrice) ?? parseMoney(b.retailPrice) ?? Number.MAX_SAFE_INTEGER
    if (aPrice !== bPrice) return aPrice - bPrice

    return a.title.localeCompare(b.title)
  })
}

export function isThailandRelevantProduct(product: Pick<SelectionInput, 'title' | 'city' | 'location' | 'description' | 'excerpt'>): boolean {
  const text = `${product.city ?? ''} ${product.location ?? ''} ${product.title} ${product.excerpt ?? ''} ${product.description ?? ''}`.toLowerCase()
  const thailandSignal = /(thailand|bangkok|phuket|chiang mai|chiangmai|krabi|samui|koh samui|pattaya|ayutthaya|hua hin|chiang rai|phi phi|james bond|floating market|曼谷|普吉|清迈|甲米|苏梅|芭提雅|大城|华欣|清莱)/i.test(text)
  const nonThailandSignal = /(kenya|nairobi|maasai|masai|mara|nakuru|amboseli|hellsgate|naivasha|giraffe centre|kazuri|sheldrick)/i.test(text)

  return thailandSignal || !nonThailandSignal
}

export function selectCuratedProducts<T extends SelectionInput>(products: T[], take = 100, perSupplierMinimum = 10): T[] {
  const ranked = sortProductsBySelectionScore(products)
  const selected = new Map<string, T>()
  const bySupplier = new Map<string, T[]>()

  for (const product of ranked) {
    const supplier = product.supplier?.title ?? 'No supplier'
    bySupplier.set(supplier, [...(bySupplier.get(supplier) ?? []), product])
  }

  for (const supplierProducts of bySupplier.values()) {
    for (const product of supplierProducts.slice(0, perSupplierMinimum)) {
      if (selected.size >= take) break
      selected.set(product.title, product)
    }
  }

  for (const product of ranked) {
    if (selected.size >= take) break
    selected.set(product.title, product)
  }

  return Array.from(selected.values()).slice(0, take)
}

export function productView(rawJson: Prisma.JsonValue, fallbackDescription?: string | null, fallbackExcerpt?: string | null): ProductView {
  const raw = asRecord(rawJson)
  const description = stripHtml(
    readString(raw.description) ??
    fallbackDescription ??
    readString(raw.summary) ??
    fallbackExcerpt ??
    null,
  )
  const summary = stripHtml(readString(raw.summary) ?? fallbackExcerpt ?? description)
  const itinerary = firstNonEmptyList(
    readStringList(raw.itinerary),
    readStringList(raw.agendaItems),
    readStringList(raw.route),
  )
  const included = firstNonEmptyList(
    readStringList(raw.included),
    readStringList(raw.includedItems),
    readStringList(raw.whatsIncluded),
  )
  const excluded = firstNonEmptyList(
    readStringList(raw.excluded),
    readStringList(raw.excludedItems),
    readStringList(raw.whatsExcluded),
  )
  const additionalInfo = uniqueList(
    readStringList(raw.additionalInfo),
    readStringList(raw.additionalInformation),
    readStringList(raw.requirements),
    readStringList(raw.knowBeforeYouGoItems),
    readStringList(raw.attention),
  ).map(humanizeInfo)
  const pickup = readString(raw.pickup) ??
    readString(raw.pickupInfo) ??
    readString(asRecord(raw.pickupService).description) ??
    readString(raw.noPickupMsg)
  const duration = readString(raw.durationText) ??
    readString(raw.duration) ??
    readString(asRecord(raw.duration).text)
  const cancellationPolicy = readNestedString(raw, [
    ['cancellationPolicy', 'title'],
    ['cancellationPolicy', 'description'],
    ['cancellationPolicy', 'policyType'],
  ])
  const reviewRating = readNestedNumber(raw, [
    ['reviewRating'],
    ['rating'],
    ['averageRating'],
    ['reviews', 'averageRating'],
    ['reviewStatistics', 'averageRating'],
    ['tripadvisorReview', 'rating'],
  ])
  const reviewCount = readNestedNumber(raw, [
    ['reviewCount'],
    ['reviewsCount'],
    ['numberOfReviews'],
    ['reviews', 'count'],
    ['reviewStatistics', 'count'],
    ['tripadvisorReview', 'reviewCount'],
  ])

  return {
    imageUrl: findImageUrl(rawJson),
    images: findImageUrls(rawJson),
    summary,
    description,
    descriptionParagraphs: description
      ? description.split(/\n{2,}|\n/).map(paragraph => paragraph.trim()).filter(Boolean)
      : [],
    itinerary,
    included,
    excluded,
    additionalInfo,
    cancellationPolicy: stripHtml(cancellationPolicy),
    guidance: readGuidanceTypes(raw.guidanceTypes),
    meetingType: readString(raw.meetingType) ?? readString(asRecord(raw.fields).meetingType),
    difficulty: readString(raw.difficultyLevel),
    reviewRating,
    reviewCount,
    reviews: readReviews(raw),
    pickup: stripHtml(pickup),
    duration,
  }
}
