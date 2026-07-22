import React from 'react'
import { buildYesimPreDepartureOffer } from '@/lib/affiliates/affiliatePartners'
import { TrackedAffiliateLink } from './TrackedAffiliateLink'

export function YesimEsimCard() {
  const offer = buildYesimPreDepartureOffer()
  if (!offer) return null

  return (
    <aside className="flex flex-col gap-4 rounded-rs-md border border-rs-sage-200/70 bg-white px-5 py-5 shadow-rs-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">
          Before you go · sponsored partner link
        </p>
        <h3 className="mt-1 font-rs-display text-xl font-semibold tracking-[-0.02em] text-rs-ink">
          Stay connected in Thailand
        </h3>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-rs-muted">
          Compare Yesim eSIM options before your trip. Continue to Yesim for current plan details and activation.
        </p>
      </div>
      <TrackedAffiliateLink
        href={offer.href}
        provider={offer.provider}
        placement={offer.placement}
        destination={offer.destination}
        campaign={offer.campaign}
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-rs-pill bg-rs-terracotta px-5 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
      >
        View Thailand eSIM plans
      </TrackedAffiliateLink>
    </aside>
  )
}
