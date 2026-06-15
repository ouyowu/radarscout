import 'server-only'

const MAX_PRODUCT_ID_LENGTH = 128
const MAX_REVIEWER_LENGTH = 160
const MAX_CLEANED_TITLE_LENGTH = 120
const MAX_SHORT_SUMMARY_LENGTH = 280
const MAX_SEO_TITLE_LENGTH = 70
const MAX_SEO_DESCRIPTION_LENGTH = 180
const MAX_TAGS = 8
const MAX_TAG_LENGTH = 40

const REVIEWED_FIELD_KEYS = [
  'cleanedTitle',
  'shortSummary',
  'suggestedTags',
  'seoTitle',
  'seoDescription',
] as const

const ALLOWED_KEYS = new Set([
  'productId',
  ...REVIEWED_FIELD_KEYS,
  'reviewedBy',
  'reviewedAt',
])

const FORBIDDEN_KEYS = new Set([
  'rawJson',
  'price',
  'availability',
  'supplier',
  'supplierName',
  'rating',
  'reviewCount',
  'bookingUrl',
  'bookingStatus',
  'openingHours',
  'checkout',
  'payment',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
])

export type ReviewedEnrichmentData = {
  productId: string
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string
  reviewedAt: Date
}

export type ReviewedEnrichmentValidationResult =
  | { ok: true; data: ReviewedEnrichmentData }
  | {
      ok: false
      status: 400
      error:
        | 'invalid_product_id'
        | 'invalid_reviewer'
        | 'invalid_reviewed_at'
        | 'no_reviewed_fields'
        | 'unknown_fields'
        | 'forbidden_fields'
      fields?: string[]
    }

export type ReviewedEnrichmentRecord = ReviewedEnrichmentData & {
  updatedAt: Date
}

function compactString(value: string, maxLength: number): string | null {
  const compacted = value.trim().replace(/\s+/g, ' ')

  if (!compacted) return null

  return compacted.length > maxLength
    ? compacted.slice(0, maxLength).trim()
    : compacted
}

function optionalString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null

  return compactString(value, maxLength)
}

function requiredString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null

  return compactString(value, maxLength)
}

function parseProductId(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const productId = value.trim()

  if (!productId || productId.length > MAX_PRODUCT_ID_LENGTH) return null

  return productId
}

function sanitizeTags(value: unknown): string[] | null {
  if (value === undefined) return []
  if (!Array.isArray(value)) return null

  const seen = new Set<string>()
  const tags: string[] = []

  for (const rawTag of value) {
    if (typeof rawTag !== 'string') continue

    const tag = compactString(rawTag, MAX_TAG_LENGTH)
    if (!tag) continue

    const key = tag.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    tags.push(tag)

    if (tags.length >= MAX_TAGS) break
  }

  return tags
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

function parseReviewedAt(value: unknown): Date | null {
  if (value === undefined) return new Date()
  if (typeof value !== 'string') return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export function sanitizeReviewedEnrichmentInput(
  value: unknown,
): ReviewedEnrichmentValidationResult {
  const payload = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {}

  const { forbidden, unknown } = findInvalidKeys(payload)

  if (forbidden.length > 0) {
    return { ok: false, status: 400, error: 'forbidden_fields', fields: forbidden }
  }

  if (unknown.length > 0) {
    return { ok: false, status: 400, error: 'unknown_fields', fields: unknown }
  }

  const productId = parseProductId(payload.productId)
  if (!productId) {
    return { ok: false, status: 400, error: 'invalid_product_id' }
  }

  const reviewedBy = requiredString(payload.reviewedBy, MAX_REVIEWER_LENGTH)
  if (!reviewedBy) {
    return { ok: false, status: 400, error: 'invalid_reviewer' }
  }

  const reviewedAt = parseReviewedAt(payload.reviewedAt)
  if (!reviewedAt) {
    return { ok: false, status: 400, error: 'invalid_reviewed_at' }
  }

  const suggestedTags = sanitizeTags(payload.suggestedTags)
  if (!suggestedTags) {
    return { ok: false, status: 400, error: 'unknown_fields', fields: ['suggestedTags'] }
  }

  const data: ReviewedEnrichmentData = {
    productId,
    cleanedTitle: optionalString(payload.cleanedTitle, MAX_CLEANED_TITLE_LENGTH),
    shortSummary: optionalString(payload.shortSummary, MAX_SHORT_SUMMARY_LENGTH),
    suggestedTags,
    seoTitle: optionalString(payload.seoTitle, MAX_SEO_TITLE_LENGTH),
    seoDescription: optionalString(payload.seoDescription, MAX_SEO_DESCRIPTION_LENGTH),
    reviewedBy,
    reviewedAt,
  }

  const hasReviewedField = REVIEWED_FIELD_KEYS.some((key) => {
    const field = data[key]
    return Array.isArray(field) ? field.length > 0 : field !== null
  })

  if (!hasReviewedField) {
    return { ok: false, status: 400, error: 'no_reviewed_fields' }
  }

  return { ok: true, data }
}

export function toReviewedEnrichmentResponse(record: ReviewedEnrichmentRecord) {
  return {
    productId: record.productId,
    cleanedTitle: record.cleanedTitle,
    shortSummary: record.shortSummary,
    suggestedTags: record.suggestedTags,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    reviewedBy: record.reviewedBy,
    reviewedAt: record.reviewedAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}
