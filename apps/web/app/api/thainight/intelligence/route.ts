import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { fetchThaiNightVenues, fuzzyMatchVenue, type ThaiNightVenue } from '@reddit-monitor/matcher'

type ThaiNightFeedItem = {
  id: string
  platform: string
  title: string
  url: string
  snippet: string
  aiSummary: string | null
  location: string | null
  contentCategory: string | null
  opportunityType: string | null
  travelIntentScore: number | null
  intentScore: number | null
  credibilityScore: number | null
  commercialScore: number | null
  matchedAt: Date
  keyword: {
    text: string
    campaign: {
      id: string
      name: string
    } | null
  }
}

type ThaiNightPayloadItem = {
  id: string
  platform: string
  title: string
  url: string
  snippet: string
  summary: string | null
  keyword: string
  campaign: {
    id: string
    name: string
  } | null
  location: string | null
  city: string | null
  category: string | null
  opportunityType: string | null
  travelIntentScore: number | null
  credibilityScore: number | null
  commercialScore: number | null
  thainight_value: number
  matched_venue: {
    slug: string
    name: string
    city: string | null
    area_slug: string | null
    score: number
  } | null
  matchedAt: string
}

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.THAINIGHT_FEED_TOKEN
  if (!token) return true
  return request.nextUrl.searchParams.get('token') === token ||
    request.headers.get('x-thainight-token') === token
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function normalizeCity(value: string | null): string | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  const map: Record<string, string> = {
    bangkok: 'Bangkok',
    pattaya: 'Pattaya',
    phuket: 'Phuket',
    'chiang-mai': 'Chiang Mai',
    'chiang mai': 'Chiang Mai',
    thailand: 'Thailand',
    unknown: 'Unknown',
  }
  return map[normalized] ?? value
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
  const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)
  const location = searchParams.get('location')
  const city = searchParams.get('city')
  const category = searchParams.get('category')
  const format = searchParams.get('format')
  const minValue = Number(searchParams.get('min_value') ?? 0)
  const matchedOnly = searchParams.get('matched_only') === 'true'
  const cityFilter = normalizeCity(city ?? location)
  const valueFilter = Number.isFinite(minValue) && minValue > 0
    ? Math.min(Math.max(minValue, 0), 1)
    : 0

  const items = await db.match.findMany({
    where: {
      ...(cityFilter ? { location: cityFilter } : {}),
      ...(category ? { contentCategory: category } : {}),
      ...(valueFilter > 0 ? { commercialScore: { gte: Math.ceil(valueFilter * 10) } } : {}),
    },
    take: Number.isFinite(limit) && limit > 0 ? limit : 50,
    skip: Number.isFinite(offset) && offset > 0 ? offset : 0,
    orderBy: [
      { commercialScore: 'desc' },
      { travelIntentScore: 'desc' },
      { matchedAt: 'desc' },
    ],
    include: {
      keyword: {
        select: {
          text: true,
          campaign: { select: { id: true, name: true } },
        },
      },
    },
  })

  let venues: ThaiNightVenue[] = []
  if (matchedOnly || items.length > 0) {
    venues = await fetchThaiNightVenues()
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  const payload = (items as ThaiNightFeedItem[])
    .map((item): ThaiNightPayloadItem => {
      const thainightValue = (item.commercialScore ?? 0) / 10
      const venueMatch = fuzzyMatchVenue(
        `${item.title}\n${item.snippet}\n${item.aiSummary ?? ''}`,
        venues,
      )

      return {
        id: item.id,
        platform: item.platform,
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        summary: item.aiSummary,
        keyword: item.keyword.text,
        campaign: item.keyword.campaign,
        location: item.location,
        city: item.location,
        category: item.contentCategory,
        opportunityType: item.opportunityType,
        travelIntentScore: item.travelIntentScore ?? item.intentScore,
        credibilityScore: item.credibilityScore,
        commercialScore: item.commercialScore,
        thainight_value: thainightValue,
        matched_venue: venueMatch
          ? {
              slug: venueMatch.venue.slug,
              name: venueMatch.venue.name,
              city: venueMatch.venue.city ?? null,
              area_slug: venueMatch.venue.area_slug ?? null,
              score: venueMatch.score,
            }
          : null,
        matchedAt: item.matchedAt.toISOString(),
      }
    })
    .filter((item) => !matchedOnly || item.matched_venue)

  if (format === 'rss') {
    const xmlItems = payload.map(item => {
      const title = `[${item.location ?? 'Thailand'}] ${item.title}`
      const description = [
        item.summary,
        item.snippet,
        `Category: ${item.category ?? 'unknown'}`,
        `Commercial score: ${item.commercialScore ?? 'n/a'}`,
      ].filter(Boolean).join('\n\n')

      return [
        '<item>',
        `<title>${escapeXml(title)}</title>`,
        `<link>${escapeXml(item.url)}</link>`,
        `<guid>${escapeXml(item.id)}</guid>`,
        `<pubDate>${new Date(item.matchedAt).toUTCString()}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        '</item>',
      ].join('')
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RadarScout Thailand Nightlife Intelligence</title>
    <link>${escapeXml(base)}</link>
    <description>Fresh Thailand nightlife tips, warnings, questions, and hidden gems for thainight.</description>
    ${xmlItems}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
  }

  return NextResponse.json({
    source: 'RadarScout',
    partner: 'thainight',
    generatedAt: new Date().toISOString(),
    count: payload.length,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 50,
    offset: Number.isFinite(offset) && offset > 0 ? offset : 0,
    items: payload,
  })
}
