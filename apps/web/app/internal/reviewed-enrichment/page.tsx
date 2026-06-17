import 'server-only'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { EditForm } from './EditForm'

export const metadata: Metadata = {
  title: 'Enrichment Console | Internal',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: { productId?: string; saved?: string }
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

export default async function InternalEnrichmentConsolePage({ searchParams }: PageProps) {
  const isConfigured = Boolean(process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET)
  const productId = searchParams.productId?.trim() ?? ''
  const justSaved = searchParams.saved === '1'

  let result: InspectResult | null = null

  if (isConfigured && productId) {
    result = await fetchInspect(productId)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900">
      <div className="mx-auto max-w-2xl space-y-5">
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
            <LookupForm defaultValue={productId || undefined} />

            {result && !result.ok && result.error === 'product_not_found' && productId && (
              <ProductNotFound productId={productId} />
            )}

            {result && !result.ok && result.error !== 'product_not_found' && (
              <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Error: {result.error}
              </div>
            )}

            {result && result.ok && (
              <div className="space-y-4">
                {justSaved && (
                  <div className="rounded border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
                    Enrichment saved.
                  </div>
                )}

                <ProductPanel product={result.product} />

                {result.reviewedEnrichment ? (
                  <EnrichmentPanel enrichment={result.reviewedEnrichment} />
                ) : (
                  <div className="rounded border border-gray-200 bg-white p-4 text-sm text-gray-500">
                    No reviewed enrichment yet for this product.
                  </div>
                )}

                <EditForm
                  productId={result.product.id}
                  enrichment={result.reviewedEnrichment}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
