import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from './_components/AdventureHero'
import { DestinationCapsuleCard } from './_components/DestinationCapsuleCard'
import { DmcTrustBar } from './_components/DmcTrustBar'
import { EditorialBanner } from './_components/EditorialBanner'
import { ExperienceCategoryGrid } from './_components/ExperienceCategoryGrid'
import { FAQAccordion } from './_components/FAQAccordion'
import { PartnerInventoryNotice } from './_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from './_components/SupplierPartnerCTA'
import { WarmNewsletterFooter } from './_components/WarmNewsletterFooter'
import { globalDestinations } from '@/lib/global-destinations'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'RadarScout | AI-powered Destination DMC Portal',
  description:
    'Plan smarter private trips and discover curated day tours, transfers, food tours, cultural experiences, and custom itineraries from signed Bókun supplier partners in selected top travel destinations.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout | AI-powered Destination DMC Portal',
    description:
      'AI-powered destination planning for curated day tours, private trips, local experiences, transfers, and custom itineraries powered by signed supplier partners.',
    type: 'website',
    url: base,
  },
}

const featuredDestinations = [
  globalDestinations.find(destination => destination.slug === 'thailand'),
  globalDestinations.find(destination => destination.slug === 'japan'),
  globalDestinations.find(destination => destination.slug === 'france'),
  globalDestinations.find(destination => destination.slug === 'austria'),
  globalDestinations.find(destination => destination.slug === 'united-states'),
].filter((destination): destination is NonNullable<typeof destination> => Boolean(destination))

const trustItems = [
  { label: 'Live inventory', value: 'Thailand partner tours' },
  { label: 'Supplier boundary', value: 'Signed Bókun partners only' },
  { label: 'Planning engine', value: 'AI itinerary matching' },
  { label: 'Expansion model', value: 'Selected destinations, city by city' },
]

const categories = [
  {
    title: 'Curated day tours',
    description: 'Focused local experiences for travelers who want quality over endless low-value listings.',
    label: 'Core product',
  },
  {
    title: 'Private trips',
    description: 'Flexible routes, private guides, and driver-led days for travelers who need timing control.',
    label: 'Custom fit',
  },
  {
    title: 'Transfers',
    description: 'Airport, hotel, stadium, and city-to-city movement when timing matters as much as the tour.',
    label: 'Logistics',
  },
  {
    title: 'Food and culture',
    description: 'Food walks, cultural workshops, heritage routes, and local activities matched to trip style.',
    label: 'Local depth',
  },
]

const howItWorks = [
  {
    title: 'Tell RadarScout your route',
    body: 'Share destination, days, pace, travel style, group needs, and private customization preferences.',
  },
  {
    title: 'Compare realistic experience fits',
    body: 'The planning layer compares destination fit, time value, experience type, transfer needs, and itinerary flow.',
  },
  {
    title: 'Book only trusted partner inventory',
    body: 'Bookable products appear only when they are supplied by signed Bókun supplier partners who can operate the experience.',
  },
]

const faqItems = [
  {
    question: 'Is RadarScout a marketplace with every country available now?',
    answer:
      'No. RadarScout focuses on selected high-demand travel destinations. Thailand is currently the first live inventory destination, and more destinations are added as supplier agreements and product connections are completed.',
  },
  {
    question: 'Where do bookable products come from?',
    answer:
      'Bookable products come from signed Bókun supplier partners who can directly operate and fulfill the experience. RadarScout does not add external marketplace, affiliate, unsupported, or fake products to the bookable catalog.',
  },
  {
    question: 'What does the AI planning engine compare?',
    answer:
      'It helps compare experiences by destination, travel style, time value, itinerary fit, private customization needs, and available partner inventory.',
  },
  {
    question: 'Can I use RadarScout before a destination has live inventory?',
    answer:
      'Yes, planning pages can help structure routes and ideas. Destinations without signed supplier inventory are marked as planning-only or partner tours coming soon.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        title="AI-powered Destination DMC Portal for Curated Day Tours"
        subtitle="Plan private trips, compare local experiences, and discover curated day tours, transfers, food tours, and custom itineraries from signed Bókun supplier partners in selected top travel destinations."
        actions={[
          { label: 'Start planning with AI', href: '/ai-trip-planner' },
          { label: 'Explore live tours', href: '/tours', variant: 'secondary' },
        ]}
        trustNote="Thailand is currently RadarScout's first live inventory destination. Other destinations remain planning-only while trusted local Bókun supplier partners are onboarded."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {howItWorks.map((item, index) => (
            <article key={item.title} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                Step {index + 1}
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                Featured destinations
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                Selected top travel destinations, not worldwide noise.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              RadarScout does not try to list every destination. We focus on high-demand travel countries where trusted local supplier partners can directly operate and fulfill the experience.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map(destination => (
              <DestinationCapsuleCard
                key={destination.slug}
                name={destination.name}
                href={`/destinations/${destination.slug}`}
                status={destination.hasLiveInventory ? 'live' : 'coming-soon'}
                region={destination.region}
                summary={destination.shortDescription}
                highlights={destination.popularTourTypes.slice(0, 4)}
              />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/destinations"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-bg-dark)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white"
            >
              View destination portal
            </Link>
          </div>
        </div>
      </section>

      <ExperienceCategoryGrid
        title="Day tours, private trips, transfers, food, culture, and tailor-made itineraries."
        categories={categories}
      />

      <EditorialBanner
        label="Thailand live inventory"
        title="Thailand is RadarScout's first live partner-tour destination."
        body="Explore current Bókun partner inventory for Thailand while RadarScout expands signed supplier coverage into more selected high-demand destinations."
        href="/tours"
        ctaLabel="Explore Thailand tours"
      />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <PartnerInventoryNotice status="planning-only" currentDestination="non-Thailand destinations" />
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-ai-feature)]">AI planning use cases</p>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-7 text-[var(--color-text-secondary)] sm:grid-cols-2">
              <li>Plan 7 days in Thailand</li>
              <li>Compare private day tours</li>
              <li>Build an Austria + Germany + France route</li>
              <li>Prepare a World Cup 2026 travel plan</li>
              <li>Find food, culture, transfers, and local activities</li>
              <li>Match routes to realistic daily timing</li>
            </ul>
          </div>
        </div>
      </section>

      <SupplierPartnerCTA />
      <FAQAccordion items={faqItems} title="RadarScout travel planning FAQ" />
      <WarmNewsletterFooter
        title="Follow RadarScout's destination rollout."
        body="For now, email us for supplier partnerships, destination planning requests, and private tour questions. No automated newsletter backend is connected here."
      />
    </main>
  )
}
