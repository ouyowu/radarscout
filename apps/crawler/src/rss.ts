import { createHash } from 'node:crypto'
import { XMLParser } from 'fast-xml-parser'
import type { Redis } from 'ioredis'

export interface RssItem {
  postId: string
  title: string
  url: string
  snippet: string
  platform: 'REDDIT'
  subreddit: string
}

const CACHE_TTL = 180
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

export const TARGET_SUBREDDITS = [
  'ThailandTourism',
  'Thailand',
  'Bangkok',
  'Pattaya',
  'phuket',
  'chiangmai',
  'solotravel',
  'travel',
]

function cacheKey(keyword: string, subreddit?: string): string {
  const input = subreddit ? `${keyword}:${subreddit}` : keyword
  return `rs:rss:${createHash('sha1').update(input).digest('hex').slice(0, 16)}`
}

function subredditCacheKey(subreddit: string): string {
  return `rs:rss:sub:${subreddit.toLowerCase()}`
}

function parseAtomFeed(xml: string): RssItem[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = parser.parse(xml) as any
  const feed = doc?.feed
  if (!feed) return []

  const raw = feed.entry
  const entries: unknown[] = Array.isArray(raw) ? raw : raw ? [raw] : []

  return entries.flatMap((entry): RssItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = entry as any
    const url: string = e.link?.['@_href'] ?? e.link ?? ''
    if (!url.includes('reddit.com')) return []

    const postMatch = url.match(/\/comments\/([a-z0-9]+)\//i)
    if (!postMatch) return []
    const postId: string = postMatch[1]

    const subMatch = url.match(/\/r\/([^/]+)\//)
    const subreddit: string = subMatch?.[1] ?? 'all'

    const title = String(e.title?.['#text'] ?? e.title ?? '').trim()
    if (!title) return []

    const rawContent: string =
      e.content?.['#text'] ?? e.summary?.['#text'] ?? e.summary ?? ''
    const snippet = rawContent.replace(/<[^>]+>/g, '').trim().slice(0, 300)

    return [{ postId, title, url, snippet, platform: 'REDDIT', subreddit }]
  })
}

async function fetchFeed(feedUrl: string): Promise<RssItem[]> {
  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RadarScout/1.0)' },
    signal: AbortSignal.timeout(8_000),
  })
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}: ${feedUrl}`)
  return parseAtomFeed(await res.text())
}

// Fetches and caches a single subreddit's /new/.rss feed independently of any
// keyword, so N keywords share one fetch per cache window instead of N fetches.
export async function fetchSubredditFeed(subreddit: string, redis: Redis): Promise<RssItem[]> {
  const key = subredditCacheKey(subreddit)
  const cached = await redis.get(key)
  if (cached) {
    try {
      return JSON.parse(cached) as RssItem[]
    } catch {
      // corrupt entry — fall through to fetch
    }
  }

  const items = await fetchFeed(`https://www.reddit.com/r/${subreddit}/new/.rss`)
  if (items.length > 0) {
    await redis.set(key, JSON.stringify(items), 'EX', CACHE_TTL)
  }
  return items
}

export async function fetchRedditRSS(
  keyword: string,
  redis: Redis,
  subreddit?: string,
): Promise<RssItem[]> {
  const key = cacheKey(keyword, subreddit)
  const cached = await redis.get(key)
  if (cached) {
    try {
      return JSON.parse(cached) as RssItem[]
    } catch {
      // corrupt cache entry — fall through to fetch
    }
  }

  const encoded = encodeURIComponent(keyword)
  const keywordFeeds: Array<[label: string, promise: Promise<RssItem[]>]> = [
    ['search', fetchFeed(`https://www.reddit.com/search.rss?q=${encoded}&sort=new&limit=25`)],
    ['all/new', fetchFeed('https://www.reddit.com/r/all/new/.rss')],
  ]
  if (subreddit) {
    keywordFeeds.push([`r/${subreddit}`, fetchFeed(`https://www.reddit.com/r/${subreddit}/new/.rss`)])
  }

  const targetFeeds: Array<[label: string, promise: Promise<RssItem[]>]> = TARGET_SUBREDDITS.map(
    sub => [`r/${sub}`, fetchSubredditFeed(sub, redis)],
  )

  const allFeeds = [...keywordFeeds, ...targetFeeds]
  const results = await Promise.allSettled(allFeeds.map(([, p]) => p))

  const allItems: RssItem[] = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    } else {
      console.warn(`[rss] ${allFeeds[i][0]} feed failed:`, (result.reason as Error).message)
    }
  }

  const seen = new Set<string>()
  const items: RssItem[] = []
  for (const item of allItems) {
    if (!seen.has(item.postId)) {
      seen.add(item.postId)
      items.push(item)
    }
  }

  if (items.length > 0) {
    await redis.set(key, JSON.stringify(items), 'EX', CACHE_TTL)
  }

  return items
}
