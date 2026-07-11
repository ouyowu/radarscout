import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { Card, Section } from '../_components/design-system'

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

type ProductDisplay = {
  id: string | number
  title: string
  destination?: string | null
  summary?: string | null
  imageUrl?: string | null
  tags?: string[]
  detailHref: string
}

type ProductsResponse = {
  products: ProductDisplay[]
  meta?: {
    source: 'signed-bokun-supplier-products'
    inventoryScope: 'thailand-first'
    bookingEnabled: false
    availabilityEnabled: false
    count: number
  }
  error?: string
}

type ToursPageProps = {
  searchParams?: {
    city?: string
    hasImage?: string
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

function requestOrigin() {
  const headerStore = headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const protocol = headerStore.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https')

  if (host) return `${protocol}://${host}`

  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
}

function normalizeFilterValue(value: string | undefined, allowedValues: string[]): string | null {
  if (!value) return null
  return allowedValues.includes(value) ? value : null
}

function readFilters(searchParams?: ToursPageProps['searchParams']): FilterState {
  return {
    city: normalizeFilterValue(searchParams?.city, ['chiang-mai', 'bangkok', 'phuket']),
    hasImage: normalizeFilterValue(searchParams?.hasImage, ['true', 'false']) as FilterState['hasImage'],
  }
}

function buildToursHref(nextFilters: Partial<FilterState>) {
  const params = new URLSearchParams()
  const city = nextFilters.city ?? null
  const hasImage = nextFilters.hasImage ?? null

  if (city) params.set('city', city)
  if (hasImage) params.set('hasImage', hasImage)

  const query = params.toString()
  return query ? `/tours?${query}` : '/tours'
}

function buildProductsQuery(filters: FilterState) {
  const params = new URLSearchParams({ destination: 'thailand', take: '12' })
  if (filters.city) params.set('city', filters.city)
  if (filters.hasImage) params.set('hasImage', filters.hasImage)
  return params.toString()
}

function cityLabel(city: string | null) {
  if (city === 'chiang-mai') return 'Chiang Mai'
  if (city === 'bangkok') return 'Bangkok'
  if (city === 'phuket') return 'Phuket'
  return null
}

function imageLabel(hasImage: FilterState['hasImage']) {
  if (hasImage === 'true') return 'With photo'
  if (hasImage === 'false') return 'Photo pending'
  return null
}

function resultCountLabel(count: number) {
  if (count === 0) return 'No experiences shown'
  if (count === 1) return '1 experience shown'
  return `${count} experiences shown`
}

async function fetchThailandProducts(filters: FilterState): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${requestOrigin()}/api/products?${buildProductsQuery(filters)}`, {
      cache: 'no-store',
    })

    if (!response.ok) return { products: [], error: 'PRODUCTS_UNAVAILABLE' }
    return await response.json() as ProductsResponse
  } catch {
    return { products: [], error: 'PRODUCTS_UNAVAILABLE' }
  }
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

function ProductCard({ product }: { product: ProductDisplay }) {
  return (
    <Card href={product.detailHref} ariaLabel={`View ${product.title}`} className="group h-full transition duration-200 hover:-translate-y-1">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,var(--rs-forest-900),var(--rs-forest-700)_45%,var(--rs-sand-100)_78%,var(--rs-terracotta))]">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.title} loading="lazy" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-rs-forest-900/70 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {product.destination ?? 'Thailand'}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="font-rs-display text-2xl font-semibold leading-tight text-rs-ink">{product.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-rs-muted">
            {product.summary ?? 'Product details are being prepared from trusted partner records.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(product.tags ?? []).slice(0, 3).map(tag => (
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
  const productResponse = await fetchThailandProducts(filters)
  const products = productResponse.products
  const hasActiveFilters = Boolean(filters.city || filters.hasImage)
  const labels = [cityLabel(filters.city), imageLabel(filters.hasImage)].filter(Boolean)
  const filterSummary = labels.length > 0
    ? `Filtered by ${labels.join(' · ')}`
    : 'Showing all reviewed Thailand experiences'

  return (
    <PublicSiteShell>
      <main className="min-h-screen bg-rs-sand-50 text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-rs-cloud px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-500">Thailand day trips</p>
              <h1 className="mt-3 font-rs-display text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                Find a reviewed experience for your Thailand day.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-rs-muted">
                Browse real experience records, narrow the city or photo coverage, and inspect one detail page before continuing with a booking partner.
              </p>
            </div>
            <Link href="/ai-trip-planner" className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-rs-terracotta-600">
              Plan my day
            </Link>
          </div>
        </section>

        <Section variant="sand" className="py-10 sm:py-14" contentClassName="max-w-[1240px]">
          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-5 shadow-rs-soft">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <FilterGroup title="City">
                <FilterChip href={buildToursHref({ ...filters, city: null })} label="All" active={!filters.city} />
                <FilterChip href={buildToursHref({ ...filters, city: 'chiang-mai' })} label="Chiang Mai" active={filters.city === 'chiang-mai'} />
                <FilterChip href={buildToursHref({ ...filters, city: 'bangkok' })} label="Bangkok" active={filters.city === 'bangkok'} />
                <FilterChip href={buildToursHref({ ...filters, city: 'phuket' })} label="Phuket" active={filters.city === 'phuket'} />
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
              <p className="text-sm text-rs-muted">{resultCountLabel(products.length)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          {products.length === 0 ? (
            <Card className="mt-8 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta">No reviewed matches</p>
              <h2 className="mt-3 font-rs-display text-3xl font-semibold">Try a broader city or photo filter.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-rs-muted">
                {productResponse.error
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
