import type { Metadata } from 'next'
import Link from 'next/link'
import { IntentParserDemo } from './IntentParserDemo'

export const metadata: Metadata = {
  title: 'AI Private Trip Search | RadarScout',
  description:
    'AI private trip search engine preview for custom travel ideas. Understand travel intent locally before Bókun-backed catalog search, availability, pricing, or booking are connected.',
}

const examplePrompts = [
  'Chiang Mai, 3 days, temples, elephants, local food, relaxed pace',
  'Bangkok and Phuket, 7 days, private transfers, family-friendly islands',
  'Japan, 5 days, food markets, culture, less crowded neighborhoods',
  'France, 4 days, wine villages, local guides, premium comfort',
]

const differentiators = [
  [
    'Not a normal tour list',
    'Start with a custom travel idea instead of forcing travelers to scroll through flat filters first.',
  ],
  [
    'Not a generic chatbot',
    'The preview focuses on structured trip intent, missing fields, and planning signals rather than open-ended conversation.',
  ],
  [
    'Catalog search comes next',
    'Real product search from the Bókun-backed catalog will only appear after that backend connection is implemented.',
  ],
]

const steps = [
  ['1', 'Describe your custom trip', 'Tell us destination, duration, interests, avoid preferences, and travel style in one sentence.'],
  ['2', 'AI understands intent locally', 'RadarScout parses the request on the page so the preview stays transparent and self-contained.'],
  ['3', 'Bókun-backed product search coming next', 'Real product search arrives after the catalog connection is implemented in a separate backend step.'],
]

const trustCards = [
  ['AI private trip search preview', 'This page is a launch-focused search preview, not a hidden booking flow.'],
  ['Understand your travel intent locally', 'We understand destination, duration, interests, avoid preferences, and booking intent locally.'],
  ['No fake prices', 'The preview never invents prices, inventory signals, or product matches.'],
  ['No fake availability or booking links', 'Real product matching will only appear after the catalog connection is implemented.'],
]

const notConnectedYet = [
  'Bókun catalog sync',
  'Product search',
  'Availability',
  'Checkout',
  'Payment',
  'Booking',
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
                <span>AI Private Trip Search Preview</span>
                <span className="text-[#a77b36]">Local intent parsing only</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                AI private trip search engine for custom travel ideas
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#5a5147]">
                Describe your trip in one sentence. RadarScout understands the travel intent first, then prepares for future search across a Bókun-backed catalog once that connection is implemented.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="#ai-search-preview"
                  className="inline-flex min-h-[52px] items-center justify-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white [clip-path:polygon(4%_0,100%_7%,96%_100%,0_93%)]"
                >
                  Try the AI Search Preview
                </Link>
                <p className="max-w-xl text-sm font-semibold leading-7 text-[#5a6670]">
                  No fake prices, no fake availability, no fake booking links, and no form submission connected.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#d9cfbf] bg-white/85 p-4 shadow-[0_24px_0_rgba(16,24,32,0.05)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-[#101820] px-5 py-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8dd8ca]">Preview mode</p>
                <h2 className="mt-2 text-2xl font-black leading-tight">
                  Search-style discovery starts with trip intent
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">
                  The existing demo below stays intact while the page framing shifts to a clear AI private trip search engine story.
                </p>
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-[#ebe0cf] bg-[#fffaf0] px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a35c09]">Catalog transparency</p>
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-7 text-[#5a6670]">
                  <li>Bókun-backed product catalog connection is planned next</li>
                  <li>No Bókun product data is loaded in this preview</li>
                  <li>No fake prices, no fake availability, no fake booking links</li>
                  <li>Supplier, availability, pricing, checkout, payment, and booking integrations are not connected yet</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            id="ai-search-preview"
            className="mt-8 rounded-[2rem] border border-[#d8cebf] bg-white/70 p-4 shadow-[0_20px_0_rgba(16,24,32,0.04)] sm:p-5"
          >
            <IntentParserDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {differentiators.map(([title, body]) => (
            <article key={title} className="border border-[#ded7ca] bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.04)]">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">Why this is different</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">Example prompts</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.035em] sm:text-5xl">
              Describe your trip in one sentence.
            </h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-7 text-[#5a6670]">
            These are search-preview prompts only. They do not load products, confirm availability, or invent a booking path.
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
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a35c09]">What is not connected yet</p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
                Honest launch boundaries.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-[#6b5d4d]">
                This launch preview helps people understand the product concept without pretending that catalog search, availability, pricing, or booking are already live.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {notConnectedYet.map(item => (
                  <div key={item} className="border border-[#e9d7b7] bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#6b5d4d]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <article className="border-l-4 border-[#f59a3d] bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.04)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a35c09]">Bókun-backed catalog</p>
                <h3 className="mt-2 text-2xl font-black">Product search from the catalog is coming next</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  Real product matching will only appear after the Bókun-backed catalog connection is implemented in a separate backend step.
                </p>
              </article>
              <article className="border-l-4 border-[#0f766e] bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.04)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">Search preview</p>
                <h3 className="mt-2 text-2xl font-black">Intent first, product matching later</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  Today&apos;s page proves that custom trip intent can be parsed clearly before catalog search, availability, checkout, payment, or booking are switched on.
                </p>
              </article>
              <div className="border border-[#e9d7b7] bg-[#f7f5ef] p-5">
                <h3 className="text-xl font-black">Transparent preview mode</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  No Bókun product data is loaded in this PR. No fake prices, no fake availability, and no fake booking links are shown anywhere on the page.
                </p>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
                  No product retrieval, checkout, payment, or booking flow is connected in this preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl bg-[#101820] p-8 text-center text-white shadow-[0_18px_0_rgba(16,24,32,0.08)] sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#8dd8ca]">Search preview</p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
            Search-style discovery starts here.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-white/76">
            Use the AI search preview to express a custom trip idea now. Real product matching from the Bókun-backed catalog is the next step, not part of this PR.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="#ai-search-preview"
              className="inline-flex min-h-[52px] items-center justify-center bg-[#f59a3d] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#101820] [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]"
            >
              Try the AI Search Preview
            </Link>
            <Link href="/destinations/thailand" className="inline-flex min-h-[52px] items-center justify-center border border-white/20 px-6 text-sm font-black uppercase tracking-[0.12em] text-white">
              Thailand inspiration
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
