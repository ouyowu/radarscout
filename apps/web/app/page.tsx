import type { Metadata } from 'next'
import Link from 'next/link'
import { PromptHero } from './_components/PromptHero'
import { FAQAccordion } from './_components/FAQAccordion'
import { SupplierPartnerCTA } from './_components/SupplierPartnerCTA'
import { TrackedLink } from './_components/TrackedLink'
import { WarmNewsletterFooter } from './_components/WarmNewsletterFooter'
import { ExperienceCard, Section } from './_components/design-system'
import { globalDestinations } from '@/lib/global-destinations'
import { pilotPartnerProducts } from '@/lib/partnerProducts/seed/pilotPartnerProducts'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'RadarScout | Personalized Thailand Experience Planner',
  description:
    'Describe your ideal Thailand day and compare hand-picked experiences for elephant care, cooking, nature, and family-friendly days, then continue with a trusted booking partner.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout | Personalized Thailand Experience Planner',
    description:
      'Compare Thailand experiences, draft a day plan, and continue with a trusted booking partner when you are ready.',
    type: 'website',
    url: base,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout | Personalized Thailand Experience Planner',
    description:
      'Compare Thailand experiences, draft a day plan, and continue with a trusted booking partner when you are ready.',
  },
}

const featuredDestinations = [
  globalDestinations.find(destination => destination.slug === 'thailand'),
  globalDestinations.find(destination => destination.slug === 'japan'),
  globalDestinations.find(destination => destination.slug === 'france'),
].filter((destination): destination is NonNullable<typeof destination> => Boolean(destination))

const trustItems = [
  { label: 'Thailand focus', value: 'Guided experience discovery' },
  { label: 'Handoff boundary', value: 'Continue with a booking partner' },
  { label: 'Planning engine', value: 'Personalized experience matching' },
  { label: 'Expansion model', value: 'Thailand first, then selected destinations' },
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

const chiangMaiPlannerHref = '/chiang-mai/elephant-camp-finder#plan-with-radarscout'

const faqItems = [
  {
    question: 'How broad is RadarScout coverage today?',
    answer:
      'No. RadarScout is Thailand-first. Other destination pages stay planning-only until local partner coverage and handoff paths are reviewed.',
  },
  {
    question: 'Where do recommended experiences come from?',
    answer:
      'RadarScout recommends real local experiences and routes travelers to product or booking partner pages for final details. RadarScout does not add fake, unsupported, or unverified products to the traveler-facing recommendations.',
  },
  {
    question: 'What does the planning engine compare?',
    answer:
      'It helps compare experiences by destination, travel style, time value, itinerary fit, private customization needs, and booking partner handoff fit.',
  },
  {
    question: 'Can I use RadarScout before a destination has full partner coverage?',
    answer:
      'Yes, planning pages can help structure routes and ideas. Destinations without enough local partner coverage are marked as planning-only or coming soon.',
  },
]

const featuredPartnerExperiences = pilotPartnerProducts.slice(0, 4)

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-rs-sand-50 font-rs-body text-rs-ink">
      <PromptHero />

      <section className="border-y border-rs-sage-200/70 bg-rs-sand-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-4">
          {trustItems.map(item => (
            <div key={item.label} className="rounded-rs-md bg-rs-cloud px-5 py-4 shadow-[0_10px_24px_rgba(15,36,28,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-500">{item.label}</p>
              <p className="mt-2 font-rs-display text-xl font-medium leading-tight text-rs-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section
        variant="cloud"
        eyebrow="Reviewed partner examples"
        title="Featured Thailand experiences for the first traveler test."
        lead="These cards point to RadarScout detail pages for reviewed partner products. Final operating details stay with the booking partner handoff."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredPartnerExperiences.map(product => (
            <ExperienceCard
              key={product.id}
              href={`/tours/${encodeURIComponent(product.id)}`}
              eyebrow={product.destination}
              title={product.title}
              summary={product.shortSummary}
              tags={product.tags.slice(0, 3)}
              imageUrl={product.imageUrl}
              imageAlt={product.imageAlt ?? product.title}
            />
          ))}
        </div>
      </Section>

      <section className="bg-rs-sand-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-3">
          {howItWorks.map((item, index) => (
            <article key={item.title} className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-cloud p-7 shadow-rs-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta">Step {index + 1}</p>
              <h2 className="mt-4 font-rs-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-rs-ink">
                {item.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-rs-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <Section variant="forest" className="relative overflow-hidden" contentClassName="relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(213,124,72,0.24),transparent_30%),linear-gradient(135deg,var(--rs-forest-900),var(--rs-forest-700))]" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-rs-lg border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">Chiang Mai guided planner</p>
            <h2 className="mt-4 font-rs-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
              Plan a Chiang Mai elephant day
            </h2>
            <p className="mt-5 text-base leading-8 text-white/74">
              Use RadarScout&apos;s guided planner to compare experiences for elephant care, cooking, nature, and family-friendly travel before you continue with a booking partner.
            </p>
            <TrackedLink
              href={chiangMaiPlannerHref}
              event="homepage_finder_entry_clicked"
              eventProps={{ source: 'section' }}
              className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-rs-soft transition hover:bg-rs-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
            >
              Plan with RadarScout
            </TrackedLink>
          </div>
          <div className="rounded-rs-lg border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">Thailand-first rollout</p>
            <h2 className="mt-4 font-rs-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
              Thailand is live first. Other destinations stay planning-only.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/72">
              RadarScout focuses current product coverage on Thailand experiences. Other destination pages help structure future routes while local partner coverage is reviewed city by city.
            </p>
          </div>
        </div>
      </Section>

      <Section
        variant="sand"
        eyebrow="Destination structure"
        title="Thailand first, then selected destinations."
        lead="Destination pages help structure future routes while reviewed local partner coverage is still being expanded."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {featuredDestinations.map(destination => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-cloud p-6 shadow-rs-soft transition hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-500">{destination.region}</p>
              <h3 className="mt-3 font-rs-display text-3xl font-semibold leading-tight text-rs-ink">{destination.name}</h3>
              <p className="mt-4 text-sm leading-7 text-rs-muted">{destination.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {destination.popularTourTypes.slice(0, 3).map(highlight => (
                  <span key={highlight} className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-forest-700">
                    {highlight}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        variant="cloud"
        eyebrow="Trip planning use cases"
        title="Plan around real Thailand routes before you choose details."
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-sand-50 p-6 shadow-rs-soft">
            <ul className="grid gap-3 text-sm font-semibold leading-7 text-rs-muted sm:grid-cols-2">
              <li>Plan 7 days in Thailand</li>
              <li>Compare Bangkok and Chiang Mai day tours</li>
              <li>Plan elephant care, cooking, and nature days</li>
              <li>Prepare Pattaya or Phuket day-trip ideas</li>
              <li>Find food, culture, transfers, and local Thailand activities</li>
              <li>Match Thailand routes to realistic daily timing</li>
            </ul>
          </div>
          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-forest-900 p-6 text-white shadow-rs-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">Partner-direct value</p>
            <h2 className="mt-4 font-rs-display text-4xl font-semibold leading-tight">Trusted local experience discovery, then secure booking handoff.</h2>
            <p className="mt-5 text-sm leading-7 text-white/72">
              RadarScout keeps discovery and trip-fit comparison separate from final product details, so travelers can compare ideas before continuing with the right booking partner.
            </p>
          </div>
        </div>
      </Section>

      <SupplierPartnerCTA showPartnerPathLinks />
      <FAQAccordion items={faqItems} title="RadarScout travel planning FAQ" />
      <WarmNewsletterFooter
        title="Follow RadarScout's destination rollout."
        body="For now, email us for supplier partnerships, destination planning requests, and private tour questions. Automated newsletter signup is not part of this page."
      />
    </main>
  )
}
