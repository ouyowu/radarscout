import type { Metadata } from 'next'
import Link from 'next/link'
import { IntentParserDemo } from './IntentParserDemo'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'AI Private Trip Search | RadarScout',
  description:
    'Describe a custom travel idea in one sentence. RadarScout understands trip intent locally today, with Bókun-backed product catalog matching planned next.',
  alternates: { canonical: `${base}/ai-trip-planner` },
  openGraph: {
    title: 'AI Private Trip Search | RadarScout',
    description:
      'AI private trip search engine for custom travel ideas. Local intent parsing only for now. Bókun-backed catalog matching is coming next.',
    type: 'website',
    url: `${base}/ai-trip-planner`,
  },
}

const differentiators = [
  {
    title: 'Not a generic chatbot',
    body: 'The experience is focused on travel structure: destination, duration, interests, avoid preferences, pace, budget, and booking intent.',
  },
  {
    title: 'Not a filter-first tour list',
    body: 'You start with a natural-language trip idea. Product-style matching only comes later, after the catalog connection is ready.',
  },
  {
    title: 'Transparent preview mode',
    body: 'This page does not load products, prices, availability, or booking links. It shows the intent-understanding layer only.',
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
    body: 'RadarScout parses destination, duration, interests, style exclusions, and booking-related wording locally in the browser.',
  },
  {
    label: 'Step 3',
    title: 'Bókun-backed catalog coming next',
    body: 'Real product matching will only appear after the read-only catalog connection is implemented.',
  },
]

const transparencyPoints = [
  'No fake prices',
  'No fake availability',
  'No fake booking links',
  'No fake products or suppliers',
]

const notConnected = [
  'Bókun catalog sync',
  'Product search',
  'Availability',
  'Checkout',
  'Payment',
  'Booking',
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
                AI Private Trip Search Preview
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                AI private trip search engine for custom travel ideas
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Describe your trip in one sentence. RadarScout understands your travel intent locally first, then will match products from a
                real Bókun-backed catalog later.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#intent-demo"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
                >
                  Try the AI Search Preview
                </a>
                <Link
                  href="/destinations/thailand"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                >
                  Thailand live destination
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a15d31]">Connects later</p>
                    <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                      Real product matching from the Bókun-backed catalog after read-only catalog connection is implemented.
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-[#d9cab4] bg-white p-4">
                  <p className="text-sm font-semibold text-[#1E2D59]">Transparent preview mode</p>
                  <p className="mt-2 text-sm leading-7 text-[#6b7280]">
                    This page only demonstrates local trip intent parsing. Supplier, availability, pricing, checkout, payment, and booking
                    integrations are not connected yet.
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
              This is still a frontend preview. It understands travel intent locally today and keeps the future catalog layer clearly marked
              as not connected yet.
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
              AI Search Preview
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#1E2D59] sm:text-5xl">
              Understand your travel intent locally before any product matching exists
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b7280]">
              The parser preview below keeps all current safety boundaries. No products are loaded. No fake prices, no fake availability, and
              no fake booking links are shown.
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
                Bókun catalog transparency
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
                The Bókun-backed product catalog is planned next, but not connected in this PR
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                This page positions RadarScout as an AI private trip search engine. The current implementation only understands trip intent
                locally. Real product matching will appear later, after the Bókun-backed catalog connection is implemented safely.
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
            Start with a custom trip idea now. Product search comes later.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">
            This preview understands travel intent locally and keeps future catalog behavior transparent. No form submission is connected. No
            email capture is enabled. No booking or payment flow is active.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="#intent-demo"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
            >
              Try the AI Search Preview
            </a>
            <Link
              href="/destinations/thailand"
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
