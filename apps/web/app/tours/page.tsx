import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { EditorialBanner } from '../_components/EditorialBanner'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { Button, Card, Section } from '../_components/design-system'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Thailand Experience Discovery | RadarScout',
  description:
    'Explore RadarScout’s Thailand experience discovery page for curated day tours, private experiences, transfers, food, culture, and trusted booking partner records.',
  alternates: { canonical: `${base}/tours` },
  robots: { index: false, follow: false },
}

const trustItems = [
  { label: 'Destination focus', value: 'Thailand first' },
  { label: 'Product source', value: 'Trusted partner records' },
  { label: 'Experience model', value: 'Guided comparison' },
  { label: 'Expansion model', value: 'Selected destinations' },
]

const categories = [
  {
    title: 'Elephant sanctuaries',
    description: 'Ethical elephant care and nature-led experiences that fit realistic Thailand itineraries.',
    label: 'Thailand focus',
  },
  {
    title: 'Island and beach trips',
    description: 'Marine parks, island days, beach routes, and private coastal experiences for warm-weather trips.',
    label: 'Day tours',
  },
  {
    title: 'Food and culture',
    description: 'Street food, market walks, temple routes, workshops, and local cultural experiences.',
    label: 'Local depth',
  },
  {
    title: 'Private transfers',
    description: 'Airport, hotel, city-to-city, and custom private transfer needs for smoother trip timing.',
    label: 'Logistics',
  },
  {
    title: 'Adventure and trekking',
    description: 'Outdoor routes, soft adventure, viewpoint days, jungle areas, and active travel planning.',
    label: 'Active travel',
  },
  {
    title: 'Family friendly',
    description: 'Lower-friction experiences for families who need timing, comfort, and pickup details handled clearly.',
    label: 'Private fit',
  },
]

type ProductDisplay = {
  id: string | number
  title: string
  destination?: string | null
  summary?: string | null
  imageUrl?: string | null
  retailPrice?: string | null
  currency?: string | null
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
    hasPrice?: string
    hasImage?: string
  }
}

type FilterState = {
  city: string | null
  hasPrice: 'true' | 'false' | null
  hasImage: 'true' | 'false' | null
}

const faqItems = [
  {
    question: 'Why are some destinations still planning-only?',
    answer:
      'No. Thailand is currently RadarScout’s first supported destination. Other destinations remain planning-only while trusted local product records are prepared.',
  },
  {
    question: 'Where do RadarScout tour records come from?',
    answer:
      'RadarScout shows trusted partner product records and leaves missing fields blank instead of inventing unsupported listings.',
  },
  {
    question: 'Is this page connected to a transaction flow?',
    answer:
      'No. This page helps travelers compare details before they continue with a booking partner. It does not create a traveler request or submit a form from this page.',
  },
  {
    question: 'Will RadarScout add more destinations?',
    answer:
      'Yes. Additional destinations can move beyond planning-only after local supplier coverage and booking partner handoff paths are reviewed.',
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
    hasPrice: normalizeFilterValue(searchParams?.hasPrice, ['true', 'false']) as FilterState['hasPrice'],
    hasImage: normalizeFilterValue(searchParams?.hasImage, ['true', 'false']) as FilterState['hasImage'],
  }
}

function buildToursHref(nextFilters: Partial<FilterState>) {
  const params = new URLSearchParams()
  const city = nextFilters.city ?? null
  const hasPrice = nextFilters.hasPrice ?? null
  const hasImage = nextFilters.hasImage ?? null

  if (city) params.set('city', city)
  if (hasPrice) params.set('hasPrice', hasPrice)
  if (hasImage) params.set('hasImage', hasImage)

  const query = params.toString()
  return query ? `/tours?${query}` : '/tours'
}

function buildProductsQuery(filters: FilterState) {
  const params = new URLSearchParams({
    destination: 'thailand',
    take: '12',
  })

  if (filters.city) params.set('city', filters.city)
  if (filters.hasPrice) params.set('hasPrice', filters.hasPrice)
  if (filters.hasImage) params.set('hasImage', filters.hasImage)

  return params.toString()
}

function cityLabel(city: string | null) {
  if (city === 'chiang-mai') return 'Chiang Mai'
  if (city === 'bangkok') return 'Bangkok'
  if (city === 'phuket') return 'Phuket'

  return null
}

function priceLabel(hasPrice: FilterState['hasPrice']) {
  if (hasPrice === 'true') return 'Has price'
  if (hasPrice === 'false') return 'Price not listed'

  return null
}

function imageLabel(hasImage: FilterState['hasImage']) {
  if (hasImage === 'true') return 'Has image'
  if (hasImage === 'false') return 'Needs image'

  return null
}

function activeFilterLabels(filters: FilterState) {
  return [
    cityLabel(filters.city),
    priceLabel(filters.hasPrice),
    imageLabel(filters.hasImage),
  ].filter((label): label is string => Boolean(label))
}

function resultCountLabel(count: number) {
  if (count === 0) return 'No products shown'
  if (count === 1) return '1 product shown'

  return `${count} products shown`
}

async function fetchThailandProducts(filters: FilterState): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${requestOrigin()}/api/products?${buildProductsQuery(filters)}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        products: [],
        error: 'PRODUCTS_UNAVAILABLE',
      }
    }

    return await response.json() as ProductsResponse
  } catch {
    return {
      products: [],
      error: 'PRODUCTS_UNAVAILABLE',
    }
  }
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex min-h-[42px] items-center rounded-rs-pill border px-4 text-xs font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-terracotta',
        active
          ? 'border-rs-forest-700 bg-rs-forest-700 text-white'
          : 'border-rs-sage-200/80 bg-white text-rs-muted hover:border-rs-terracotta hover:text-rs-forest-700',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-rs-muted">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ProductCard({ product }: { product: ProductDisplay }) {
  return (
    <Card className="group h-full bg-white transition duration-200 hover:-translate-y-1 hover:shadow-rs-soft">
      <article className="flex h-full flex-col">
        <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-[linear-gradient(135deg,var(--rs-forest-900),var(--rs-forest-700)_45%,var(--rs-sand-100)_78%,var(--rs-terracotta))] p-5">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_28%),linear-gradient(0deg,rgba(15,36,28,0.62),transparent_55%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/82">
              Partner record
            </p>
            <p className="mt-2 max-w-[16rem] font-rs-display text-2xl font-semibold leading-tight text-white">
              {product.destination ?? 'Thailand'} experience
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700">
            Thailand
          </span>
          {product.destination ? (
            <span className="rounded-rs-pill bg-rs-sage-200/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rs-muted">
              {product.destination}
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 font-rs-display text-[clamp(1.4rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.02em] text-rs-ink">
          {product.title}
        </h3>
        <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-rs-muted">
          {product.summary ?? 'Product details are being prepared from trusted partner records.'}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="max-w-[12rem] text-xs font-semibold uppercase tracking-[0.12em] text-rs-muted">
            Review details before partner handoff
          </p>
          <Link
            href={product.detailHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-rs-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-terracotta"
          >
            View details
          </Link>
        </div>
      </div>
      </article>
    </Card>
  )
}

export default async function ToursExperienceDiscoveryPage({ searchParams }: ToursPageProps) {
  const filters = readFilters(searchParams)
  const productResponse = await fetchThailandProducts(filters)
  const products = productResponse.products
  const hasActiveFilters = Boolean(filters.city || filters.hasPrice || filters.hasImage)
  const filterLabels = activeFilterLabels(filters)
  const filterSummary = filterLabels.length > 0
    ? `Showing Thailand supplier products filtered by ${filterLabels.join(' · ')}`
    : 'Showing all Thailand supplier products'
  const currentResultCount = resultCountLabel(products.length)

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Thailand experience discovery"
        title="Curated Thailand Tours & Private Experiences"
        subtitle="Explore curated day tours, private experiences, transfers, food, culture, and guided itinerary planning from trusted partner records."
        actions={[
          { label: 'Open Trip Planner', href: '/ai-trip-planner' },
          { label: 'View Thailand destination', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="Thailand is RadarScout’s first supported destination. Product cards appear only when there is a trusted partner record to show."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Experience boundary
            </p>
            <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
              Real partner records only. No unsupported product listings.
            </h1>
            <p className="mt-4 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              This experience surface is designed for trusted partner product records. It does not add external marketplace listings, unsupported manual listings, or unavailable experiences.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--color-border-light)] bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Planning boundary
            </p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              RadarScout helps travelers compare experience details before they continue with a booking partner. Missing fields are left empty instead of being invented.
            </p>
            <p className="mt-2 text-xs font-bold leading-6 text-[var(--color-text-muted)]">
              Thailand is currently the first supported destination for this guided comparison surface.
            </p>
          </div>
        </div>
      </section>

      <ExperienceCategoryGrid
        eyebrow="Thailand experience categories"
        title="Explore the kinds of partner experiences RadarScout is built to compare."
        categories={categories}
      />

      <Section
        variant="sand"
        className="border-y border-rs-sage-200/55"
        contentClassName="max-w-[1240px]"
      >
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-forest-500">
                Thailand experience records
              </p>
              <h2 className="mt-3 font-rs-display text-[clamp(2.35rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-rs-ink">
                Curated product cards, no invented listings.
              </h2>
            </div>
            <p className="text-base leading-8 text-rs-muted">
              These cards are loaded from RadarScout&apos;s read-only product API and display only Thailand product records that are prepared for comparison. Use the booking partner page to review current details.
            </p>
          </div>

          <div className="sticky top-4 z-10 mt-8 rounded-rs-lg border border-rs-sage-200/70 bg-white/94 p-5 shadow-rs-soft backdrop-blur">
            <div className="mb-6 grid gap-3 border-b border-rs-sage-200/65 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-terracotta">
                  Browse filters
                </p>
                <p className="mt-2 text-sm leading-7 text-rs-muted">
                  Filter Thailand experience records before continuing with a booking partner.
                </p>
              </div>
              <div className="rounded-rs-md bg-rs-sand-100 px-4 py-3 text-left lg:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-muted">
                  Current view
                </p>
                <p className="mt-1 text-sm font-semibold text-rs-ink">
                  {currentResultCount}
                </p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <FilterGroup title="City">
                <FilterChip
                  href={buildToursHref({ ...filters, city: null })}
                  label="All"
                  active={!filters.city}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, city: 'chiang-mai' })}
                  label="Chiang Mai"
                  active={filters.city === 'chiang-mai'}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, city: 'bangkok' })}
                  label="Bangkok"
                  active={filters.city === 'bangkok'}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, city: 'phuket' })}
                  label="Phuket"
                  active={filters.city === 'phuket'}
                />
              </FilterGroup>

              <FilterGroup title="Price">
                <FilterChip
                  href={buildToursHref({ ...filters, hasPrice: null })}
                  label="All prices"
                  active={!filters.hasPrice}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, hasPrice: 'true' })}
                  label="Has price"
                  active={filters.hasPrice === 'true'}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, hasPrice: 'false' })}
                  label="Price not listed"
                  active={filters.hasPrice === 'false'}
                />
              </FilterGroup>

              <FilterGroup title="Image">
                <FilterChip
                  href={buildToursHref({ ...filters, hasImage: null })}
                  label="All images"
                  active={!filters.hasImage}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, hasImage: 'true' })}
                  label="Has image"
                  active={filters.hasImage === 'true'}
                />
                <FilterChip
                  href={buildToursHref({ ...filters, hasImage: 'false' })}
                  label="Needs image"
                  active={filters.hasImage === 'false'}
                />
              </FilterGroup>

              <Link
                href="/tours"
                className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill border border-rs-forest-500 bg-rs-sand-50 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-rs-forest-700 transition hover:bg-rs-sand-100"
              >
                Clear filters
              </Link>
            </div>
            <div className="mt-5 rounded-rs-md bg-rs-sand-100 px-5 py-4">
              <p className="text-sm font-semibold text-rs-forest-700">
                {filterSummary}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map(product => (
                <ProductCard key={String(product.id)} product={product} />
              ))}
            </div>
          ) : (
            <Card className="mt-8 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rs-terracotta">
                {hasActiveFilters ? 'No products match these filters' : 'Experience records coming online'}
              </p>
              <h3 className="mt-3 font-rs-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.03em] text-rs-ink">
                {hasActiveFilters
                  ? 'No trusted partner records match these filters yet.'
                  : 'Thailand experience records are being prepared for display.'}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-rs-muted">
                {hasActiveFilters
                  ? 'Try clearing filters or choosing another Thailand city. RadarScout does not add placeholder products to fill filtered results.'
                  : 'The product API returned no display-ready rows right now. RadarScout will show trusted partner product records here when they are ready, without creating placeholder products, prices, ratings, reviews, or names.'}
              </p>
              {hasActiveFilters ? (
                <Button href="/tours" className="mt-6 min-h-[44px] px-6 text-xs">
                  Clear filters
                </Button>
              ) : null}
              {productResponse.error ? (
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-rs-terracotta">
                  Safe fallback: product feed unavailable
                </p>
              ) : null}
            </Card>
          )}
      </Section>

      <EditorialBanner
        label="Coming soon destinations"
        title="Non-Thailand destinations remain planning-only."
        body="RadarScout keeps non-Thailand destinations planning-only until trusted product records are ready for comparison."
        href="/destinations"
        ctaLabel="View destination status"
      />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <Link
            href="/destinations/thailand"
            className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg transition hover:-translate-y-1"
          >
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
              Traveler CTA
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Explore Thailand destination planning
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              See why Thailand is the first supported destination and how RadarScout structures guided travel planning.
            </p>
          </Link>

          <Link
            href="/chiang-mai/elephant-camp-finder"
            className="rounded-[2rem] border border-[var(--color-border-light)] bg-[var(--color-bg-dark)] p-6 text-white shadow-lg transition hover:-translate-y-1"
          >
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
              Guided planner
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Plan a Chiang Mai experience
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-white/72">
              Use RadarScout&apos;s guided planner to compare elephant care, cooking, nature, and family-friendly experiences before continuing with a booking partner.
            </p>
            <span className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-xs font-black uppercase tracking-[0.1em] text-white">
              Plan with RadarScout
            </span>
          </Link>
        </div>
      </section>

      <FAQAccordion items={faqItems} title="Thailand experience discovery FAQ" />
    </main>
  )
}
