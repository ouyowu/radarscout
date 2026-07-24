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
