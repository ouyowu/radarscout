import type { AffiliatePlacement, AffiliateProvider } from './affiliatePartners'
import {
  buildSafeAffiliateAnalyticsContext,
  type AffiliateTripContext,
  type SafeAffiliateAnalyticsContext,
} from './affiliateTripContext'

export type PartnerHandoffProvider = AffiliateProvider
  | 'viator'
  | 'bokun'
  | 'direct_partner'

export type PartnerHandoffPlacement = AffiliatePlacement
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
  campaign?: string
  recommendationSource?: 'ai-trip-planner' | 'tour-detail'
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
  campaign?: string
  recommendationSource?: PartnerHandoffInput['recommendationSource']
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

const SAFE_PRODUCT_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/

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
  if (input.productId && !SAFE_PRODUCT_ID.test(input.productId)) return null

  return {
    href: target.toString(),
    provider: input.provider,
    placement: input.placement,
    destination: input.destination,
    ...(input.productId ? { productId: input.productId } : {}),
    ...(input.campaign ? { campaign: input.campaign } : {}),
    ...(input.recommendationSource
      ? { recommendationSource: input.recommendationSource }
      : {}),
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
    attributionSource: record.attributionSource,
    targetHost: record.targetHost,
    ...record.intent,
  }
}
