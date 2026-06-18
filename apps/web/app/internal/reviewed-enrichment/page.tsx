import 'server-only'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { InspectEditor } from './InspectEditor'

export const metadata: Metadata = {
  title: 'Enrichment Console | Internal',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: {
    productId?: string
    saved?: string
    q?: string
    city?: string
    status?: string
  }
}

type ProductRow = {
  id: string
  title: string
  city: string | null
  location: string | null
  retailPrice: string | null
  currency: string | null
}

type ReviewedEnrichment = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string | null
  reviewedAt: string | null
}

type InspectSuccess = {
  ok: true
  product: ProductRow
  reviewedEnrichment: ReviewedEnrichment | null
}

type InspectError = {
  ok: false
  error: string
}

type InspectResult = InspectSuccess | InspectError

type SearchProductRow = {
  id: string
  title: string
  city: string | null
  location: string | null
  retailPrice: string | null
  currency: string | null
  reviewedStatus: 'reviewed' | 'missing'
  cleanedTitle: string | null
  reviewedAt: string | null
}

type SearchSuccess = {
  ok: true
  products: SearchProductRow[]
}

type SearchError = {
  ok: false
  error: string
}

type SearchResult = SearchSuccess | SearchError

type CoverageCity = {
  city: string
  total: number
  reviewed: number
  missing: number
  pct: number
}

type CoverageData = {
  total: number
  reviewed: number
  missing: number
  pct: number
  cities: CoverageCity[]
}

type CoverageResult =
  | { ok: true; coverage: CoverageData }
  | { ok: false; error: string }

type NavigationSuccess = {
  ok: true
  previousMissingProductId: string | null
  nextMissingProductId: string | null
  backHref: string
}

type NavigationResult = NavigationSuccess | { ok: false; error: string }

const THAILAND_CITIES = [
  'Ayutthaya',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Phuket',
]

function getOrigin(): string {
  const headerStore = headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const proto = headerStore.get('x-forwarded-proto') ?? 'http'

  if (host) return `${proto}://${host}`

  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

async function fetchInspect(productId: string): Promise<InspectResult> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET

  if (!secret) {
    return { ok: false, error: 'inspect_not_configured' }
  }

  try {
    const url = `${getOrigin()}/api/internal/product-enrichment/inspect?productId=${encodeURIComponent(productId)}`
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'x-internal-enrichment-review-secret': secret },
    })

    return await response.json() as InspectResult
  } catch {
    return { ok: false, error: 'inspect_unavailable' }
  }
}

async function fetchNavigation(
  productId: string,
  params: { q?: string; city?: string; status?: string },
): Promise<NavigationResult> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return { ok: false, error: 'navigation_not_configured' }

  try {
    const url = new URL(`${getOrigin()}/api/internal/product-enrichment/navigation`)
    url.searchParams.set('productId', productId)
    if (params.q) url.searchParams.set('q', params.q)
    if (params.city) url.searchParams.set('city', params.city)
    if (params.status) url.searchParams.set('status', params.status)

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: { 'x-internal-enrichment-review-secret': secret },
    })

    return await response.json() as NavigationResult
  } catch {
    return { ok: false, error: 'navigation_unavailable' }
  }
}

async function fetchCoverage(): Promise<CoverageResult> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return { ok: false, error: 'coverage_not_configured' }

  try {
    const url = `${getOrigin()}/api/internal/product-enrichment/coverage`
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'x-internal-enrichment-review-secret': secret },
    })
    return await response.json() as CoverageResult
  } catch {
    return { ok: false, error: 'coverage_unavailable' }
  }
}

async function fetchProductSearch(params: {
  q?: string
  city?: string
  status?: string
}): Promise<SearchResult> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET

  if (!secret) {
    return { ok: false, error: 'search_not_configured' }
  }

  try {
    const url = new URL(`${getOrigin()}/api/internal/product-enrichment/search`)
    if (params.q) url.searchParams.set('q', params.q)
    if (params.city) url.searchParams.set('city', params.city)
    if (params.status) url.searchParams.set('status', params.status)

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: { 'x-internal-enrichment-review-secret': secret },
    })

    return await response.json() as SearchResult
  } catch {
    return { ok: false, error: 'search_unavailable' }
  }
}

function NotConfigured() {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <strong>Console not configured.</strong> INTERNAL_ENRICHMENT_REVIEW_SECRET is not set in
      this environment.
    </div>
  )
}

function ProductNotFound({ productId }: { productId: string }) {
  return (
    <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
      No active Thailand product found for ID: <code className="font-mono">{productId}</code>
    </div>
  )
}

function EnrichmentPanel({ enrichment }: { enrichment: ReviewedEnrichment }) {
  const rows: Array<{ label: string; value: string | string[] | null }> = [
    { label: 'Cleaned title', value: enrichment.cleanedTitle },
    { label: 'Short summary', value: enrichment.shortSummary },
    { label: 'Suggested tags', value: enrichment.suggestedTags.length > 0 ? enrichment.suggestedTags : null },
    { label: 'SEO title', value: enrichment.seoTitle },
    { label: 'SEO description', value: enrichment.seoDescription },
    { label: 'Reviewed by', value: enrichment.reviewedBy },
    { label: 'Reviewed at', value: enrichment.reviewedAt },
  ]

  return (
    <div className="overflow-hidden rounded border border-green-200 bg-green-50">
      <div className="border-b border-green-200 bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-800">
        Reviewed enrichment
      </div>
      <div className="divide-y divide-green-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-4 py-2 text-sm">
            <span className="w-36 shrink-0 text-xs font-semibold text-gray-500">{label}</span>
            {Array.isArray(value) ? (
              <div className="flex flex-wrap gap-1">
                {value.map(tag => (
                  <span key={tag} className="rounded-full bg-green-200 px-2 py-0.5 text-xs text-green-900">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className={value ? 'text-gray-900' : 'italic text-gray-400'}>
                {value ?? 'not set'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductPanel({ product }: { product: ProductRow }) {
  const sourceRows = [
    { label: 'Product ID', value: product.id },
    { label: 'Title', value: product.title },
    { label: 'City', value: product.city },
    { label: 'Location', value: product.location },
    {
      label: 'Retail price',
      value: product.retailPrice
        ? `${product.currency ?? ''} ${product.retailPrice}`.trim()
        : null,
    },
  ]

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600">
        Source product data — read-only
      </div>
      <div className="divide-y divide-gray-100">
        {sourceRows.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-4 py-2 text-sm">
            <span className="w-36 shrink-0 text-xs font-semibold text-gray-500">{label}</span>
            <span className={value ? 'font-mono text-xs text-gray-900' : 'italic text-gray-400'}>
              {value ?? 'not set'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoverageDashboard({ coverage }: { coverage: CoverageData }) {
  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600">
        Coverage dashboard
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: coverage.total, color: 'gray' },
            { label: 'Reviewed', value: coverage.reviewed, color: 'green' },
            { label: 'Missing', value: coverage.missing, color: 'yellow' },
            { label: 'Complete', value: `${coverage.pct}%`, color: coverage.pct >= 80 ? 'green' : 'yellow' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`rounded border px-4 py-3 text-center ${
                color === 'green'
                  ? 'border-green-200 bg-green-50'
                  : color === 'yellow'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`text-2xl font-bold ${
                color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : 'text-gray-800'
              }`}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <a
            href="?status=missing"
            className="rounded border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-800 hover:bg-yellow-100"
          >
            View all missing
          </a>
          <a
            href="?status=reviewed"
            className="rounded border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100"
          >
            View all reviewed
          </a>
        </div>

        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500">
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">Reviewed</th>
                <th className="px-3 py-2 text-right">Missing</th>
                <th className="px-3 py-2 text-right">%</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {coverage.cities.map(row => (
                <tr key={row.city} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{row.city}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{row.total}</td>
                  <td className="px-3 py-2 text-right text-green-700">{row.reviewed}</td>
                  <td className="px-3 py-2 text-right text-yellow-700">{row.missing}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={`font-semibold ${row.pct >= 80 ? 'text-green-700' : row.pct > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>
                      {row.pct}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.missing > 0 && (
                      <a
                        href={`?city=${encodeURIComponent(row.city)}&status=missing`}
                        className="text-xs text-gray-500 underline hover:text-gray-800"
                      >
                        View missing
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function LookupForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form method="GET" className="flex gap-2">
      <input
        type="text"
        name="productId"
        defaultValue={defaultValue}
        placeholder="Product ID"
        required
        className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm font-mono focus:border-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700"
      >
        Inspect
      </button>
    </form>
  )
}

function SearchForm({
  q,
  city,
  status,
}: {
  q: string
  city: string
  status: string
}) {
  return (
    <form method="GET" className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Keyword (optional)"
          className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        />
        <select
          name="city"
          defaultValue={city}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="">All cities</option>
          {THAILAND_CITIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status || 'all'}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="missing">Missing</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <button
          type="submit"
          className="rounded bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Search
        </button>
      </div>
    </form>
  )
}

function ProductListRow({
  row,
  searchContext,
}: {
  row: SearchProductRow
  searchContext: { q: string; city: string; status: string }
}) {
  const inspectUrl = (() => {
    const params = new URLSearchParams({ productId: row.id })
    if (searchContext.q) params.set('q', searchContext.q)
    if (searchContext.city) params.set('city', searchContext.city)
    if (searchContext.status) params.set('status', searchContext.status)
    return `/internal/reviewed-enrichment?${params.toString()}`
  })()

  const priceDisplay = row.retailPrice
    ? `${row.currency ?? ''} ${row.retailPrice}`.trim()
    : null

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2 font-mono text-xs text-gray-500">{row.id}</td>
      <td className="px-3 py-2 text-sm text-gray-900">{row.title}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{row.city ?? '—'}</td>
      <td className="px-3 py-2 text-xs text-gray-500">{row.location ?? '—'}</td>
      <td className="px-3 py-2 text-xs text-gray-500">{priceDisplay ?? '—'}</td>
      <td className="px-3 py-2">
        {row.reviewedStatus === 'reviewed' ? (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
            Reviewed
          </span>
        ) : (
          <span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
            Missing
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-xs text-gray-500">
        {row.reviewedStatus === 'reviewed' ? (
          <div>
            {row.cleanedTitle && (
              <div className="font-medium text-gray-700">{row.cleanedTitle}</div>
            )}
            {row.reviewedAt && (
              <div className="text-gray-400">{row.reviewedAt.slice(0, 10)}</div>
            )}
          </div>
        ) : (
          <span className="italic text-gray-400">—</span>
        )}
      </td>
      <td className="px-3 py-2">
        <a
          href={inspectUrl}
          className="rounded bg-gray-800 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700"
        >
          Inspect
        </a>
      </td>
    </tr>
  )
}

function ProductList({
  products,
  searchContext,
}: {
  products: SearchProductRow[]
  searchContext: { q: string; city: string; status: string }
}) {
  if (products.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
        No products found matching the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600">
        Products ({products.length})
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Reviewed data</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(row => (
              <ProductListRow key={row.id} row={row} searchContext={searchContext} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function InternalEnrichmentConsolePage({ searchParams }: PageProps) {
  const isConfigured = Boolean(process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET)
  const productId = searchParams.productId?.trim() ?? ''
  const justSaved = searchParams.saved === '1'
  const q = searchParams.q?.trim() ?? ''
  const city = searchParams.city?.trim() ?? ''
  const status = searchParams.status?.trim() ?? ''

  let inspectResult: InspectResult | null = null
  let searchResult: SearchResult | null = null
  let coverageResult: CoverageResult | null = null
  let navigationResult: NavigationResult | null = null

  if (isConfigured) {
    if (productId) {
      ;[inspectResult, navigationResult] = await Promise.all([
        fetchInspect(productId),
        fetchNavigation(productId, { q, city, status }),
      ])
    }
    ;[searchResult, coverageResult] = await Promise.all([
      fetchProductSearch({ q, city, status: status || 'all' }),
      fetchCoverage(),
    ])
  }

  const searchContext = { q, city, status: status || 'all' }

  return (
    <main className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Internal console</p>
          <h1 className="mt-1 text-xl font-bold">Reviewed enrichment inspector</h1>
          <p className="mt-1 text-sm text-gray-500">
            Read-only. Displays source product data and reviewed enrichment status.
            Does not write data.
          </p>
        </div>

        {!isConfigured ? (
          <NotConfigured />
        ) : (
          <>
            {coverageResult && coverageResult.ok && (
              <CoverageDashboard coverage={coverageResult.coverage} />
            )}

            <SearchForm q={q} city={city} status={status || 'all'} />

            {searchResult && searchResult.ok && (
              <ProductList products={searchResult.products} searchContext={searchContext} />
            )}

            {searchResult && !searchResult.ok && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Search error: {searchResult.error}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Inspect by product ID
              </p>
              <LookupForm defaultValue={productId || undefined} />
            </div>

            {inspectResult && !inspectResult.ok && inspectResult.error === 'product_not_found' && productId && (
              <ProductNotFound productId={productId} />
            )}

            {inspectResult && !inspectResult.ok && inspectResult.error !== 'product_not_found' && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Error: {inspectResult.error}
              </div>
            )}

            {inspectResult && inspectResult.ok && (
              <div className="space-y-4">
                {justSaved && (
                  <div className="rounded border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
                    Enrichment saved.
                  </div>
                )}

                <ProductPanel product={inspectResult.product} />

                {inspectResult.reviewedEnrichment ? (
                  <EnrichmentPanel enrichment={inspectResult.reviewedEnrichment} />
                ) : (
                  <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
                    No reviewed enrichment yet for this product.
                  </div>
                )}

                <InspectEditor
                  productId={inspectResult.product.id}
                  enrichment={inspectResult.reviewedEnrichment}
                  navigation={navigationResult?.ok ? (navigationResult as NavigationSuccess) : null}
                  searchContext={searchContext}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
