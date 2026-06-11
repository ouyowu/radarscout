import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { AdventureHero } from '@/app/_components/AdventureHero'
import { DmcTrustBar } from '@/app/_components/DmcTrustBar'
import { EditorialBanner } from '@/app/_components/EditorialBanner'
import { FAQAccordion } from '@/app/_components/FAQAccordion'
import { PartnerInventoryNotice } from '@/app/_components/PartnerInventoryNotice'

export const dynamic = 'force-dynamic'

const siteBase = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type TourDetailPageProps = {
  params: {
    id: string
  }
}

type ProductFacts = {
  duration?: string | null
  meetingPoint?: string | null
  pickupAvailable?: boolean | null
  cancellationPolicy?: string | null
}

type ProductDetail = {
  id: string
  title: string
  summary?: string | null
  description?: string | null
  destination?: string | null
  city?: string | null
  location?: string | null
  imageUrl?: string | null
  retailPrice?: string | null
  currency?: string | null
  detailHref: string
  facts?: ProductFacts | null
}

type ProductDetailResponse = {
  product: ProductDetail | null
  meta?: {
    source: 'signed-bokun-supplier-products'
    inventoryScope: 'thailand-first'
    bookingEnabled: false
    availabilityEnabled: false
    detailSupported: true
  }
  error?: string
}

type ProductDetailResult =
  | { status: 'found'; product: ProductDetail }
  | { status: 'not-found' }
  | { status: 'error' }

export function generateMetadata({ params }: TourDetailPageProps): Metadata {
  return {
    title: 'Thailand Tour Detail Preview | RadarScout',
    description:
      'A display-only RadarScout product detail page for curated Thailand supplier experiences powered by signed Bókun supplier partners.',
    alternates: { canonical: `${siteBase}/tours/${encodeURIComponent(params.id)}` },
  }
}

function getRequestOrigin() {
  const headerStore = headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const proto = headerStore.get('x-forwarded-proto') ?? 'http'

  if (host) return `${proto}://${host}`

  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

async function fetchProductDetail(id: string): Promise<ProductDetailResult> {
  try {
    const response = await fetch(`${getRequestOrigin()}/api/products/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    })
    const payload = await response.json() as ProductDetailResponse

    if (response.status === 404 || !payload.product) {
      return { status: 'not-found' }
    }

    if (!response.ok) {
      return { status: 'error' }
    }

    return { status: 'found', product: payload.product }
  } catch {
    return { status: 'error' }
  }
}

function productLocation(product: ProductDetail) {
  return product.city ?? product.location ?? product.destination ?? 'Thailand'
}

function productPrice(product: ProductDetail) {
  if (!product.retailPrice) return 'Contact for partner rate'

  return product.currency ? `${product.currency} ${product.retailPrice}` : product.retailPrice
}

function factRows(facts?: ProductFacts | null) {
  if (!facts) return []

  return [
    facts.duration ? { label: 'Duration', value: facts.duration } : null,
    facts.meetingPoint ? { label: 'Meeting point', value: facts.meetingPoint } : null,
    typeof facts.pickupAvailable === 'boolean'
      ? { label: 'Pickup', value: facts.pickupAvailable ? 'Pickup information provided by partner data' : 'Pickup not listed in partner data' }
      : null,
    facts.cancellationPolicy ? { label: 'Cancellation policy', value: facts.cancellationPolicy } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))
}

const trustItems = [
  { label: 'Page status', value: 'Display-only detail' },
  { label: 'Live destination', value: 'Thailand first' },
  { label: 'Supplier source', value: 'Signed Bókun partners' },
  { label: 'Purchase flow', value: 'Not enabled here' },
]

const faqItems = [
  {
    question: 'Can I reserve this experience here?',
    answer:
      'No. This page is display-only. Booking and payment are not enabled, and availability is not checked on this preview page.',
  },
  {
    question: 'Where does this product information come from?',
    answer:
      'Product details are read from RadarScout’s signed Bókun supplier partner product database. Missing fields are left blank or shown as partner-rate placeholders instead of being invented.',
  },
  {
    question: 'Why do some fields say partner data is not available yet?',
    answer:
      'RadarScout only displays fields that exist in the partner product record. Details such as duration, pickup, or cancellation policy are not fabricated when supplier data is missing.',
  },
  {
    question: 'Which destination has live inventory first?',
    answer:
      'Thailand is currently RadarScout’s first live inventory destination. Other destinations remain planning-only or partner tours coming soon.',
  },
]

function UnavailableState({ status }: { status: 'not-found' | 'error' }) {
  const title = status === 'not-found'
    ? 'This product preview is not available.'
    : 'Product details are temporarily unavailable.'
  const body = status === 'not-found'
    ? 'This product may no longer be active, may not belong to Thailand live inventory, or may not have a signed supplier partner record available for display.'
    : 'RadarScout could not load this product detail preview right now. No fallback product has been invented.'

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-border-light)] bg-white p-8 text-center shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
            Display-only product detail
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
            {body}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/tours"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-sm font-black uppercase tracking-[0.1em] text-white"
            >
              Back to tours
            </Link>
            <Link
              href="/destinations/thailand"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]"
            >
              Thailand destination
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const result = await fetchProductDetail(params.id)

  if (result.status !== 'found') {
    return <UnavailableState status={result.status} />
  }

  const { product } = result
  const rows = factRows(product.facts)

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="bg-[var(--color-bg-primary)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/tours"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border-light)] bg-white px-5 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
          >
            Back to tours
          </Link>
        </div>
      </section>

      <AdventureHero
        eyebrow="Signed Bókun supplier product"
        title={product.title}
        subtitle={product.summary ?? 'A display-only RadarScout product detail page for Thailand live inventory from signed Bókun supplier partners.'}
        actions={[
          { label: 'Back to tours', href: '/tours' },
          { label: 'Plan Thailand trip', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="This product detail page is display-only. Booking and payment are not enabled, and availability is not checked on this preview page."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <article className="overflow-hidden rounded-[2rem] border border-[var(--color-border-light)] bg-white shadow-lg">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt=""
                className="h-72 w-full object-cover sm:h-96"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-[var(--color-accent-orange-pale)] px-8 text-center sm:h-96">
                <p className="font-[var(--font-heading)] text-4xl font-black uppercase tracking-[-0.035em] text-[var(--color-accent-orange-dark)]">
                  Partner image coming soon
                </p>
              </div>
            )}
            <div className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                {productLocation(product)}
              </p>
              <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                {product.title}
              </h1>
              <p className="mt-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
                {product.description ?? product.summary ?? 'Partner description is not available yet. RadarScout does not create placeholder descriptions for real supplier products.'}
              </p>
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                Partner rate
              </p>
              <p className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-none tracking-[-0.035em]">
                {productPrice(product)}
              </p>
              <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                Prices are shown only when provided by the signed supplier product record. No estimated or invented price is displayed.
              </p>
            </div>

            <PartnerInventoryNotice status="live" currentDestination="Thailand" />

            <div className="rounded-[2rem] bg-[var(--color-bg-dark)] p-6 text-white shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
                Transaction boundary
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                Booking and payment are not enabled.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
                Availability is not checked on this preview page. This page does not create a reservation, payment, inquiry, or Bókun order.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-ai-feature)]">
                Product facts
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                Displayed only when present in partner data.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              RadarScout does not add ratings, reviews, supplier names, itineraries, meeting points, or policies unless they come from safe product fields prepared for display.
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {rows.map(row => (
                <article key={row.label} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                    {row.label}
                  </p>
                  <p className="mt-3 text-sm font-bold leading-7 text-[var(--color-text-secondary)]">
                    {row.value}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
                Additional facts are not available in the display-safe product data yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <EditorialBanner
        label="Display-only detail"
        title="Plan around verified partner product data without starting a transaction."
        body="This detail page is connected to real product data, but purchase flow remains disabled. Travelers can continue planning through RadarScout while direct booking remains in a later dedicated phase."
        href="/tours"
        ctaLabel="Back to tours"
      />

      <FAQAccordion items={faqItems} title="Tour detail FAQ" />
    </main>
  )
}
