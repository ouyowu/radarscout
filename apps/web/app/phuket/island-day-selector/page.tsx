import type { Metadata } from 'next'
import Link from 'next/link'

import { PublicSiteShell } from '@/app/_components/PublicSiteShell'
import { loadReviewedViatorPublicCatalogue } from '@/lib/viator/reviewedViatorPublicCatalogue'
import { PhuketIslandDaySelectorClient } from './PhuketIslandDaySelectorClient'

export const metadata: Metadata = {
  title: 'Phuket island day selector | RadarScout',
  description: 'Compare three reviewed Phuket island-day options by traveler fit, pace, and practical trade-offs before continuing to Viator.',
  alternates: { canonical: 'https://www.radarscout.io/phuket/island-day-selector' },
  robots: { index: true, follow: true },
}

export default function PhuketIslandDaySelectorPage() {
  const products = loadReviewedViatorPublicCatalogue({ city: 'phuket' })

  return (
    <PublicSiteShell>
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/68">
              <Link href="/">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/thailand/phuket">Phuket</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>Island day selector</span>
            </nav>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-rs-sage-200">
              Phuket decision tool
            </p>
            <h1 className="mt-5 max-w-4xl font-rs-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
              Choose a Phuket island day without sorting through endless listings.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78">
              Tell RadarScout what kind of water day fits your group. We return three reviewed
              Viator options and explain the fit, trade-offs, and what to verify before choosing.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <PhuketIslandDaySelectorClient products={products} />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
