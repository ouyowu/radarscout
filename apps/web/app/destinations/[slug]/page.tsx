import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdventureHero } from '@/app/_components/AdventureHero'
import { CityActivityPartnerLinks } from '@/app/_components/CityActivityPartnerLinks'
import { DestinationCapsuleCard } from '@/app/_components/DestinationCapsuleCard'
import { EditorialBanner } from '@/app/_components/EditorialBanner'
import { ExperienceCategoryGrid } from '@/app/_components/ExperienceCategoryGrid'
import { FAQAccordion } from '@/app/_components/FAQAccordion'
import { PartnerInventoryNotice } from '@/app/_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from '@/app/_components/SupplierPartnerCTA'
import { getGlobalDestination, globalDestinations } from '@/lib/global-destinations'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type DestinationPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return globalDestinations.map(destination => ({ slug: destination.slug }))
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = getGlobalDestination(params.slug)
  if (!destination) return {}

  const title = destination.hasLiveInventory
    ? `${destination.name} AI Destination Portal | Focused Experience Coverage`
    : `${destination.name} Travel Planning Guide | Planning-Only`
  const description = destination.hasLiveInventory
    ? `${destination.shortDescription} RadarScout highlights traveler-ready experience discovery with booking partner handoff.`
    : `${destination.shortDescription} Planning-only destination guide while RadarScout onboards trusted local suppliers.`

  return {
    title,
    description,
    alternates: { canonical: `${base}/destinations/${destination.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${base}/destinations/${destination.slug}`,
    },
  }
}

function relatedDestinations(currentSlug: string) {
  return globalDestinations
    .filter(destination => destination.slug !== currentSlug)
    .slice(0, 3)
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = getGlobalDestination(params.slug)
  if (!destination) notFound()

  const inventoryStatus = destination.hasLiveInventory ? 'live' : 'planning-only'
  const related = relatedDestinations(destination.slug)
  const faqItems = [
    {
      question: `Can I compare ${destination.name} experiences on RadarScout now?`,
      answer: destination.hasLiveInventory
        ? 'Thailand currently has traveler-ready recommendations with booking partner handoff. RadarScout sends travelers to the partner page for final details.'
        : `Not yet. ${destination.name} is a planning-only destination while RadarScout onboards trusted local suppliers.`,
    },
    {
      question: 'What makes this a destination planning portal?',
      answer:
        'RadarScout combines destination planning, experience category matching, private itinerary thinking, and clear booking partner handoff boundaries instead of behaving like a generic product list.',
    },
    {
      question: 'Does RadarScout show third-party marketplace or affiliate products here?',
      answer: destination.hasLiveInventory
        ? 'RadarScout may include clearly marked affiliate links as optional comparison handoffs. The partner website handles final product details, availability, booking, purchase, and confirmation.'
        : 'No. Destinations without enough reviewed coverage remain planning-only and do not display unsupported products or affiliate links.',
    },
    {
      question: 'How can a local supplier join this destination?',
      answer:
        'Local tour operators and destination partners can contact RadarScout to discuss day tours, private tours, transfers, food tours, cultural experiences, and custom local activities.',
    },
  ]

  const categoryCards = destination.popularTourTypes.slice(0, 4).map(type => ({
    title: type,
    description: destination.hasLiveInventory
      ? `RadarScout can match ${type.toLowerCase()} with current Thailand experience coverage where safe partner handoff details are available.`
      : `${type} is part of this planning guide and will become traveler-ready only after trusted local supplier coverage is connected.`,
    label: destination.hasLiveInventory ? 'Focused destination' : 'Planning only',
  }))

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow={destination.hasLiveInventory ? 'Focused destination portal' : 'Planning-only destination portal'}
        title={destination.heroTitle}
        subtitle={destination.hasLiveInventory
          ? `${destination.shortDescription} RadarScout helps compare experience types, route fit, travel style, time value, and private customization needs.`
          : `${destination.shortDescription} This is a planning-only route guide; product recommendations stay off until trusted local supplier coverage is reviewed.`
        }
        actions={[
          destination.hasLiveInventory
            ? { label: 'Explore Thailand experiences', href: '/tours' }
            : { label: 'Start AI planner', href: '/ai-trip-planner' },
          { label: 'All destinations', href: '/destinations', variant: 'secondary' },
        ]}
        trustNote={
          destination.hasLiveInventory
            ? 'Thailand is currently RadarScout’s first focused experience destination with booking partner handoff.'
            : 'Planning only — partner tours are coming soon. Thailand is currently RadarScout’s first focused experience destination.'
        }
      />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Destination expert portal
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Best for realistic private trip planning.
            </h2>
            <div className="mt-5 grid gap-3 text-sm font-bold leading-7 text-[var(--color-text-secondary)]">
              <p>Recommended stay: {destination.recommendedDays}</p>
              <p>Best time to visit: {destination.bestTimeToVisit}</p>
              <p>Top cities: {destination.topCities.slice(0, 5).join(' / ')}</p>
            </div>
          </div>
          <PartnerInventoryNotice
            status={inventoryStatus}
            currentDestination={destination.name}
          />
        </div>
      </section>

      <ExperienceCategoryGrid
        eyebrow={`${destination.name} experience types`}
        title="Match the trip style before choosing the tour."
        categories={categoryCards}
      />

      {destination.slug === 'thailand' ? <CityActivityPartnerLinks /> : null}

      {destination.hasLiveInventory ? (
        <EditorialBanner
          label="Focused experience coverage"
          title="Thailand partner-ready experiences are available through the existing discovery catalog."
          body="RadarScout keeps traveler recommendations behind a safe handoff boundary. Use the tours page to browse current Thailand experience options and continue with a booking partner for final details."
          href="/tours"
          ctaLabel="Browse Thailand tours"
        />
      ) : (
        <EditorialBanner
          label="Partner tours coming soon"
          title={`${destination.name} remains planning-only while supplier onboarding continues.`}
          body="This page supports destination research and AI itinerary planning. It does not display fake products, affiliate products, or unsupported availability claims."
          href="/ai-trip-planner"
          ctaLabel="Plan this route"
        />
      )}

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
            Suggested planning flow
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              `Use ${destination.topCities[0]} as the first planning anchor.`,
              `Add ${destination.topCities[1] ?? destination.topCities[0]} if the trip has enough days.`,
              destination.hasLiveInventory
                ? 'Compare Thailand experience options against your daily timing.'
                : 'Mark partner tours as coming soon until trusted local supplier coverage is connected.',
            ].map((idea, index) => (
              <article key={idea} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">Idea {index + 1}</p>
                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{idea}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!destination.hasLiveInventory ? (
        <SupplierPartnerCTA
          title={`Operate tours in ${destination.name}?`}
          body={`RadarScout is onboarding trusted local suppliers for ${destination.name}. We are interested in day tours, private tours, transfers, food tours, cultural experiences, and custom local activities that can be directly operated and fulfilled.`}
        />
      ) : null}

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
            Related destination planning
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map(item => (
              <DestinationCapsuleCard
                key={item.slug}
                name={item.name}
                href={`/destinations/${item.slug}`}
                status={item.hasLiveInventory ? 'live' : 'coming-soon'}
                region={item.region}
                summary={item.shortDescription}
                highlights={item.popularTourTypes.slice(0, 3)}
              />
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion items={faqItems} title={`${destination.name} destination FAQ`} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-10 text-center sm:px-6 lg:px-8">
        <a
          href="mailto:hello@radarscout.io?subject=RadarScout%20Supplier%20Partnership%20Inquiry"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]"
        >
          Email us to become a partner
        </a>
      </section>
    </main>
  )
}
