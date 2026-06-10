import type { Metadata } from 'next'
import Link from 'next/link'
import { PlannerDemo } from './PlannerDemo'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'AI Trip Planner for Global Cities and Curated Day Tours | RadarScout',
  description:
    'Build private trip plans with a static AI planner demo, route ideas, curated day-tour categories, and live Thailand Bókun partner inventory boundaries.',
  alternates: { canonical: `${base}/ai-trip-planner` },
  openGraph: {
    title: 'AI Trip Planner for Global Cities and Curated Day Tours | RadarScout',
    description:
      'Plan routes, compare travel styles, and match available partner tours as RadarScout expands its signed Bókun supplier network city by city.',
    type: 'website',
    url: `${base}/ai-trip-planner`,
  },
}

const trustPoints = [
  ['AI itinerary engine', 'Organize destinations, days, interests, budget, and travel pace into a practical route draft.'],
  ['Private custom planning', 'Shape the plan around families, food, culture, adventure, relaxed pacing, or premium comfort.'],
  ['Curated partner tours', 'Bookable products appear only when they come from signed Bókun supplier partners.'],
  ['Clear inventory boundary', 'Thailand is live now; other destinations stay coming soon until partner suppliers are onboarded.'],
]

export default function AiTripPlannerPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/destinations" className="min-h-[44px] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
          Destinations
        </Link>
      </header>

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-3xl font-black text-[#101820] [font-family:cursive]">AI trip planner</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            Build a private trip plan with AI.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            Tell us your destination, travel dates, interests, and budget. Our AI planning experience will help organize your route and match available partner tours as our Bókun supplier network grows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#planner-demo" className="inline-flex min-h-[52px] items-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
              Start planning
            </a>
            <Link href="/destinations/thailand" className="inline-flex min-h-[52px] items-center border border-[#d8d1c4] bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
              Thailand live inventory
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="border-l-4 border-[#f59a3d] bg-[#fff8e8] p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
          <h2 className="text-lg font-black text-[#101820]">Service Notice</h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-[#7c4a03]">
            RadarScout only displays bookable tours from signed Bókun supplier partners. Thailand is our first live inventory destination. For destinations where partner inventory is not yet available, this planner provides route ideas and coming-soon guidance, not bookable third-party products.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {trustPoints.map(([title, body]) => (
            <article key={title} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="planner-demo">
        <PlannerDemo />
      </div>

      <section className="bg-[#101820] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Plan with clear boundaries</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-[-0.035em]">
            Route ideas can be global. Bookable inventory stays partner-only.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['All destinations', '/destinations'],
              ['Thailand live partner tours', '/destinations/thailand'],
              ['World Cup 2026 guides', '/world-cup-2026'],
              ['Browse live tours', '/tours'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="flex min-h-[72px] items-center border border-white/12 bg-white/[0.06] px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-1 hover:text-[#8dd8ca]">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
