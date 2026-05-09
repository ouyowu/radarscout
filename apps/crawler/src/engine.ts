import { AhoCorasick } from '@reddit-monitor/matcher'
import { submitMatch } from './submitter.js'

const POLL_MS = 60_000
const REBUILD_MS = 5 * 60_000

export interface CrawledItem {
  postId: string
  title: string
  url: string
  snippet: string
  platform: 'REDDIT'
}

export interface EngineClient {
  fetchNewPosts(after?: string): Promise<CrawledItem[]>
  fetchNewComments(after?: string): Promise<CrawledItem[]>
}

function excerpt(text: string, start: number, end: number): string {
  return text.slice(Math.max(0, start - 100), Math.min(text.length, end + 100)).trim()
}

async function loadKeywords(apiUrl: string, apiSecret: string): Promise<AhoCorasick> {
  const res = await fetch(`${apiUrl}/api/internal/keywords`, {
    headers: { 'x-internal-secret': apiSecret },
  })
  if (!res.ok) throw new Error(`Failed to load keywords: HTTP ${res.status}`)

  const keywords = (await res.json()) as Array<{ id: string; text: string }>
  const ac = new AhoCorasick()
  for (const kw of keywords) ac.addPattern(kw.id, kw.text)
  ac.build()
  console.log(`[engine] loaded ${keywords.length} keywords`)
  return ac
}

export async function pollOnce(
  client: EngineClient,
  ac: AhoCorasick,
  seenIds: Set<string>,
): Promise<void> {
  const [posts, comments] = await Promise.all([
    client.fetchNewPosts(),
    client.fetchNewComments(),
  ])

  for (const item of [...posts, ...comments]) {
    if (seenIds.has(item.postId)) continue
    seenIds.add(item.postId)

    const text = `${item.title} ${item.snippet}`
    const matches = ac.search(text)

    for (const m of matches) {
      await submitMatch({
        keywordId: m.id,
        platform: item.platform,
        postId: item.postId,
        title: item.title,
        url: item.url,
        snippet: excerpt(text, m.start, m.end),
      })
    }
  }

  // Keep seen set bounded to avoid unbounded memory growth
  if (seenIds.size > 2000) {
    const arr = [...seenIds]
    seenIds.clear()
    arr.slice(-1000).forEach(id => seenIds.add(id))
  }
}

export async function startEngine(
  client: EngineClient,
  opts: { apiUrl: string; apiSecret: string },
): Promise<() => void> {
  let ac = await loadKeywords(opts.apiUrl, opts.apiSecret)
  let lastRebuild = Date.now()
  const seenIds = new Set<string>()

  const tick = async () => {
    try {
      if (Date.now() - lastRebuild > REBUILD_MS) {
        ac = await loadKeywords(opts.apiUrl, opts.apiSecret)
        lastRebuild = Date.now()
      }
      await pollOnce(client, ac, seenIds)
    } catch (err) {
      console.error('[engine] tick error:', (err as Error).message)
    }
  }

  await tick()
  const timer = setInterval(tick, POLL_MS)

  return () => clearInterval(timer)
}
