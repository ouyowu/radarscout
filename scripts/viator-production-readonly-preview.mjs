const VIATOR_ACCEPT_HEADER = 'application/json;version=2.0'
export const VIATOR_PRODUCTION_PRODUCT_SEARCH_URL = 'https://api.viator.com/partner/products/search'

const cities = Object.freeze({
  bangkok: { city: 'Bangkok', destinationId: '343' },
  'chiang-mai': { city: 'Chiang Mai', destinationId: '5267' },
  phuket: { city: 'Phuket', destinationId: '349' },
  krabi: { city: 'Krabi', destinationId: '348' },
  pattaya: { city: 'Pattaya', destinationId: '344' },
  'koh-samui': { city: 'Koh Samui', destinationId: '347' },
})

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value
    : null
}

function asNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function isViatorAffiliateUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && (url.hostname === 'viator.com' || url.hostname.endsWith('.viator.com'))
      && Boolean(url.searchParams.get('pid')?.trim())
  } catch {
    return false
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function selectImageUrl(product) {
  const images = Array.isArray(product.images) ? product.images : []
  const coverFirst = [...images].sort((left, right) => {
    const leftCover = asRecord(left)?.isCover === true ? 1 : 0
    const rightCover = asRecord(right)?.isCover === true ? 1 : 0
    return rightCover - leftCover
  })

  for (const image of coverFirst) {
    const variants = asRecord(image)?.variants
    if (!Array.isArray(variants)) continue

    const largestFirst = [...variants].sort((left, right) => {
      const leftRecord = asRecord(left)
      const rightRecord = asRecord(right)
      return Number(rightRecord?.width ?? 0) * Number(rightRecord?.height ?? 0)
        - Number(leftRecord?.width ?? 0) * Number(leftRecord?.height ?? 0)
    })

    for (const variant of largestFirst) {
      const imageUrl = asNonEmptyString(asRecord(variant)?.url)
      if (imageUrl && isHttpsUrl(imageUrl)) return imageUrl
    }
  }

  return null
}

function toSafeCandidate(value, city) {
  const product = asRecord(value)
  if (!product) return null

  const productCode = asNonEmptyString(product.productCode)
  const title = asNonEmptyString(product.title)
  const productUrl = asNonEmptyString(product.productUrl)
  const imageUrl = selectImageUrl(product)

  if (!productCode || !title || !productUrl || !imageUrl || !isViatorAffiliateUrl(productUrl)) return null

  return {
    city: city.city,
    destinationId: city.destinationId,
    productCode,
    title,
    productUrl,
    imageUrl,
  }
}

function normalizeInput(input) {
  const city = cities[input?.cityKey]
  const count = input?.count ?? 5

  if (!city) return { ok: false, reason: 'invalid_city' }
  if (!Number.isInteger(count) || count < 1 || count > 20) return { ok: false, reason: 'invalid_count' }

  return { ok: true, city, count }
}

export function parsePreviewArgs(args) {
  const values = new Map()

  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index]
    const value = args[index + 1]
    if ((flag !== '--city' && flag !== '--count') || !value || values.has(flag)) {
      return { ok: false, reason: 'invalid_arguments' }
    }
    values.set(flag, value)
  }

  const cityKey = values.get('--city')?.trim().toLowerCase().replaceAll(' ', '-')
  const countValue = values.get('--count')
  const count = countValue === undefined ? 5 : Number(countValue)
  const normalized = normalizeInput({ cityKey, count })

  if (!normalized.ok) return normalized
  return { ok: true, input: { cityKey, count } }
}

export async function fetchViatorProductionPreview(input, { apiKey, fetchFn = fetch } = {}) {
  const normalized = normalizeInput(input)
  if (!normalized.ok) return normalized
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  let response
  try {
    response = await fetchFn(VIATOR_PRODUCTION_PRODUCT_SEARCH_URL, {
      method: 'POST',
      headers: {
        Accept: VIATOR_ACCEPT_HEADER,
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': apiKey,
      },
      body: JSON.stringify({
        filtering: { destination: normalized.city.destinationId },
        pagination: { start: 1, count: normalized.count },
        currency: 'THB',
      }),
    })
  } catch {
    return { ok: false, reason: 'upstream_error' }
  }

  if (!response.ok) return { ok: false, reason: 'upstream_error', status: response.status }

  let body
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: 'upstream_error', status: response.status }
  }

  const products = Array.isArray(asRecord(body)?.products) ? asRecord(body).products : []
  const candidates = products
    .map((product) => toSafeCandidate(product, normalized.city))
    .filter(Boolean)

  return {
    ok: true,
    city: normalized.city.city,
    destinationId: normalized.city.destinationId,
    acceptedCandidateCount: candidates.length,
    excludedProductCount: products.length - candidates.length,
    candidates,
  }
}

async function main() {
  const parsed = parsePreviewArgs(process.argv.slice(2))
  if (!parsed.ok) {
    process.stderr.write(`${JSON.stringify(parsed)}\n`)
    process.exitCode = 1
    return
  }

  const result = await fetchViatorProductionPreview(parsed.input, {
    apiKey: process.env.VIATOR_PRODUCTION_API_KEY,
  })

  const output = result.ok
    ? result
    : { ok: false, reason: result.reason, ...(result.status ? { status: result.status } : {}) }
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`)
  if (!result.ok) process.exitCode = 1
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  await main()
}
