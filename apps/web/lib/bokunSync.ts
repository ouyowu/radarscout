import { db } from '@reddit-monitor/db'
import { BokunSearchResult, fetchActiveBokunActivities } from '@/lib/bokun'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'

type SyncBokunCatalogParams = {
  queries?: string[]
  currency?: string
  lang?: string
  commissionPercent?: number
  pageSize?: number
  maxPages?: number
}

export type SyncBokunCatalogResult = {
  queries: string[]
  maxPages: number
  fetchedUniqueProducts: number
  suppliersUpserted: number
  productsUpserted: number
  skippedProducts: number
  failures: Array<{ query: string; status: number }>
  startedAt: string
  syncedAt: string
  finishedAt: string
}

type SupplierSnapshot = {
  bokunVendorId: string
  title: string
  status: string | null
  rawJson: unknown
}

const DEFAULT_SYNC_QUERIES = [
  'bangkok',
  'chiang mai',
  'chiang rai',
  'phuket',
  'pattaya',
  'krabi',
  'koh samui',
  'ayutthaya',
  'hua hin',
  'khao lak',
  'phang nga',
  'phi phi',
  'koh tao',
  'koh phangan',
  'sukhothai',
  'kanchanaburi',
  'trat',
  'koh chang',
  'railay',
  'ao nang',
]

const CITY_ALIASES: Array<[string, string[]]> = [
  ['Bangkok', ['bangkok', '曼谷']],
  ['Chiang Mai', ['chiang mai', 'chiangmai', '清迈']],
  ['Phuket', ['phuket', '普吉', '普吉岛']],
  ['Pattaya', ['pattaya', '芭提雅']],
  ['Krabi', ['krabi', '甲米']],
  ['Koh Samui', ['koh samui', 'samui', '苏梅', '苏梅岛']],
  ['Ayutthaya', ['ayutthaya', '大城']],
  ['Chiang Rai', ['chiang rai', 'chiangrai', '清莱']],
  ['Hua Hin', ['hua hin', 'huahin', '华欣']],
  ['Khao Lak', ['khao lak', 'khaolak']],
  ['Phang Nga', ['phang nga', 'phangnga']],
  ['Phi Phi', ['phi phi', 'koh phi phi', 'ko phi phi']],
  ['Koh Tao', ['koh tao', 'ko tao']],
  ['Koh Phangan', ['koh phangan', 'ko phangan', 'koh pha ngan']],
  ['Sukhothai', ['sukhothai']],
  ['Kanchanaburi', ['kanchanaburi']],
  ['Trat', ['trat']],
  ['Koh Chang', ['koh chang', 'ko chang']],
  ['Railay', ['railay']],
  ['Ao Nang', ['ao nang', 'aonang']],
]

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function readId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)

  return null
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)

  return null
}

function parseMoney(value: string | null): { amount: string | null; currency: string | null } {
  if (!value) return { amount: null, currency: null }

  const match = value.match(/^(\d+(?:\.\d+)?)\s+([A-Z]{3})$/)
  if (!match) return { amount: null, currency: null }

  return { amount: match[1], currency: match[2] }
}

function detectCity(item: BokunSearchResult): string | null {
  const raw = asRecord(item.raw)
  const haystack = [
    item.title,
    item.excerpt,
    item.location,
    readString(raw.city),
    readString(raw.country),
    readString(raw.address),
    readString(raw.locationCode),
    JSON.stringify(raw.places ?? ''),
    JSON.stringify(raw.googlePlace ?? ''),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return CITY_ALIASES.find(([, aliases]) =>
    aliases.some(alias => haystack.includes(alias.toLowerCase())),
  )?.[0] ?? null
}

function readNestedRecord(record: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const value = record[key]
    if (value && typeof value === 'object') return value as Record<string, unknown>
  }

  return null
}

function extractSupplier(item: BokunSearchResult): SupplierSnapshot | null {
  const raw = asRecord(item.raw)
  const supplierRecord = readNestedRecord(raw, ['vendor', 'supplier', 'seller', 'operator'])
  const vendorId =
    readId(raw.vendorId) ??
    readId(raw.supplierId) ??
    readId(raw.sellerId) ??
    readId(supplierRecord?.id) ??
    readId(supplierRecord?.vendorId)

  if (!vendorId) return null

  return {
    bokunVendorId: vendorId,
    title:
      readString(raw.vendorTitle) ??
      readString(raw.vendorName) ??
      readString(raw.supplierName) ??
      readString(supplierRecord?.title) ??
      readString(supplierRecord?.name) ??
      `Bókun supplier ${vendorId}`,
    status:
      readString(raw.contractStatus) ??
      readString(raw.status) ??
      readString(supplierRecord?.status),
    rawJson: supplierRecord ?? raw,
  }
}

function normalizeQueries(queries?: string[]): string[] {
  const values = queries?.length ? queries : DEFAULT_SYNC_QUERIES
  const cleaned = values.map(query => query.trim().toLowerCase())

  return Array.from(new Set(cleaned))
}

export function isBokunCatalogConfigured(): boolean {
  return Boolean(
    process.env.BOKUN_ACCESS_KEY &&
    process.env.BOKUN_SECRET_KEY &&
    process.env.BOKUN_API_BASE_URL,
  )
}

export async function syncBokunCatalog(
  params: SyncBokunCatalogParams = {},
): Promise<SyncBokunCatalogResult> {
  const seen = new Map<string, BokunSearchResult>()
  const failures: Array<{ query: string; status: number }> = []
  const queries = normalizeQueries(params.queries)
  const pageSize = params.pageSize ?? 100
  const maxPages = params.maxPages ?? 1
  const startedAt = new Date()

  for (const query of queries) {
    for (let page = 1; page <= maxPages; page += 1) {
      const result = await fetchActiveBokunActivities({
        query,
        currency: params.currency,
        lang: params.lang,
        commissionPercent: params.commissionPercent,
        page,
        pageSize,
      })

      if (!result.ok) {
        failures.push({ query, status: result.status })
        break
      }

      for (const item of result.body.items) {
        if (item.id) seen.set(item.id, item)
      }

      if (result.body.items.length < pageSize) break
    }
  }

  let suppliersUpserted = 0
  let productsUpserted = 0
  const syncedAt = new Date()

  for (const item of seen.values()) {
    const city = detectCity(item)
    const eligibility = evaluateThailandProductEligibility({
      title: item.title,
      city,
      location: item.location,
      description: item.excerpt,
    })

    if (!eligibility.eligible) continue

    const supplier = extractSupplier(item)
    const supplierRow = supplier
      ? await db.bokunSupplier.upsert({
          where: { bokunVendorId: supplier.bokunVendorId },
          update: {
            title: supplier.title,
            status: supplier.status,
            rawJson: supplier.rawJson as never,
            lastSyncedAt: syncedAt,
          },
          create: {
            bokunVendorId: supplier.bokunVendorId,
            title: supplier.title,
            status: supplier.status,
            rawJson: supplier.rawJson as never,
            lastSyncedAt: syncedAt,
          },
          select: { id: true },
        })
      : null

    if (supplierRow) suppliersUpserted += 1

    const retail = parseMoney(item.retailPrice)
    const net = parseMoney(item.netSettlementPrice)

    await db.bokunProduct.upsert({
      where: { bokunActivityId: item.id },
      update: {
        supplierId: supplierRow?.id ?? null,
        title: item.title,
        description: readString(asRecord(item.raw).description),
        excerpt: item.excerpt,
        city,
        location: item.location,
        retailPrice: retail.amount,
        netSettlementPrice: net.amount,
        currency: retail.currency ?? net.currency,
        commissionPercent: readNumber(item.commissionPercent)?.toString() ?? null,
        active: true,
        rawJson: item.raw as never,
        lastSyncedAt: syncedAt,
      },
      create: {
        bokunActivityId: item.id,
        supplierId: supplierRow?.id ?? null,
        title: item.title,
        description: readString(asRecord(item.raw).description),
        excerpt: item.excerpt,
        city,
        location: item.location,
        retailPrice: retail.amount,
        netSettlementPrice: net.amount,
        currency: retail.currency ?? net.currency,
        commissionPercent: readNumber(item.commissionPercent)?.toString() ?? null,
        active: true,
        rawJson: item.raw as never,
        lastSyncedAt: syncedAt,
      },
    })

    productsUpserted += 1
  }

  const finishedAt = new Date()

  return {
    queries,
    maxPages,
    fetchedUniqueProducts: seen.size,
    suppliersUpserted,
    productsUpserted,
    skippedProducts: Math.max(seen.size - productsUpserted, 0),
    failures,
    startedAt: startedAt.toISOString(),
    syncedAt: syncedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
  }
}
