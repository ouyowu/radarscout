import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | RadarScout',
  description: 'How RadarScout uses clearly marked affiliate links and evaluates travel partners.',
  robots: { index: false, follow: true },
}

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-16 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-7 shadow-lg sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
          Transparency
        </p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-black tracking-[-0.04em]">
          Affiliate disclosure
        </h1>
        <div className="mt-7 space-y-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
          <p>
            RadarScout may receive referral earnings when you follow a clearly marked affiliate link and complete an eligible purchase on the partner website. This does not add a fee to your booking.
          </p>
          <p>
            RadarScout helps with trip fit and comparison. The partner website handles product details, availability, booking, purchase, confirmation, changes, and cancellations.
          </p>
          <p>
            Partner placement is evaluated using traveler usefulness and measured performance, including revenue per 100 eligible page visits, earnings per click, conversion rate, and cancellation rate. A higher advertised referral percentage does not automatically win.
          </p>
        </div>
      </article>
    </main>
  )
}
