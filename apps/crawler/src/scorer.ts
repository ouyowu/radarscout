import Anthropic from '@anthropic-ai/sdk'
import type { Redis } from 'ioredis'

export interface ScoreMatchOpts {
  keywordId: string
  postId: string
  plan: string
  redis: Redis
}

const CACHE_TTL = 7 * 24 * 60 * 60 // 7 days in seconds

export async function scoreMatch(
  keyword: string,
  post: { title: string; snippet: string },
  opts: ScoreMatchOpts,
): Promise<{ score: number | null; summary: string | null }> {
  const NULL_RESULT = { score: null, summary: null }

  if (opts.plan !== 'PRO' && opts.plan !== 'TEAM') {
    return NULL_RESULT
  }

  const cacheKey = `lp:score:${opts.keywordId}:${opts.postId}`

  try {
    const cached = await opts.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as { score: number; summary: string }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.log('[scorer] ANTHROPIC_API_KEY not set — skipping')
      return NULL_RESULT
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-haiku-20250307',
      max_tokens: 128,
      system: `Score this Reddit post for purchase intent regarding '${keyword}'.
Return valid JSON only, no markdown, no explanation:
{"score": number, "summary": string}

Scoring:
9-10: Actively asking for product/service recommendation
7-8:  Clear pain point, comparing solutions
5-6:  Relevant topic, passive interest
3-4:  Tangentially related
1-2:  Irrelevant, venting, or negative sentiment

Summary: max 12 words describing what this person needs.`,
      messages: [
        { role: 'user', content: `Title: ${post.title}\n\n${post.snippet}` },
      ],
    })

    const text =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : ''

    const parsed = JSON.parse(text) as unknown
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).score !== 'number' ||
      typeof (parsed as Record<string, unknown>).summary !== 'string'
    ) {
      return NULL_RESULT
    }

    const result = {
      score: (parsed as { score: number }).score,
      summary: (parsed as { summary: string }).summary,
    }

    await opts.redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL)

    return result
  } catch {
    return NULL_RESULT
  }
}
