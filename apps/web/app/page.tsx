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
  title: 'RadarScout | AI-guided Thailand Experience Planner',
  description:
    'Plan Thailand experiences with guided discovery for elephant care, cooking, nature, family-friendly days, and trusted booking partner handoff.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout | AI-guided Thailand Experience Planner',
    description:
      'Compare Thailand experiences, draft a day plan, and continue with a trusted booking partner when you are ready.',
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
  { label: 'Thailand focus', value: 'Guided experience discovery' },
  { label: 'Handoff boundary', value: 'Continue with a booking partner' },
  { label: 'Planning engine', value: 'AI itinerary matching' },
  { label: 'Expansion model', value: 'Thailand first, then selected destinations' },
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
    title: 'Continue with a booking partner',
    body: 'When you are ready, RadarScout sends you to the relevant product or booking partner page for final details.',
  },
]

const faqItems = [
  {
    question: 'Is RadarScout a marketplace with every country currently shown?',
    answer:
      'No. RadarScout focuses on selected high-demand travel destinations. Thailand is currently the first focused experience destination, and more destinations are added as local partner coverage improves.',
  },
  {
    question: 'Where do recommended experiences come from?',
    answer:
      'RadarScout recommends real local experiences and routes travelers to product or booking partner pages for final details. RadarScout does not add fake, unsupported, or unverified products to the traveler-facing recommendations.',
  },
  {
    question: 'What does the AI planning engine compare?',
    answer:
      'It helps compare experiences by destination, travel style, time value, itinerary fit, private customization needs, and booking partner handoff fit.',
  },
  {
    question: 'Can I use RadarScout before a destination has full partner coverage?',
    answer:
      'Yes, planning pages can help structure routes and ideas. Destinations without enough local partner coverage are marked as planning-only or coming soon.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        title="AI-guided Thailand Experience Planner"
        subtitle="Plan private trips, compare local experiences, and discover day tours, transfers, food tours, and custom itinerary ideas across selected top travel destinations."
        actions={[
          { label: 'Start planning with AI', href: '/ai-trip-planner' },
          { label: 'Compare Thailand experiences', href: '/tours', variant: 'secondary' },
        ]}
        trustNote="Thailand is currently RadarScout's first focused experience destination. Other destinations remain planning-only while local partner coverage improves."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-secondary)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Chiang Mai guided planner
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              Plan a Chiang Mai elephant day
            </h2>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)] sm:text-base">
              Use RadarScout&apos;s guided planner to compare experiences for elephant care, cooking, nature, and
              family-friendly travel before you continue with a booking partner.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Link
              href="/chiang-mai/elephant-camp-finder"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-bg-dark)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white"
            >
              Plan with RadarScout
            </Link>
          </div>
        </div>
      </section>

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
                Thailand-first rollout
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                Thailand is live first. Other destinations stay planning-only.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              RadarScout focuses current product coverage on Thailand experiences. Other destination pages help structure future routes while local partner coverage is reviewed city by city.
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
        label="Thailand guided discovery"
        title="Thailand is RadarScout's first focused experience destination."
        body="Compare Thailand experiences while RadarScout expands local partner coverage into more selected high-demand destinations."
        href="/tours"
        ctaLabel="Compare Thailand experiences"
      />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <PartnerInventoryNotice status="planning-only" currentDestination="non-Thailand destinations" />
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-ai-feature)]">AI planning use cases</p>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-7 text-[var(--color-text-secondary)] sm:grid-cols-2">
              <li>Plan 7 days in Thailand</li>
              <li>Compare Bangkok and Chiang Mai day tours</li>
              <li>Plan elephant care, cooking, and nature days</li>
              <li>Prepare Pattaya or Phuket day-trip ideas</li>
              <li>Find food, culture, transfers, and local Thailand activities</li>
              <li>Match Thailand routes to realistic daily timing</li>
            </ul>
          </div>
        </div>
      </section>

      <SupplierPartnerCTA showPartnerPathLinks />
      <FAQAccordion items={faqItems} title="RadarScout travel planning FAQ" />
      <WarmNewsletterFooter
        title="Follow RadarScout's destination rollout."
        body="For now, email us for supplier partnerships, destination planning requests, and private tour questions. Automated newsletter signup is not part of this page."
      />
    </main>
  )
}
