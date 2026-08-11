import type { TripBudget, TravelerType } from '@/lib/ai-trip/intent-schema'

export type AffiliateTripContext = {
  startDate: string | null
  endDate: string | null
  groupSize: number | null
  adultCount: number | null
  childCount: number | null
  travelerType: TravelerType
  interests?: string[]
  budgetRange?: TripBudget
  travelMonth?: string | null
}

export type SafeAffiliateAnalyticsContext = {
  hasDates: boolean
  hasGroupSize: boolean
  hasOccupancy: boolean
  travelerType: TravelerType
  interests?: string[]
  budgetRange?: TripBudget
  companionType?: TravelerType
  groupSizeBand?: '1' | '2' | '3-4' | '5+'
  travelMonth?: string
}

const EMPTY_AFFILIATE_TRIP_CONTEXT: AffiliateTripContext = {
  startDate: null,
  endDate: null,
  groupSize: null,
  adultCount: null,
  childCount: null,
  travelerType: 'unspecified',
}

const SAFE_TRAVELER_TYPES = new Set<TravelerType>([
  'solo',
  'couple',
  'family',
  'friends',
  'business',
  'unspecified',
])

export function buildSafeAffiliateAnalyticsContext(
  context: AffiliateTripContext = EMPTY_AFFILIATE_TRIP_CONTEXT,
): SafeAffiliateAnalyticsContext {
  const groupSizeBand = context.groupSize === null
    ? undefined
    : context.groupSize <= 1
      ? '1'
      : context.groupSize === 2
        ? '2'
        : context.groupSize <= 4
          ? '3-4'
          : '5+'
  const interests = Array.isArray(context.interests)
    ? context.interests.filter(value => typeof value === 'string').slice(0, 5)
    : undefined
  const travelMonth = typeof context.travelMonth === 'string' && /^20\d{2}-(0[1-9]|1[0-2])$/.test(context.travelMonth)
    ? context.travelMonth
    : undefined

  return {
    hasDates: Boolean(context.startDate && context.endDate),
    hasGroupSize: context.groupSize !== null,
    hasOccupancy: context.adultCount !== null && context.childCount !== null,
    travelerType: context.travelerType,
    ...(interests && interests.length > 0 ? { interests } : {}),
    ...(context.budgetRange ? { budgetRange: context.budgetRange } : {}),
    ...(context.travelerType !== 'unspecified' ? { companionType: context.travelerType } : {}),
    ...(groupSizeBand ? { groupSizeBand } : {}),
    ...(travelMonth ? { travelMonth } : {}),
  }
}

export function parseSafeAffiliateAnalyticsContext(
  input: {
    hasDates?: string
    hasGroupSize?: string
    hasOccupancy?: string
    travelerType?: string
  } = {},
  trustedInternalSource = false,
): SafeAffiliateAnalyticsContext {
  if (!trustedInternalSource) {
    return buildSafeAffiliateAnalyticsContext()
  }

  const travelerType = input.travelerType
  const safeTravelerType = typeof travelerType === 'string'
    && SAFE_TRAVELER_TYPES.has(travelerType as TravelerType)
    ? travelerType as TravelerType
    : 'unspecified'

  return {
    hasDates: input.hasDates === '1',
    hasGroupSize: input.hasGroupSize === '1',
    hasOccupancy: input.hasOccupancy === '1',
    travelerType: safeTravelerType,
  }
}
