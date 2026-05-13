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
  location: string | null
  contentCategory: string | null
  travelIntentScore: number | null
  credibilityScore: number | null
  commercialScore: number | null
}

const NULL_RESULT: ScoreResult = {
  score: null,
  summary: null,
  painPoints: null,
  opportunityType: null,
  competitors: [],
  location: null,
  contentCategory: null,
  travelIntentScore: null,
  credibilityScore: null,
  commercialScore: null,
}

const OPPORTUNITY_TYPES = [
  'traveler_question',
  'fresh_tip',
  'warning',
  'price_check',
  'venue_recommendation',
  'safety_report',
  'itinerary_research',
] as const

const LOCATIONS = ['Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai', 'Thailand', 'Unknown'] as const
const CONTENT_CATEGORIES = [
  'bar',
  'club',
  'massage',
  'scam',
  'price',
  'dating',
  'transport',
  'safety',
  'tourist_question',
  'hidden_gem',
  'general_nightlife',
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
      max_tokens: 512,
      system: `Score this public travel/community post as Thailand nightlife intelligence for '${keyword}'.
Return valid JSON only, no markdown, no explanation:
{
  "score": number,
  "summary": string,
  "painPoints": string,
  "opportunityType": string,
  "competitors": string[],
  "location": string,
  "contentCategory": string,
  "travelIntentScore": number,
  "credibilityScore": number,
  "commercialScore": number
}

Scoring:
9-10: Fresh, specific Thailand nightlife travel intelligence with clear action value
7-8:  Useful visitor question, warning, venue tip, price/safety signal, or itinerary need
5-6:  Relevant Thailand nightlife discussion, but generic or low detail
3-4:  Tangentially related travel/social chatter
1-2:  Irrelevant, stale, spammy, or not Thailand/nightlife related

summary: max 18 words describing the useful intelligence.
painPoints: the visitor concern or opportunity in one sentence.
opportunityType: one of exactly: traveler_question | fresh_tip | warning | price_check | venue_recommendation | safety_report | itinerary_research
competitors: array of venue, district, tool, blog, or community names explicitly mentioned (empty array if none).
location: one of exactly: Bangkok | Pattaya | Phuket | Chiang Mai | Thailand | Unknown
contentCategory: one of exactly: bar | club | massage | scam | price | dating | transport | safety | tourist_question | hidden_gem | general_nightlife
travelIntentScore: 1-10 for how useful this is to a traveler planning a night out.
credibilityScore: 1-10 for specificity, recency, first-hand detail, and source reliability.
commercialScore: 1-10 for potential to become thainight content, newsletter item, guide, map entry, or paid lead.`,
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
      !Array.isArray(p.competitors) ||
      !LOCATIONS.includes(p.location as typeof LOCATIONS[number]) ||
      !CONTENT_CATEGORIES.includes(p.contentCategory as typeof CONTENT_CATEGORIES[number]) ||
      typeof p.travelIntentScore !== 'number' ||
      typeof p.credibilityScore !== 'number' ||
      typeof p.commercialScore !== 'number'
    ) {
      return NULL_RESULT
    }

    const result: ScoreResult = {
      score: p.score,
      summary: p.summary,
      painPoints: p.painPoints,
      opportunityType: p.opportunityType as string,
      competitors: (p.competitors as unknown[]).filter(c => typeof c === 'string') as string[],
      location: p.location as string,
      contentCategory: p.contentCategory as string,
      travelIntentScore: p.travelIntentScore,
      credibilityScore: p.credibilityScore,
      commercialScore: p.commercialScore,
    }

    await opts.redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL)

    return result
  } catch {
    return NULL_RESULT
  }
}
