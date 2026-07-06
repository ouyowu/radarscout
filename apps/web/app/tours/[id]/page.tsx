import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '@/app/_components/AdventureHero'
import { DmcTrustBar } from '@/app/_components/DmcTrustBar'
import { EditorialBanner } from '@/app/_components/EditorialBanner'
import { FAQAccordion } from '@/app/_components/FAQAccordion'
import {
  getPublicThailandProduct,
  loadPublicThailandProductDetail,
} from '@/lib/publicProducts/getPublicThailandProduct'

export const dynamic = 'force-dynamic'

const siteBase = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type TourDetailPageProps = {
  params: {
    id: string
  }
  searchParams?: {
    source?: string
  }
}

type ProductFacts = {
  duration?: string | null
  meetingPoint?: string | null
  pickupAvailable?: boolean | null
  cancellationPolicy?: string | null
}

type ReviewedEnrichment = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
}

type BookingPartnerHandoff = {
  href: string
  label: 'Check availability'
  rel: 'nofollow sponsored noopener noreferrer'
  source:
    | 'owner_managed_profile'
    | 'operator_verified_public_link'
    | 'booking_partner_verified_public_widget'
  verifiedBy: 'operator_manual_review' | 'owner_managed_catalog'
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
  reviewedEnrichment?: ReviewedEnrichment | null
  bookingPartnerHandoff?: BookingPartnerHandoff
}

type ProductDetailResult =
  | { status: 'found'; product: ProductDetail }
  | { status: 'not-found' }
  | { status: 'error' }

const GENERIC_TOUR_METADATA = {
  title: 'Thailand Tour Detail | RadarScout',
  description:
    'Explore curated Thailand travel experiences from trusted local operators, with a secure booking handoff.',
} as const

const BLOCKED_METADATA = {
  ...GENERIC_TOUR_METADATA,
  robots: { index: false, follow: false },
} as const

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const id = params.id.trim()

  const product = await getPublicThailandProduct(id)

  if (!product) {
    return BLOCKED_METADATA
  }

  const canonical = `${siteBase}/tours/${encodeURIComponent(id)}`
  const title = product.reviewedEnrichment?.cleanedTitle ?? product.title
  const description =
    product.reviewedEnrichment?.shortSummary ??
    product.summary ??
    GENERIC_TOUR_METADATA.description

  return {
    title: `${title} | RadarScout Thailand Tours`,
    description,
    alternates: { canonical },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
    },
  }
}

async function fetchProductDetail(id: string): Promise<ProductDetailResult> {
  return loadPublicThailandProductDetail(id)
}

function productLocation(product: ProductDetail) {
  return product.city ?? product.location ?? product.destination ?? 'Thailand'
}

function productPrice(product: ProductDetail) {
  if (!product.retailPrice) return 'Price not listed'

  return product.currency ? `${product.currency} ${product.retailPrice}` : product.retailPrice
}

function factRows(facts?: ProductFacts | null) {
  if (!facts) return []

  return [
    facts.duration ? { label: 'Duration', value: facts.duration } : null,
    facts.meetingPoint ? { label: 'Meeting point', value: facts.meetingPoint } : null,
    typeof facts.pickupAvailable === 'boolean'
      ? { label: 'Pickup', value: facts.pickupAvailable ? 'Pickup details are provided in the product record' : 'Pickup is not listed in the product record' }
      : null,
    facts.cancellationPolicy ? { label: 'Cancellation policy', value: facts.cancellationPolicy } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))
}

function displayTitle(product: ProductDetail): string {
  return product.reviewedEnrichment?.cleanedTitle ?? product.title
}

function displaySummary(product: ProductDetail): string {
  return (
    product.reviewedEnrichment?.shortSummary ??
    product.summary ??
    'A RadarScout product detail page for Thailand experiences from trusted local partners.'
  )
}

const trustItems = [
  { label: 'Page status', value: 'Experience detail' },
  { label: 'Destination focus', value: 'Thailand first' },
  { label: 'Product source', value: 'Trusted partner record' },
  { label: 'Next step', value: 'Booking partner handoff' },
]

const faqItems = [
  {
    question: 'Can I compare this experience here?',
    answer:
      'Yes. This page helps travelers compare experience details before they continue with a booking partner.',
  },
  {
    question: 'Where does this product information come from?',
    answer:
      'Product details are read from a trusted partner product record. Missing fields are left blank or shown as not listed instead of being invented.',
  },
  {
    question: 'Why do some fields say details are not available yet?',
    answer:
      'RadarScout only displays fields that exist in the product record. Details such as duration, pickup, or cancellation policy are not fabricated when product details are missing.',
  },
  {
    question: 'Which destination is supported first?',
    answer:
      'Thailand is currently RadarScout’s first supported destination. Other destinations remain planning-only while trusted product records are prepared.',
  },
]

function UnavailableState({
  status,
  isFromAiTripPlanner,
}: {
  status: 'not-found' | 'error'
  isFromAiTripPlanner: boolean
}) {
  const title = status === 'not-found'
    ? 'This product detail is not available.'
    : 'Product details are temporarily unavailable.'
  const body = status === 'not-found'
    ? 'This product may no longer be active, may not belong to the supported Thailand experience set, or may not have a trusted partner record available for display.'
    : 'RadarScout could not load this product detail right now. No fallback product has been invented.'

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-border-light)] bg-white p-8 text-center shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
            Experience detail
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
            {isFromAiTripPlanner ? (
              <Link
                href="/ai-trip-planner#ai-trip-results"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#d8eadf] bg-[#f5fbf7] px-6 text-sm font-black uppercase tracking-[0.1em] text-[#0f766e]"
              >
                Back to AI Trip Planner
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function TourDetailPage({ params, searchParams }: TourDetailPageProps) {
  const result = await fetchProductDetail(params.id)
  const isFromAiTripPlanner = searchParams?.source === 'ai-trip-planner'

  if (result.status !== 'found') {
    return <UnavailableState status={result.status} isFromAiTripPlanner={isFromAiTripPlanner} />
  }

  const { product } = result
  const rows = factRows(product.facts)

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="bg-[var(--color-bg-primary)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/tours"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border-light)] bg-white px-5 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
          >
            Back to tours
          </Link>
          {isFromAiTripPlanner ? (
            <Link
              href="/ai-trip-planner#ai-trip-results"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[#d8eadf] bg-[#f5fbf7] px-5 text-sm font-black uppercase tracking-[0.1em] text-[#0f766e] transition hover:text-[#0b5f59]"
            >
              Back to AI Trip Planner results
            </Link>
          ) : null}
        </div>
        {isFromAiTripPlanner ? (
          <div className="mx-auto mt-4 max-w-7xl rounded-2xl border border-[#d8eadf] bg-[#f5fbf7] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
              AI Trip Planner context
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
              You opened this product from RadarScout&apos;s AI Trip Planner. Review this product detail, then return to compare the other planner matches.
            </p>
          </div>
        ) : null}
      </section>

      <AdventureHero
        eyebrow={product.reviewedEnrichment ? 'Curated experience' : 'Trusted local experience'}
        title={displayTitle(product)}
        subtitle={displaySummary(product)}
        actions={[
          { label: 'Back to tours', href: '/tours' },
          { label: 'Plan Thailand trip', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="RadarScout helps you compare experience details before you continue with a booking partner."
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
                {displayTitle(product)}
              </h1>
              {product.reviewedEnrichment?.suggestedTags && product.reviewedEnrichment.suggestedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.reviewedEnrichment.suggestedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-[var(--color-accent-orange-pale)] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[var(--color-accent-orange-dark)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
                {product.description ?? product.summary ?? 'Product description is not available yet. RadarScout does not create placeholder descriptions for real partner records.'}
              </p>
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                Price detail
              </p>
              <p className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-none tracking-[-0.035em]">
                {productPrice(product)}
              </p>
              <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                Prices are shown only when provided in the product record. No estimated or invented price is displayed.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                Planning boundary
              </p>
              <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                RadarScout helps travelers compare details before they continue with a booking partner. Current details should be reviewed on the partner page.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[var(--color-bg-dark)] p-6 text-white shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
                Handoff boundary
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                Compare details before continuing.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
                Use the booking partner page to review current details. This page does not create a traveler request or order.
              </p>
              {product.bookingPartnerHandoff ? (
                <a
                  href={product.bookingPartnerHandoff.href}
                  target="_blank"
                  rel={product.bookingPartnerHandoff.rel}
                  className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[var(--color-accent-orange-dark)]"
                >
                  {product.bookingPartnerHandoff.label}
                </a>
              ) : null}
              {product.bookingPartnerHandoff ? (
                <p className="mt-3 text-xs font-bold leading-6 text-white/65">
                  Continue with a booking partner to review current details.
                </p>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
                    Planning-only detail
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
                    RadarScout can help you compare this experience, but a verified booking partner handoff is not available yet.
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/75">
                    Use this page for planning and compare other experiences with verified handoff options.
                  </p>
                </div>
              )}
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
                Displayed only when present in the product record.
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
        label="Experience detail"
        title="Plan around trusted product details before choosing a next step."
        body="This detail page is connected to a real product record. Travelers can continue planning through RadarScout and review current details on the booking partner page."
        href="/tours"
        ctaLabel="Back to tours"
      />

      <FAQAccordion items={faqItems} title="Tour detail FAQ" />
    </main>
  )
}
