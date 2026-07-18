import Link from 'next/link'
import {
  buildGetYourGuideCityGuideOffer,
  type GetYourGuideCitySlug,
} from '@/lib/affiliates/affiliatePartners'
import { TrackedAffiliateLink } from './TrackedAffiliateLink'

const citySlugs: GetYourGuideCitySlug[] = ['bangkok', 'chiang-mai', 'phuket']

export function CityActivityPartnerLinks() {
  const offers = citySlugs
    .map(buildGetYourGuideCityGuideOffer)
    .filter(offer => offer !== null)

  if (offers.length === 0) return null

  return (
    <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="city-activity-partners-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
          More city activity choices
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 id="city-activity-partners-title" className="font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Continue comparing on an activity partner.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              Use these city links after shaping your route. Final product details, availability, booking, purchase, and confirmation are handled by GetYourGuide.
            </p>
          </div>
          <Link href="/affiliate-disclosure" className="text-sm font-black text-[var(--color-accent-orange-dark)] underline underline-offset-4">
            Affiliate disclosure
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {offers.map(offer => (
            <article key={offer.destination} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                GetYourGuide · affiliate link
              </p>
              <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-black tracking-[-0.025em]">
                {offer.destination} activities
              </h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                Compare additional tours and activities for this city on the partner website.
              </p>
              <TrackedAffiliateLink
                href={offer.href}
                provider={offer.provider}
                placement={offer.placement}
                destination={offer.destination}
                campaign={offer.campaign}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-5 text-sm font-black text-[var(--color-text-primary)]"
              >
                Compare {offer.destination} activities
              </TrackedAffiliateLink>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold leading-6 text-[var(--color-text-secondary)]">
          RadarScout may receive referral earnings if you book through these links, at no extra cost to you. Partner ranking is not based on the advertised referral percentage alone.
        </p>
      </div>
    </section>
  )
}
