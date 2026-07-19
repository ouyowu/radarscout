import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { Card, ExperienceCard, Section } from '../_components/design-system'
import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
  paginateReviewedViatorPublicCatalogue,
  type ReviewedViatorPublicProduct,
} from '@/lib/viator/reviewedViatorPublicCatalogue'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Thailand Experience Discovery | RadarScout',
  description:
    'Browse reviewed Thailand day trips and local experiences, then inspect product details before continuing with a booking partner.',
  alternates: { canonical: `${base}/tours` },
  robots: { index: false, follow: false },
}

const categories = [
  {
    title: 'Elephant and nature days',
    description: 'Reviewed elephant care, forest, and nature-led experiences for a Thailand day trip.',
    label: 'Nature',
  },
  {
    title: 'Food and culture',
    description: 'Cooking, markets, temples, workshops, and local cultural experiences.',
    label: 'Local depth',
  },
  {
    title: 'Island and outdoor trips',
    description: 'Coastal days, viewpoints, trekking, and active experiences as reviewed coverage expands.',
    label: 'Outdoor',
  },
] as const

type ToursPageProps = {
  searchParams?: {
    city?: string
    hasImage?: string
    page?: string
  }
}

type FilterState = {
  city: string | null
  hasImage: 'true' | 'false' | null
}

const faqItems = [
  {
    question: 'Which experiences appear here?',
    answer:
      'RadarScout shows Thailand experience records that have been prepared for public comparison. Missing facts are left out rather than invented.',
  },
  {
    question: 'Can I complete a booking on RadarScout?',
    answer:
      'No. Review the experience detail on RadarScout, then use a verified Check availability link when a booking partner handoff is available.',
  },
  {
    question: 'Why are some cities not shown yet?',
    answer:
      'Coverage expands city by city after product content, images, and handoff paths have been reviewed.',
  },
]

const PAGE_SIZE = 12
const cityOptions = listReviewedViatorPublicCatalogueCities()

function normalizeFilterValue(value: string | undefined, allowedValues: string[]): string | null {
  if (!value) return null
  return allowedValues.includes(value) ? value : null
}

function readFilters(searchParams?: ToursPageProps['searchParams']): FilterState {
  return {
    city: normalizeFilterValue(searchParams?.city, cityOptions.map(option => option.slug)),
    hasImage: normalizeFilterValue(searchParams?.hasImage, ['true', 'false']) as FilterState['hasImage'],
  }
}

function readPage(value: string | undefined): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 1
  return Math.max(1, Math.floor(parsed))
}

function buildToursHref(nextFilters: Partial<FilterState>, page = 1) {
  const params = new URLSearchParams()
  const city = nextFilters.city ?? null
  const hasImage = nextFilters.hasImage ?? null

  if (city) params.set('city', city)
  if (hasImage) params.set('hasImage', hasImage)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `/tours?${query}` : '/tours'
}

function cityLabel(city: string | null) {
  return cityOptions.find(option => option.slug === city)?.label ?? null
}

function imageLabel(hasImage: FilterState['hasImage']) {
  if (hasImage === 'true') return 'With photo'
  if (hasImage === 'false') return 'Photo pending'
  return null
}

function resultCountLabel(count: number) {
  if (count === 0) return 'No reviewed experiences'
  if (count === 1) return '1 reviewed experience'
  return `${count} reviewed experiences`
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'inline-flex min-h-[44px] items-center rounded-rs-pill border px-4 text-xs font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-terracotta',
        active
          ? 'border-rs-forest-700 bg-rs-forest-700 text-white'
          : 'border-rs-sage-200/80 bg-white text-rs-muted hover:border-rs-terracotta hover:text-rs-forest-700',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-rs-muted">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

function ProductCard({ product }: { product: ReviewedViatorPublicProduct }) {
  return (
    <ExperienceCard
      href={product.detailHref}
      eyebrow={product.destination}
      title={product.title}
      summary={product.summary}
      tags={product.tags.slice(0, 3)}
      imageUrl={product.imageUrl}
      imageAlt={product.title}
      whyRecommended={product.summary}
      bestFor={product.tags.slice(0, 3)}
      watchOut="Review meeting details, timing, inclusions, and current terms on the booking partner page."
      className="group h-full transition duration-200 hover:-translate-y-1"
    />
  )
}

export default async function ToursExperienceDiscoveryPage({ searchParams }: ToursPageProps) {
  const filters = readFilters(searchParams)
  const requestedPage = readPage(searchParams?.page)
  let catalogueError = false
  let catalogueProducts: ReviewedViatorPublicProduct[] = []

  try {
    catalogueProducts = loadReviewedViatorPublicCatalogue({
      city: filters.city,
      hasImage: filters.hasImage === null ? null : filters.hasImage === 'true',
    })
  } catch {
    catalogueError = true
  }

  const cataloguePage = paginateReviewedViatorPublicCatalogue(
    catalogueProducts,
    requestedPage,
    PAGE_SIZE,
  )
  const products = cataloguePage.items
  const hasActiveFilters = Boolean(filters.city || filters.hasImage)
  const labels = [cityLabel(filters.city), imageLabel(filters.hasImage)].filter(Boolean)
  const filterSummary = labels.length > 0
    ? `Filtered by ${labels.join(' · ')}`
    : 'Showing all reviewed Thailand experiences'

  return (
    <PublicSiteShell>
      <main className="min-h-screen bg-rs-sand-50 text-rs-ink">
        <section className="border-b border-[var(--color-border-light)] bg-[linear-gradient(135deg,#fffaf5_0%,#fff3ee_75%,#feeabf_155%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-500">Thailand day trips</p>
              <h1 className="mt-3 font-rs-display text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                We narrow the list before you browse.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-rs-muted">
                Browse reviewed Viator experience records chosen for useful destination and day-trip fit. Filter by city, inspect why each option made the shortlist, then continue to Viator for current details.
              </p>
            </div>
            <Link href="/planner" className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white">
              Plan my day
            </Link>
          </div>
        </section>

        <Section variant="sand" className="py-10 sm:py-14" contentClassName="max-w-[1240px]">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-rs-md border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-500">Why it made the shortlist</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                Clear city and activity fit, useful day-trip shape, reviewed public content, and a verified affiliate handoff.
              </p>
            </article>
            <article className="rounded-rs-md border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-trust">What value means here</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                RadarScout helps compare the experience and inclusions we can verify, instead of making unsupported popularity or price rankings.
              </p>
            </article>
            <article className="rounded-rs-md border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Check the current details</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                Current price, inclusions, and booking terms stay on Viator so you can review them before continuing.
              </p>
            </article>
          </div>

          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <FilterGroup title="City">
                <FilterChip href={buildToursHref({ ...filters, city: null })} label="All" active={!filters.city} />
                {cityOptions.map(option => (
                  <FilterChip
                    key={option.slug}
                    href={buildToursHref({ ...filters, city: option.slug })}
                    label={option.label}
                    active={filters.city === option.slug}
                  />
                ))}
              </FilterGroup>
              <FilterGroup title="Photo">
                <FilterChip href={buildToursHref({ ...filters, hasImage: null })} label="All" active={!filters.hasImage} />
                <FilterChip href={buildToursHref({ ...filters, hasImage: 'true' })} label="With photo" active={filters.hasImage === 'true'} />
                <FilterChip href={buildToursHref({ ...filters, hasImage: 'false' })} label="Photo pending" active={filters.hasImage === 'false'} />
              </FilterGroup>
              {hasActiveFilters ? (
                <Link href="/tours" className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill border border-rs-forest-500 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700">Clear filters</Link>
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rs-sage-200/60 pt-4">
              <p className="text-sm font-semibold text-rs-forest-700">{filterSummary}</p>
              <p className="text-sm text-rs-muted">{resultCountLabel(cataloguePage.totalItems)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta-600">
                Reviewed catalogue
              </p>
              <h2 className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">
                Reviewed experiences
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-rs-muted">
              Choose a card to inspect the decision guide and product detail.
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          {cataloguePage.totalPages > 1 ? (
            <nav aria-label="Catalogue pagination" className="mt-10 flex items-center justify-center gap-4">
              {cataloguePage.page > 1 ? (
                <Link
                  href={buildToursHref(filters, cataloguePage.page - 1)}
                  aria-label="Previous catalogue page"
                  className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-forest-500 px-5 text-sm font-semibold text-rs-forest-700"
                >
                  Previous
                </Link>
              ) : null}
              <p className="text-sm font-semibold text-rs-muted">
                Page {cataloguePage.page} of {cataloguePage.totalPages}
              </p>
              {cataloguePage.page < cataloguePage.totalPages ? (
                <Link
                  href={buildToursHref(filters, cataloguePage.page + 1)}
                  aria-label="Next catalogue page"
                  className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-forest-500 px-5 text-sm font-semibold text-rs-forest-700"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}

          {products.length === 0 ? (
            <Card className="mt-8 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta">No reviewed matches</p>
              <h2 className="mt-3 font-rs-display text-3xl font-semibold">Try a broader city or photo filter.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-rs-muted">
                {catalogueError
                  ? 'The reviewed product feed could not be loaded. Your filters are preserved; retry or use the planner.'
                  : 'No display-ready experience matches these filters. RadarScout does not create placeholder products.'}
              </p>
            </Card>
          ) : null}
        </Section>

        <ExperienceCategoryGrid
          eyebrow="Explore by interest"
          title="Use an interest as the next prompt for your Thailand day."
          categories={[...categories]}
        />

        <FAQAccordion items={faqItems} title="Thailand experience discovery FAQ" />
      </main>
    </PublicSiteShell>
  )
}
