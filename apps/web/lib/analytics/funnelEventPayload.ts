export const FUNNEL_EVENTS = [
  'homepage_finder_entry_clicked',
  'finder_planner_choice_selected',
  'finder_planner_reset_clicked',
  'finder_matching_experiences_clicked',
  'finder_recommendations_rendered',
  'booking_partner_handoff_clicked',
  'affiliate_partner_handoff_clicked',
  'finder_planner_viewed',
] as const

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number]
export type FunnelEventProps = Record<string, string | number | boolean | string[]>

export type SafeFunnelEventPayload = {
  event: FunnelEvent
  sessionId?: string
  provider?: string
  placement?: string
  city?: string
  productId?: string
  attributionSource?: string
  targetHost?: string
  hasDates?: boolean
  hasGroupSize?: boolean
  hasOccupancy?: boolean
  travelerType?: string
  recommendationSource?: string
  reasonCode?: string
  durationDays?: number
  pace?: string
  travelMonth?: string
  budgetRange?: string
  companionType?: string
  groupSizeBand?: string
  interests?: string[]
}

const APPROVED_PROVIDERS = new Set([
  '12go',
  'agoda',
  'airalo',
  'bokun',
  'direct_partner',
  'expedia',
  'getyourguide',
  'klook',
  'trip_com',
  'viator',
  'yesim',
])

const APPROVED_PLACEMENTS = new Set([
  'ai_trip_planner_card',
  'ai_trip_planner_top_match',
  'city_guide',
  'hotel_results',
  'itinerary_template',
  'multi_city_transport',
  'planner_day_workspace',
  'planner_filtered_matches',
  'pre_departure',
  'tour_detail_primary',
  'tour_detail_sticky',
])

const APPROVED_CITIES = new Set([
  'Bangkok',
  'Bophut',
  'Chiang Mai',
  'Chiang Rai',
  'Hua Hin',
  'Kanchanaburi',
  'Khao Lak',
  'Ko Chang',
  'Ko Lanta',
  'Ko Lipe',
  'Ko Pha Ngan',
  'Ko Phi Phi Don',
  'Ko Yao Yai',
  'Koh Samui',
  'Koh Tao',
  'Krabi',
  'Mae Hong Son',
  'Pattaya',
  'Phuket',
  'Thailand',
])

const APPROVED_ATTRIBUTION_SOURCES = new Set([
  '12go_affiliate',
  'agoda_affiliate',
  'airalo_affiliate',
  'bokun_public_widget',
  'direct_partner',
  'expedia_affiliate',
  'getyourguide_affiliate',
  'klook_affiliate',
  'trip_com_affiliate',
  'viator_affiliate',
  'yesim_affiliate',
])

const APPROVED_TARGET_HOSTS = new Set([
  '12go.asia',
  'yesim.app',
  'www.agoda.com',
  'www.airalo.com',
  'www.expedia.com',
  'www.getyourguide.com',
  'www.klook.com',
  'www.trip.com',
  'www.viator.com',
  'widgets.bokun.io',
])

const APPROVED_TRAVELER_TYPES = new Set([
  'business',
  'couple',
  'family',
  'friends',
  'solo',
  'unspecified',
])

const APPROVED_RECOMMENDATION_SOURCES = new Set([
  'ai-trip-planner',
  'planner',
  'tour-detail',
])

const APPROVED_REASON_CODES = new Set([
  'interest_match',
  'destination_match',
  'theme_match',
  'reviewed_fallback',
])

const APPROVED_PACES = new Set(['relaxed', 'moderate', 'packed', 'unspecified'])
const APPROVED_BUDGET_RANGES = new Set(['budget', 'mid-range', 'premium', 'luxury', 'unspecified'])
const APPROVED_COMPANION_TYPES = new Set(['solo', 'couple', 'family', 'friends', 'business', 'unspecified'])
const APPROVED_GROUP_SIZE_BANDS = new Set(['1', '2', '3-4', '5+'])
const SAFE_SESSION_ID = /^[a-z0-9-]{16,80}$/i
const SAFE_TRAVEL_MONTH = /^20\d{2}-(0[1-9]|1[0-2])$/
const APPROVED_INTERESTS = new Set([
  'animals', 'beaches', 'culture', 'elephants', 'family', 'food', 'islands',
  'nature', 'nightlife', 'snorkeling', 'temples', 'wellness',
])

const SAFE_PRODUCT_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/

function isFunnelEvent(value: unknown): value is FunnelEvent {
  return typeof value === 'string' && FUNNEL_EVENTS.some(event => event === value)
}

function approvedValue(value: unknown, approved: Set<string>): string | undefined {
  return typeof value === 'string' && approved.has(value) ? value : undefined
}

function safeProductId(value: unknown): string | undefined {
  return typeof value === 'string' && SAFE_PRODUCT_ID.test(value) ? value : undefined
}

export function buildSafeFunnelEventPayload(
  event: FunnelEvent,
  props: FunnelEventProps = {},
): SafeFunnelEventPayload {
  const payload: SafeFunnelEventPayload = { event }
  const sessionId = typeof props.sessionId === 'string' && SAFE_SESSION_ID.test(props.sessionId)
    ? props.sessionId
    : undefined
  const provider = approvedValue(props.provider, APPROVED_PROVIDERS)
  const placement = approvedValue(props.placement, APPROVED_PLACEMENTS)
  const city = approvedValue(props.city, APPROVED_CITIES)
  const productId = safeProductId(props.productId)
  const attributionSource = approvedValue(
    props.attributionSource,
    APPROVED_ATTRIBUTION_SOURCES,
  )
  const targetHost = approvedValue(props.targetHost, APPROVED_TARGET_HOSTS)
  const travelerType = approvedValue(props.travelerType, APPROVED_TRAVELER_TYPES)
  const recommendationSource = approvedValue(
    props.recommendationSource,
    APPROVED_RECOMMENDATION_SOURCES,
  )
  const reasonCode = approvedValue(props.reasonCode, APPROVED_REASON_CODES)
  const pace = approvedValue(props.pace, APPROVED_PACES)
  const budgetRange = approvedValue(props.budgetRange, APPROVED_BUDGET_RANGES)
  const companionType = approvedValue(props.companionType, APPROVED_COMPANION_TYPES)
  const groupSizeBand = approvedValue(props.groupSizeBand, APPROVED_GROUP_SIZE_BANDS)
  const travelMonth = typeof props.travelMonth === 'string' && SAFE_TRAVEL_MONTH.test(props.travelMonth)
    ? props.travelMonth
    : undefined
  const interests = Array.isArray(props.interests)
    ? props.interests.filter((value): value is string => typeof value === 'string' && APPROVED_INTERESTS.has(value)).slice(0, 5)
    : undefined

  if (sessionId) payload.sessionId = sessionId
  if (provider) payload.provider = provider
  if (placement) payload.placement = placement
  if (city) payload.city = city
  if (productId) payload.productId = productId
  if (attributionSource) payload.attributionSource = attributionSource
  if (targetHost) payload.targetHost = targetHost
  if (typeof props.hasDates === 'boolean') payload.hasDates = props.hasDates
  if (typeof props.hasGroupSize === 'boolean') payload.hasGroupSize = props.hasGroupSize
  if (typeof props.hasOccupancy === 'boolean') payload.hasOccupancy = props.hasOccupancy
  if (travelerType) payload.travelerType = travelerType
  if (recommendationSource) payload.recommendationSource = recommendationSource
  if (reasonCode) payload.reasonCode = reasonCode
  if (
    typeof props.durationDays === 'number'
    && Number.isInteger(props.durationDays)
    && props.durationDays >= 1
    && props.durationDays <= 14
  ) payload.durationDays = props.durationDays
  if (pace) payload.pace = pace
  if (travelMonth) payload.travelMonth = travelMonth
  if (budgetRange) payload.budgetRange = budgetRange
  if (companionType) payload.companionType = companionType
  if (groupSizeBand) payload.groupSizeBand = groupSizeBand
  if (interests && interests.length > 0) payload.interests = interests

  return payload
}

export function parseSafeFunnelEventPayload(input: unknown): SafeFunnelEventPayload | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as Record<string, unknown>
  if (!isFunnelEvent(candidate.event)) return null

  return buildSafeFunnelEventPayload(candidate.event, candidate as FunnelEventProps)
}
