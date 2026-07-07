import { track as trackVercelEvent } from '@vercel/analytics'

export type FunnelEvent =
  | 'homepage_finder_entry_clicked'
  | 'finder_planner_choice_selected'
  | 'finder_planner_reset_clicked'
  | 'finder_matching_experiences_clicked'
  | 'finder_recommendations_rendered'
  | 'booking_partner_handoff_clicked'
  | 'finder_planner_viewed'

export type FunnelEventProps = Record<string, string | number | boolean>

type AnalyticsPayload = FunnelEventProps & {
  event: FunnelEvent
}

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[]
    __radarscoutAnalyticsQueue?: AnalyticsPayload[]
  }
}

const QUEUE_LIMIT = 50

export function track(event: FunnelEvent, props: FunnelEventProps = {}): void {
  if (typeof window === 'undefined') return

  try {
    const payload: AnalyticsPayload = { event, ...props }

    window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : []
    window.__radarscoutAnalyticsQueue = Array.isArray(window.__radarscoutAnalyticsQueue)
      ? window.__radarscoutAnalyticsQueue
      : []

    window.dataLayer.push(payload)
    window.__radarscoutAnalyticsQueue.push(payload)
    trackVercelEvent(event, props)

    if (window.__radarscoutAnalyticsQueue.length > QUEUE_LIMIT) {
      window.__radarscoutAnalyticsQueue.splice(0, window.__radarscoutAnalyticsQueue.length - QUEUE_LIMIT)
    }
  } catch {
    // Analytics must never break planning or handoff interactions.
  }
}
