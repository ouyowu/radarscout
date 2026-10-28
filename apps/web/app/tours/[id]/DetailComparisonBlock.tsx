import React from 'react'
import Link from 'next/link'
import type { ActivityFeedV1Item } from '@/lib/activityFeed/activityFeedV1'
import type { DetailComparisonCandidate } from '@/lib/activityFeed/detailComparison'
import { selectReviewedActivityOffer } from '@/lib/activityFeed/activityOfferSelection'
import { Card } from '@/app/_components/design-system'
import { TrackedBookingPartnerHandoff } from './TrackedBookingPartnerHandoff'

type DetailComparisonBlockProps = {
  primary: ActivityFeedV1Item
  candidates: DetailComparisonCandidate[]
}

type ComparisonFact = {
  label: string
  value: string
}

function formatReviewedDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function displayable(value: { status: string; value: string | string[] | null }) {
  if (value.status === 'not_reviewed') return null
  if (Array.isArray(value.value)) return value.value.filter(Boolean).join(' · ') || null
  return value.value?.trim() || null
}

function comparisonFacts(item: ActivityFeedV1Item): ComparisonFact[] {
  const fields: Array<[string, string | null]> = [
    ['Duration', displayable(item.duration)],
    ['Pickup', displayable(item.pickupArea)],
    ['Cancellation', displayable(item.cancellationPolicy)],
    ['Best for', displayable(item.suitableFor)],
    ['Not recommended for', displayable(item.notSuitableFor)],
    ['Why RadarScout included it', displayable(item.recommendation.whyRecommended)],
  ]

  return [
    ...fields
      .filter((field): field is [string, string] => Boolean(field[1]))
      .map(([label, value]) => ({ label, value })),
    { label: 'Last verified', value: formatReviewedDate(item.provenance.verifiedAt) },
  ]
}

export function DetailComparisonBlock({ primary, candidates }: DetailComparisonBlockProps) {
  if (candidates.length === 0) return null

  return (
    <section aria-labelledby="compare-reviewed-experiences" className="bg-rs-cloud-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-terracotta-600">
            Compare reviewed experiences
          </p>
          <h2 id="compare-reviewed-experiences" className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">
            Similar {primary.destination.city} experiences to consider
          </h2>
          <p className="mt-3 text-sm leading-7 text-rs-muted">
            These alternatives share a reviewed destination and experience theme. RadarScout only shows details prepared for public comparison; missing facts stay hidden.
          </p>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {candidates.map(({ item, sharedThemes }) => {
            const offer = selectReviewedActivityOffer(item)

            return (
            <Card key={item.id} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-forest-700">
                    Also matches {sharedThemes.join(' · ')}
                  </p>
                  <h3 className="mt-2 font-rs-display text-2xl font-semibold leading-tight text-rs-ink">
                    <Link href={item.detailHref} className="transition hover:text-rs-terracotta-600">
                      {item.title}
                    </Link>
                  </h3>
                </div>
                <span className="shrink-0 rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-forest-700">
                  Reviewed
                </span>
              </div>

              <dl className="mt-5 grid gap-3 border-y border-rs-sage-200/70 py-5 text-sm">
                {comparisonFacts(item).map((fact) => (
                  <div key={fact.label} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-3">
                    <dt className="font-semibold text-rs-forest-700">{fact.label}</dt>
                    <dd className="leading-6 text-rs-muted">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={item.detailHref}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill border border-rs-sage-200 px-5 text-sm font-bold text-rs-forest-700 transition hover:border-rs-terracotta hover:text-rs-terracotta-600"
                >
                  Compare details
                </Link>
                {offer ? (
                  <TrackedBookingPartnerHandoff
                    href={offer.deeplink}
                    rel="nofollow sponsored noopener noreferrer"
                    productId={item.id}
                    source="tour-detail"
                    placement="tour_detail_compare"
                    reasonCode="theme_match"
                    city={item.destination.city}
                    hasDates={false}
                    hasGroupSize={false}
                    hasOccupancy={false}
                    travelerType="unspecified"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                  >
                    {item.partnerHandoff.label}
                  </TrackedBookingPartnerHandoff>
                ) : null}
              </div>
            </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
