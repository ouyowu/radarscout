import type { Metadata } from 'next'
import Link from 'next/link'
import { IntentParserDemo } from './IntentParserDemo'

export const metadata: Metadata = {
  title: 'AI Trip Planner | RadarScout',
  description:
    'Preview how RadarScout understands your travel intent locally before itinerary generation, supplier matching, availability, or booking are connected.',
}

const examplePrompts = [
  'Chiang Mai, 3 days, temples, elephants, local food, relaxed pace',
  'Bangkok and Phuket, 7 days, private transfers, family-friendly islands',
  'Japan, 5 days, food markets, culture, less crowded neighborhoods',
  'France, 4 days, wine villages, local guides, premium comfort',
]

const steps = [
  ['1', 'Tell us your travel idea', 'Share destination, timing, pace, interests, and travel style in plain language.'],
  ['2', 'Understand intent locally', 'RadarScout parses the prompt on the page and keeps the preview self-contained.'],
  ['3', 'Itinerary later', 'Itinerary generation and booking connections are coming later, after the safe demo flow.'],
]

const trustCards = [
  ['AI trip planning preview', 'Preview a trip planner flow before supplier matching, booking, or pricing connections go live.'],
  ['Understand your travel intent locally', 'The prompt is parsed on the page so you can see the structured intent immediately.'],
  ['No fake prices', 'The preview never invents prices, availability, or booking links.'],
  ['No fake booking links', 'Supplier, availability, pricing, checkout, payment, and booking integrations are not connected yet.'],
]

const itineraryPreview = [
  {
    day: 'Day 1',
    title: 'Arrival rhythm and local orientation',
    body: 'Start with a gentle route, arrival timing, and a light introduction that fits your trip pace.',
  },
  {
    day: 'Day 2',
    title: 'Culture, food, and neighborhood discovery',
    body: 'Balance landmark context with food stops and quieter neighborhoods based on your travel style.',
  },
  {
    day: 'Day 3',
    title: 'Experience match and optional rest buffer',
    body: 'Leave room for weather, timing, and personal pace while the future itinerary engine stays off.',
  },
]

export default function AiTripPlannerPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#d8cebf] bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
                <span>AI trip planning preview</span>
                <span className="text-[#a77b36]">Local intent parsing only</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Turn a rough trip idea into a clear planning preview.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#5a5147]">
                RadarScout understands your travel intent locally, then shows a safe preview of the trip structure. Itinerary generation, supplier matching, pricing, and booking connections are not connected yet.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-[52px] items-center justify-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white opacity-80 disabled:cursor-not-allowed"
                >
                  Join waitlist
                </button>
                <p className="max-w-xl text-sm font-semibold leading-7 text-[#5a6670]">
                  No fake prices, no fake availability, and no fake booking links. The demo stays local until a safe future connection exists.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d9cfbf] bg-white/85 p-4 shadow-[0_24px_0_rgba(16,24,32,0.05)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-[#101820] px-5 py-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8dd8ca]">Preview mode</p>
                <h2 className="mt-2 text-2xl font-black leading-tight">
                  Understand your travel intent locally
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">
                  The page below keeps the existing parser demo, confirmation state, placeholder shell, and disabled CTA intact.
                </p>
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-[#ebe0cf] bg-[#fffaf0] px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a35c09]">Safety</p>
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-7 text-[#5a6670]">
                  <li>No fake prices</li>
                  <li>No fake availability</li>
                  <li>No fake booking links</li>
                  <li>Supplier, availability, pricing, checkout, payment, and booking integrations are not connected yet</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-[#d8cebf] bg-white/70 p-4 shadow-[0_20px_0_rgba(16,24,32,0.04)] sm:p-5">
            <IntentParserDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">Example prompts</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.035em] sm:text-5xl">
              Plan from natural language, not product filters.
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7 text-[#5a6670]">
            These are planning examples only. They do not create a booking, confirm availability, or invent a product.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {examplePrompts.map(prompt => (
            <button
              key={prompt}
              type="button"
              disabled
              className="min-h-[96px] border border-[#ded7ca] bg-white p-5 text-left text-base font-black leading-7 text-[#101820] opacity-85 shadow-[0_10px_0_rgba(16,24,32,0.04)] disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-[#101820] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#8dd8ca]">How it works</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map(([step, title, body]) => (
              <article key={title} className="border border-white/12 bg-white/[0.06] p-5">
                <div className="flex h-12 w-12 items-center justify-center bg-[#f59a3d] text-lg font-black text-[#101820] [clip-path:polygon(10%_0,100%_12%,90%_100%,0_88%)]">
                  {step}
                </div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">Why RadarScout</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map(([title, body]) => (
            <article key={title} className="bg-white p-5 shadow-[0_12px_0_rgba(16,24,32,0.05)]">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fff8e8] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a35c09]">Static generative preview</p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
                A preview of the itinerary format.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-[#6b5d4d]">
                The live planner stays informational until safe itinerary and booking connections are ready. If no fit is available, the preview should stay informative instead of inventing a product.
              </p>
            </div>

            <div className="space-y-4">
              {itineraryPreview.map(item => (
                <article key={item.day} className="border-l-4 border-[#f59a3d] bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.04)]">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a35c09]">{item.day}</p>
                  <h3 className="mt-2 text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{item.body}</p>
                </article>
              ))}
              <div className="border border-[#e9d7b7] bg-[#f7f5ef] p-5">
                <h3 className="text-xl font-black">Booking handoff explanation</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  RadarScout helps travelers decide. The booking partner helps travelers book. Local operators deliver the experience.
                </p>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  This page does not include checkout, payment collection, live availability checks, or booking submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-[#101820] p-8 text-center text-white shadow-[0_18px_0_rgba(16,24,32,0.08)] sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#8dd8ca]">Planner preview</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
            Ready to shape your next route?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-white/76">
            Explore current Thailand partner experiences now, or return soon for the interactive AI trip planner.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/tours" className="inline-flex min-h-[52px] items-center justify-center bg-[#f59a3d] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#101820] [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
              Explore local experiences
            </Link>
            <Link href="/destinations/thailand" className="inline-flex min-h-[52px] items-center justify-center border border-white/20 px-6 text-sm font-black uppercase tracking-[0.12em] text-white">
              Thailand trip ideas
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
