import type { AffiliatePlacement, AffiliateProvider } from './affiliatePartners'
import {
  buildSafeAffiliateAnalyticsContext,
  type AffiliateTripContext,
  type SafeAffiliateAnalyticsContext,
} from './affiliateTripContext'
import type { RecommendationReasonCode } from '../ai-trip/recommendation-signals'
import type { TripPace } from '../ai-trip/intent-schema'

export type PartnerHandoffProvider = AffiliateProvider
  | 'viator'
  | 'bokun'
  | 'direct_partner'

export type PartnerHandoffPlacement = AffiliatePlacement
  | 'planner_day_workspace'
  | 'planner_filtered_matches'
  | 'tour_detail_primary'
  | 'tour_detail_sticky'

export type PartnerAttributionSource =
  | `${AffiliateProvider | 'viator'}_affiliate`
  | 'bokun_public_widget'
  | 'direct_partner'

export type PartnerHandoffInput = {
  href: string
  provider: PartnerHandoffProvider
  placement: PartnerHandoffPlacement
  destination: string
  productId?: string
  recommendationId?: string
  campaign?: string
  recommendationSource?: 'ai-trip-planner' | 'planner' | 'tour-detail'
  reasonCode?: RecommendationReasonCode
  durationDays?: number
  pace?: TripPace
  tripContext?: AffiliateTripContext
  safeIntent?: SafeAffiliateAnalyticsContext
  trustedPublicHandoff?: boolean
}

export type PartnerHandoffRecord = {
  href: string
  provider: PartnerHandoffProvider
  placement: PartnerHandoffPlacement
  destination: string
  productId?: string
  recommendationId?: string
  campaign?: string
  recommendationSource?: PartnerHandoffInput['recommendationSource']
  reasonCode?: RecommendationReasonCode
  durationDays?: number
  pace?: TripPace
  attributionSource: PartnerAttributionSource
  targetHost: string
  intent: SafeAffiliateAnalyticsContext
}

const PROVIDER_HOSTS: Record<PartnerHandoffProvider, ReadonlySet<string>> = {
  '12go': new Set(['12go.asia']),
  agoda: new Set(['www.agoda.com']),
  airalo: new Set(['www.airalo.com']),
  bokun: new Set(['widgets.bokun.io']),
  direct_partner: new Set(),
  expedia: new Set(['www.expedia.com']),
  getyourguide: new Set(['www.getyourguide.com']),
  klook: new Set(['www.klook.com']),
  trip_com: new Set(['www.trip.com']),
  viator: new Set(['www.viator.com']),
  yesim: new Set(['yesim.app']),
}

const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,79}$/

const ATTRIBUTION_SOURCES: Record<PartnerHandoffProvider, PartnerAttributionSource> = {
  '12go': '12go_affiliate',
  agoda: 'agoda_affiliate',
  airalo: 'airalo_affiliate',
  bokun: 'bokun_public_widget',
  direct_partner: 'direct_partner',
  expedia: 'expedia_affiliate',
  getyourguide: 'getyourguide_affiliate',
  klook: 'klook_affiliate',
  trip_com: 'trip_com_affiliate',
  viator: 'viator_affiliate',
  yesim: 'yesim_affiliate',
}

export function resolveReviewedBookingHandoffProvider(
  href: string,
): 'viator' | 'bokun' | 'direct_partner' | null {
  try {
    const url = new URL(href)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    if (url.hostname === 'www.viator.com') return 'viator'
    if (url.hostname === 'widgets.bokun.io') return 'bokun'
    return 'direct_partner'
  } catch {
    return null
  }
}

function parseApprovedTarget(
  provider: PartnerHandoffProvider,
  href: string,
  trustedPublicHandoff = false,
): URL | null {
  try {
    const url = new URL(href)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    if (trustedPublicHandoff) return url
    return PROVIDER_HOSTS[provider].has(url.hostname) ? url : null
  } catch {
    return null
  }
}

export function createPartnerHandoffRecord(
  input: PartnerHandoffInput,
): PartnerHandoffRecord | null {
  const target = parseApprovedTarget(
    input.provider,
    input.href,
    input.trustedPublicHandoff,
  )
  if (!target) return null
  if (input.productId && !SAFE_IDENTIFIER.test(input.productId)) return null
  if (input.recommendationId && !SAFE_IDENTIFIER.test(input.recommendationId)) return null

  return {
    href: target.toString(),
    provider: input.provider,
    placement: input.placement,
    destination: input.destination,
    ...(input.productId ? { productId: input.productId } : {}),
    ...(input.recommendationId ? { recommendationId: input.recommendationId } : {}),
    ...(input.campaign ? { campaign: input.campaign } : {}),
    ...(input.recommendationSource
      ? { recommendationSource: input.recommendationSource }
      : {}),
    ...(input.reasonCode ? { reasonCode: input.reasonCode } : {}),
    ...(Number.isInteger(input.durationDays) && input.durationDays! >= 1 && input.durationDays! <= 14
      ? { durationDays: input.durationDays }
      : {}),
    ...(input.pace ? { pace: input.pace } : {}),
    attributionSource: ATTRIBUTION_SOURCES[input.provider],
    targetHost: target.hostname,
    intent: input.safeIntent ?? buildSafeAffiliateAnalyticsContext(input.tripContext),
  }
}

export function buildPartnerHandoffAnalyticsProps(record: PartnerHandoffRecord) {
  return {
    provider: record.provider,
    placement: record.placement,
    city: record.destination,
    ...(record.productId ? { productId: record.productId } : {}),
    ...(record.recommendationId ? { recommendationId: record.recommendationId } : {}),
    ...(record.recommendationSource
      ? { recommendationSource: record.recommendationSource }
      : {}),
    ...(record.reasonCode ? { reasonCode: record.reasonCode } : {}),
    ...(record.durationDays ? { durationDays: record.durationDays } : {}),
    ...(record.pace ? { pace: record.pace } : {}),
    attributionSource: record.attributionSource,
    targetHost: record.targetHost,
    ...record.intent,
  }
}
