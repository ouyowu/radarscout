import { db, Prisma } from '@reddit-monitor/db'

type WebhookMatch = {
  id: string
  platform: string
  title: string
  url: string
  snippet: string
  matchedAt: Date
  intentScore: number | null
  aiSummary: string | null
  painPoints: string | null
  opportunityType: string | null
  location: string | null
  contentCategory: string | null
  travelIntentScore: number | null
  credibilityScore: number | null
  commercialScore: number | null
  sourceMeta: Prisma.JsonValue
  keyword?: { text: string; flags?: Prisma.JsonValue }
}

const RAID_KEYWORDS = [
  'raid',
  'raided',
  'police raid',
  'police check',
  'crackdown',
  'checkpoint',
  'shut down',
  'shutdown',
]

function sourceMetaObject(value: Prisma.JsonValue): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function keywordSubreddit(keyword: WebhookMatch['keyword']): string | undefined {
  if (!keyword?.flags || typeof keyword.flags !== 'object' || Array.isArray(keyword.flags)) {
    return undefined
  }
  const subreddit = (keyword.flags as Record<string, unknown>).subreddit
  return typeof subreddit === 'string' && subreddit.length > 0 ? subreddit : undefined
}

export function hasRaidKeywords(match: Pick<WebhookMatch, 'title' | 'snippet' | 'aiSummary'>): boolean {
  const text = `${match.title}\n${match.snippet}\n${match.aiSummary ?? ''}`.toLowerCase()
  return RAID_KEYWORDS.some(keyword => text.includes(keyword))
}

export function thainightValue(match: Pick<WebhookMatch, 'commercialScore'>): number {
  return (match.commercialScore ?? 0) / 10
}

export async function sendThaiNightWebhookIfNeeded(match: WebhookMatch): Promise<void> {
  const baseUrl = process.env.THAINIGHT_API_URL?.replace(/\/$/, '')
  const secret = process.env.RADARSCOUT_WEBHOOK_SECRET
  if (!baseUrl || !secret) return

  const meta = sourceMetaObject(match.sourceMeta)
  if (typeof meta.thainightWebhookSentAt === 'string') return

  const value = thainightValue(match)
  const raidDetected = hasRaidKeywords(match)
  if (value < 0.85 && !raidDetected) return

  const item = {
    id: match.id,
    source: match.platform.toLowerCase(),
    subreddit: keywordSubreddit(match.keyword),
    title: match.title,
    url: match.url,
    body_snippet: match.snippet,
    posted_at: match.matchedAt.toISOString(),
    ai_scores: {
      city: match.location,
      venue_type: match.contentCategory,
      travel_intent:
        match.travelIntentScore !== null
          ? match.travelIntentScore / 10
          : match.intentScore !== null
            ? match.intentScore / 10
            : undefined,
      credibility:
        match.credibilityScore !== null ? match.credibilityScore / 10 : undefined,
      thainight_value: value,
      sentiment: undefined,
      extracted_venue_names: match.keyword?.text ? [match.keyword.text] : [],
    },
    thainight_match: undefined,
  }

  const payload = {
    secret,
    item,
    event: raidDetected ? 'raid_signal' : 'high_value_signal',
    raid_keywords_detected: raidDetected,
    match: {
      id: match.id,
      platform: match.platform,
      title: match.title,
      url: match.url,
      snippet: match.snippet,
      summary: match.aiSummary,
      keyword: match.keyword?.text,
      location: match.location,
      city: match.location,
      category: match.contentCategory,
      opportunityType: match.opportunityType,
      travelIntentScore: match.travelIntentScore ?? match.intentScore,
      credibilityScore: match.credibilityScore,
      commercialScore: match.commercialScore,
      matchedAt: match.matchedAt.toISOString(),
    },
  }

  try {
    const response = await fetch(`${baseUrl}/api/radarscout/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(`[thainight-webhook] HTTP ${response.status}`)
      return
    }

    await db.match.update({
      where: { id: match.id },
      data: {
        sourceMeta: {
          ...meta,
          thainightWebhookSentAt: new Date().toISOString(),
          thainightWebhookEvent: payload.event,
        } as Prisma.InputJsonValue,
      },
    })
  } catch (err) {
    console.error('[thainight-webhook] failed:', err)
  }
}
