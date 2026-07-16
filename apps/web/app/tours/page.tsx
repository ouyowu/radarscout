import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { Card, Section } from '../_components/design-system'
import type { CatalogTheme } from '@/lib/viator/catalogCoverage'
import {
  listReviewedViatorCatalogueProducts,
  paginateReviewedViatorCatalogueProducts,
  reviewedViatorCatalogueCities,
  type ReviewedViatorCatalogueCitySlug,
  type ReviewedViatorCatalogueDuration,
} from '@/lib/viator/reviewedViatorCatalogue'
import { loadReviewedViatorProducts, type ReviewedViatorProduct } from '@/lib/viator/reviewedViatorProducts'

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
    theme?: string
    duration?: string
    page?: string
  }
}

type FilterState = {
  city: ReviewedViatorCatalogueCitySlug | null
  theme: CatalogTheme | null
  duration: ReviewedViatorCatalogueDuration | null
  page: number
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

function normalizeFilterValue<T extends string>(value: string | undefined, allowedValues: readonly T[]): T | null {
  if (!value) return null
  return allowedValues.includes(value as T) ? value as T : null
}

function readFilters(searchParams?: ToursPageProps['searchParams']): FilterState {
  return {
    city: normalizeFilterValue(searchParams?.city, reviewedViatorCatalogueCities.map(city => city.slug)),
    theme: normalizeFilterValue(searchParams?.theme, ['culture', 'food', 'nature', 'adventure']),
    duration: normalizeFilterValue(searchParams?.duration, ['half-day', 'full-day']),
    page: Math.max(1, Number.parseInt(searchParams?.page ?? '1', 10) || 1),
  }
}

function buildToursHref(nextFilters: Partial<FilterState>) {
  const params = new URLSearchParams()
  const city = nextFilters.city ?? null
  const theme = nextFilters.theme ?? null
  const duration = nextFilters.duration ?? null
  const page = nextFilters.page ?? 1

  if (city) params.set('city', city)
  if (theme) params.set('theme', theme)
  if (duration) params.set('duration', duration)
  if (page > 1) params.set('page', String(page))

  const query = params.toString()
  return query ? `/tours?${query}` : '/tours'
}

function cityLabel(city: ReviewedViatorCatalogueCitySlug | null) {
  return reviewedViatorCatalogueCities.find(option => option.slug === city)?.label ?? null
}

function themeLabel(theme: CatalogTheme | null) {
  if (!theme) return null
  return theme[0].toUpperCase() + theme.slice(1)
}

function durationLabel(duration: ReviewedViatorCatalogueDuration | null) {
  if (duration === 'half-day') return 'Half day'
  if (duration === 'full-day') return 'Full day'
  return null
}

function resultCountLabel(count: number) {
  if (count === 0) return 'No experiences shown'
  if (count === 1) return '1 experience shown'
  return `${count} experiences shown`
}

function buildPlannerAudienceHref(audience: 'family' | 'couple' | 'friends', city: ReviewedViatorCatalogueCitySlug | null) {
  const destination = cityLabel(city) ?? 'Thailand'
  const prompt = `${destination} 1 day for ${audience === 'family' ? 'a family' : audience === 'couple' ? 'a couple' : 'friends'}`
  return `/ai-trip-planner?idea=${encodeURIComponent(prompt)}#intent-demo`
}

function buildPlannerDurationHref(days: 1 | 3 | 5, city: ReviewedViatorCatalogueCitySlug | null) {
  const destination = cityLabel(city) ?? 'Thailand'
  return `/ai-trip-planner?idea=${encodeURIComponent(`${destination} ${days} ${days === 1 ? 'day' : 'days'}`)}#intent-demo`
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

function ProductCard({ product }: { product: ReviewedViatorProduct }) {
  return (
    <Card href={`/tours/${encodeURIComponent(product.id)}`} ariaLabel={`View ${product.title}`} className="group h-full transition duration-200 hover:-translate-y-1">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[2/1] overflow-hidden bg-[linear-gradient(135deg,#feeabf,var(--rs-sand-100)_55%,var(--rs-trust))]">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.title} loading="lazy" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-rs-forest-900/70 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {product.city}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="font-rs-display text-2xl font-semibold leading-tight text-rs-ink">{product.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-rs-muted">
            {product.shortSummary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-forest-700">{tag}</span>
            ))}
          </div>
          <p className="mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.12em] text-rs-terracotta">
            View experience
          </p>
          <span className="sr-only">Review details before partner handoff</span>
        </div>
      </article>
    </Card>
  )
}

export default async function ToursExperienceDiscoveryPage({ searchParams }: ToursPageProps) {
  const filters = readFilters(searchParams)
  const matchingProducts = listReviewedViatorCatalogueProducts(loadReviewedViatorProducts(), filters)
  const { items: products, page, totalItems, totalPages } = paginateReviewedViatorCatalogueProducts(
    matchingProducts,
    filters.page,
    12,
  )
  const hasActiveFilters = Boolean(filters.city || filters.theme || filters.duration)
  const labels = [cityLabel(filters.city), themeLabel(filters.theme), durationLabel(filters.duration)].filter(Boolean)
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
                Find a reviewed experience for your Thailand day.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-rs-muted">
                Browse reviewed Viator experience records, narrow by city, theme, or day length, and inspect one detail page before continuing with a booking partner.
              </p>
            </div>
            <Link href="/ai-trip-planner" className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white">
              Plan my day
            </Link>
          </div>
        </section>

        <Section variant="sand" className="py-10 sm:py-14" contentClassName="max-w-[1240px]">
          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <FilterGroup title="City">
                <FilterChip href={buildToursHref({ ...filters, city: null, page: 1 })} label="All" active={!filters.city} />
                {reviewedViatorCatalogueCities.map(city => (
                  <FilterChip
                    key={city.slug}
                    href={buildToursHref({ ...filters, city: city.slug, page: 1 })}
                    label={city.label}
                    active={filters.city === city.slug}
                  />
                ))}
              </FilterGroup>
              <FilterGroup title="Experience">
                <FilterChip href={buildToursHref({ ...filters, theme: null, page: 1 })} label="All" active={!filters.theme} />
                <FilterChip href={buildToursHref({ ...filters, theme: 'culture', page: 1 })} label="Culture" active={filters.theme === 'culture'} />
                <FilterChip href={buildToursHref({ ...filters, theme: 'food', page: 1 })} label="Food" active={filters.theme === 'food'} />
                <FilterChip href={buildToursHref({ ...filters, theme: 'nature', page: 1 })} label="Nature" active={filters.theme === 'nature'} />
                <FilterChip href={buildToursHref({ ...filters, theme: 'adventure', page: 1 })} label="Adventure" active={filters.theme === 'adventure'} />
              </FilterGroup>
              <FilterGroup title="Day length">
                <FilterChip href={buildToursHref({ ...filters, duration: null, page: 1 })} label="All" active={!filters.duration} />
                <FilterChip href={buildToursHref({ ...filters, duration: 'half-day', page: 1 })} label="Half day" active={filters.duration === 'half-day'} />
                <FilterChip href={buildToursHref({ ...filters, duration: 'full-day', page: 1 })} label="Full day" active={filters.duration === 'full-day'} />
              </FilterGroup>
              {hasActiveFilters ? (
                <Link href="/tours" className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill border border-rs-forest-500 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700">Clear filters</Link>
              ) : null}
            </div>
            <div className="mt-5 border-t border-rs-sage-200/60 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-muted">Plan for</p>
              <p className="mt-2 text-sm leading-6 text-rs-muted">Add a family, couple, or friends preference in the planner. It shapes the plan, not an unreviewed product-suitability claim.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterChip href={buildPlannerAudienceHref('family', filters.city)} label="Family" active={false} />
                <FilterChip href={buildPlannerAudienceHref('couple', filters.city)} label="Couple" active={false} />
                <FilterChip href={buildPlannerAudienceHref('friends', filters.city)} label="Friends" active={false} />
              </div>
            </div>
            <div className="mt-5 border-t border-rs-sage-200/60 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-muted">Build a route</p>
              <p className="mt-2 text-sm leading-6 text-rs-muted">Choose a trip length to continue with a day-by-day route in the planner.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterChip href={buildPlannerDurationHref(1, filters.city)} label="1 day" active={false} />
                <FilterChip href={buildPlannerDurationHref(3, filters.city)} label="3 days" active={false} />
                <FilterChip href={buildPlannerDurationHref(5, filters.city)} label="5 days" active={false} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rs-sage-200/60 pt-4">
              <p className="text-sm font-semibold text-rs-forest-700">{filterSummary}</p>
              <p className="text-sm text-rs-muted">{resultCountLabel(products.length)}{totalItems > products.length ? ` · ${totalItems} reviewed matches` : ''}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          {totalPages > 1 ? (
            <nav aria-label="Experience results pages" className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-rs-lg border border-rs-sage-200/70 bg-white p-4 shadow-rs-soft">
              <p className="text-sm font-semibold text-rs-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link href={buildToursHref({ ...filters, page: page - 1 })} className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill border border-rs-sage-200 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700">Previous</Link>
                ) : null}
                {page < totalPages ? (
                  <Link href={buildToursHref({ ...filters, page: page + 1 })} className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-4 text-xs font-semibold uppercase tracking-[0.12em] text-rs-ink">Next</Link>
                ) : null}
              </div>
            </nav>
          ) : null}

          {products.length === 0 ? (
            <Card className="mt-8 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta">No reviewed matches</p>
              <h2 className="mt-3 font-rs-display text-3xl font-semibold">Try a broader city, experience, or day-length filter.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-rs-muted">
                No reviewed experience matches these filters. RadarScout does not create placeholder products.
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
