import Anthropic from '@anthropic-ai/sdk'
import type { Redis } from 'ioredis'

export interface ScoreMatchOpts {
  keywordId: string
  postId: string
  plan: string
  redis: Redis
}

export interface ScoreResult {
  score: number | null
  summary: string | null
  painPoints: string | null
  opportunityType: string | null
  competitors: string[]
}

const NULL_RESULT: ScoreResult = {
  score: null,
  summary: null,
  painPoints: null,
  opportunityType: null,
  competitors: [],
}

const OPPORTUNITY_TYPES = [
  'buying_intent',
  'alternative_seeking',
  'complaint',
  'recommendation_request',
  'research',
] as const

const CACHE_TTL = 7 * 24 * 60 * 60 // 7 days in seconds

export async function scoreMatch(
  keyword: string,
  post: { title: string; snippet: string },
  opts: ScoreMatchOpts,
): Promise<ScoreResult> {
  if (opts.plan !== 'PRO' && opts.plan !== 'TEAM') {
    return NULL_RESULT
  }

  const cacheKey = `lp:score:${opts.keywordId}:${opts.postId}`

  try {
    const cached = await opts.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as ScoreResult
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.log('[scorer] ANTHROPIC_API_KEY not set — skipping')
      return NULL_RESULT
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-haiku-20250307',
      max_tokens: 256,
      system: `Score this Reddit post for purchase intent regarding '${keyword}'.
Return valid JSON only, no markdown, no explanation:
{
  "score": number,
  "summary": string,
  "painPoints": string,
  "opportunityType": string,
  "competitors": string[]
}

Scoring:
9-10: Actively asking for product/service recommendation
7-8:  Clear pain point, comparing solutions
5-6:  Relevant topic, passive interest
3-4:  Tangentially related
1-2:  Irrelevant, venting, or negative sentiment

summary: max 15 words describing what this person needs.
painPoints: the main pain point in one sentence.
opportunityType: one of exactly: buying_intent | alternative_seeking | complaint | recommendation_request | research
competitors: array of competitor product/service names explicitly mentioned (empty array if none).`,
      messages: [
        { role: 'user', content: `Title: ${post.title}\n\n${post.snippet}` },
      ],
    })

    const text =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : ''

    const parsed = JSON.parse(text) as unknown
    if (
      typeof parsed !== 'object' ||
      parsed === null
    ) {
      return NULL_RESULT
    }

    const p = parsed as Record<string, unknown>

    if (
      typeof p.score !== 'number' ||
      typeof p.summary !== 'string' ||
      typeof p.painPoints !== 'string' ||
      !OPPORTUNITY_TYPES.includes(p.opportunityType as typeof OPPORTUNITY_TYPES[number]) ||
      !Array.isArray(p.competitors)
    ) {
      return NULL_RESULT
    }

    const result: ScoreResult = {
      score: p.score,
      summary: p.summary,
      painPoints: p.painPoints,
      opportunityType: p.opportunityType as string,
      competitors: (p.competitors as unknown[]).filter(c => typeof c === 'string') as string[],
    }

    await opts.redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL)

    return result
  } catch {
    return NULL_RESULT
  }
}
