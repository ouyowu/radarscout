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
export type FunnelEventProps = Record<string, string | number | boolean>

export type SafeFunnelEventPayload = {
  event: FunnelEvent
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
  source?: string
  stepId?: string
  choiceId?: string
  resultPosition?: number
  resultCount?: number
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

const APPROVED_FINDER_SOURCES = new Set(['form', 'planner'])
const APPROVED_FINDER_STEP_IDS = new Set(['style', 'group', 'time', 'preferences'])
const APPROVED_FINDER_CHOICE_IDS = new Set([
  'gentle-elephant',
  'family-half-day',
  'cooking-food',
  'nature-day',
  'low-intensity',
  'photo-friendly',
  'solo',
  'couple',
  'family',
  'friends',
  'group',
  'half-day',
  'full-day',
  'flexible-time',
  'feeding',
  'bathing-listed',
  'ethical-priority',
  'easy-pace',
  'hotel-area-friendly',
])

const SAFE_PRODUCT_ID = /^[A-Za-z0-9][A-Za-z0-9_:-]{0,79}$/

function isFunnelEvent(value: unknown): value is FunnelEvent {
  return typeof value === 'string' && FUNNEL_EVENTS.some(event => event === value)
}

function approvedValue(value: unknown, approved: Set<string>): string | undefined {
  return typeof value === 'string' && approved.has(value) ? value : undefined
}

function safeProductId(value: unknown): string | undefined {
  return typeof value === 'string' && SAFE_PRODUCT_ID.test(value) ? value : undefined
}

function safeResultMetric(value: unknown, minimum: number): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= 20
    ? value
    : undefined
}

export function buildSafeFunnelEventPayload(
  event: FunnelEvent,
  props: FunnelEventProps = {},
): SafeFunnelEventPayload {
  const payload: SafeFunnelEventPayload = { event }
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
  const source = approvedValue(props.source, APPROVED_FINDER_SOURCES)
  const stepId = approvedValue(props.stepId, APPROVED_FINDER_STEP_IDS)
  const choiceId = approvedValue(props.choiceId, APPROVED_FINDER_CHOICE_IDS)
  const resultPosition = safeResultMetric(props.resultPosition, 1)
  const resultCount = safeResultMetric(props.resultCount, 0)

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
  if (source) payload.source = source
  if (stepId) payload.stepId = stepId
  if (choiceId) payload.choiceId = choiceId
  if (resultPosition) payload.resultPosition = resultPosition
  if (resultCount !== undefined) payload.resultCount = resultCount

  return payload
}

export function parseSafeFunnelEventPayload(input: unknown): SafeFunnelEventPayload | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as Record<string, unknown>
  if (!isFunnelEvent(candidate.event)) return null

  return buildSafeFunnelEventPayload(candidate.event, candidate as FunnelEventProps)
}
