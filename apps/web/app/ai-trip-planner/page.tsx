import type { Metadata } from 'next'
import Link from 'next/link'
import { IntentParserDemo } from './IntentParserDemo'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'AI Private Trip Search | RadarScout',
  description:
    'Describe a custom Thailand travel idea in one sentence. RadarScout understands trip intent locally, then supports read-only Thailand product search for comparison.',
  alternates: { canonical: `${base}/ai-trip-planner` },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'AI Private Trip Search | RadarScout',
    description:
      'AI private trip search engine for custom Thailand ideas. Local intent parsing with read-only Thailand product search for comparison.',
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
    body: 'This page can show comparison-only product results, but availability checks, reservation handoff, and final partner workflows stay disabled.',
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
    body: 'After local confirmation, RadarScout can show comparison-only product results without availability checks or reservation handoff.',
  },
]

const transparencyPoints = [
  'No fake prices',
  'No fake availability',
  'No fake booking links',
  'No fake products or suppliers',
]

const notConnected = [
  'Availability checks',
  'Final partner handoff',
  'Reservation workflow',
  'Itinerary generation',
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
                AI Private Trip Search
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                AI private trip search engine for custom travel ideas
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Describe your trip in one sentence. RadarScout understands your travel intent locally first, then can show read-only Thailand
                product search results for comparison.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#intent-demo"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
                >
                  Try the AI Trip Planner
                </a>
                <Link
                  href="/chiang-mai/elephant-camp-finder"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  Open Chiang Mai finder
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
                      Read-only Thailand product search after local confirmation, with results clearly marked as comparison-only.
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-[#d9cab4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#1E2D59]">Transparent planning mode</p>
                  <p className="mt-2 text-sm leading-7 text-[#6b7280]">
                    This page demonstrates local trip intent parsing and comparison-only product results. Availability status and partner handoff
                    integrations are not connected.
                  </p>
                </div>
              </div>
            </div>

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
              AI Trip Planner
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
              Understand your travel intent locally before read-only product matching
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b7280]">
              The planner below keeps all current safety boundaries. Product results, when shown, are comparison-only. No fake prices,
              no fake availability, and no fake reservation links are shown.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#ece3d6] bg-white p-4 shadow-[0_30px_60px_rgba(17,24,39,0.06)] sm:p-6 lg:p-8">
            <IntentParserDemo />
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
                The booking-partner product catalog is connected for read-only comparison only
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                This page positions RadarScout as an AI private trip search engine. The current implementation understands trip intent locally
                and can return comparison-only product results. Availability checks, final partner handoff, and reservation workflow stay disabled.
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f8d7bf]">What is not connected yet</p>
              <div className="mt-6 space-y-3">
                {notConnected.map(item => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-white/92">{item}</span>
                    <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
                      Not connected
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
            Planning shell only
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
            Start with a custom trip idea, then compare Thailand experiences.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">
            This workspace understands travel intent locally and keeps product search transparent. No form submission is connected. No
            email capture is enabled. No reservation handoff flow is active.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#6b7280]">
            For a concrete guided Chiang Mai finder, compare elephant care, cooking, nature, and family-friendly experiences before
            continuing with a booking partner.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="#intent-demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
            >
              Try the AI Trip Planner
            </a>
            <Link
              href="/chiang-mai/elephant-camp-finder"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#d9cab4] bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#1E2D59] transition hover:bg-[#fcfaf6]"
            >
              Open Chiang Mai finder
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
