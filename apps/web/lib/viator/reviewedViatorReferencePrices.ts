const MAX_PRICE_AGE_MS = 7 * 24 * 60 * 60 * 1_000

const allowedKeys = new Set([
  'productCode',
  'retailFromPrice',
  'currency',
  'priceFetchedAt',
])

const forbiddenKeys = new Set([
  'partnerNetFromPrice',
  'partnerNet',
  'partnerNetPrice',
  'partnerTotalPrice',
  'netRate',
  'commission',
  'markup',
  'pricing',
  'raw',
  'rawResponse',
])

const allowedCurrencies = new Set(['THB', 'USD'])

export type ReviewedViatorReferencePrice = {
  productCode: string
  retailFromPrice: number
  currency: 'THB' | 'USD'
  priceFetchedAt: string
}

export type PublicViatorReferencePrice = {
  retailPrice: string
  currency: ReviewedViatorReferencePrice['currency']
  priceFetchedAt: string
}

export type ReviewedViatorReferencePriceValidationResult =
  | { ok: true; data: ReviewedViatorReferencePrice }
  | { ok: false; error: string; fields?: string[] }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function validateReviewedViatorReferencePrice(
  value: unknown,
): ReviewedViatorReferencePriceValidationResult {
  const record = asRecord(value)
  if (!record) return { ok: false, error: 'not_object' }

  const keys = Object.keys(record)
  const forbidden = keys.filter(key => forbiddenKeys.has(key))
  if (forbidden.length > 0) return { ok: false, error: 'forbidden_fields', fields: forbidden }

  const unknown = keys.filter(key => !allowedKeys.has(key))
  if (unknown.length > 0) return { ok: false, error: 'unknown_fields', fields: unknown }

  const productCode = typeof record.productCode === 'string'
    ? record.productCode.trim()
    : ''
  const retailFromPrice = record.retailFromPrice
  const currency = typeof record.currency === 'string'
    ? record.currency.trim().toUpperCase()
    : ''
  const priceFetchedAt = typeof record.priceFetchedAt === 'string'
    ? record.priceFetchedAt.trim()
    : ''

  if (!productCode || !/^[a-z0-9]+$/i.test(productCode)) {
    return { ok: false, error: 'invalid_product_code' }
  }
  if (typeof retailFromPrice !== 'number' || !Number.isFinite(retailFromPrice) || retailFromPrice <= 0) {
    return { ok: false, error: 'invalid_retail_from_price' }
  }
  if (!allowedCurrencies.has(currency)) return { ok: false, error: 'invalid_currency' }
  if (!priceFetchedAt || Number.isNaN(Date.parse(priceFetchedAt))) {
    return { ok: false, error: 'invalid_price_fetched_at' }
  }

  return {
    ok: true,
    data: {
      productCode,
      retailFromPrice,
      currency: currency as ReviewedViatorReferencePrice['currency'],
      priceFetchedAt,
    },
  }
}

export function loadReviewedViatorReferencePrices(): ReviewedViatorReferencePrice[] {
  return reviewedViatorReferencePriceRecords.flatMap(record => {
    const result = validateReviewedViatorReferencePrice(record)
    return result.ok ? [result.data] : []
  })
}

export function getFreshViatorReferencePrice(
  productCode: string,
  now = new Date(),
): PublicViatorReferencePrice | null {
  const normalizedCode = productCode.trim().toLowerCase()
  const record = loadReviewedViatorReferencePrices()
    .find(candidate => candidate.productCode.toLowerCase() === normalizedCode)

  if (!record) return null

  const ageMs = now.getTime() - Date.parse(record.priceFetchedAt)
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > MAX_PRICE_AGE_MS) return null

  return {
    retailPrice: String(record.retailFromPrice),
    currency: record.currency,
    priceFetchedAt: record.priceFetchedAt,
  }
}
import { reviewedViatorReferencePriceRecords } from './reviewedViatorReferencePriceRecords'
