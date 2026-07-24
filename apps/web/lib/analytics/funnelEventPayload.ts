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
  hasDates?: boolean
}

const APPROVED_PROVIDERS = new Set([
  '12go',
  'agoda',
  'airalo',
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
  const provider = approvedValue(props.provider, APPROVED_PROVIDERS)
  const placement = approvedValue(props.placement, APPROVED_PLACEMENTS)
  const city = approvedValue(props.city, APPROVED_CITIES)
  const productId = safeProductId(props.productId)

  if (provider) payload.provider = provider
  if (placement) payload.placement = placement
  if (city) payload.city = city
  if (productId) payload.productId = productId
  if (typeof props.hasDates === 'boolean') payload.hasDates = props.hasDates

  return payload
}

export function parseSafeFunnelEventPayload(input: unknown): SafeFunnelEventPayload | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as Record<string, unknown>
  if (!isFunnelEvent(candidate.event)) return null

  return buildSafeFunnelEventPayload(candidate.event, candidate as FunnelEventProps)
}
