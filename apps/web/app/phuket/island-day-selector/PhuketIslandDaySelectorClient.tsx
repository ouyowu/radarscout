'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { track } from '@/lib/analytics/track'
import {
  buildPartnerHandoffAnalyticsProps,
  createPartnerHandoffRecord,
} from '@/lib/affiliates/partnerHandoff'
import {
  selectPhuketIslandDayMatches,
  type PhuketIslandExperience,
  type PhuketIslandPace,
  type PhuketIslandTravelerType,
} from '@/lib/phuketSelector/phuketIslandSelector'
import type { ReviewedViatorPublicProduct } from '@/lib/viator/reviewedViatorPublicCatalogue'

type PhuketIslandDaySelectorClientProps = {
  products: readonly ReviewedViatorPublicProduct[]
}

const experienceOptions: readonly { value: PhuketIslandExperience; label: string }[] = [
  { value: 'scenery', label: 'Island scenery' },
  { value: 'snorkeling', label: 'Snorkeling & water time' },
  { value: 'relaxed', label: 'Relaxed boat day' },
]

const travelerOptions: readonly { value: PhuketIslandTravelerType; label: string }[] = [
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'friends', label: 'Friends' },
]

const paceOptions: readonly { value: PhuketIslandPace; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'active', label: 'Active' },
]

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value
              ? 'min-h-[44px] rounded-rs-pill bg-rs-forest-900 px-5 text-sm font-bold text-white'
              : 'min-h-[44px] rounded-rs-pill border border-rs-sage-200 bg-white px-5 text-sm font-bold text-rs-muted hover:border-rs-forest-500'}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function reviewedDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export function PhuketIslandDaySelectorClient({ products }: PhuketIslandDaySelectorClientProps) {
  const [experience, setExperience] = useState<PhuketIslandExperience>('scenery')
  const [travelerType, setTravelerType] = useState<PhuketIslandTravelerType>('couple')
  const [pace, setPace] = useState<PhuketIslandPace>('balanced')
  const [submitted, setSubmitted] = useState(false)

  const matches = useMemo(
    () => selectPhuketIslandDayMatches(products, { experience, travelerType, pace }),
    [experience, pace, products, travelerType],
  )

  function showMatches() {
    setSubmitted(true)
    track('finder_matching_experiences_clicked', {
      destination: 'phuket',
      source: 'phuket_island_day_selector',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
      <section className="rounded-rs-lg border border-rs-sage-200/80 bg-white p-6 shadow-rs-soft lg:sticky lg:top-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rs-terracotta-600">
          Three quick choices
        </p>
        <h2 className="mt-3 font-rs-display text-3xl font-semibold text-rs-ink">
          What kind of island day fits you?
        </h2>
        <div className="mt-7 space-y-7">
          <OptionGroup
            label="Main priority"
            value={experience}
            options={experienceOptions}
            onChange={setExperience}
          />
          <OptionGroup
            label="Who is going"
            value={travelerType}
            options={travelerOptions}
            onChange={setTravelerType}
          />
          <OptionGroup
            label="Preferred pace"
            value={pace}
            options={paceOptions}
            onChange={setPace}
          />
        </div>
        <button
          type="button"
          onClick={showMatches}
          className="mt-8 min-h-[52px] w-full rounded-rs-pill bg-rs-terracotta px-6 text-sm font-black uppercase tracking-[0.1em] text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
        >
          See my 3 matches
        </button>
        <p className="mt-4 text-xs font-semibold leading-5 text-rs-muted">
          Matching is deterministic and uses only RadarScout-reviewed Phuket products.
        </p>
      </section>

      <section aria-live="polite" aria-label="Phuket island day matches">
        {!submitted ? (
          <div className="rounded-rs-lg border border-dashed border-rs-sage-200 bg-rs-sand-50 p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">
              Decision support, not a generic list
            </p>
            <h2 className="mt-3 max-w-2xl font-rs-display text-4xl font-semibold text-rs-ink">
              Get three reviewed options with the trade-offs made clear.
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-rs-muted">
              RadarScout explains why each option fits, who may prefer something else, and what
              you still need to confirm with Viator before choosing.
            </p>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">
                Your reviewed shortlist
              </p>
              <h2 className="mt-2 font-rs-display text-4xl font-semibold text-rs-ink">
                Three Phuket island-day matches
              </h2>
            </div>
            {matches.map((match, index) => (
              <article
                key={match.product.id}
                className="overflow-hidden rounded-rs-lg border border-rs-sage-200/80 bg-white shadow-rs-soft"
              >
                <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={match.product.imageUrl}
                    alt={match.product.title}
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
                  />
                  <div className="p-5 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-terracotta-600">
                      Match {index + 1} · Reviewed {reviewedDate(match.product.reviewedAt)}
                    </p>
                    <h3 className="mt-2 font-rs-display text-2xl font-semibold leading-tight text-rs-ink">
                      {match.product.title}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-rs-muted">
                      {match.product.summary}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-rs-md bg-rs-sand-50 p-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-rs-forest-700">
                          Why RadarScout recommends it
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-rs-muted">{match.whyRecommended}</p>
                      </div>
                      <div className="rounded-rs-md bg-rs-sage-200/35 p-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-rs-forest-700">
                          Check before choosing
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-rs-muted">{match.watchOut}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-rs-forest-700">Best for</h4>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-rs-muted">
                          {match.bestFor.map(item => <li key={item}>• {item}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-rs-forest-700">Not ideal for</h4>
                        <ul className="mt-2 space-y-1 text-sm leading-6 text-rs-muted">
                          {match.notFor.map(item => <li key={item}>• {item}</li>)}
                        </ul>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-2 rounded-rs-md border border-rs-sage-200/80 p-4 text-sm sm:grid-cols-3">
                      <div><dt className="font-bold text-rs-ink">Price</dt><dd className="mt-1 text-rs-muted">Check on Viator</dd></div>
                      <div><dt className="font-bold text-rs-ink">Pickup</dt><dd className="mt-1 text-rs-muted">Confirm coverage</dd></div>
                      <div><dt className="font-bold text-rs-ink">Cancellation</dt><dd className="mt-1 text-rs-muted">Review current terms</dd></div>
                    </dl>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={match.product.detailHref}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-rs-pill border border-rs-forest-500 px-5 text-sm font-bold text-rs-forest-700"
                      >
                        Review details
                      </Link>
                      <a
                        href={match.product.bookingPartnerHandoff.href}
                        target="_blank"
                        rel={match.product.bookingPartnerHandoff.rel}
                        onClick={() => {
                          const handoff = createPartnerHandoffRecord({
                            href: match.product.bookingPartnerHandoff.href,
                            provider: 'viator',
                            placement: 'planner_filtered_matches',
                            destination: 'Phuket',
                            productId: match.product.id,
                            recommendationSource: 'planner',
                            safeIntent: {
                              hasDates: false,
                              hasGroupSize: false,
                              hasOccupancy: false,
                              travelerType: 'unspecified',
                            },
                          })
                          if (handoff) {
                            track('booking_partner_handoff_clicked', buildPartnerHandoffAnalyticsProps(handoff))
                          }
                        }}
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-black text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                      >
                        Check availability
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-rs-lg border border-rs-sage-200 bg-white p-8 text-sm font-semibold leading-7 text-rs-muted">
            No reviewed Phuket island-day products match these choices yet. Try another priority or pace.
          </div>
        )}
      </section>
    </div>
  )
}
