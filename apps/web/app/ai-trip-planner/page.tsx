import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { DestinationStarterCard } from './DestinationStarterCard'
import { IntentParserDemo } from './IntentParserDemo'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Trip Planner | RadarScout',
  description:
    'Plan Thailand experiences with RadarScout. Describe Bangkok, Chiang Mai, Pattaya, Phuket, or a wider Thailand route, then compare read-only product matches safely.',
  alternates: { canonical: `${base}/ai-trip-planner` },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Thailand Trip Planner | RadarScout',
    description:
      'Thailand trip planner for guided discovery. Local intent parsing with read-only Thailand product search for comparison.',
    type: 'website',
    url: `${base}/ai-trip-planner`,
  },
}

const differentiators = [
  {
    title: 'Not a generic chatbot',
    body: 'The experience is focused on travel structure: destination, duration, interests, avoid preferences, pace, budget, and trip intent.',
  },
  {
    title: 'Not a filter-first tour list',
    body: 'You start with a natural-language trip idea, confirm the detected intent, then use read-only Thailand product search for comparison.',
  },
  {
    title: 'Transparent planning mode',
    body: 'This page can show comparison-only product results, while current product details and booking partner handoff stay on product pages.',
  },
]

const steps = [
  {
    label: 'Step 1',
    title: 'Describe your custom trip',
    body: 'Write the destination, duration, interests, and avoid preferences in one sentence.',
  },
  {
    label: 'Step 2',
    title: 'Understand travel intent locally',
    body: 'RadarScout parses destination, duration, interests, style exclusions, and travel-style wording locally in the browser.',
  },
  {
    label: 'Step 3',
    title: 'Search read-only Thailand experiences',
    body: 'After local confirmation, RadarScout can show comparison-only product results while current product details and booking partner handoff stay on product pages.',
  },
]

const transparencyPoints = [
  'Read-only comparison',
  'Product-page details',
  'Thailand-only matching',
  'Reviewed coverage first',
]

const notConnected = [
  { label: 'Current product details', status: 'Product page only' },
  { label: 'Booking partner handoff', status: 'Product page only' },
  { label: 'External partner steps', status: 'Product page only' },
  { label: 'AI-generated itinerary', status: 'Future stage' },
]

const destinationStarters = [
  {
    city: 'Bangkok',
    title: 'Bangkok city days',
    body: 'Canals, temples, markets, food routes, and easier day-trip comparisons from Bangkok.',
    prompt: 'Bangkok 3 days canals temples street food, relaxed pace',
  },
  {
    city: 'Chiang Mai',
    title: 'Chiang Mai elephant and food plans',
    body: 'Elephant care, cooking, nature, temples, and family-friendly experience matching.',
    prompt: 'Chiang Mai 3 days elephants cooking temples, family friendly',
  },
  {
    city: 'Pattaya',
    title: 'Pattaya day-trip ideas',
    body: 'Beach-area day trips, local experiences, and nearby options with clearer planning fit.',
    prompt: 'Pattaya 2 days beaches food elephant day trip, easy pace',
  },
  {
    city: 'Phuket',
    title: 'Phuket islands and nature',
    body: 'Island days, beaches, boats, old town, food, and gentler outdoor experience ideas.',
    prompt: 'Phuket 4 days islands beaches local food, avoid rushed schedule',
  },
  {
    city: 'Thailand',
    title: 'Thailand multi-city route',
    body: 'Bangkok, Chiang Mai, Phuket, food, temples, islands, and gentler experience comparisons across one Thailand plan.',
    prompt: 'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace',
  },
]

export default function AiTripPlannerPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#111827]">
      <section className="relative overflow-hidden bg-[#1E2D59] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,124,72,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />


        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8d7bf]">
                Thailand Trip Planner
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Plan Thailand experiences before choosing what to compare
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Describe Bangkok, Chiang Mai, Pattaya, Phuket, or a wider Thailand route. RadarScout understands your travel intent locally,
                then shows read-only product matches for safe comparison. Product matching is currently limited to Thailand experience records.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#intent-demo"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
                >
                  Try the Trip Planner
                </a>
                <Link
                  href="#planner-demo"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  Browse destination starters
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {transparencyPoints.map(point => (
                  <span
                    key={point}
                    className="inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/85"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
              <div className="rounded-[1.5rem] bg-[#fbf8f3] p-6 text-[#111827]">
                <div className="flex items-center justify-between border-b border-[#e8e0d3] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1E2D59]">Search-style discovery</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#1E2D59]">Start with intent, not filters</h2>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-[#1E2D59] text-center text-[11px] font-semibold uppercase leading-[56px] tracking-[0.18em] text-white">
                    Local
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f5efe8] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a15d31]">Understands now</p>
                    <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                      Destination, duration, interests, avoid preferences, pace, budget, traveler type, and language.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f5efe8] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a15d31]">After confirmation</p>
                    <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                      Read-only Thailand product search after local confirmation, with reviewed handoff-ready results clearly marked as comparison-only.
                      Non-Thailand ideas can still be structured as planning text, but product matching stays Thailand-only until coverage is reviewed.
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-[#d9cab4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#1E2D59]">Transparent planning mode</p>
                  <p className="mt-2 text-sm leading-7 text-[#6b7280]">
                    This page demonstrates local trip intent parsing and comparison-only product results. Current details stay on product pages
                    and booking partner surfaces.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="planner-demo" className="bg-[#fcfaf6] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#D57C48] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Thailand routes
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
              Start with a city, then refine the experience fit.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b7280]">
              These starters are prompts for guided discovery. They do not claim current status, trigger partner actions, or replace product-page
              details. Non-Thailand ideas can still be structured as planning text, but product matching stays Thailand-only until coverage is reviewed.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {destinationStarters.map(item => (
              <DestinationStarterCard
                key={item.city}
                city={item.city}
                title={item.title}
                body={item.body}
                prompt={item.prompt}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#1E2D59] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Why this is different
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
              RadarScout starts with travel intent before it ever thinks about product matching.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {differentiators.map(item => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-[#ede6db] bg-white p-6 shadow-[0_20px_40px_rgba(17,24,39,0.05)]"
              >
                <div className="h-1 w-16 rounded-full bg-[#D57C48]" />
                <h3 className="mt-6 text-2xl font-semibold text-[#1E2D59]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#6b7280]">{item.body}</p>
              </article>
            ))}

          </div>
        </div>
      </section>

      <section className="bg-[#f5efe8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-[#D57C48] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                How it works
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
                A simple three-step flow for custom travel discovery
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6b7280]">
              This is a guarded planning surface. It understands travel intent locally and keeps product results clearly marked as comparison-only.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map(step => (
              <article key={step.label} className="rounded-[1.75rem] bg-white p-6 shadow-[0_20px_40px_rgba(17,24,39,0.04)]">
                <span className="inline-flex rounded-full bg-[#1E2D59] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  {step.label}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-[#1E2D59]">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#6b7280]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="intent-demo" className="bg-[#fbf8f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <span className="inline-flex rounded-full bg-[#1E2D59] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Trip Planner
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
              Understand your travel intent locally before read-only product matching
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b7280]">
              The planner below keeps all current safety boundaries. Product results, when shown, are comparison-only. Current details stay on product
              pages, and product matching is currently limited to Thailand experience records.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#ece3d6] bg-white p-4 shadow-[0_30px_60px_rgba(17,24,39,0.06)] sm:p-6 lg:p-8">
            <Suspense fallback={<div className="mt-10 max-w-5xl border border-[#ded7ca] bg-white p-6 text-sm font-semibold text-[#5a5147]">Loading trip planner…</div>}>
              <IntentParserDemo />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-[#1E2D59] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d7bf]">
                Catalog transparency
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
                The Thailand experience catalog is connected for read-only comparison only
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                This page positions RadarScout as a Thailand trip planner. The current implementation understands trip intent locally
                and can return comparison-only results from reviewed Thailand partner products with a safe public handoff. Non-Thailand ideas can still be structured
                as planning text, but product matching stays Thailand-only until coverage is reviewed. Current details stay on product pages
                and booking partner surfaces.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {transparencyPoints.map(point => (
                  <div key={point} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm font-medium text-white/90">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f8d7bf]">What stays outside this planner</p>
              <div className="mt-6 space-y-3">
                {notConnected.map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-white/92">{item.label}</span>
                    <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#f5efe8] p-8 text-center shadow-[0_24px_48px_rgba(17,24,39,0.05)] sm:p-12">
          <span className="inline-flex rounded-full bg-[#1E2D59] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
            Guarded planner MVP
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
            Start with a custom trip idea, then compare Thailand experiences.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">
            This workspace understands travel intent locally and keeps product search transparent. Email capture is not part of this page and no booking
            partner handoff starts from this planner page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="#intent-demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
            >
              Try the Trip Planner
            </a>
            <Link
              href="#planner-demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#d9cab4] bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#1E2D59] transition hover:bg-[#fcfaf6]"
            >
              Explore Thailand ideas
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
