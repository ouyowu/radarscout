import type { Metadata } from 'next'
import Link from 'next/link'
import { worldCupHostCities, worldCupHostCountries } from '@/lib/world-cup-2026'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'World Cup 2026 Travel Planner | RadarScout',
  description:
    'Plan World Cup 2026 trips with AI-powered city guides, match-day essentials, airport transfers, private tours, food experiences, and trusted local partner tours as RadarScout expands.',
  alternates: { canonical: `${base}/world-cup-2026` },
  openGraph: {
    title: 'World Cup 2026 Travel Planner | RadarScout',
    description:
      'USA, Canada, and Mexico host city guides for match-day logistics, transfers, city tours, food experiences, and future Bókun partner tours.',
    type: 'website',
    url: `${base}/world-cup-2026`,
  },
}

const essentials = [
  ['Airport transfers', 'Plan arrival windows, luggage needs, and hotel zones before match-day pressure begins.'],
  ['Stadium transfers', 'Keep stadium transport separate from sightseeing so match timing stays realistic.'],
  ['Private city tours', 'Use private guides or drivers when traffic, hotel zones, or group timing would add stress.'],
  ['Food and day trips', 'Save non-match days for neighborhoods, food routes, nearby nature, and cultural day trips.'],
]

const fanStyles = [
  ['Match-day only', 'For travelers flying in around one match: prioritize airport transfer, hotel zone, stadium timing, and a safe post-match return.'],
  ['2-3 day city break', 'For fans adding one city stay: place food, private highlights, and a short city walk around the match schedule.'],
  ['Multi-city football trip', 'For fans following teams across borders: compare airport choices, transfer days, and rest windows before adding tours.'],
]

export default function WorldCup2026Page() {
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
          <p className="text-3xl font-black text-[#101820] [font-family:cursive]">World Cup 2026 travel planning</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            AI-powered host city guides for match days and day tours.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            Plan your World Cup 2026 trip with AI-powered city guides, match-day essentials, airport transfers, private tours, food experiences, and trusted local partner tours as our Bókun supplier network expands.
          </p>
          <div className="mt-8 border-l-4 border-[#f59a3d] bg-[#fff8e8] p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-semibold leading-7 text-[#7c4a03]">
              Partner tours coming soon. We only show bookable products when they are supplied by signed Bókun supplier partners.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Why football travelers need planning</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              Match days are not normal sightseeing days.
            </h2>
            <p className="mt-5 text-sm font-semibold leading-7 text-[#5a6670]">
              World Cup trips need realistic transfer windows, hotel-zone planning, crowd-aware timing, and backup routes. RadarScout separates match-day essentials from city touring so travelers do not stack too much into one day.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {essentials.map(([title, body]) => (
              <article key={title} className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Why plan early</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Host-city hotel zones, airports, and stadium transfers can shape the entire trip. Early planning helps fans avoid rushed routes and expensive last-minute transport decisions.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Matches plus day tours</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Keep match days simple. Add private city tours, food experiences, and nearby day trips on non-match days where timing is more forgiving.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Supplier network notice</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              These pages are travel planning assets. Bookable tours will appear only after local Bókun supplier partners are signed and synced.
            </p>
          </article>
        </div>

        <div className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Sample fan travel styles</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {fanStyles.map(([title, body]) => (
              <article key={title} className="bg-[#fffdf7] p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <h3 className="font-serif text-3xl font-black leading-none">{title}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-[#5a6670]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101820] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Host countries</p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
            USA, Canada, and Mexico.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {worldCupHostCountries.map(country => (
              <Link key={country.slug} href={`/world-cup-2026/${country.slug}`} className="group border border-white/12 bg-white/[0.06] p-6 transition hover:-translate-y-1">
                <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">World Cup 2026</span>
                <h3 className="mt-6 font-serif text-4xl font-black leading-none group-hover:text-[#8dd8ca]">{country.name}</h3>
                <p className="mt-4 text-sm font-semibold leading-7 text-white/72">{country.shortDescription}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/tours" className="inline-flex min-h-[44px] items-center bg-[#f59a3d] px-5 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
              Thailand currently has live partner tours
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Host cities</p>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
          City guides ready for early SEO.
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {worldCupHostCities.map(city => (
            <Link key={`${city.countrySlug}-${city.citySlug}`} href={`/world-cup-2026/${city.countrySlug}/${city.citySlug}`} className="group bg-[#fffdf7] p-5 shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition hover:-translate-y-1">
              <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Coming soon</span>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{city.countryName}</p>
              <h3 className="mt-2 font-serif text-3xl font-black leading-none group-hover:text-[#0f766e]">{city.cityName}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">{city.stadiumName}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfaf4] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">FAQ</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['Can I book World Cup tours now?', 'Not yet through these pages. We will show bookable products only after local Bókun suppliers are signed and synced.'],
              ['Do these pages use FIFA data?', 'No. These are static travel-planning and SEO pages. No FIFA API or external sports API is connected.'],
              ['Will you list Viator or affiliate tours?', 'No. RadarScout is not using Viator, GetYourGuide, Klook, or affiliate products as bookable inventory.'],
              ['What comes next?', 'The next phase can add deeper city copy, transfer request flows, or supplier onboarding once real Bókun partners are available.'],
            ].map(([question, answer]) => (
              <article key={question} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <h3 className="text-lg font-black">{question}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
