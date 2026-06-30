import type { Metadata } from 'next'
import { AdventureHero } from '../_components/AdventureHero'
import { DestinationCapsuleCard } from '../_components/DestinationCapsuleCard'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { FAQAccordion } from '../_components/FAQAccordion'
import { PartnerInventoryNotice } from '../_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from '../_components/SupplierPartnerCTA'
import { globalDestinations } from '@/lib/global-destinations'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Destination Portal | RadarScout AI Travel Planning',
  description:
    'Explore selected top travel destinations for AI-guided private trip planning. Thailand is RadarScout’s first focused experience destination while other destinations remain planning-only.',
  alternates: { canonical: `${base}/destinations` },
}

const liveDestinations = globalDestinations.filter(destination => destination.hasLiveInventory)
const comingSoonDestinations = globalDestinations.filter(destination => !destination.hasLiveInventory)

const trustItems = [
  { label: 'Focused now', value: 'Thailand' },
  { label: 'Planning pages', value: `${comingSoonDestinations.length} destinations` },
  { label: 'Handoff model', value: 'Booking partner handoff only' },
  { label: 'Portal focus', value: 'Selected travel countries' },
]

const faqItems = [
  {
    question: 'Why do some destinations say partner tours coming soon?',
    answer:
      'Those destinations are planning pages while RadarScout onboards trusted local suppliers. They are not presented as traveler-ready recommendation pages.',
  },
  {
    question: 'Which destination is focused now?',
    answer:
      'Thailand is currently RadarScout’s first focused experience destination. Other destinations will show traveler-facing recommendations only after supplier coverage and booking partner handoff paths are safe to present.',
  },
  {
    question: 'Do destination pages include external affiliate products?',
    answer:
      'No. RadarScout does not add external marketplace, affiliate, unsupported, or fake products to the comparison catalog.',
  },
  {
    question: 'Can suppliers apply for a destination that is coming soon?',
    answer:
      'Yes. Local tour operators and destination partners can contact RadarScout to discuss onboarding for day tours, private tours, transfers, food tours, cultural experiences, and custom local activities.',
  },
]

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Destination planning portal"
        title="Selected travel destinations, planned city by city."
        subtitle="Explore RadarScout destination pages for AI itinerary planning, private trip design, and curated partner-tour readiness across high-demand travel countries."
        actions={[
          { label: 'View Thailand tours', href: '/tours' },
          { label: 'Start AI planner', href: '/ai-trip-planner', variant: 'secondary' },
        ]}
        trustNote="Thailand is RadarScout’s first focused experience destination. Other destinations are planning-only while trusted local suppliers are onboarded."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Focused vs planning-only
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
              Clear coverage status before travelers click.
            </h2>
            <p className="mt-4 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              Traveler-facing recommendations appear only when RadarScout has enough product detail and a safe booking partner handoff path. Planning-only destinations are useful for route ideas, but they do not pretend to have ready-to-compare experiences.
            </p>
          </div>
          <PartnerInventoryNotice status="planning-only" currentDestination="destinations outside Thailand" />
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                Focused coverage
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                First focused experience destination.
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              Thailand is RadarScout’s first focused experience destination. These pages link into the existing discovery surface instead of creating fake products.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {liveDestinations.map(destination => (
              <DestinationCapsuleCard
                key={destination.slug}
                name={destination.name}
                href={`/destinations/${destination.slug}`}
                status="live"
                region={destination.region}
                summary={destination.shortDescription}
                highlights={destination.popularTourTypes}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-coming-soon)]">
                Partner onboarding
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                Planning guides for selected high-demand destinations.
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              These pages are intentionally marked as partner tours coming soon. They support SEO and trip planning while supplier agreements are completed.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonDestinations.map(destination => (
              <DestinationCapsuleCard
                key={destination.slug}
                name={destination.name}
                href={`/destinations/${destination.slug}`}
                status="coming-soon"
                region={destination.region}
                summary={destination.shortDescription}
                highlights={destination.popularTourTypes}
              />
            ))}
          </div>
        </div>
      </section>

      <SupplierPartnerCTA />
      <FAQAccordion items={faqItems} title="Destination portal FAQ" />
    </main>
  )
}
