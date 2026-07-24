import type { TravelerType } from '@/lib/ai-trip/intent-schema'

export type AffiliateTripContext = {
  startDate: string | null
  endDate: string | null
  groupSize: number | null
  adultCount: number | null
  childCount: number | null
  travelerType: TravelerType
}

export type SafeAffiliateAnalyticsContext = {
  hasDates: boolean
  hasGroupSize: boolean
  hasOccupancy: boolean
  travelerType: TravelerType
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
  return {
    hasDates: Boolean(context.startDate && context.endDate),
    hasGroupSize: context.groupSize !== null,
    hasOccupancy: context.adultCount !== null && context.childCount !== null,
    travelerType: context.travelerType,
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
