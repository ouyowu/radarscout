'use client'

import React from 'react'
import type { ReviewedAgodaStayAreaOffer } from '@/lib/affiliates/agodaStayAreaOffers'
import { getReviewedAgodaStayAreasForDestination } from '@/lib/affiliates/agodaStayAreaOffers'
import { addAgodaTripContextToHref } from '@/lib/affiliates/agodaTripContext'
import { TrackedAffiliateLink } from '../_components/TrackedAffiliateLink'
import type { AffiliateTripContext } from '@/lib/affiliates/affiliateTripContext'

type AgodaStayAreaPanelProps = {
  destination: string
  offers: readonly ReviewedAgodaStayAreaOffer[]
  tripContext: AffiliateTripContext
}

export function AgodaStayAreaPanel({ destination, offers, tripContext }: AgodaStayAreaPanelProps) {
  const destinationOffers = getReviewedAgodaStayAreasForDestination(offers, destination)
  if (destinationOffers.length === 0) return null
  const hasConfirmedOccupancy = tripContext.adultCount !== null && tripContext.childCount !== null

  return (
    <section
      aria-label={`Reviewed places to stay in ${destinationOffers[0].area.city}`}
      className="rounded-rs-lg border border-rs-sage-200/80 bg-white p-5 shadow-rs-soft sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-rs-forest-700">Where to stay</p>
      <div className="mt-2 max-w-3xl">
        <h3 className="font-rs-display text-2xl font-semibold tracking-[-0.025em] text-rs-ink sm:text-3xl">
          Choose a reviewed {destinationOffers[0].area.city} base
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">
          RadarScout reviewed these neighbourhoods for different trip styles. Compare the fit and tradeoffs here, then continue to Agoda for current hotel details.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {destinationOffers.map(({ area, offer }) => (
          <article key={area.id} className="flex h-full flex-col rounded-rs-md border border-rs-sage-200 bg-rs-sand-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Best for</p>
            <p className="mt-1 text-sm font-bold leading-6 text-rs-forest-700">{area.bestFor}</p>
            <h4 className="mt-4 font-rs-display text-2xl font-semibold text-rs-ink">{area.name}</h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-rs-muted">{area.summary}</p>

            <div className="mt-4 border-t border-rs-sage-200 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">What to check</p>
              <ul className="mt-2 space-y-2 text-sm font-semibold leading-5 text-rs-muted">
                {area.tradeoffs.map(tradeoff => (
                  <li key={tradeoff} className="flex gap-2">
                    <span aria-hidden="true" className="text-rs-terracotta-600">•</span>
                    <span>{tradeoff}</span>
                  </li>
                ))}
              </ul>
            </div>

            <TrackedAffiliateLink
              href={addAgodaTripContextToHref(offer.href, tripContext)}
              provider={offer.provider}
              placement={offer.placement}
              destination={offer.destination}
              campaign={offer.campaign}
              tripContext={tripContext}
              className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
            >
              Search Agoda stays
            </TrackedAffiliateLink>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold leading-5 text-rs-muted">
        RadarScout provides area guidance only. Current hotel details and the final continue step stay on Agoda.
      </p>
      {tripContext.startDate && tripContext.endDate ? (
        <p className="mt-2 text-xs font-semibold leading-5 text-rs-forest-700">
          {hasConfirmedOccupancy
            ? 'Your confirmed stay dates and occupancy are included in the Agoda search.'
            : 'Your confirmed stay dates are included in the Agoda search. Occupancy stays unset because RadarScout does not guess the adult and child mix.'}
        </p>
      ) : null}
    </section>
  )
}
