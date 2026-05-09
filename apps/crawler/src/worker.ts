import { Queue, Worker } from 'bullmq'
import type { Redis } from 'ioredis'
import { AhoCorasick } from '@reddit-monitor/matcher'
import { RedditClient } from './reddit.js'
import { submitMatch } from './submitter.js'

interface KeywordConfig {
  id: string
  text: string
}

interface MonitorConfig {
  id: string
  subreddit: string
  keywords: KeywordConfig[]
}

// In-memory dedup: subreddit → seen post IDs
const seenIds = new Map<string, Set<string>>()

async function fetchMonitorConfigs(): Promise<MonitorConfig[]> {
  const apiUrl = process.env.INTERNAL_API_URL
  const secret = process.env.INTERNAL_API_SECRET

  if (!apiUrl || !secret) {
    console.log('[worker] INTERNAL_API_URL not set — no monitors to poll')
    return []
  }

  try {
    const res = await fetch(`${apiUrl}/api/internal/monitors`, {
      headers: { 'x-internal-secret': secret },
    })
    if (!res.ok) {
      console.error(`[worker] fetchConfigs HTTP ${res.status}`)
      return []
    }
    return (await res.json()) as MonitorConfig[]
  } catch (err) {
    console.error('[worker] fetchConfigs error:', err)
    return []
  }
}

function buildAutomaton(configs: MonitorConfig[]): AhoCorasick {
  const ac = new AhoCorasick()
  for (const config of configs) {
    for (const kw of config.keywords) {
      ac.addPattern(kw.id, kw.text)
    }
  }
  ac.build()
  return ac
}

function snippet(text: string, start: number, end: number): string {
  return text.slice(Math.max(0, start - 100), Math.min(text.length, end + 100)).trim()
}

async function pollSubreddit(
  config: MonitorConfig,
  ac: AhoCorasick,
  client: RedditClient,
): Promise<void> {
  const seen = seenIds.get(config.subreddit) ?? new Set<string>()
  const kwIds = new Set(config.keywords.map(k => k.id))

  let posts
  try {
    posts = await client.getNewPosts(config.subreddit)
  } catch (err) {
    console.error(`[worker] poll r/${config.subreddit}:`, (err as Error).message)
    return
  }

  for (const post of posts) {
    if (seen.has(post.id)) continue
    seen.add(post.id)

    const text = `${post.title} ${post.selftext}`
    const matches = ac.search(text)

    for (const m of matches) {
      if (!kwIds.has(m.id)) continue
      await submitMatch({
        keywordId: m.id,
        platform: 'REDDIT',
        postId: post.id,
        title: post.title,
        url: `https://reddit.com${post.permalink}`,
        snippet: snippet(text, m.start, m.end),
      })
    }
  }

  // Keep seen set bounded at 1000 entries
  if (seen.size > 1000) {
    const entries = [...seen]
    seenIds.set(config.subreddit, new Set(entries.slice(-500)))
  } else {
    seenIds.set(config.subreddit, seen)
  }
}

export async function startWorker(
  redditClient: RedditClient,
  connection: Redis,
): Promise<() => Promise<void>> {
  const queue = new Queue('crawler', { connection })

  // Add a single repeatable poll job — BullMQ deduplicates by jobId
  await queue.add('poll', {}, {
    jobId: 'poll-singleton',
    repeat: { every: 30_000 },
  })

  const worker = new Worker(
    'crawler',
    async () => {
      const configs = await fetchMonitorConfigs()
      if (configs.length === 0) return

      const ac = buildAutomaton(configs)
      for (const config of configs) {
        await pollSubreddit(config, ac, redditClient)
      }
    },
    { connection },
  )

  worker.on('completed', job => console.log(`[worker] done ${job.id}`))
  worker.on('failed', (job, err) => console.error(`[worker] failed ${job?.id}:`, err.message))

  console.log('[worker] running — polling every 30 s')

  return async () => {
    await worker.close()
    await queue.close()
  }
}
