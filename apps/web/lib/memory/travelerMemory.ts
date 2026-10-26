import { useEffect, useState } from 'react'

const COOKIE_NAME = 'rsm'
const MAX_AGE = 90 * 24 * 60 * 60 // 90 days

export type TravelerMemory = {
  v: 1
  deviceId: string
  sessions: number
  clickedCategories: string[]
  lastDestination: string | null
}

export type CookieStore = {
  get: () => string
  set: (serialized: string, maxAge: number) => void
}

const APPROVED_CLICKED_CATEGORIES = new Set(['activities', 'accommodation'])

function makeDeviceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

const BROWSER_STORE: CookieStore = {
  get: () => (typeof document !== 'undefined' ? document.cookie : ''),
  set: (serialized, maxAge) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=${serialized}; max-age=${maxAge}; path=/; SameSite=Lax`
    }
  },
}

function parseCookieStore(store: CookieStore): TravelerMemory | null {
  const pair = store.get().split('; ').find(r => r.startsWith(`${COOKIE_NAME}=`))
  if (!pair) return null
  try {
    const raw = decodeURIComponent(pair.slice(COOKIE_NAME.length + 1))
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (parsed.v !== 1 || typeof parsed.deviceId !== 'string' || !parsed.deviceId) return null
    return parsed as TravelerMemory
  } catch {
    return null
  }
}

function flush(memory: TravelerMemory, store: CookieStore): void {
  store.set(encodeURIComponent(JSON.stringify(memory)), MAX_AGE)
}

export function readTravelerMemory(store: CookieStore = BROWSER_STORE): TravelerMemory {
  const existing = parseCookieStore(store)
  if (existing) return existing

  // First visit: persist a stable deviceId immediately so subsequent reads agree.
  const fresh: TravelerMemory = {
    v: 1,
    deviceId: makeDeviceId(),
    sessions: 0,
    clickedCategories: [],
    lastDestination: null,
  }
  flush(fresh, store)
  return fresh
}

export function writeTravelerMemory(
  patch: {
    sessions?: number
    clickedCategories?: string[]
    lastDestination?: string | null
  },
  store: CookieStore = BROWSER_STORE,
): TravelerMemory {
  const current = readTravelerMemory(store)
  const next: TravelerMemory = {
    ...current,
    ...(patch.sessions !== undefined ? { sessions: patch.sessions } : {}),
    ...(patch.lastDestination !== undefined ? { lastDestination: patch.lastDestination } : {}),
    clickedCategories: patch.clickedCategories
      ? [...new Set([
          ...current.clickedCategories,
          ...patch.clickedCategories.filter(c => APPROVED_CLICKED_CATEGORIES.has(c)),
        ])]
      : current.clickedCategories,
  }
  flush(next, store)
  return next
}

export function useTravelerMemory() {
  const [memory, setMemory] = useState<TravelerMemory | null>(null)

  useEffect(() => {
    const current = readTravelerMemory()
    const updated = writeTravelerMemory({ sessions: current.sessions + 1 })
    setMemory(updated)
  }, [])

  function recordClickedCategory(category: string) {
    const updated = writeTravelerMemory({ clickedCategories: [category] })
    setMemory(updated)
  }

  function recordDestination(destination: string) {
    const updated = writeTravelerMemory({ lastDestination: destination })
    setMemory(updated)
  }

  return { memory, recordClickedCategory, recordDestination }
}
