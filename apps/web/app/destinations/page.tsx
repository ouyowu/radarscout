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
  title: 'Destination Portal | RadarScout AI DMC Planning',
  description:
    'Explore selected top travel destinations for AI-powered private trip planning. Thailand has live signed Bókun supplier inventory; other destinations are partner tours coming soon.',
  alternates: { canonical: `${base}/destinations` },
}

const liveDestinations = globalDestinations.filter(destination => destination.hasLiveInventory)
const comingSoonDestinations = globalDestinations.filter(destination => !destination.hasLiveInventory)

const trustItems = [
  { label: 'Live now', value: 'Thailand' },
  { label: 'Planning pages', value: `${comingSoonDestinations.length} destinations` },
  { label: 'Bookable products', value: 'Signed Bókun partners only' },
  { label: 'Portal focus', value: 'Selected travel countries' },
]

const faqItems = [
  {
    question: 'Why do some destinations say partner tours coming soon?',
    answer:
      'Those destinations are planning pages while RadarScout onboards signed local Bókun supplier partners. They are not presented as live bookable product pages.',
  },
  {
    question: 'Which destination has live inventory now?',
    answer:
      'Thailand is currently RadarScout’s first live inventory destination. Other destinations will show bookable tours only after supplier agreements and product connections are completed.',
  },
  {
    question: 'Do destination pages include external affiliate products?',
    answer:
      'No. RadarScout does not add external marketplace, affiliate, unsupported, or fake products to the bookable catalog.',
  },
  {
    question: 'Can suppliers apply for a destination that is coming soon?',
    answer:
      'Yes. Local tour operators and Bókun supplier partners can contact RadarScout to discuss onboarding for day tours, private tours, transfers, food tours, cultural experiences, and custom local activities.',
  },
]

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Destination DMC portal"
        title="Selected travel destinations, planned city by city."
        subtitle="Explore RadarScout destination pages for AI itinerary planning, private trip design, and curated partner-tour readiness across high-demand travel countries."
        actions={[
          { label: 'View Thailand tours', href: '/tours' },
          { label: 'Start AI planner', href: '/ai-trip-planner', variant: 'secondary' },
        ]}
        trustNote="Thailand is live now. Other destinations are planning-only while signed local Bókun supplier partners are onboarded."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Live vs coming soon
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
              Clear inventory status before travelers click.
            </h2>
            <p className="mt-4 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              Bookable products appear only when RadarScout has signed supplier partner inventory. Planning-only destinations are useful for route ideas, but they do not pretend to have available tours.
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
                Live inventory
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                First signed supplier destination.
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              Thailand is the first live inventory destination in the portal. These pages link into the existing tours surface instead of creating fake products.
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
