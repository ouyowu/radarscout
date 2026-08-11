import { track as trackVercelEvent } from '@vercel/analytics'
import {
  buildSafeFunnelEventPayload,
  type FunnelEvent,
  type FunnelEventProps,
} from './funnelEventPayload'

export type { FunnelEvent, FunnelEventProps } from './funnelEventPayload'

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
const SESSION_STORAGE_KEY = 'radarscout:anonymous-session-id'

function getAnonymousSessionId(): string | undefined {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return undefined
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing
    const generated = typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(SESSION_STORAGE_KEY, generated)
    return generated
  } catch {
    return undefined
  }
}

function sendServerEventBeacon(event: FunnelEvent, props: FunnelEventProps): void {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return

    const sessionId = getAnonymousSessionId()
    const payload = buildSafeFunnelEventPayload(
      event,
      sessionId ? { ...props, sessionId } : props,
    )
    const body = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    navigator.sendBeacon('/api/events', body)
  } catch {
    // Server event visibility must never block planning or handoff interactions.
  }
}

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
    const vercelProps = Object.fromEntries(
      Object.entries(props).filter(([, value]) => !Array.isArray(value)),
    ) as Record<string, string | number | boolean>
    trackVercelEvent(event, vercelProps)

    if (window.__radarscoutAnalyticsQueue.length > QUEUE_LIMIT) {
      window.__radarscoutAnalyticsQueue.splice(0, window.__radarscoutAnalyticsQueue.length - QUEUE_LIMIT)
    }
  } catch {
    // Analytics must never break planning or handoff interactions.
  }

  sendServerEventBeacon(event, props)
}
