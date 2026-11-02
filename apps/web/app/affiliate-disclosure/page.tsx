import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | RadarScout',
  description: 'How RadarScout makes money from Viator and Agoda affiliate links, without selling tours or taking payment.',
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
          How RadarScout makes money
        </h1>
        <div className="mt-7 space-y-5 text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
          <p>
            RadarScout is free to use. We don&apos;t sell tours, hold inventory, take payment, or confirm bookings. When you choose an option, we send you to the partner to book.
          </p>
          <p>
            1. Affiliate links. Experience links go to Viator and stay links go to Agoda. If you book, the partner may pay us a commission. Your price is the same.
          </p>
          <p>
            2. How we choose. Every experience we recommend has been reviewed. The page shows the latest review date.
          </p>
          <p>
            The partner website handles product details, availability, booking, purchase, confirmation, changes, and cancellations.
          </p>
        </div>
      </article>
    </main>
  )
}
