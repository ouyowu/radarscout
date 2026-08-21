'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostHandoffNextStepCandidate } from '@/lib/activityFeed/postHandoffNextStep'
import type { SafeAffiliateAnalyticsContext } from '@/lib/affiliates/affiliateTripContext'
import { TrackedBookingPartnerHandoff } from './TrackedBookingPartnerHandoff'

type PostHandoffNextStepProps = {
  href: string
  rel: 'nofollow sponsored noopener noreferrer'
  productId: string
  city: string
  source: 'ai-trip-planner' | 'tour-detail'
  safeTripContext: SafeAffiliateAnalyticsContext
  primaryLabel: 'Check availability'
  candidates: PostHandoffNextStepCandidate[]
}

function candidateReason(candidate: PostHandoffNextStepCandidate) {
  return `A different reviewed ${candidate.item.destination.city} theme for another day: ${candidate.newThemes.join(' · ')}.`
}

export function PostHandoffNextStep({
  href,
  rel,
  productId,
  city,
  source,
  safeTripContext,
  primaryLabel,
  candidates,
}: PostHandoffNextStepProps) {
  const [showNextSteps, setShowNextSteps] = useState(false)

  return (
    <div>
      <TrackedBookingPartnerHandoff
        href={href}
        rel={rel}
        productId={productId}
        source={source}
        placement="tour_detail_primary"
        city={city}
        {...safeTripContext}
        onTrackedClick={() => setShowNextSteps(true)}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
      >
        {primaryLabel}
      </TrackedBookingPartnerHandoff>

      {showNextSteps && candidates.length > 0 ? (
        <section aria-live="polite" className="mt-5 rounded-rs-md border border-rs-sage-200/80 bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rs-sage-200">
            You may also need
          </p>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Planning another day in {city}? These are separately reviewed experiences, not booking suggestions or purchase confirmations.
          </p>
          <div className="mt-4 grid gap-3">
            {candidates.map(candidate => (
              <article key={candidate.item.id} className="rounded-rs-sm bg-white/10 p-4">
                <h3 className="text-sm font-bold leading-6 text-white">{candidate.item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/70">{candidateReason(candidate)}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={candidate.item.detailHref}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-rs-pill border border-white/30 px-4 text-xs font-bold text-white transition hover:border-rs-sage-200 hover:text-rs-sage-200"
                  >
                    Review details
                  </Link>
                  <TrackedBookingPartnerHandoff
                    href={candidate.item.partnerHandoff.url}
                    rel="nofollow sponsored noopener noreferrer"
                    productId={candidate.item.id}
                    source="tour-detail"
                    placement="post_handoff_next_step"
                    reasonCode="theme_match"
                    city={candidate.item.destination.city}
                    {...safeTripContext}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-rs-pill bg-rs-sage-200 px-4 text-xs font-bold text-rs-ink transition hover:bg-white"
                  >
                    {candidate.item.partnerHandoff.label}
                  </TrackedBookingPartnerHandoff>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
