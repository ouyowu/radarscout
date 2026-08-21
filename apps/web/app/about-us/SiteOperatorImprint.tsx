import Link from 'next/link'

import {
  hasCompleteImprint,
  OPERATOR_INDEPENDENCE_STATEMENT,
  siteOperator,
} from '@/lib/legal/siteOperator'

/**
 * The site's legal notice. Every row renders only from a value the operator
 * actually supplied, so an unfilled entity or address leaves a gap rather than
 * putting a false company on a live page.
 */
export function SiteOperatorImprint() {
  const rows: { term: string; value: string }[] = [
    { term: 'Site operator', value: siteOperator.brandName },
    ...(siteOperator.legalEntity
      ? [{ term: 'Registered entity', value: siteOperator.legalEntity }]
      : []),
    ...(siteOperator.registeredAddress
      ? [{ term: 'Registered address', value: siteOperator.registeredAddress }]
      : []),
  ]

  return (
    <section
      id="operator"
      aria-labelledby="operator-heading"
      className="scroll-mt-24 bg-rs-sand-50 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[46rem]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-gold">
          Legal notice
        </p>
        <h2
          id="operator-heading"
          className="mt-3 font-rs-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-rs-ink"
        >
          Who operates this site
        </h2>

        <dl className="mt-8 divide-y divide-rs-sage-200 border-y border-rs-sage-200">
          {rows.map(row => (
            <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-rs-muted">
                {row.term}
              </dt>
              <dd className="whitespace-pre-line text-[0.98rem] leading-7 text-rs-ink">
                {row.value}
              </dd>
            </div>
          ))}
          <div className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-rs-muted">
              Contact
            </dt>
            <dd className="text-[0.98rem] leading-7">
              <a
                href={`mailto:${siteOperator.contactEmail}`}
                className="font-semibold text-rs-forest-700 underline decoration-rs-gold/60 underline-offset-4 transition hover:text-rs-terracotta-600"
              >
                {siteOperator.contactEmail}
              </a>
            </dd>
          </div>
        </dl>

        <p className="mt-7 text-[0.95rem] leading-7 text-rs-muted">
          {OPERATOR_INDEPENDENCE_STATEMENT}
        </p>

        <p className="mt-4 text-[0.95rem] leading-7 text-rs-muted">
          RadarScout earns a commission when a traveler continues to a booking partner and
          books. That relationship never changes which experiences pass review — see the{' '}
          <Link
            href="/affiliate-disclosure"
            className="font-semibold text-rs-forest-700 underline decoration-rs-gold/60 underline-offset-4 transition hover:text-rs-terracotta-600"
          >
            affiliate disclosure
          </Link>{' '}
          for the full explanation.
        </p>

        {hasCompleteImprint() ? null : (
          <p className="sr-only" data-imprint-status="incomplete">
            The registered entity and address for this site have not been published yet.
          </p>
        )}
      </div>
    </section>
  )
}
