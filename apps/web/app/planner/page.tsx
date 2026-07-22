import 'maplibre-gl/dist/maplibre-gl.css'
import type { Metadata } from 'next'
import { buildReviewedAgodaStayAreaOffers } from '@/lib/affiliates/agodaAffiliate'
import { reviewedAgodaAreaRecommendations } from '@/lib/affiliates/seed/reviewedAgodaAreas'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { PlannerStudio } from './PlannerStudio'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Planner Studio | RadarScout',
  description:
    'Describe a Thailand trip in your own words and get a reviewed day-trip route with an interactive map where reviewed coordinates are available.',
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
  const agodaStayAreaOffers = buildReviewedAgodaStayAreaOffers(reviewedAgodaAreaRecommendations)

  return (
    <PublicSiteShell>
      <main className="min-h-screen bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-gradient-to-br from-rs-sand-50 via-rs-blush to-[#fff4d6]">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rs-forest-700">Planner Studio</p>
              <h1 className="mt-1 font-rs-display text-3xl font-semibold tracking-[-0.035em] text-rs-ink sm:text-4xl">
                Build your Thailand day-trip route
              </h1>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">
                Curated from reviewed Viator experiences
              </p>
            </div>
            <div className="max-w-2xl lg:text-right">
              <p className="text-sm font-semibold leading-6 text-rs-muted">
                Describe the city, days, and interests. RadarScout narrows the catalogue into a reviewed route,
                then explains why each match fits, who it suits, and what to check before you choose.
              </p>
              <p className="mt-1 text-xs font-semibold text-rs-forest-700">
                Compare here · continue with Viator for current product details
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <PlannerStudio
              initialIdea={initialIdea}
              publicMapToken={process.env.NEXT_PUBLIC_MAPTILER_TOKEN ?? null}
              agodaStayAreaOffers={agodaStayAreaOffers}
            />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
