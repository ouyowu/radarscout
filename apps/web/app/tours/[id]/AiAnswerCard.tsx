import React from 'react'

import type { ActivityFeedV1Item } from '@/lib/activityFeed/activityFeedV1'

type AiAnswerCardProps = {
  card: ActivityFeedV1Item
}

function formatReviewedDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export function AiAnswerCard({ card }: AiAnswerCardProps) {
  const serializedCard = JSON.stringify(card).replace(/</g, '\\u003c')

  return (
    <>
      <script
        type="application/json"
        data-radarscout-ai-answer-card
        dangerouslySetInnerHTML={{ __html: serializedCard }}
      />
      <article aria-label="RadarScout AI Answer Card" className="rounded-rs-lg border border-rs-sage-200/80 bg-white p-6 shadow-rs-soft sm:p-8">
        <div className="flex flex-col gap-3 border-b border-rs-sage-200/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta-600">
              AI Answer Card
            </p>
            <h2 className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">
              A reviewed answer before the partner handoff.
            </h2>
          </div>
          <p className="text-xs font-semibold text-rs-muted">
            Last reviewed {formatReviewedDate(card.provenance.verifiedAt)}
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">Why recommended</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">{card.recommendation.whyRecommended.value}</p>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-trust">Best for</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-rs-muted">
              {card.suitableFor.value.map(value => <li key={value}>{value}</li>)}
            </ul>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Check before choosing</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">{card.recommendation.tradeoffs.value[0]}</p>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">Not suitable for</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">
              Not independently reviewed. Use the caution above and confirm participation rules with the partner.
            </p>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">Experience features</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">{card.experienceFeatures.value.join(' · ')}</p>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">Pickup, duration and child rules</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">
              Not independently reviewed. Confirm these details on the partner page before choosing.
            </p>
          </section>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-forest-700">Current partner</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">
              {card.partnerHandoff.provider} handles current product details and the final transaction.
            </p>
          </section>
        </div>
      </article>
    </>
  )
}
