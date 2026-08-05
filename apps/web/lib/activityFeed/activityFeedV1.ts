import {
  loadAiReadyProductCatalogue,
  type AiReadyProduct,
} from '@/lib/aiProducts/aiReadyProductSchema'

export const ACTIVITY_FEED_V1_SCHEMA_VERSION =
  'radarscout.activity-feed.v1' as const

type ReviewedStatus = 'human_reviewed' | 'derived_from_reviewed_fields' | 'not_reviewed'

export type ActivityFeedField<T> = {
  status: ReviewedStatus
  value: T
}

export type ActivityFeedV1Item = {
  schemaVersion: typeof ACTIVITY_FEED_V1_SCHEMA_VERSION
  id: string
  destination: {
    country: 'Thailand'
    countryCode: 'TH'
    city: string
  }
  title: string
  summary: string
  recommendation: {
    whyRecommended: ActivityFeedField<string>
    bestFor: ActivityFeedField<string[]>
    strengths: ActivityFeedField<string[]>
    tradeoffs: ActivityFeedField<string[]>
  }
  suitableFor: ActivityFeedField<string[]>
  notSuitableFor: ActivityFeedField<string[]>
  startingPrice: ActivityFeedField<null>
  duration: ActivityFeedField<string | null>
  pickupArea: ActivityFeedField<string[]>
  childPolicy: ActivityFeedField<string | null>
  fitnessLevel: ActivityFeedField<string | null>
  cancellationPolicy: ActivityFeedField<string | null>
  ethicalAttributes: ActivityFeedField<string[]>
  experienceFeatures: ActivityFeedField<string[]>
  themes: string[]
  partnerHandoff: {
    provider: 'Viator'
    url: string
    label: 'Check availability'
    availabilityClaimed: false
    source: 'operator_verified_public_link'
    verifiedBy: 'operator_manual_review'
  }
  provenance: {
    source: 'reviewed_viator_catalog'
    reviewStatus: 'human_reviewed'
    verifiedAt: string
  }
}

function notReviewed<T>(value: T): ActivityFeedField<T> {
  return { status: 'not_reviewed', value }
}

function fromValues<T extends string[]>(field: {
  status: 'human_reviewed' | 'derived_from_reviewed_fields' | 'not_reviewed'
  values: T
}): ActivityFeedField<T> {
  return { status: field.status, value: [...field.values] as T }
}

function fromValue<T>(field: {
  status: 'human_reviewed' | 'derived_from_reviewed_fields' | 'not_reviewed'
  value: T
}): ActivityFeedField<T> {
  return { status: field.status, value: field.value }
}

function derivedValue<T>(value: T): ActivityFeedField<T> {
  return { status: 'derived_from_reviewed_fields', value }
}

function derivedValues(values: string[]): ActivityFeedField<string[]> {
  return { status: 'derived_from_reviewed_fields', value: [...values] }
}

function fromAiReadyProduct(product: AiReadyProduct): ActivityFeedV1Item {
  return {
    schemaVersion: ACTIVITY_FEED_V1_SCHEMA_VERSION,
    id: product.id,
    destination: product.destination,
    title: product.title,
    summary: product.summary,
    recommendation: {
      whyRecommended: derivedValue(product.recommendation.whyRecommended),
      bestFor: derivedValues(product.recommendation.bestFor),
      strengths: derivedValues(product.recommendation.strengths),
      tradeoffs: derivedValues(product.recommendation.tradeoffs),
    },
    suitableFor: fromValues(product.fit.suitableFor),
    notSuitableFor: fromValues(product.fit.notSuitableFor),
    // The reviewed catalogue intentionally does not contain a public price.
    // Keep this field explicit so consumers cannot mistake an unknown value for 0.
    startingPrice: notReviewed(null),
    duration: fromValue(product.logistics.duration),
    pickupArea: fromValues(product.logistics.pickupAreas),
    childPolicy: fromValue(product.logistics.childRules),
    fitnessLevel: notReviewed(null),
    cancellationPolicy: notReviewed(null),
    ethicalAttributes: fromValues(product.experience.ethicalFeatures),
    experienceFeatures: fromValues(product.experience.features),
    themes: [...product.themes],
    partnerHandoff: {
      provider: product.partnerHandoff.platform,
      url: product.partnerHandoff.url,
      label: product.partnerHandoff.label,
      availabilityClaimed: product.partnerHandoff.availabilityClaimed,
      source: 'operator_verified_public_link',
      verifiedBy: 'operator_manual_review',
    },
    provenance: {
      source: product.provenance.source,
      reviewStatus: product.provenance.reviewStatus,
      verifiedAt: product.provenance.lastVerifiedAt,
    },
  }
}

export type ActivityFeedV1ValidationResult =
  | { ok: true; value: ActivityFeedV1Item }
  | { ok: false; error: 'invalid_shape' | 'unknown_product' | 'source_mismatch' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Fail-closed validation for consumers that receive a serialized feed item.
 * The reviewed catalogue remains the source of truth; arbitrary external
 * product records cannot enter the feed by matching the TypeScript shape alone.
 */
export function validateActivityFeedV1Item(
  value: unknown,
): ActivityFeedV1ValidationResult {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return { ok: false, error: 'invalid_shape' }
  }

  const expected = loadActivityFeedV1().find(item => item.id === value.id)
  if (!expected) return { ok: false, error: 'unknown_product' }
  if (value.schemaVersion !== ACTIVITY_FEED_V1_SCHEMA_VERSION) {
    return { ok: false, error: 'invalid_shape' }
  }

  return JSON.stringify(value) === JSON.stringify(expected)
    ? { ok: true, value: expected }
    : { ok: false, error: 'source_mismatch' }
}

export type LoadActivityFeedV1Options = {
  destination?: string | null
  take?: number
}

/**
 * Read-only adapter over the existing reviewed Viator catalogue.
 * It does not fetch providers, write data, or change publication policy.
 */
export function loadActivityFeedV1(
  options: LoadActivityFeedV1Options = {},
): ActivityFeedV1Item[] {
  const destination = options.destination?.trim().toLowerCase() ?? null
  const take = options.take === undefined
    ? Number.POSITIVE_INFINITY
    : Math.max(0, Math.floor(options.take))

  return loadAiReadyProductCatalogue()
    .filter((product) => !destination || product.destination.city.toLowerCase() === destination)
    .slice(0, take)
    .map(fromAiReadyProduct)
}
