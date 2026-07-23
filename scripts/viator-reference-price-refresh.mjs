import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const VIATOR_API_BASE = 'https://api.viator.com/partner'
const VIATOR_ACCEPT = 'application/json;version=2.0'
const DEFAULT_OUTPUT = 'apps/web/lib/viator/reviewedViatorReferencePriceRecords.ts'
const approvedProductCodes = [
  '6467BKKNIGHT',
  '163642P1',
  '191442P6',
  '163642P25',
  '160694P9',
  '44720P2',
]

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value
    : null
}

export function extractSafeReferencePrice(body, productCode, priceFetchedAt) {
  const record = asRecord(body)
  const summary = asRecord(record?.summary)
  const retailFromPrice = summary?.fromPrice
  const currency = typeof record?.currency === 'string'
    ? record.currency.trim().toUpperCase()
    : ''

  if (
    typeof retailFromPrice !== 'number'
    || !Number.isFinite(retailFromPrice)
    || retailFromPrice <= 0
    || !['THB', 'USD'].includes(currency)
  ) {
    return null
  }

  return {
    productCode,
    retailFromPrice,
    currency,
    priceFetchedAt,
  }
}

export function renderReferencePriceModule(records) {
  return `import type { ReviewedViatorReferencePrice } from './reviewedViatorReferencePrices'\n\nexport const reviewedViatorReferencePriceRecords: readonly ReviewedViatorReferencePrice[] = ${JSON.stringify(records, null, 2)}\n`
}

export async function refreshViatorReferencePrices({
  apiKey,
  fetchFn = fetch,
  outputPath = DEFAULT_OUTPUT,
  now = new Date(),
} = {}) {
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  const priceFetchedAt = now.toISOString()
  const records = []

  for (const productCode of approvedProductCodes) {
    let response
    try {
      response = await fetchFn(
        `${VIATOR_API_BASE}/availability/schedules/${encodeURIComponent(productCode)}`,
        {
          headers: {
            Accept: VIATOR_ACCEPT,
            'Accept-Language': 'en-US',
            'Accept-Currency': 'THB',
            'exp-api-key': apiKey,
          },
        },
      )
    } catch {
      return { ok: false, reason: 'upstream_error', productCode }
    }

    if (!response.ok) {
      return { ok: false, reason: 'upstream_error', productCode, status: response.status }
    }

    let body
    try {
      body = await response.json()
    } catch {
      return { ok: false, reason: 'invalid_response', productCode }
    }

    const safeRecord = extractSafeReferencePrice(body, productCode, priceFetchedAt)
    if (!safeRecord) return { ok: false, reason: 'invalid_response', productCode }
    records.push(safeRecord)
  }

  const absoluteOutput = resolve(outputPath)
  const temporaryOutput = `${absoluteOutput}.tmp`
  await mkdir(dirname(absoluteOutput), { recursive: true })
  await writeFile(temporaryOutput, renderReferencePriceModule(records), { mode: 0o600 })
  await rename(temporaryOutput, absoluteOutput)

  return { ok: true, refreshedCount: records.length, outputPath }
}

async function main() {
  const result = await refreshViatorReferencePrices({
    apiKey: process.env.VIATOR_PRODUCTION_API_KEY,
  })

  process.stdout.write(`${JSON.stringify(result)}\n`)
  if (!result.ok) process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
