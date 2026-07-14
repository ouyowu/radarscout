import 'server-only'

const VIATOR_SANDBOX_PRODUCT_SEARCH_URL = 'https://api.sandbox.viator.com/partner/products/search'
const VIATOR_ACCEPT_HEADER = 'application/json;version=2.0'

type JsonRecord = Record<string, unknown>

export type ViatorSandboxSearchInput = {
  destinationId: string
  count?: number
}

export type ViatorSafeProduct = {
  productCode: string
  title: string
  productUrl: string
  imageUrl?: string
}

export type ViatorSandboxSearchResult =
  | { ok: true, products: ViatorSafeProduct[] }
  | { ok: false, reason: 'invalid_request' | 'not_configured' | 'upstream_error', status?: number }

type ViatorSandboxSearchDependencies = {
  apiKey?: string
  fetchFn?: typeof fetch
}

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : null
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function isViatorAffiliateUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && (url.hostname === 'viator.com' || url.hostname.endsWith('.viator.com'))
  } catch {
    return false
  }
}

function isSafeImageUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function selectImageUrl(product: JsonRecord): string | undefined {
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
      const leftArea = Number(leftRecord?.width ?? 0) * Number(leftRecord?.height ?? 0)
      const rightArea = Number(rightRecord?.width ?? 0) * Number(rightRecord?.height ?? 0)
      return rightArea - leftArea
    })

    for (const variant of largestFirst) {
      const url = asNonEmptyString(asRecord(variant)?.url)
      if (url && isSafeImageUrl(url)) return url
    }
  }

  return undefined
}

function toSafeProduct(value: unknown): ViatorSafeProduct | null {
  const product = asRecord(value)
  if (!product) return null

  const productCode = asNonEmptyString(product.productCode)
  const title = asNonEmptyString(product.title)
  const productUrl = asNonEmptyString(product.productUrl)

  if (!productCode || !title || !productUrl || !isViatorAffiliateUrl(productUrl)) return null

  const imageUrl = selectImageUrl(product)
  return imageUrl ? { productCode, title, productUrl, imageUrl } : { productCode, title, productUrl }
}

function normalizeDestinationId(destinationId: string): string | null {
  const normalized = destinationId.trim()
  return /^\d+$/.test(normalized) ? normalized : null
}

function normalizeCount(count: number | undefined): number | null {
  const normalized = count ?? 12
  return Number.isInteger(normalized) && normalized >= 1 && normalized <= 20 ? normalized : null
}

export async function searchViatorSandboxProducts(
  input: ViatorSandboxSearchInput,
  dependencies: ViatorSandboxSearchDependencies = {},
): Promise<ViatorSandboxSearchResult> {
  const destinationId = normalizeDestinationId(input.destinationId)
  const count = normalizeCount(input.count)

  if (!destinationId || !count) return { ok: false, reason: 'invalid_request' }

  const apiKey = dependencies.apiKey ?? process.env.VIATOR_SANDBOX_API_KEY
  if (!apiKey?.trim()) return { ok: false, reason: 'not_configured' }

  const fetchFn = dependencies.fetchFn ?? fetch
  let response: Response

  try {
    response = await fetchFn(VIATOR_SANDBOX_PRODUCT_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Accept': VIATOR_ACCEPT_HEADER,
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': apiKey,
      },
      body: JSON.stringify({
        filtering: { destination: destinationId },
        pagination: { start: 1, count },
      }),
    })
  } catch {
    return { ok: false, reason: 'upstream_error' }
  }

  if (!response.ok) return { ok: false, reason: 'upstream_error', status: response.status }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: 'upstream_error', status: response.status }
  }

  const products = Array.isArray(asRecord(body)?.products)
    ? asRecord(body)?.products as unknown[]
    : []

  return { ok: true, products: products.map(toSafeProduct).filter((product): product is ViatorSafeProduct => product !== null) }
}
