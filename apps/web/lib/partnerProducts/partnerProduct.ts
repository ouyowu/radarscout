import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { validatePublicBookingPartnerHandoff } from '@/lib/publicProducts/bookingPartnerHandoff'

const MAX_ID_LENGTH = 128
const MAX_SLUG_LENGTH = 160
const MAX_DESTINATION_LENGTH = 120
const MAX_TITLE_LENGTH = 140
const MAX_SHORT_SUMMARY_LENGTH = 320
const MAX_PARTNER_NAME_LENGTH = 160
const MAX_REVIEWER_LENGTH = 160
const MAX_TAGS = 8
const MAX_TAG_LENGTH = 40
const MAX_IMAGE_ALT_LENGTH = 180
const MAX_IMAGE_URLS = 6

const ALLOWED_KEYS = new Set([
  'id',
  'slug',
  'destination',
  'title',
  'shortSummary',
  'tags',
  'partnerName',
  'bookingWidgetUrl',
  'imageUrl',
  'imageAlt',
  'sourceImageUrls',
  'reviewedBy',
  'reviewedAt',
])

const FORBIDDEN_KEYS = new Set([
  'rawJson',
  'price',
  'retailPrice',
  'availability',
  'availabilityEnabled',
  'supplier',
  'supplierName',
  'rating',
  'reviewCount',
  'bookingUrl',
  'bookingStatus',
  'openingHours',
  'checkout',
  'payment',
  'cart',
  'inventory',
  'confirmation',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
])

const ALLOWED_IMAGE_HOSTS = new Set(['imgcdn.bokun.tools'])

export type PartnerProduct = {
  id: string
  slug: string
  destination: string
  title: string
  shortSummary: string
  tags: string[]
  partnerName: string
  bookingWidgetUrl: string
  imageUrl?: string
  imageAlt?: string
  sourceImageUrls?: string[]
  reviewedBy: string
  reviewedAt: Date
}

export type PartnerProductValidationResult =
  | { ok: true; data: PartnerProduct }
  | {
      ok: false
      error:
        | 'not_object'
        | 'unknown_fields'
        | 'forbidden_fields'
        | 'invalid_id'
        | 'invalid_slug'
        | 'invalid_destination'
        | 'non_thailand_destination'
        | 'invalid_title'
        | 'invalid_short_summary'
        | 'invalid_tags'
        | 'invalid_partner_name'
        | 'invalid_booking_widget_url'
        | 'invalid_image_url'
        | 'invalid_image_alt'
        | 'invalid_source_image_urls'
        | 'invalid_reviewer'
        | 'invalid_reviewed_at'
      fields?: string[]
    }

function compactString(value: string, maxLength: number): string | null {
  const compacted = value.trim().replace(/\s+/g, ' ')

  if (!compacted || compacted.length > maxLength) return null

  return compacted
}

function requiredString(value: unknown, maxLength: number): string | null {
  return typeof value === 'string' ? compactString(value, maxLength) : null
}

function optionalString(value: unknown, maxLength: number): string | undefined | null {
  if (value === undefined) return undefined
  if (typeof value !== 'string') return null

  return compactString(value, maxLength)
}

function parseSlug(value: unknown): string | null {
  const slug = requiredString(value, MAX_SLUG_LENGTH)
  if (!slug) return null

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null
}

function parseTags(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null

  const seen = new Set<string>()
  const tags: string[] = []

  for (const rawTag of value) {
    if (typeof rawTag !== 'string') return null

    const tag = compactString(rawTag, MAX_TAG_LENGTH)
    if (!tag) return null

    const key = tag.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    tags.push(tag)

    if (tags.length >= MAX_TAGS) break
  }

  return tags
}

function parseReviewedAt(value: unknown): Date | null {
  if (typeof value !== 'string') return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function parsePublicImageUrl(value: unknown): string | null {
  const imageUrl = requiredString(value, 520)
  if (!imageUrl) return null

  try {
    const url = new URL(imageUrl)
    if (url.protocol !== 'https:') return null
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) return null
    if (url.username || url.password) return null

    return url.toString()
  } catch {
    return null
  }
}

function parseSourceImageUrls(value: unknown): string[] | undefined | null {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) return null

  const urls: string[] = []
  const seen = new Set<string>()

  for (const rawUrl of value) {
    const imageUrl = parsePublicImageUrl(rawUrl)
    if (!imageUrl) return null

    if (!seen.has(imageUrl)) {
      seen.add(imageUrl)
      urls.push(imageUrl)
    }

    if (urls.length >= MAX_IMAGE_URLS) break
  }

  return urls.length > 0 ? urls : null
}

function findInvalidKeys(payload: Record<string, unknown>) {
  const forbidden = new Set<string>()
  const unknown = new Set<string>()

  for (const key of Object.keys(payload)) {
    if (FORBIDDEN_KEYS.has(key)) {
      forbidden.add(key)
      continue
    }

    if (!ALLOWED_KEYS.has(key)) {
      unknown.add(key)
    }
  }

  return {
    forbidden: Array.from(forbidden).sort(),
    unknown: Array.from(unknown).sort(),
  }
}

function isThailandDestination(input: {
  destination: string
  title: string
  shortSummary: string
}) {
  return evaluateThailandProductEligibility({
    title: input.title,
    city: input.destination,
    location: input.destination,
    description: input.shortSummary,
  }).eligible
}

export function validatePartnerProductRecord(
  value: unknown,
): PartnerProductValidationResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'not_object' }
  }

  const payload = value as Record<string, unknown>
  const { forbidden, unknown } = findInvalidKeys(payload)

  if (forbidden.length > 0) {
    return { ok: false, error: 'forbidden_fields', fields: forbidden }
  }

  if (unknown.length > 0) {
    return { ok: false, error: 'unknown_fields', fields: unknown }
  }

  const id = requiredString(payload.id, MAX_ID_LENGTH)
  if (!id) return { ok: false, error: 'invalid_id' }

  const slug = parseSlug(payload.slug)
  if (!slug) return { ok: false, error: 'invalid_slug' }

  const destination = requiredString(payload.destination, MAX_DESTINATION_LENGTH)
  if (!destination) return { ok: false, error: 'invalid_destination' }

  const title = requiredString(payload.title, MAX_TITLE_LENGTH)
  if (!title) return { ok: false, error: 'invalid_title' }

  const shortSummary = requiredString(payload.shortSummary, MAX_SHORT_SUMMARY_LENGTH)
  if (!shortSummary) return { ok: false, error: 'invalid_short_summary' }

  if (!isThailandDestination({ destination, title, shortSummary })) {
    return { ok: false, error: 'non_thailand_destination' }
  }

  const tags = parseTags(payload.tags)
  if (!tags) return { ok: false, error: 'invalid_tags' }

  const partnerName = requiredString(payload.partnerName, MAX_PARTNER_NAME_LENGTH)
  if (!partnerName) return { ok: false, error: 'invalid_partner_name' }

  const handoff = validatePublicBookingPartnerHandoff({
    href: payload.bookingWidgetUrl,
    source: 'booking_partner_verified_public_widget',
    verifiedBy: 'operator_manual_review',
  })
  if (!handoff) return { ok: false, error: 'invalid_booking_widget_url' }

  const imageUrl = payload.imageUrl === undefined
    ? undefined
    : parsePublicImageUrl(payload.imageUrl)
  if (payload.imageUrl !== undefined && !imageUrl) {
    return { ok: false, error: 'invalid_image_url' }
  }

  const imageAlt = optionalString(payload.imageAlt, MAX_IMAGE_ALT_LENGTH)
  if (imageAlt === null) return { ok: false, error: 'invalid_image_alt' }

  const sourceImageUrls = parseSourceImageUrls(payload.sourceImageUrls)
  if (sourceImageUrls === null) {
    return { ok: false, error: 'invalid_source_image_urls' }
  }

  const reviewedBy = requiredString(payload.reviewedBy, MAX_REVIEWER_LENGTH)
  if (!reviewedBy) return { ok: false, error: 'invalid_reviewer' }

  const reviewedAt = parseReviewedAt(payload.reviewedAt)
  if (!reviewedAt) return { ok: false, error: 'invalid_reviewed_at' }

  return {
    ok: true,
    data: {
      id,
      slug,
      destination,
      title,
      shortSummary,
      tags,
      partnerName,
      bookingWidgetUrl: handoff.href,
      ...(imageUrl ? { imageUrl } : {}),
      ...(imageAlt ? { imageAlt } : {}),
      ...(sourceImageUrls ? { sourceImageUrls } : {}),
      reviewedBy,
      reviewedAt,
    },
  }
}
