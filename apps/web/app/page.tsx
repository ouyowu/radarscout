import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQAccordion } from './_components/FAQAccordion'
import { SupplierPartnerCTA } from './_components/SupplierPartnerCTA'
import { TrackedLink } from './_components/TrackedLink'
import { WarmNewsletterFooter } from './_components/WarmNewsletterFooter'
import { Button, ExperienceCard, Section } from './_components/design-system'
import { globalDestinations } from '@/lib/global-destinations'
import { pilotPartnerProducts } from '@/lib/partnerProducts/seed/pilotPartnerProducts'

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
].filter((destination): destination is NonNullable<typeof destination> => Boolean(destination))

const trustItems = [
  { label: 'Thailand focus', value: 'Guided experience discovery' },
  { label: 'Handoff boundary', value: 'Continue with a booking partner' },
  { label: 'Planning engine', value: 'AI itinerary matching' },
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

const plannerPromptChips = [
  'Gentle elephant day in Chiang Mai',
  'Family-friendly Thailand experience',
  'Cooking and local food day',
  'Nature day trip from Chiang Mai',
  'Bangkok or Pattaya elephant day',
]

const chiangMaiPlannerHref = '/chiang-mai/elephant-camp-finder#plan-with-radarscout'

function buildPlannerIdeaHref(prompt: string) {
  return `/ai-trip-planner?idea=${encodeURIComponent(prompt)}#intent-demo`
}

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

const featuredPartnerExperiences = pilotPartnerProducts.slice(0, 4)

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-rs-sand-50 font-rs-body text-rs-ink">
      <section className="relative isolate overflow-hidden bg-rs-forest-900 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(213,124,72,0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(203,216,207,0.18),transparent_32%),linear-gradient(135deg,var(--rs-forest-900),var(--rs-forest-700)_58%,var(--rs-ink))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-rs-sand-50 to-transparent" />

        <nav className="mx-auto flex min-h-20 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Homepage navigation">
          <Link href="/" className="font-rs-display text-2xl font-semibold tracking-[-0.03em] text-white">
            Radar<span className="text-rs-terracotta">Scout</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <Link href="/tours" className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white">
              Experiences
            </Link>
            <Link href="/destinations" className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white">
              Destinations
            </Link>
            <Link href="/ai-trip-planner" className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75 hover:text-white">
              Planner
            </Link>
          </div>
          <Button href="/ai-trip-planner#intent-demo" className="hidden min-h-[44px] px-5 md:inline-flex">
            Open planner
          </Button>
          <span className="rounded-rs-pill border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 md:hidden">
            Menu
          </span>
        </nav>

        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-32 lg:pt-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">Thailand, thoughtfully planned</p>
            <h1 className="mt-5 font-rs-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              AI-guided Thailand Experience Planner
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              Tell RadarScout the kind of Thailand day you want. Compare elephant care, food, nature, family-friendly, and city experiences before continuing with a booking partner.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/ai-trip-planner#intent-demo">Start planning</Button>
              <TrackedLink
                href={chiangMaiPlannerHref}
                event="homepage_finder_entry_clicked"
                eventProps={{ source: 'hero' }}
                className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
              >
                Plan a Chiang Mai elephant day
              </TrackedLink>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/68">
              Thailand is currently RadarScout&apos;s first focused experience destination. Other destinations remain planning-only while local partner coverage improves.
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-rs-lg border border-white/15 bg-white/10 p-5 shadow-rs-soft backdrop-blur">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(15,36,28,0.15),rgba(213,124,72,0.32)),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-end rounded-[1.4rem] border border-white/10 bg-rs-forest-900/35 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">Immersive planning preview</p>
              <h2 className="mt-3 font-rs-display text-4xl font-semibold leading-tight text-white">Forest time, local food, gentle routes.</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Placeholder visual area reserved for owned or licensed Thailand photography.
              </p>
            </div>
          </div>
        </div>
      </section>

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
        variant="sand"
        eyebrow="Start with a travel idea"
        title="Use a prompt, then compare matching experiences."
        lead="RadarScout helps with guided discovery, comparison, and planning. Booking partners handle current operating details and final booking steps."
      >
        <div className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-cloud p-5 shadow-rs-soft sm:p-6">
          <div className="flex flex-wrap gap-3">
            {plannerPromptChips.map(chip => (
              <Link
                key={chip}
                href={buildPlannerIdeaHref(chip)}
                className="inline-flex min-h-[44px] items-center rounded-rs-pill border border-rs-sage-200 bg-rs-sand-100 px-4 text-sm font-semibold text-rs-forest-700 transition hover:bg-rs-sage-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
              >
                {chip}
              </Link>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-xs font-semibold uppercase tracking-[0.14em] text-rs-muted">
            Prompt links load the planner form only. Real Thailand experience search starts after you review and confirm your trip intent.
          </p>
        </div>
      </Section>

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
              imageAlt={`${product.title} visual placeholder`}
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
        eyebrow="AI planning use cases"
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
