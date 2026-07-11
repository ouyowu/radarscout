import type { Metadata } from 'next'
import Link from 'next/link'
import { PlannerStudio } from './PlannerStudio'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Planner Studio | RadarScout',
  description:
    'Describe a Thailand trip in your own words and get a reviewed day-trip route with a schematic map, real experience photos, and safe booking partner handoffs.',
  alternates: { canonical: `${base}/planner` },
  robots: { index: false, follow: false },
}

export default function PlannerStudioPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#111827]">
      <section className="bg-[#1E2D59] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8d7bf]">
                Planner Studio
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Talk through a Thailand trip, get a reviewed route.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                A guided conversation that parses your trip idea locally, matches reviewed Thailand experiences,
                and lays them out as a day-by-day route with a schematic map. Comparison only — the reviewed handoff
                opens the external booking partner.
              </p>
            </div>
            <Link
              href="/ai-trip-planner"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              Classic Thailand trip planner
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PlannerStudio />
        </div>
      </section>
    </main>
  )
}
