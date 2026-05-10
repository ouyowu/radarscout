import type { RssItem } from './rss.js'

interface SerperResult {
  link?: string
  title?: string
  snippet?: string
}

interface SerperResponse {
  organic?: SerperResult[]
}

export async function searchRedditViaGoogle(keyword: string): Promise<RssItem[]> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ q: `site:reddit.com ${keyword}`, num: 10 }),
      signal: AbortSignal.timeout(8_000),
    })

    if (!res.ok) {
      console.warn('[google] Serper API failed:', res.status)
      return []
    }

    const data = (await res.json()) as SerperResponse
    const results = data.organic ?? []

    return results.flatMap((r): RssItem[] => {
      const url = r.link ?? ''
      if (!url.includes('reddit.com/r/')) return []

      const postMatch = url.match(/\/comments\/([a-z0-9]+)\//i)
      if (!postMatch) return []
      const postId: string = postMatch[1]

      const subMatch = url.match(/\/r\/([^/]+)\//)
      const subreddit: string = subMatch?.[1] ?? 'all'

      const title = (r.title ?? '').replace(/\s*[-|]\s*Reddit\s*$/, '').trim()
      if (!title) return []

      const snippet = (r.snippet ?? '').trim().slice(0, 300)

      return [{ postId, title, url, snippet, platform: 'REDDIT', subreddit }]
    })
  } catch (err) {
    console.warn('[google] search failed:', (err as Error).message)
    return []
  }
}
