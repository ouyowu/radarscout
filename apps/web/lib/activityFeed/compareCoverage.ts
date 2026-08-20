import {
  loadActivityFeedV1,
  type ActivityFeedField,
  type ActivityFeedV1Item,
} from './activityFeedV1'

export const ACTIVITY_COMPARE_COVERAGE_FIELDS = [
  'startingPrice',
  'duration',
  'pickupArea',
  'childPolicy',
  'fitnessLevel',
  'cancellationPolicy',
  'ethicalAttributes',
  'suitableFor',
  'notSuitableFor',
  'whyRecommended',
  'bestFor',
  'strengths',
  'tradeoffs',
] as const

export type ActivityCompareCoverageField =
  typeof ACTIVITY_COMPARE_COVERAGE_FIELDS[number]

export const ACTIVITY_COMPARE_COVERAGE_SCOPES = [
  'core',
  'family',
  'ethics',
  'price',
  'full',
] as const

export type ActivityCompareCoverageScope =
  typeof ACTIVITY_COMPARE_COVERAGE_SCOPES[number]

export type ActivityCompareCoverage = {
  productId: string
  city: string
  coveredFields: ActivityCompareCoverageField[]
  missingFields: ActivityCompareCoverageField[]
  readyFor: Record<ActivityCompareCoverageScope, boolean>
}

export type ActivityCompareCoverageSummary = {
  scanned: number
  coveredProductCountByField: Record<ActivityCompareCoverageField, number>
  readyProductCountByScope: Record<ActivityCompareCoverageScope, number>
  products: ActivityCompareCoverage[]
}

const REQUIRED_FIELDS: Record<
  ActivityCompareCoverageScope,
  readonly ActivityCompareCoverageField[]
> = {
  core: ['duration', 'pickupArea', 'suitableFor', 'notSuitableFor', 'whyRecommended'],
  family: ['duration', 'pickupArea', 'childPolicy', 'suitableFor', 'notSuitableFor', 'whyRecommended'],
  ethics: ['duration', 'pickupArea', 'ethicalAttributes', 'suitableFor', 'notSuitableFor', 'whyRecommended'],
  price: ['startingPrice', 'duration', 'pickupArea', 'suitableFor', 'notSuitableFor', 'whyRecommended'],
  full: ACTIVITY_COMPARE_COVERAGE_FIELDS,
}

function hasReviewedValue(field: ActivityFeedField<string | string[] | null>): boolean {
  if (field.status === 'not_reviewed') return false
  if (Array.isArray(field.value)) return field.value.some(Boolean)
  return Boolean(field.value?.trim())
}

function comparisonFields(
  item: ActivityFeedV1Item,
): Record<ActivityCompareCoverageField, ActivityFeedField<string | string[] | null>> {
  return {
    startingPrice: item.startingPrice,
    duration: item.duration,
    pickupArea: item.pickupArea,
    childPolicy: item.childPolicy,
    fitnessLevel: item.fitnessLevel,
    cancellationPolicy: item.cancellationPolicy,
    ethicalAttributes: item.ethicalAttributes,
    suitableFor: item.suitableFor,
    notSuitableFor: item.notSuitableFor,
    whyRecommended: item.recommendation.whyRecommended,
    bestFor: item.recommendation.bestFor,
    strengths: item.recommendation.strengths,
    tradeoffs: item.recommendation.tradeoffs,
  }
}

export function getActivityCompareCoverage(item: ActivityFeedV1Item): ActivityCompareCoverage {
  const fields = comparisonFields(item)
  const coveredFields = ACTIVITY_COMPARE_COVERAGE_FIELDS.filter(field => hasReviewedValue(fields[field]))
  const coveredSet = new Set(coveredFields)
  const missingFields = ACTIVITY_COMPARE_COVERAGE_FIELDS.filter(field => !coveredSet.has(field))
  const readyFor = Object.fromEntries(
    ACTIVITY_COMPARE_COVERAGE_SCOPES.map(scope => [
      scope,
      REQUIRED_FIELDS[scope].every(field => coveredSet.has(field)),
    ]),
  ) as Record<ActivityCompareCoverageScope, boolean>

  return {
    productId: item.id,
    city: item.destination.city,
    coveredFields,
    missingFields,
    readyFor,
  }
}

/**
 * Read-only coverage audit for the reviewed Activity Feed. The cap keeps an
 * editorial review batch focused; it never fetches, writes, or infers facts.
 */
export function summarizeActivityCompareCoverage(
  items: readonly ActivityFeedV1Item[],
  take = 40,
): ActivityCompareCoverageSummary {
  const limit = Math.max(0, Math.min(40, Math.floor(take)))
  const products = items.slice(0, limit).map(getActivityCompareCoverage)
  const coveredProductCountByField = Object.fromEntries(
    ACTIVITY_COMPARE_COVERAGE_FIELDS.map(field => [
      field,
      products.filter(product => product.coveredFields.includes(field)).length,
    ]),
  ) as Record<ActivityCompareCoverageField, number>
  const readyProductCountByScope = Object.fromEntries(
    ACTIVITY_COMPARE_COVERAGE_SCOPES.map(scope => [
      scope,
      products.filter(product => product.readyFor[scope]).length,
    ]),
  ) as Record<ActivityCompareCoverageScope, number>

  return {
    scanned: products.length,
    coveredProductCountByField,
    readyProductCountByScope,
    products,
  }
}

export function loadActivityCompareCoverage(take = 40): ActivityCompareCoverageSummary {
  return summarizeActivityCompareCoverage(loadActivityFeedV1({ take }), take)
}
