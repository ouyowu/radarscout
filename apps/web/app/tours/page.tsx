import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { EditorialBanner } from '../_components/EditorialBanner'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PartnerInventoryNotice } from '../_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from '../_components/SupplierPartnerCTA'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

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

const previewCollections = [
  {
    title: 'Thailand supplier inventory',
    body:
      'RadarScout is preparing live Thailand partner inventory for discovery and comparison. Product cards will use real Bókun supplier data only.',
  },
  {
    title: 'Private trip matching',
    body:
      'Use the AI planner to compare trip pace, transfer needs, private customization, and experience fit before choosing tours.',
  },
  {
    title: 'Partner tours coming soon',
    body:
      'Japan, France, and other selected destinations remain planning-only until signed supplier product connections are completed.',
  },
]

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

export default function ToursMarketplacePreviewPage() {
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
                Marketplace preview
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                Collection previews without invented product listings.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              Product-level cards will be shown only from real signed Bókun supplier partner inventory. This preview explains the marketplace structure without inventing tour names, prices, ratings, reviews, or supplier identities.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {previewCollections.map(collection => (
              <article key={collection.title} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                  Example collection
                </p>
                <h3 className="mt-3 font-[var(--font-heading)] text-3xl font-black leading-tight tracking-[-0.035em]">
                  {collection.title}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{collection.body}</p>
              </article>
            ))}
          </div>
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
