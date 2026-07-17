import 'maplibre-gl/dist/maplibre-gl.css'

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicSiteShell } from '@/app/_components/PublicSiteShell'
import {
  getThailandItineraryTemplate,
  listThailandItineraryTemplates,
} from '@/lib/itineraries/thailandTemplates'
import { loadReviewedViatorProducts } from '@/lib/viator/reviewedViatorProducts'
import { ItineraryWorkspace } from './ItineraryWorkspace'

type ThailandItineraryPageProps = {
  params: {
    city: string
    duration: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return listThailandItineraryTemplates().map(template => ({
    city: template.citySlug,
    duration: `${template.days}-days`,
  }))
}

function parseDuration(value: string): number | null {
  const match = value.match(/^([357])-days$/)
  return match ? Number(match[1]) : null
}

export function generateMetadata({ params }: ThailandItineraryPageProps): Metadata {
  const days = parseDuration(params.duration)
  const template = days ? getThailandItineraryTemplate(params.city, days) : null

  if (!template) return { title: 'Thailand itinerary not found | RadarScout', robots: { index: false, follow: false } }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  return {
    title: `${template.cityName} ${template.days}-Day Itinerary | RadarScout`,
    description: `${template.summary} Compare reviewed day tours and continue to Viator for current product details.`,
    alternates: { canonical: `${base}/itineraries/thailand/${template.citySlug}/${template.days}-days` },
    robots: { index: false, follow: false },
  }
}

export default function ThailandItineraryPage({ params }: ThailandItineraryPageProps) {
  const days = parseDuration(params.duration)
  const template = days ? getThailandItineraryTemplate(params.city, days) : null
  if (!template) notFound()

  const products = loadReviewedViatorProducts()
  const publicMapToken = process.env.NEXT_PUBLIC_MAP_PUBLIC_TOKEN?.trim() || null

  return (
    <PublicSiteShell>
      <main className="min-h-screen bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-gradient-to-br from-rs-sand-50 via-white to-[#fff0cf]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rs-forest-700">Thailand itinerary</p>
                <h1 className="mt-3 max-w-4xl font-rs-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-rs-ink sm:text-6xl">
                  {template.title}, built to stay realistic.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-rs-muted">{template.summary}</p>
              </div>
              <Link
                href={`/planner?idea=${encodeURIComponent(`${template.cityName} ${template.days} days`)}`}
                className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-rs-pill bg-rs-forest-900 px-6 text-sm font-bold text-white transition hover:bg-rs-forest-700"
              >
                Personalize this trip
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ItineraryWorkspace template={template} products={products} publicMapToken={publicMapToken} />
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
