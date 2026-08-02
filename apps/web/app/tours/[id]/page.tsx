import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '@/app/_components/AdventureHero'
import { DmcTrustBar } from '@/app/_components/DmcTrustBar'
import { EditorialBanner } from '@/app/_components/EditorialBanner'
import { FAQAccordion } from '@/app/_components/FAQAccordion'
import { PublicSiteShell } from '@/app/_components/PublicSiteShell'
import { Button, Card, DecisionGuide, Section } from '@/app/_components/design-system'
import { TrackedBookingPartnerHandoff } from './TrackedBookingPartnerHandoff'
import {
  getPublicThailandProduct,
  loadPublicThailandProductDetail,
} from '@/lib/publicProducts/getPublicThailandProduct'
import { getTourDetailRobots } from '@/lib/publicProducts/tourDetailSeoCandidates'
import { parseSafeAffiliateAnalyticsContext } from '@/lib/affiliates/affiliateTripContext'
import { getAiReadyProductById } from '@/lib/aiProducts/aiReadyProductSchema'
import { AiAnswerCard } from './AiAnswerCard'

export const dynamic = 'force-dynamic'

const siteBase = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type TourDetailPageProps = {
  params: {
    id: string
  }
  searchParams?: {
    source?: string
    hasDates?: string
    hasGroupSize?: string
    hasOccupancy?: string
    travelerType?: string
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
  imageGalleryUrls?: string[]
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
    robots: getTourDetailRobots(product.id),
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

function displayBestFor(product: ProductDetail, location: string): string[] {
  const tags = product.reviewedEnrichment?.suggestedTags ?? []
  return tags.length > 0
    ? tags
    : [`Travelers comparing a reviewed experience in ${location}`]
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
    <PublicSiteShell>
      <main className="min-h-[70vh] bg-rs-sand-50 text-rs-ink">
        <Section variant="sand" className="min-h-[70vh]">
          <Card className="mx-auto max-w-3xl p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-terracotta">
            Experience detail
          </p>
          <h1 className="mt-4 font-rs-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-5 text-base leading-8 text-rs-muted">
            {body}
          </p>
          {isFromAiTripPlanner ? (
            <p className="mt-4 text-sm leading-6 text-rs-muted">
              Return to the Trip Planner results to compare the other matches. No partner action or current status is recorded from this unavailable detail page.
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/tours" className="min-h-[44px] px-6 text-xs">
              Back to tours
            </Button>
            <Button
              href="/destinations/thailand"
              variant="secondary"
              className="min-h-[44px] px-6 text-xs"
            >
              Thailand destination
            </Button>
            {isFromAiTripPlanner ? (
              <Button
                href="/ai-trip-planner#ai-trip-results"
                variant="secondary"
                className="min-h-[44px] px-6 text-xs"
              >
                Back to Trip Planner results
              </Button>
            ) : null}
          </div>
          </Card>
        </Section>
      </main>
    </PublicSiteShell>
  )
}

export default async function TourDetailPage({ params, searchParams }: TourDetailPageProps) {
  const result = await fetchProductDetail(params.id)
  const isFromAiTripPlanner = searchParams?.source === 'ai-trip-planner'
  const safeTripContext = parseSafeAffiliateAnalyticsContext(searchParams, isFromAiTripPlanner)
  const confirmedContextLabels = [
    safeTripContext.hasDates ? 'dates' : null,
    safeTripContext.hasGroupSize ? 'party size' : null,
    safeTripContext.hasOccupancy ? 'adult and child mix' : null,
    safeTripContext.travelerType !== 'unspecified'
      ? `${safeTripContext.travelerType} trip`
      : null,
  ].filter((label): label is string => label !== null)

  if (result.status !== 'found') {
    return <UnavailableState status={result.status} isFromAiTripPlanner={isFromAiTripPlanner} />
  }

  const { product } = result
  const rows = factRows(product.facts)
  const location = productLocation(product)
  const aiAnswerCard = getAiReadyProductById(product.id)

  return (
    <PublicSiteShell>
      <main className={`min-h-screen bg-rs-sand-50 text-rs-ink ${product.bookingPartnerHandoff ? 'pb-20 md:pb-0' : ''}`}>
      <section className="bg-rs-sand-50 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/tours"
            className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-sage-200/80 bg-white px-5 text-sm font-semibold uppercase tracking-[0.12em] text-rs-muted transition hover:border-rs-terracotta hover:text-rs-forest-700"
          >
            Back to tours
          </Link>
          {isFromAiTripPlanner ? (
            <Link
              href="/ai-trip-planner#ai-trip-results"
              className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-sage-200 bg-white px-5 text-sm font-semibold uppercase tracking-[0.12em] text-rs-forest-700 transition hover:border-rs-terracotta"
            >
              Back to Trip Planner results
            </Link>
          ) : null}
        </div>
        {isFromAiTripPlanner ? (
          <div className="mx-auto mt-4 max-w-7xl rounded-rs-md border border-rs-sage-200/80 bg-white p-4 shadow-rs-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-forest-700">
              Trip Planner context
            </p>
            <p className="mt-2 text-sm leading-6 text-rs-muted">
              You opened this product from RadarScout&apos;s Trip Planner. Review this product detail, then return to compare the other planner matches.
            </p>
            <p className="mt-2 text-sm leading-6 text-rs-muted">
              The return link takes you back to the same Trip Planner results section. No partner action or current status is recorded on this page.
            </p>
            {confirmedContextLabels.length > 0 ? (
              <p className="mt-2 text-sm font-semibold leading-6 text-rs-forest-700">
                Confirmed in RadarScout: {confirmedContextLabels.join(' · ')}.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <AdventureHero
        eyebrow={product.reviewedEnrichment ? 'Curated experience' : 'Trusted local experience'}
        title={displayTitle(product)}
        subtitle={displaySummary(product)}
        imageUrl={product.imageUrl ?? undefined}
        imageAlt={product.imageUrl ? displayTitle(product) : undefined}
        actions={[
          { label: 'Back to tours', href: '/tours' },
          { label: 'Plan Thailand trip', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="RadarScout helps you compare experience details before you continue with a booking partner."
      />

      <DmcTrustBar items={trustItems} />

      <Section variant="cloud" className="py-8 sm:py-10" contentClassName="max-w-[1240px]">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta-600">
            Decision guide
          </p>
          <h2 className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">
            Decide whether this experience fits your day.
          </h2>
        </div>
        {aiAnswerCard ? (
          <AiAnswerCard card={aiAnswerCard} />
        ) : (
          <DecisionGuide
            whyRecommended={displaySummary(product)}
            bestFor={displayBestFor(product, location)}
            watchOut="Review meeting details, timing, inclusions, and current terms on the booking partner page."
          />
        )}
      </Section>

      <Section variant="sand" className="pt-8" contentClassName="max-w-[1240px]">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
          <Card className="overflow-hidden">
            <article>
            {product.imageGalleryUrls && product.imageGalleryUrls.length > 1 ? (
              <div className="grid grid-cols-3 gap-2 border-b border-rs-sage-200/70 bg-white p-3 sm:grid-cols-4">
                {product.imageGalleryUrls.slice(1, 5).map((imageUrl, index) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={`${displayTitle(product)} photo ${index + 2}`}
                    loading="lazy"
                    className="h-24 w-full rounded-rs-sm object-cover sm:h-28"
                  />
                ))}
              </div>
            ) : null}
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-forest-500">
                {location}
              </p>
              <h2 className="mt-3 font-rs-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.035em] text-rs-ink">
                Experience overview
              </h2>
              {product.reviewedEnrichment?.suggestedTags && product.reviewedEnrichment.suggestedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.reviewedEnrichment.suggestedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-5 text-base leading-8 text-rs-muted">
                {product.description ?? product.summary ?? 'Product description is not available yet. RadarScout does not create placeholder descriptions for real partner records.'}
              </p>
            </div>
            </article>
          </Card>

          <aside className="grid gap-5 lg:sticky lg:top-5">
            <div className="rounded-rs-lg bg-rs-forest-900 p-6 text-white shadow-rs-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-sage-200">
                Handoff boundary
              </p>
              <h2 className="mt-3 font-rs-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.035em]">
                Compare details before continuing.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Use the booking partner page to review current details. This page does not create a traveler request or order.
              </p>
              {product.bookingPartnerHandoff ? (
                <TrackedBookingPartnerHandoff
                  href={product.bookingPartnerHandoff.href}
                  rel={product.bookingPartnerHandoff.rel}
                  productId={product.id}
                  source={isFromAiTripPlanner ? 'ai-trip-planner' : 'tour-detail'}
                  placement="tour_detail_primary"
                  city={location}
                  {...safeTripContext}
                  className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
                >
                  {product.bookingPartnerHandoff.label}
                </TrackedBookingPartnerHandoff>
              ) : null}
              {product.bookingPartnerHandoff ? (
                <p className="mt-3 text-xs font-semibold leading-6 text-white/65">
                  Continue with a booking partner to review current details. The partner may ask you to confirm dates and traveler details because this affiliate link does not prefill its booking form.
                </p>
              ) : (
                <div className="mt-6 rounded-rs-md border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-sage-200">
                    Planning-only detail
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    RadarScout can help you compare this experience, but a verified booking partner handoff is not available yet.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    Use this page for planning and compare other experiences with verified handoff options.
                  </p>
                </div>
              )}
            </div>

            <Card className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-terracotta">
                Planning boundary
              </p>
              <p className="mt-4 text-sm leading-7 text-rs-muted">
                RadarScout helps travelers compare details before they continue with a booking partner. Current details should be reviewed on the partner page.
              </p>
            </Card>
          </aside>
        </div>
      </Section>

      <Section variant="cloud" contentClassName="max-w-[1240px]">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-forest-500">
                Product facts
              </p>
              <h2 className="mt-3 font-rs-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-rs-ink">
                Displayed only when present in the product record.
              </h2>
            </div>
            <p className="text-base leading-8 text-rs-muted">
              RadarScout does not add ratings, reviews, supplier names, itineraries, meeting points, or policies unless they come from safe product fields prepared for display.
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {rows.map(row => (
                <Card key={row.label} className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta">
                    {row.label}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-rs-muted">
                    {row.value}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mt-8 p-6">
              <p className="text-base leading-8 text-rs-muted">
                Additional facts are not available in the display-safe product data yet.
              </p>
            </Card>
          )}
      </Section>

      <EditorialBanner
        label="Experience detail"
        title="Plan around trusted product details before choosing a next step."
        body="This detail page is connected to a real product record. Travelers can continue planning through RadarScout and review current details on the booking partner page."
        href="/tours"
        ctaLabel="Back to tours"
      />

      <FAQAccordion items={faqItems} title="Tour detail FAQ" />
      </main>
      {product.bookingPartnerHandoff ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-light)] bg-white/95 p-3 shadow-[0_-10px_30px_rgba(45,52,54,0.10)] backdrop-blur md:hidden">
          <TrackedBookingPartnerHandoff
            href={product.bookingPartnerHandoff.href}
            rel={product.bookingPartnerHandoff.rel}
            productId={product.id}
            source={isFromAiTripPlanner ? 'ai-trip-planner' : 'tour-detail'}
            placement="tour_detail_sticky"
            city={location}
            {...safeTripContext}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold text-rs-ink"
          >
            {product.bookingPartnerHandoff.label}
          </TrackedBookingPartnerHandoff>
        </div>
      ) : null}
    </PublicSiteShell>
  )
}
