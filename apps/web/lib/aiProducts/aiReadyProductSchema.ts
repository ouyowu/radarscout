import {
  buildProductRecommendationSignals,
} from '../ai-trip/recommendation-signals'
import {
  loadReviewedViatorPublicCatalogue,
  type ReviewedViatorPublicProduct,
} from '../viator/reviewedViatorPublicCatalogue'

export const AI_READY_PRODUCT_SCHEMA_VERSION =
  'radarscout.ai-ready-product.v1' as const

const RADARSCOUT_ORIGIN = 'https://www.radarscout.io'
const FORBIDDEN_FIELDS = new Set([
  'availability',
  'bookingPartnerHandoff',
  'bookingUrl',
  'commission',
  'currency',
  'price',
  'rating',
  'raw',
  'retailPrice',
  'reviewCount',
  'reviews',
  'supplier',
])

export type AiReadyProduct = {
  schemaVersion: typeof AI_READY_PRODUCT_SCHEMA_VERSION
  id: string
  title: string
  summary: string
  destination: {
    country: 'Thailand'
    countryCode: 'TH'
    city: string
  }
  themes: string[]
  recommendation: {
    whyRecommended: string
    bestFor: string[]
    strengths: string[]
    tradeoffs: string[]
  }
  partnerLink: `https://www.radarscout.io/tours/${string}`
  handoff: {
    mode: 'affiliate_partner'
    label: 'Check availability'
    availabilityClaimed: false
  }
  provenance: {
    source: 'reviewed_viator_catalog'
    reviewStatus: 'human_reviewed'
  }
}

export type AiReadyProductValidationResult =
  | { ok: true; value: AiReadyProduct }
  | { ok: false; error: 'forbidden_fields'; fields: string[] }
  | { ok: false; error: 'invalid_shape' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  const actual = Object.keys(value).sort()
  return actual.length === expected.length
    && actual.every((key, index) => key === [...expected].sort()[index])
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value)
    && value.length > 0
    && value.every(isNonEmptyString)
}

function collectForbiddenFields(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [...new Set(value.flatMap(collectForbiddenFields))].sort()
  }
  if (!isRecord(value)) return []

  return [...new Set(Object.entries(value).flatMap(([key, nested]) => [
    ...(FORBIDDEN_FIELDS.has(key) ? [key] : []),
    ...collectForbiddenFields(nested),
  ]))].sort()
}

function isOwnedProductLink(value: unknown, id: unknown): value is AiReadyProduct['partnerLink'] {
  if (typeof value !== 'string' || typeof id !== 'string') return false
  return value === `${RADARSCOUT_ORIGIN}/tours/${encodeURIComponent(id)}`
}

export function buildAiReadyProduct(
  product: ReviewedViatorPublicProduct,
): AiReadyProduct {
  const signals = buildProductRecommendationSignals({
    title: product.title,
    city: product.destination,
    summary: product.summary,
    tags: product.tags,
  }, {
    destination: product.destination,
    interests: product.tags.slice(0, 2),
    travelerType: 'unspecified',
    pace: 'unspecified',
    month: null,
  })
  const themeSummary = product.tags.slice(0, 2).join(' and ').toLowerCase()

  return {
    schemaVersion: AI_READY_PRODUCT_SCHEMA_VERSION,
    id: product.id,
    title: product.title,
    summary: product.summary,
    destination: {
      country: 'Thailand',
      countryCode: 'TH',
      city: product.destination,
    },
    themes: [...product.tags],
    recommendation: {
      whyRecommended: signals.whyRecommended,
      bestFor: signals.bestFor,
      strengths: [
        'Human-reviewed Thailand day-trip option',
        ...(themeSummary ? [`Supports ${themeSummary} interests`] : []),
      ],
      tradeoffs: [signals.watchOut],
    },
    partnerLink: `${RADARSCOUT_ORIGIN}${product.detailHref}`,
    handoff: {
      mode: 'affiliate_partner',
      label: 'Check availability',
      availabilityClaimed: false,
    },
    provenance: {
      source: 'reviewed_viator_catalog',
      reviewStatus: 'human_reviewed',
    },
  }
}

export function loadAiReadyProductCatalogue(): AiReadyProduct[] {
  return loadReviewedViatorPublicCatalogue().map(buildAiReadyProduct)
}

export function validateAiReadyProduct(
  value: unknown,
): AiReadyProductValidationResult {
  const forbiddenFields = collectForbiddenFields(value)
  if (forbiddenFields.length > 0) {
    return { ok: false, error: 'forbidden_fields', fields: forbiddenFields }
  }
  if (!isRecord(value)) return { ok: false, error: 'invalid_shape' }
  if (!hasExactKeys(value, [
    'schemaVersion',
    'id',
    'title',
    'summary',
    'destination',
    'themes',
    'recommendation',
    'partnerLink',
    'handoff',
    'provenance',
  ])) return { ok: false, error: 'invalid_shape' }

  const { destination, recommendation, handoff, provenance } = value
  if (
    value.schemaVersion !== AI_READY_PRODUCT_SCHEMA_VERSION
    || !isNonEmptyString(value.id)
    || !value.id.startsWith('viator_')
    || !isNonEmptyString(value.title)
    || !isNonEmptyString(value.summary)
    || !isNonEmptyStringArray(value.themes)
    || !isOwnedProductLink(value.partnerLink, value.id)
    || !isRecord(destination)
    || !hasExactKeys(destination, ['country', 'countryCode', 'city'])
    || destination.country !== 'Thailand'
    || destination.countryCode !== 'TH'
    || !isNonEmptyString(destination.city)
    || !isRecord(recommendation)
    || !hasExactKeys(recommendation, [
      'whyRecommended',
      'bestFor',
      'strengths',
      'tradeoffs',
    ])
    || !isNonEmptyString(recommendation.whyRecommended)
    || !isNonEmptyStringArray(recommendation.bestFor)
    || !isNonEmptyStringArray(recommendation.strengths)
    || !isNonEmptyStringArray(recommendation.tradeoffs)
    || !isRecord(handoff)
    || !hasExactKeys(handoff, ['mode', 'label', 'availabilityClaimed'])
    || handoff.mode !== 'affiliate_partner'
    || handoff.label !== 'Check availability'
    || handoff.availabilityClaimed !== false
    || !isRecord(provenance)
    || !hasExactKeys(provenance, ['source', 'reviewStatus'])
    || provenance.source !== 'reviewed_viator_catalog'
    || provenance.reviewStatus !== 'human_reviewed'
  ) {
    return { ok: false, error: 'invalid_shape' }
  }

  return { ok: true, value: value as AiReadyProduct }
}
