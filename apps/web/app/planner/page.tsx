import type { Metadata } from 'next'
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
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.75fr)] lg:items-end">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-rs-pill border border-rs-forest-500/20 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rs-forest-700">
                  Planner Studio
                </span>
                <h1 className="mt-4 font-rs-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-rs-ink sm:text-5xl">
                  Talk through a Thailand trip, get a reviewed route.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-rs-muted sm:text-base">
                  A guided conversation that parses your trip idea locally, matches reviewed Thailand experiences,
                  and lays them out as a day-by-day route with a schematic map. Comparison only — the reviewed handoff
                  opens the external booking partner.
                </p>
              </div>
              <div aria-label="Planner flow" className="rounded-rs-lg border border-white/80 bg-white/75 p-5 shadow-rs-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
                  Planner flow
                </p>
                <ol className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    ['01', 'Describe', 'Tell us the city, days, and interests.'],
                    ['02', 'Confirm', 'See what RadarScout understood.'],
                    ['03', 'Compare', 'Inspect the route and reviewed matches.'],
                  ].map(([number, title, body]) => (
                    <li key={number} className="rounded-rs-md bg-rs-sand-50 p-3 sm:p-4">
                      <p className="text-xs font-bold text-rs-terracotta-600">{number}</p>
                      <p className="mt-1 text-xs font-bold text-rs-ink sm:text-sm">{title}</p>
                      <p className="mt-1 hidden text-xs leading-5 text-rs-muted sm:block lg:block">{body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <PlannerStudio initialIdea={initialIdea} />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
