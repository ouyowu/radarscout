import {
  validateAgodaAreaRecommendationCatalogue,
  validateAgodaAreaRecommendationRecord,
  type AgodaAreaRecommendation,
} from './agodaAreaRecommendations'

type SeedPreparationResult =
  | { ok: true; data: AgodaAreaRecommendation[] }
  | { ok: false; error: string }

const allowedCandidateKeys = new Set([
  'id',
  'citySlug',
  'city',
  'areaSlug',
  'name',
  'bestFor',
  'summary',
  'tradeoffs',
  'reviewStatus',
  'affiliateHref',
  'reviewedBy',
  'reviewedAt',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function prepareAgodaAreaPublicSeed(value: unknown): SeedPreparationResult {
  if (!isRecord(value) || value.schemaVersion !== 1) {
    return { ok: false, error: 'invalid_review_pool' }
  }
  if (value.status !== 'owner_review_complete') {
    return { ok: false, error: 'review_not_complete' }
  }
  if (!Array.isArray(value.missingCities) || value.missingCities.length > 0) {
    return { ok: false, error: 'missing_city_content' }
  }
  if (!Array.isArray(value.areas)) return { ok: false, error: 'invalid_review_pool' }

  const approvedRecords: AgodaAreaRecommendation[] = []

  for (const candidate of value.areas) {
    if (!isRecord(candidate)) return { ok: false, error: 'invalid_candidate' }
    if (Object.keys(candidate).some(key => !allowedCandidateKeys.has(key))) {
      return { ok: false, error: 'unexpected_candidate_field' }
    }
    if (candidate.affiliateHref !== null && candidate.affiliateHref !== undefined) {
      return { ok: false, error: 'embedded_affiliate_href' }
    }
    if (candidate.reviewStatus === 'rejected') continue
    if (candidate.reviewStatus !== 'approved') {
      return { ok: false, error: 'review_not_complete' }
    }

    const reviewedRecord = {
      id: candidate.id,
      citySlug: candidate.citySlug,
      city: candidate.city,
      areaSlug: candidate.areaSlug,
      name: candidate.name,
      bestFor: candidate.bestFor,
      summary: candidate.summary,
      tradeoffs: candidate.tradeoffs,
      reviewedBy: candidate.reviewedBy,
      reviewedAt: candidate.reviewedAt,
    }
    const validation = validateAgodaAreaRecommendationRecord(reviewedRecord)
    if (!validation.ok) return validation
    approvedRecords.push(validation.data)
  }

  return validateAgodaAreaRecommendationCatalogue(approvedRecords)
}
