import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'
import { DmcTrustBar } from '../_components/DmcTrustBar'

export const metadata: Metadata = {
  title: 'About RadarScout | Thailand Day-Trip Decision Support',
  description:
    'How RadarScout helps English-speaking travelers compare reviewed Thailand day trips, understand the tradeoffs, and continue safely to affiliate partners.',
}

const trustItems = [
  { label: 'Current focus', value: 'Thailand day trips' },
  { label: 'Product facts', value: 'Reviewed product records' },
  { label: 'Activity handoff', value: 'Current details on Viator' },
  { label: 'Hotel handoff', value: 'Current details on Agoda' },
]

const recommendationPrinciples = [
  {
    number: '01',
    title: 'Why we recommend it',
    copy: 'A useful recommendation needs a clear reason: destination fit, activity style, pace, or the kind of day it helps a traveler build.',
  },
  {
    number: '02',
    title: 'Who it suits',
    copy: 'We surface the travel style and interests behind a match so families, couples, friends, and solo travelers can judge the fit.',
  },
  {
    number: '03',
    title: 'What to check before choosing',
    copy: 'We point out the details worth confirming—timing, meeting arrangements, inclusions, pace, current terms, and possible tradeoffs.',
  },
]

export default function AboutUsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Thailand-focused decision support"
        title="Thailand trip decisions should feel clearer—not more crowded."
        subtitle="RadarScout turns a travel idea into a smaller set of reviewed day-trip options, then explains the fit before the traveler continues to an external booking partner."
        actions={[
          { label: 'Plan a Thailand day', href: '/planner' },
          { label: 'Browse reviewed experiences', href: '/tours', variant: 'secondary' },
        ]}
        trustNote="RadarScout is a recommendation and comparison layer. It does not own inventory, take payment, or confirm a booking."
      />

      <DmcTrustBar items={trustItems} />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Our point of view
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              Better guidance before another marketplace page.
            </h2>
            <p className="mt-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              Travelers can already find thousands of Thailand activities. The harder job is deciding which kind of day makes sense, which option fits the group, and what must be checked before committing. RadarScout focuses on that decision.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {recommendationPrinciples.map((principle) => (
              <article
                key={principle.number}
                className="rounded-[2rem] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-7 shadow-lg"
              >
                <span className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-live-inventory)]">
                  {principle.number}
                </span>
                <h3 className="mt-4 font-[var(--font-heading)] text-3xl font-black leading-tight tracking-[-0.03em]">
                  {principle.title}
                </h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                  {principle.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="min-w-0 rounded-[2rem] bg-[var(--color-bg-dark)] p-8 text-white shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange)]">
              What RadarScout owns
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">
              The planning and recommendation layer.
            </h2>
            <ul className="mt-6 space-y-4 text-sm font-semibold leading-7 text-white/80">
              <li>• Understanding the city, days, interests, pace, and group.</li>
              <li>• Matching only reviewed public product records.</li>
              <li>• Explaining fit, traveler suitability, and practical tradeoffs.</li>
              <li>• Leaving missing or unverified facts out instead of inventing them.</li>
            </ul>
          </article>

          <article className="min-w-0 rounded-[2rem] border border-[var(--color-border-light)] bg-white p-8 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
              What partners handle
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">
              Current commercial details and the transaction.
            </h2>
            <p className="mt-5 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              Viator handles current activity details and the next booking step. Agoda handles current hotel details and accommodation booking. RadarScout does not take payment, control availability, issue confirmations, or manage changes and cancellations.
            </p>
            <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              When a reviewed activity has a verified affiliate handoff, the action remains <strong>Check availability</strong>.
            </p>
            <Link
              href="/affiliate-disclosure"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--color-live-inventory)] px-6 text-sm font-black text-[var(--color-live-inventory)]"
            >
              Read our affiliate disclosure
            </Link>
          </article>
        </div>
      </section>
    </main>
  )
}
