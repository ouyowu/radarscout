import {
  buildProductRecommendationSignals,
} from '../ai-trip/recommendation-signals'
import {
  loadReviewedViatorPublicCatalogue,
  type ReviewedViatorPublicProduct,
} from '../viator/reviewedViatorPublicCatalogue'
import { isReviewedViatorAffiliateUrl } from '../viator/reviewedViatorMatching'

export const AI_READY_PRODUCT_SCHEMA_VERSION =
  'radarscout.ai-ready-product.v2' as const

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
  fit: {
    suitableFor: {
      status: 'derived_from_reviewed_fields'
      values: string[]
    }
    notSuitableFor: {
      status: 'not_reviewed'
      values: []
    }
  }
  logistics: {
    pickupAreas: {
      status: 'not_reviewed'
      values: []
    }
    duration: {
      status: 'not_reviewed'
      value: null
    }
    childRules: {
      status: 'not_reviewed'
      value: null
    }
  }
  experience: {
    features: {
      status: 'human_reviewed'
      values: string[]
    }
    ethicalFeatures: {
      status: 'not_reviewed'
      values: []
    }
  }
  partnerLink: `https://www.radarscout.io/tours/${string}`
  handoff: {
    mode: 'affiliate_partner'
    label: 'Check availability'
    availabilityClaimed: false
  }
  partnerHandoff: {
    platform: 'Viator'
    role: 'booking_partner'
    url: string
    label: 'Check availability'
    currentDetailsOwner: 'Viator'
    availabilityClaimed: false
  }
  provenance: {
    source: 'reviewed_viator_catalog'
    reviewStatus: 'human_reviewed'
    lastVerifiedAt: string
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

function isExactEmptyArray(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0
}

function isNotReviewedList(value: unknown): boolean {
  return isRecord(value)
    && hasExactKeys(value, ['status', 'values'])
    && value.status === 'not_reviewed'
    && isExactEmptyArray(value.values)
}

function isNotReviewedValue(value: unknown): boolean {
  return isRecord(value)
    && hasExactKeys(value, ['status', 'value'])
    && value.status === 'not_reviewed'
    && value.value === null
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
    fit: {
      suitableFor: {
        status: 'derived_from_reviewed_fields',
        values: [...signals.bestFor],
      },
      notSuitableFor: {
        status: 'not_reviewed',
        values: [],
      },
    },
    logistics: {
      pickupAreas: { status: 'not_reviewed', values: [] },
      duration: { status: 'not_reviewed', value: null },
      childRules: { status: 'not_reviewed', value: null },
    },
    experience: {
      features: {
        status: 'human_reviewed',
        values: [...product.tags],
      },
      ethicalFeatures: {
        status: 'not_reviewed',
        values: [],
      },
    },
    partnerLink: `${RADARSCOUT_ORIGIN}${product.detailHref}`,
    handoff: {
      mode: 'affiliate_partner',
      label: 'Check availability',
      availabilityClaimed: false,
    },
    partnerHandoff: {
      platform: 'Viator',
      role: 'booking_partner',
      url: product.bookingPartnerHandoff.href,
      label: 'Check availability',
      currentDetailsOwner: 'Viator',
      availabilityClaimed: false,
    },
    provenance: {
      source: 'reviewed_viator_catalog',
      reviewStatus: 'human_reviewed',
      lastVerifiedAt: product.reviewedAt,
    },
  }
}

export function loadAiReadyProductCatalogue(): AiReadyProduct[] {
  return loadReviewedViatorPublicCatalogue().map(buildAiReadyProduct)
}

export function getAiReadyProductById(id: string): AiReadyProduct | null {
  const normalizedId = id.trim()
  if (!normalizedId) return null
  return loadAiReadyProductCatalogue().find((product) => product.id === normalizedId) ?? null
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
    'fit',
    'logistics',
    'experience',
    'partnerLink',
    'handoff',
    'partnerHandoff',
    'provenance',
  ])) return { ok: false, error: 'invalid_shape' }

  const {
    destination,
    recommendation,
    fit,
    logistics,
    experience,
    handoff,
    partnerHandoff,
    provenance,
  } = value
  const reviewedSource = typeof value.id === 'string'
    ? loadReviewedViatorPublicCatalogue().find((product) => product.id === value.id)
    : null
  if (
    value.schemaVersion !== AI_READY_PRODUCT_SCHEMA_VERSION
    || !isNonEmptyString(value.id)
    || !value.id.startsWith('viator_')
    || !reviewedSource
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
    || !isRecord(fit)
    || !hasExactKeys(fit, ['suitableFor', 'notSuitableFor'])
    || !isRecord(fit.suitableFor)
    || !hasExactKeys(fit.suitableFor, ['status', 'values'])
    || fit.suitableFor.status !== 'derived_from_reviewed_fields'
    || !isNonEmptyStringArray(fit.suitableFor.values)
    || !isNotReviewedList(fit.notSuitableFor)
    || !isRecord(logistics)
    || !hasExactKeys(logistics, ['pickupAreas', 'duration', 'childRules'])
    || !isNotReviewedList(logistics.pickupAreas)
    || !isNotReviewedValue(logistics.duration)
    || !isNotReviewedValue(logistics.childRules)
    || !isRecord(experience)
    || !hasExactKeys(experience, ['features', 'ethicalFeatures'])
    || !isRecord(experience.features)
    || !hasExactKeys(experience.features, ['status', 'values'])
    || experience.features.status !== 'human_reviewed'
    || !isNonEmptyStringArray(experience.features.values)
    || !isNotReviewedList(experience.ethicalFeatures)
    || !isRecord(handoff)
    || !hasExactKeys(handoff, ['mode', 'label', 'availabilityClaimed'])
    || handoff.mode !== 'affiliate_partner'
    || handoff.label !== 'Check availability'
    || handoff.availabilityClaimed !== false
    || !isRecord(partnerHandoff)
    || !hasExactKeys(partnerHandoff, [
      'platform',
      'role',
      'url',
      'label',
      'currentDetailsOwner',
      'availabilityClaimed',
    ])
    || partnerHandoff.platform !== 'Viator'
    || partnerHandoff.role !== 'booking_partner'
    || !isNonEmptyString(partnerHandoff.url)
    || !isReviewedViatorAffiliateUrl(partnerHandoff.url)
    || partnerHandoff.url !== reviewedSource.bookingPartnerHandoff.href
    || partnerHandoff.label !== 'Check availability'
    || partnerHandoff.currentDetailsOwner !== 'Viator'
    || partnerHandoff.availabilityClaimed !== false
    || !isRecord(provenance)
    || !hasExactKeys(provenance, ['source', 'reviewStatus', 'lastVerifiedAt'])
    || provenance.source !== 'reviewed_viator_catalog'
    || provenance.reviewStatus !== 'human_reviewed'
    || !isNonEmptyString(provenance.lastVerifiedAt)
    || Number.isNaN(Date.parse(provenance.lastVerifiedAt))
    || provenance.lastVerifiedAt !== reviewedSource.reviewedAt
  ) {
    return { ok: false, error: 'invalid_shape' }
  }

  return { ok: true, value: value as AiReadyProduct }
}
