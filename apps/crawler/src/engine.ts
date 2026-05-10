import type { Redis } from 'ioredis'
import { fetchRedditRSS } from './rss.js'
import { searchRedditViaGoogle } from './google.js'
import { submitMatch } from './submitter.js'

const POLL_WINDOW_MS = 90_000
const RELOAD_INTERVAL_MS = 5 * 60_000
const LAST_POLL_KEY = 'lp:crawler:lastpoll'

export interface Keyword {
  id: string
  text: string
  userPlan: string
  subreddit?: string
}

async function loadKeywords(apiUrl: string, apiSecret: string): Promise<Keyword[]> {
  const res = await fetch(`${apiUrl}/api/internal/monitors`, {
    headers: { 'x-internal-secret': apiSecret },
  })
  if (!res.ok) throw new Error(`Failed to load monitors: HTTP ${res.status}`)

  const monitors = (await res.json()) as Array<{
    subreddit?: string
    keywords: Array<{ id: string; text: string; userPlan: string }>
  }>

  const seen = new Set<string>()
  const keywords: Keyword[] = []
  for (const m of monitors) {
    for (const kw of m.keywords) {
      if (!seen.has(kw.id)) {
        seen.add(kw.id)
        keywords.push({ ...kw, subreddit: m.subreddit })
      }
    }
  }
  console.log(`[engine] loaded ${keywords.length} keywords`)
  return keywords
}

async function triggerScore(
  matchId: string,
  opts: { apiUrl: string; apiSecret: string },
): Promise<void> {
  await fetch(`${opts.apiUrl}/api/internal/matches/${matchId}/score`, {
    method: 'POST',
    headers: { 'x-internal-secret': opts.apiSecret },
  })
}

export async function processKeyword(
  kw: Keyword,
  redis: Redis,
  seenIds: Set<string>,
  opts: { apiUrl: string; apiSecret: string },
): Promise<void> {
  const [rssResult, googleResult] = await Promise.allSettled([
    fetchRedditRSS(kw.text, redis, kw.subreddit),
    searchRedditViaGoogle(kw.text),
  ])

  if (rssResult.status === 'rejected') {
    console.warn('[engine] RSS failed:', (rssResult.reason as Error).message)
  }

  const rssItems = rssResult.status === 'fulfilled' ? rssResult.value : []
  const googleItems = googleResult.status === 'fulfilled' ? googleResult.value : []

  // Merge RSS + Google, deduplicate by postId (RSS takes priority)
  const seenPostIds = new Set<string>()
  const items = [...rssItems, ...googleItems].filter(item => {
    if (seenPostIds.has(item.postId)) return false
    seenPostIds.add(item.postId)
    return true
  })

  for (const item of items) {
    const seenKey = `${item.postId}:${kw.id}`
    if (seenIds.has(seenKey)) continue
    seenIds.add(seenKey)

    const matchId = await submitMatch({
      keywordId: kw.id,
      platform: item.platform,
      postId: item.postId,
      title: item.title,
      url: item.url,
      snippet: item.snippet,
    })

    if (matchId && (kw.userPlan === 'PRO' || kw.userPlan === 'TEAM')) {
      triggerScore(matchId, opts).catch(err =>
        console.warn('[engine] score trigger failed:', (err as Error).message),
      )
    }
  }

  // Keep seen set bounded to avoid unbounded memory growth
  if (seenIds.size > 10_000) {
    const arr = [...seenIds]
    seenIds.clear()
    arr.slice(-5_000).forEach(id => seenIds.add(id))
  }
}

export async function startEngine(
  redis: Redis,
  opts: { apiUrl: string; apiSecret: string },
): Promise<() => void> {
  let keywords = await loadKeywords(opts.apiUrl, opts.apiSecret)
  await redis.set(LAST_POLL_KEY, new Date().toISOString())
  let lastReload = Date.now()
  const seenIds = new Set<string>()
  const timers: ReturnType<typeof setTimeout>[] = []

  function scheduleRound(kws: Keyword[]): void {
    for (const t of timers.splice(0)) clearTimeout(t)
    const n = kws.length
    if (n === 0) return
    kws.forEach((kw, i) => {
      const offset = Math.floor((POLL_WINDOW_MS / n) * i)
      timers.push(
        setTimeout(() => {
          processKeyword(kw, redis, seenIds, opts).catch(err =>
            console.error(`[engine] keyword ${kw.id} error:`, (err as Error).message),
          )
        }, offset),
      )
    })
  }

  scheduleRound(keywords)

  const interval = setInterval(async () => {
    try {
      if (Date.now() - lastReload > RELOAD_INTERVAL_MS) {
        keywords = await loadKeywords(opts.apiUrl, opts.apiSecret)
        lastReload = Date.now()
      }
      await redis.set(LAST_POLL_KEY, new Date().toISOString())
      scheduleRound(keywords)
    } catch (err) {
      console.error('[engine] cycle error:', (err as Error).message)
    }
  }, POLL_WINDOW_MS)

  return () => {
    clearInterval(interval)
    for (const t of timers.splice(0)) clearTimeout(t)
  }
}
