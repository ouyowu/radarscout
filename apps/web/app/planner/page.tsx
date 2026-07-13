import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { PlannerStudio } from './PlannerStudio'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Planner Studio | RadarScout',
  description:
    'Describe a Thailand trip in your own words and get a reviewed day-trip route with a schematic map, real experience photos, and safe product-detail paths.',
  alternates: { canonical: `${base}/planner` },
  robots: { index: false, follow: false },
}

type PlannerStudioPageProps = {
  searchParams?: {
    idea?: string | string[]
  }
}

export default function PlannerStudioPage({ searchParams }: PlannerStudioPageProps) {
  const initialIdea = typeof searchParams?.idea === 'string' ? searchParams.idea : ''

  return (
    <PublicSiteShell>
      <main className="min-h-screen bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-gradient-to-br from-rs-sand-50 via-rs-blush to-[#fff4d6]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex rounded-rs-pill border border-rs-forest-500/20 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rs-forest-700">
                  Planner Studio
                </span>
                <h1 className="mt-4 max-w-3xl font-rs-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-rs-ink sm:text-6xl">
                  Talk through a Thailand trip, get a reviewed route.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-rs-muted sm:text-base">
                  A guided conversation that parses your trip idea locally, matches reviewed Thailand experiences,
                  and lays them out as a day-by-day route with a schematic map. Comparison only — the reviewed handoff
                  opens the external booking partner.
                </p>
              </div>
              <Link
                href="/ai-trip-planner"
                className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-rs-pill border border-rs-forest-500 bg-white/80 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-rs-forest-700 transition hover:bg-rs-sand-100"
              >
                Classic Thailand trip planner
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <PlannerStudio initialIdea={initialIdea} />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
