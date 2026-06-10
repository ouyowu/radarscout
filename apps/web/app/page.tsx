import type { Metadata } from 'next'
import { ThailandTourChat } from './ThailandTourChat'
import { globalDestinations } from '@/lib/global-destinations'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'RadarScout.io | AI Travel Search for Curated Day Tours',
  description:
    'Search, compare, and plan curated day tours, private trips, local experiences, transfers, food tours, and custom itineraries in top travel destinations.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout.io | AI Travel Search for Curated Day Tours',
    description:
      'Compare curated day tours, private trips, transfers, food tours, and custom itineraries from trusted supplier partners in popular travel countries.',
    type: 'website',
    url: base,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout.io | AI Travel Search for Curated Day Tours',
    description: 'AI-powered tour search and itinerary recommendations for top global travel destinations and trusted supplier partner experiences.',
  },
}

const steps = [
  ['Add your travel brief', 'Destinations, dates, hotel style, group size, budget, pace, and the travel moments you care about.'],
  ['Match routes and partner tours', 'RadarScout compares route fit, timing, private options, and available signed supplier experiences.'],
  ['Choose a realistic plan', 'Keep each day practical, avoid rushed timing, and send one concise request when a live partner tour is available.'],
]

const proof = [
  ['AI Itinerary Engine', 'Turn a travel idea into a day-by-day route with recommended tours, transfers, food experiences, and private options.'],
  ['Private Custom Search', 'Search by city, travel style, budget, time available, and who you travel with.'],
  ['Curated Partner Tours', 'Bookable tours come from signed Bókun supplier partners who can actually host and serve travelers.'],
  ['Compare Time, Value, and Experience', 'Compare tour styles, planning time saved, private versus group options, and best-fit experiences.'],
]

const destinationPreview = globalDestinations.slice(0, 6)

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5ef] text-[#101820]">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_20%_10%,rgba(17,94,89,0.20),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(232,94,48,0.16),transparent_32%)]" />

      <header className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex min-h-[44px] items-center text-lg font-black tracking-[-0.03em] text-[#101820]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-semibold text-[#44515c] md:flex">
          <a href="/ai-trip-planner" className="min-h-[44px] content-center hover:text-[#0f766e]">AI Planner</a>
          <a href="/destinations" className="min-h-[44px] content-center hover:text-[#0f766e]">Destinations</a>
          <a href="/world-cup-2026" className="min-h-[44px] content-center hover:text-[#0f766e]">World Cup 2026</a>
          <a href="#how" className="min-h-[44px] content-center hover:text-[#0f766e]">How it works</a>
          <a href="#tours" className="min-h-[44px] content-center hover:text-[#0f766e]">Day tours</a>
          <a href="#news" className="min-h-[44px] content-center hover:text-[#0f766e]">News</a>
          <a href="/pricing" className="min-h-[44px] content-center hover:text-[#0f766e]">Pricing</a>
        </nav>

        <a
          href="/ai-trip-planner"
          className="hidden min-h-[44px] items-center rounded-full bg-[#101820] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0f766e] md:inline-flex"
        >
          Start planning
        </a>

        <a
          href="/ai-trip-planner"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-sm font-bold text-[#101820] md:hidden"
          aria-label="Open trip planner"
        >
          Go
        </a>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <a
          href="/world-cup-2026"
          className="flex flex-col gap-3 bg-[#101820] px-5 py-4 text-white shadow-[0_12px_0_rgba(16,24,32,0.08)] transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#f59a3d]">World Cup 2026 Travel Planning</span>
            <span className="mt-1 block text-sm font-semibold text-white/78">USA, Canada, and Mexico host city guides are now live.</span>
          </span>
          <span className="inline-flex min-h-[44px] items-center text-sm font-black uppercase tracking-[0.1em] text-[#8dd8ca]">
            View guides
          </span>
        </a>
      </section>

      <section id="planner" className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 text-[#101820] sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(16,24,32,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,32,0.035)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#f59a3d]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-5xl text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center text-[#101820]">
              <svg className="h-11 w-11" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 42s10-8 10-19a10 10 0 10-20 0c0 11 10 19 10 19Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M33 26s8-6 8-15a8 8 0 10-16 0" />
                <circle cx="17" cy="23" r="3" />
              </svg>
            </div>
            <p className="text-3xl font-black text-[#101820] [font-family:cursive]">AI tour search desk</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.045em] text-[#101820] sm:text-7xl">
              AI Travel Search for Curated Day Tours in Top Travel Destinations
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#5a5147]">
              Compare and discover quality day tours, private trips, local experiences, transfers, food tours, and custom itineraries from trusted supplier partners across the world&apos;s most popular travel countries.
            </p>
            <div className="mx-auto mt-6 max-w-2xl border-l-4 border-[#f59a3d] bg-[#fff8e8] px-4 py-3 text-left shadow-[0_8px_0_rgba(16,24,32,0.05)]">
              <p className="text-xs font-semibold leading-6 text-[#7c4a03]">
                RadarScout is an AI-powered tour search and comparison platform for curated day tours, private trips, local experiences, transfers, and custom itineraries in top global travel destinations. Bookable tours come from trusted signed supplier partners; Thailand is one current live inventory destination, with more popular travel countries being onboarded.
              </p>
            </div>
          </div>
          <ThailandTourChat />
        </div>
      </section>

      <section id="how" className="bg-[#101820] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold text-[#8dd8ca]">How it works</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              A shorter path from travel idea to realistic route.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([title, body], index) => (
              <article key={title} className="rounded-3xl border border-white/12 bg-white/[0.06] p-5">
                <p className="text-sm font-black text-[#eeb08f]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-5 text-xl font-black leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-bold text-[#0f766e]">Popular travel countries</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] text-[#101820] sm:text-5xl">
              Focused on top destinations, not every place on earth.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#44515c]">
            RadarScout helps travelers explore route ideas and compare experience types in high-demand travel countries. Only signed supplier partner products become bookable; destinations still being onboarded are clearly marked as coming soon.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinationPreview.map(destination => (
            <a key={destination.slug} href={`/destinations/${destination.slug}`} className="group bg-[#fffdf7] p-5 shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition hover:-translate-y-1">
              <div className="flex flex-wrap gap-2">
                {destination.hasLiveInventory ? (
                  <span className="bg-[#0f766e] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Live inventory</span>
                ) : (
                  <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Coming soon</span>
                )}
                {destination.worldCup2026Relevant ? (
                  <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">World Cup</span>
                ) : null}
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{destination.region}</p>
              <h3 className="mt-2 font-serif text-3xl font-black leading-none group-hover:text-[#0f766e]">{destination.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-[#5a6670]">{destination.shortDescription}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/destinations" className="inline-flex min-h-[44px] items-center bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
            View all destinations
          </a>
        </div>
      </section>

      <section id="tours" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-bold text-[#0f766e]">What makes it useful</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] text-[#101820] sm:text-5xl">
              Built for private planning, not endless filter settings.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#44515c]">
            RadarScout helps compare time, value, route quality, private versus group options, and available partner experiences across curated day tours, transfers, local experiences, food tours, and custom itineraries.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {proof.map(([title, body]) => (
            <article key={title} className="rounded-3xl border border-[#ded7ca] bg-white p-5">
              <h3 className="text-lg font-black text-[#101820]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5a6670]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfaf4] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[#101820]">Important Information</h2>
          <div className="mt-6 space-y-4 text-sm font-semibold leading-7 text-[#5a5147]">
            <p>
              <strong>Price Comparisons:</strong> RadarScout displays estimated price comparisons based on common online travel agency commission and markup structures. We do not currently have direct API integrations with third-party marketplace pricing. Actual prices elsewhere may differ due to dynamic pricing, seasonal promotions, regional variations, taxes, or fees.
            </p>
            <p>
              <strong>Booking Process:</strong> All tour bookings are subject to supplier availability confirmation. Prices shown are indicative and will be confirmed before payment. RadarScout acts as a booking facilitator connecting travelers with tour operators.
            </p>
            <p>
              <strong>Partner Inventory:</strong> Bookable products on RadarScout come from signed Bókun supplier partners. Destinations without onboarded suppliers show planning guidance and coming-soon messaging, not external affiliate inventory.
            </p>
            <p>
              <strong>Smart Matching:</strong> Our itinerary planner uses deterministic matching and rules-based itinerary logic to match preferences with available tours. Please review tour details, pickup areas, cancellation terms, and inclusions before booking.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ded7ca] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#5a6670] md:flex-row md:items-center md:justify-between">
          <p className="font-black text-[#101820]">RadarScout.io</p>
          <div className="flex flex-wrap gap-5">
            <a href="#planner" className="min-h-[44px] content-center hover:text-[#0f766e]">Plan trip</a>
            <a href="/ai-trip-planner" className="min-h-[44px] content-center hover:text-[#0f766e]">AI Planner</a>
            <a href="/destinations" className="min-h-[44px] content-center hover:text-[#0f766e]">Destinations</a>
            <a href="/world-cup-2026" className="min-h-[44px] content-center hover:text-[#0f766e]">World Cup 2026</a>
            <a href="#tours" className="min-h-[44px] content-center hover:text-[#0f766e]">Tours</a>
            <a href="#news" className="min-h-[44px] content-center hover:text-[#0f766e]">News</a>
            <a href="mailto:hello@radarscout.io" className="min-h-[44px] content-center hover:text-[#0f766e]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
