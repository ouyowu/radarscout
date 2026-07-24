import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'
import { DestinationCapsuleCard } from '../_components/DestinationCapsuleCard'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { FAQAccordion } from '../_components/FAQAccordion'
import { reviewedDestinationCoverage } from './reviewedDestinationCoverage'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Destinations | RadarScout Day-Trip Planner',
  description:
    'Choose a Thailand city and compare reviewed Thailand day trips with clear fit guidance and a verified Viator affiliate handoff.',
  alternates: { canonical: `${base}/destinations` },
}

const trustItems = [
  { label: 'Reviewed catalogue', value: `${reviewedDestinationCoverage.productCount} experiences` },
  { label: 'Thailand coverage', value: `${reviewedDestinationCoverage.cityCount} cities` },
  { label: 'Recommendation style', value: 'Fit before endless sorting' },
  { label: 'Current details', value: 'Confirmed on Viator' },
]

const faqItems = [
  {
    question: 'Which Thailand destinations can I browse?',
    answer:
      'This page lists every Thailand city or island area represented in RadarScout’s reviewed Viator catalogue. Coverage grows only after product records and affiliate handoffs pass review.',
  },
  {
    question: 'Why does RadarScout narrow the list?',
    answer:
      'The goal is to reduce sorting work. Each public experience includes a short reason to consider it, who it may suit, and what to verify before choosing.',
  },
  {
    question: 'Where do current prices and booking details come from?',
    answer:
      'Current details and booking remain on Viator. RadarScout uses verified Viator affiliate links and does not claim to control availability or complete a booking.',
  },
  {
    question: 'Can I ask the planner to compare a specific city?',
    answer:
      'Yes. Open Planner Studio and describe the Thailand city, number of days, interests, group, and preferred pace. The planner matches only reviewed catalogue records.',
  },
]

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Reviewed Thailand coverage"
        title="Choose a Thailand city. Start with experiences already reviewed."
        subtitle="Browse city-by-city shortlists, see why an experience may fit, and check the tradeoffs before continuing to Viator for current details."
        actions={[
          { label: 'Plan my Thailand days', href: '/planner' },
          { label: 'Browse all experiences', href: '/tours', variant: 'secondary' },
        ]}
        trustNote="Thailand-only for now. Product facts come from reviewed records; current details and booking remain on Viator."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                City-by-city discovery
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                Browse {reviewedDestinationCoverage.cityCount} reviewed Thailand cities.
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              Popular hubs appear first. Every card opens the real filtered catalogue—no empty destination page and no invented product coverage.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviewedDestinationCoverage.cities.map((destination) => (
              <DestinationCapsuleCard
                key={destination.slug}
                name={destination.label}
                href={destination.href}
                status="live"
                region={`Thailand · ${destination.productCount} reviewed ${destination.productCount === 1 ? 'experience' : 'experiences'}`}
                summary={`Compare the reviewed ${destination.label} shortlist, then open a product detail before the Viator handoff.`}
                highlights={destination.tags}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
            Decision support, not another marketplace wall
          </p>
          <h2 className="mt-3 max-w-4xl font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
            Three questions before you leave RadarScout.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                label: '01',
                title: 'Why RadarScout narrowed it down',
                copy: 'Look for a clear city, theme, and day-trip fit rather than an unsupported popularity claim.',
              },
              {
                label: '02',
                title: 'Who the experience suits',
                copy: 'Use the tags and planner context to judge whether the pace and activity style match your group.',
              },
              {
                label: '03',
                title: 'What to check before choosing',
                copy: 'Confirm current timing, meeting details, inclusions, price, and booking terms on Viator.',
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[2rem] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-7 shadow-lg"
              >
                <span className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-live-inventory)]">
                  {item.label}
                </span>
                <h3 className="mt-4 font-[var(--font-heading)] text-3xl font-black leading-tight tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 rounded-[2rem] bg-[var(--color-bg-dark)] p-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange)]">
                Need help choosing?
              </p>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-white/75">
                Tell Planner Studio the city, duration, group, pace, and interests. It will stay within the reviewed Thailand catalogue.
              </p>
            </div>
            <Link
              href="/planner"
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-7 text-sm font-black text-[var(--color-text-primary)]"
            >
              Open Planner Studio
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion items={faqItems} title="Destination portal FAQ" />
    </main>
  )
}
