import crypto from 'crypto'

type BokunConfig = {
  accessKey: string
  secretKey: string
  baseUrl: string
}

export type BokunSearchResult = {
  id: string
  title: string
  excerpt: string | null
  location: string | null
  retailPrice: string | null
  netSettlementPrice: string | null
  commissionPercent: number
  raw: unknown
}

export type BokunActiveActivitiesResult =
  | {
      ok: true
      status: number
      body: {
        count: number
        items: BokunSearchResult[]
      }
    }
  | {
      ok: false
      status: number
      body: unknown
    }

function getBokunConfig(): BokunConfig {
  const accessKey = process.env.BOKUN_ACCESS_KEY
  const secretKey = process.env.BOKUN_SECRET_KEY
  const baseUrl = process.env.BOKUN_API_BASE_URL ?? 'https://api.bokun.io'

  if (!accessKey || !secretKey) {
    throw new Error('Missing BOKUN_ACCESS_KEY or BOKUN_SECRET_KEY')
  }

  return { accessKey, secretKey, baseUrl: baseUrl.replace(/\/$/, '') }
}

function formatBokunDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')

  return [
    date.getUTCFullYear(),
    '-',
    pad(date.getUTCMonth() + 1),
    '-',
    pad(date.getUTCDate()),
    ' ',
    pad(date.getUTCHours()),
    ':',
    pad(date.getUTCMinutes()),
    ':',
    pad(date.getUTCSeconds()),
  ].join('')
}

function createBokunSignature(params: {
  date: string
  accessKey: string
  method: string
  pathWithQuery: string
  secretKey: string
}): string {
  const signatureBase = `${params.date}${params.accessKey}${params.method.toUpperCase()}${params.pathWithQuery}`

  return crypto
    .createHmac('sha1', params.secretKey)
    .update(signatureBase)
    .digest('base64')
}

async function bokunRequest(pathWithQuery: string, init: RequestInit = {}) {
  const config = getBokunConfig()
  const method = (init.method ?? 'GET').toUpperCase()
  const date = formatBokunDate(new Date())
  const signature = createBokunSignature({
    date,
    accessKey: config.accessKey,
    method,
    pathWithQuery,
    secretKey: config.secretKey,
  })

  const response = await fetch(`${config.baseUrl}${pathWithQuery}`, {
    ...init,
    method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Bokun-Date': date,
      'X-Bokun-AccessKey': config.accessKey,
      'X-Bokun-Signature': signature,
      ...init.headers,
    },
  })

  const text = await response.text()
  const body = text ? JSON.parse(text) as unknown : null

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      body,
    }
  }

  return {
    ok: true as const,
    status: response.status,
    body,
  }
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function formatMoney(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const currency = process.env.BOKUN_DEFAULT_CURRENCY ?? 'USD'

    return `${value.toFixed(2)} ${currency}`
  }

  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const amount = readNumber(record.amount)
  const currency = readString(record.currency)

  if (amount === null || !currency) return null

  return `${(amount / 100).toFixed(2)} ${currency}`
}

function estimateNetSettlement(retailPrice: string | null, commissionPercent: number): string | null {
  if (!retailPrice) return null

  const match = retailPrice.match(/^(\d+(?:\.\d+)?)\s+([A-Z]{3})$/)
  if (!match) return null

  const amount = Number(match[1])
  const currency = match[2]
  const net = amount * (1 - commissionPercent / 100)

  return `${net.toFixed(2)} ${currency}`
}

function normalizeBokunActivity(item: unknown, commissionPercent: number): BokunSearchResult {
  const record = item && typeof item === 'object' ? item as Record<string, unknown> : {}
  const id = String(record.id ?? record.activityId ?? record.productId ?? '')
  const title = readString(record.title) ?? readString(record.name) ?? 'Untitled Bókun product'
  const excerpt = readString(record.excerpt) ?? readString(record.summary) ?? readString(record.description)
  const locationRecord = record.location && typeof record.location === 'object'
    ? record.location as Record<string, unknown>
    : null
  const location = readString(record.location as unknown) ??
    readString(locationRecord?.title) ??
    readString(locationRecord?.address) ??
    null
  const retailPrice =
    formatMoney(record.price) ??
    formatMoney(record.fromPrice) ??
    formatMoney(record.defaultPrice) ??
    null

  return {
    id,
    title,
    excerpt,
    location,
    retailPrice,
    netSettlementPrice: estimateNetSettlement(retailPrice, commissionPercent),
    commissionPercent,
    raw: item,
  }
}

async function fetchBokunActivitySearch(params: {
  query: string
  currency?: string
  lang?: string
  commissionPercent?: number
  page?: number
  pageSize?: number
}): Promise<BokunActiveActivitiesResult> {
  const currency = params.currency ?? process.env.BOKUN_DEFAULT_CURRENCY ?? 'USD'
  const lang = params.lang ?? 'EN'
  const commissionPercent = params.commissionPercent ?? 20
  const searchParams = new URLSearchParams({ lang, currency })
  const pathWithQuery = `/activity.json/search?${searchParams.toString()}`

  const result = await bokunRequest(pathWithQuery, {
    method: 'POST',
    body: JSON.stringify({
      text: params.query,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 100,
      flags: ['ACTIVE'],
    }),
  })

  if (!result.ok) return result

  const bodyRecord = result.body && typeof result.body === 'object'
    ? result.body as Record<string, unknown>
    : {}
  const items = Array.isArray(bodyRecord.items)
    ? bodyRecord.items
    : Array.isArray(bodyRecord.activities)
      ? bodyRecord.activities
      : Array.isArray(result.body)
        ? result.body
        : []

  return {
    ok: true as const,
    status: result.status,
    body: {
      count: items.length,
      items: items.map(item => normalizeBokunActivity(item, commissionPercent)),
    },
  }
}

export async function searchBokunActivities(params: {
  query: string
  currency?: string
  lang?: string
  commissionPercent?: number
  page?: number
  pageSize?: number
}) {
  return fetchBokunActivitySearch(params)
}

export async function fetchActiveBokunActivities(params: {
  query?: string
  currency?: string
  lang?: string
  commissionPercent?: number
  page?: number
  pageSize?: number
}) {
  return fetchBokunActivitySearch({
    query: params.query ?? '',
    currency: params.currency,
    lang: params.lang,
    commissionPercent: params.commissionPercent,
    page: params.page,
    pageSize: params.pageSize,
  })
}
