import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { EditorialBanner } from '../_components/EditorialBanner'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PartnerInventoryNotice } from '../_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from '../_components/SupplierPartnerCTA'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Thailand Tours Marketplace Preview | RadarScout',
  description:
    'Explore RadarScout’s display-only Thailand tour marketplace preview for curated day tours, private experiences, transfers, food, culture, and signed Bókun supplier partner inventory.',
  alternates: { canonical: `${base}/tours` },
}

const trustItems = [
  { label: 'Live destination', value: 'Thailand first' },
  { label: 'Supplier source', value: 'Signed Bókun partners' },
  { label: 'Marketplace status', value: 'Display-only preview' },
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
    question: 'Can I book tours from every destination on this page?',
    answer:
      'No. Thailand is currently RadarScout’s first live inventory destination. Other destinations remain planning-only or partner tours coming soon until signed supplier connections are completed.',
  },
  {
    question: 'Where do RadarScout bookable tours come from?',
    answer:
      'Bookable products are powered by signed Bókun supplier partners who can directly operate and fulfill the experience.',
  },
  {
    question: 'Is this page connected to a purchase flow?',
    answer:
      'No. This UI-3A page is display-only. It does not submit bookings, collect money, create inquiries, call Bókun, or write to the database.',
  },
  {
    question: 'Will RadarScout add more destinations?',
    answer:
      'Yes. More selected high-demand destinations will be added as supplier agreements and product connections are completed.',
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
  if (hasPrice === 'false') return 'Partner rate'

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
        'inline-flex min-h-[40px] items-center rounded-full border px-4 text-xs font-black uppercase tracking-[0.1em] transition',
        active
          ? 'border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)] text-white'
          : 'border-[var(--color-border-light)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-accent-orange-dark)]',
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
      <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function formatPrice(product: ProductDisplay) {
  if (!product.retailPrice) return 'Contact for partner rate'
  if (!product.currency) return product.retailPrice

  return `${product.currency} ${product.retailPrice}`
}

function ProductCard({ product }: { product: ProductDisplay }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--color-border-light)] bg-white shadow-lg">
      <div className="flex h-56 items-center justify-center bg-[var(--color-accent-orange-pale)]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Supplier image pending
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text-secondary)]">
              Image will appear only when supplied by partner product data.
            </p>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-accent-orange-pale)] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[var(--color-accent-orange-dark)]">
            Thailand
          </span>
          {product.destination ? (
            <span className="rounded-full bg-[var(--color-bg-muted)] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
              {product.destination}
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 font-[var(--font-heading)] text-3xl font-black leading-tight tracking-[-0.035em]">
          {product.title}
        </h3>
        <p className="mt-3 min-h-[4.5rem] text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
          {product.summary ?? 'Partner product details are being normalized from signed Bókun supplier data.'}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.1em] text-[var(--color-live-inventory)]">
            {formatPrice(product)}
          </p>
          <Link
            href={product.detailHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-5 text-xs font-black uppercase tracking-[0.1em] text-white"
          >
            View preview details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function ToursMarketplacePreviewPage({ searchParams }: ToursPageProps) {
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
        eyebrow="Thailand live inventory preview"
        title="Curated Thailand Tours & Private Experiences"
        subtitle="Explore a display-only preview of RadarScout’s DMC marketplace for curated day tours, private experiences, transfers, food, culture, and AI-assisted itinerary planning powered by signed Bókun supplier partners."
        actions={[
          { label: 'Plan with AI', href: '/ai-trip-planner' },
          { label: 'View Thailand destination', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="Thailand is RadarScout’s first live inventory destination. Bookable products are shown only when they come from signed Bókun supplier partners."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Inventory boundary
            </p>
            <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
              Real partner inventory only. No unsupported product listings.
            </h1>
            <p className="mt-4 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              This tours surface is designed for signed supplier partner products. It does not add external marketplace inventory, unsupported manual listings, or unavailable experiences.
            </p>
          </div>
          <PartnerInventoryNotice status="live" currentDestination="Thailand" />
        </div>
      </section>

      <ExperienceCategoryGrid
        eyebrow="Thailand experience categories"
        title="Preview the kinds of partner experiences RadarScout is built to compare."
        categories={categories}
      />

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                Live Thailand products
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                Real partner product cards, no invented listings.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              These cards are loaded from RadarScout&apos;s read-only product API and display only active Thailand products from signed Bókun supplier partner data. Booking and payment are not enabled on this preview page.
            </p>
          </div>

          <div className="mt-8 rounded-[2rem] border border-[var(--color-border-light)] bg-white p-5 shadow-lg">
            <div className="mb-6 grid gap-3 border-b border-[var(--color-border-light)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                  Browse filters
                </p>
                <p className="mt-2 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                  Filter display-only supplier products. Booking and payment remain disabled.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-4 py-3 text-left lg:text-right">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Current view
                </p>
                <p className="mt-1 text-sm font-black text-[var(--color-text-primary)]">
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
                  label="Partner rate"
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
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-[var(--color-bg-secondary)] px-5 text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]"
              >
                Clear filters
              </Link>
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-[var(--color-accent-orange-pale)] px-5 py-4">
              <p className="text-sm font-black text-[var(--color-accent-orange-dark)]">
                {filterSummary}
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map(product => (
                <ProductCard key={String(product.id)} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-[var(--color-border-light)] bg-white p-8 shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                {hasActiveFilters ? 'No products match these filters' : 'Partner inventory coming online'}
              </p>
              <h3 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                {hasActiveFilters
                  ? 'No active supplier products match these filters yet.'
                  : 'Thailand supplier products are being prepared for display.'}
              </h3>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                {hasActiveFilters
                  ? 'Try clearing filters or choosing another Thailand city. RadarScout does not add placeholder products to fill filtered results.'
                  : 'The product API returned no display-ready rows right now. RadarScout will show real signed Bókun supplier products here when active partner inventory is available, without creating placeholder products, prices, ratings, reviews, or supplier names.'}
              </p>
              {hasActiveFilters ? (
                <Link
                  href="/tours"
                  className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-xs font-black uppercase tracking-[0.1em] text-white"
                >
                  Clear filters
                </Link>
              ) : null}
              {productResponse.error ? (
                <p className="mt-4 text-xs font-black uppercase tracking-[0.1em] text-[var(--color-coming-soon)]">
                  Safe fallback: product feed unavailable
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <EditorialBanner
        label="Coming soon destinations"
        title="Japan, France, and other selected destinations remain planning-only."
        body="RadarScout does not claim live inventory for every destination. More partner destinations will become bookable only after signed supplier agreements and product connections are completed."
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
              See why Thailand is the first live inventory destination and how RadarScout structures partner-tour planning.
            </p>
          </Link>

          <a
            href="mailto:hello@radarscout.io?subject=B%C3%B3kun%20Supplier%20Partnership%20Inquiry"
            className="rounded-[2rem] border border-[var(--color-border-light)] bg-[var(--color-bg-dark)] p-6 text-white shadow-lg transition hover:-translate-y-1"
          >
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
              Supplier CTA
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Email RadarScout about supplier partnership
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-white/72">
              We are onboarding trusted local Bókun supplier partners for selected high-demand destinations.
            </p>
          </a>
        </div>
      </section>

      <SupplierPartnerCTA />
      <FAQAccordion items={faqItems} title="Tours marketplace preview FAQ" />
    </main>
  )
}
