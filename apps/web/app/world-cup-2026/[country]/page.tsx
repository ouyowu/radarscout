import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InventoryAlert } from '@/app/_components/InventoryAlert'
import { getWorldCupCitiesByCountry, getWorldCupCountry, worldCupCountryRouteIdeas, worldCupHostCountries } from '@/lib/world-cup-2026'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type CountryPageProps = {
  params: {
    country: string
  }
}

export function generateStaticParams() {
  return worldCupHostCountries.map(country => ({ country: country.slug }))
}

export function generateMetadata({ params }: CountryPageProps): Metadata {
  const country = getWorldCupCountry(params.country)
  if (!country) return {}

  return {
    title: `${country.name} World Cup 2026 Travel Planning Guide | Partner Tours Coming Soon`,
    description: `${country.shortDescription} Partner tours are coming soon; bookable Bókun partner inventory is currently live in Thailand only.`,
    alternates: { canonical: `${base}/world-cup-2026/${country.slug}` },
  }
}

function ComingSoonPanel({ countryName }: { countryName: string }) {
  return (
    <div className="mt-8">
      <InventoryAlert status="coming-soon" destinationName={countryName} />
      <h2 className="text-2xl font-black text-[#101820]">Partner tours coming soon</h2>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#7c4a03]">
        Partner tours coming soon. We are onboarding local Bókun suppliers for this host country.
      </p>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-[#7c4a03]">
        No external affiliate products are shown here.
      </p>
    </div>
  )
}

export default function WorldCupCountryPage({ params }: CountryPageProps) {
  const country = getWorldCupCountry(params.country)
  if (!country) notFound()

  const cities = getWorldCupCitiesByCountry(country.slug)
  const tourTypes = Array.from(new Set(cities.flatMap(city => city.popularTourTypes))).slice(0, 8)
  const routeIdeas = worldCupCountryRouteIdeas.filter(route => route.countrySlug === country.slug)

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/world-cup-2026" className="min-h-[44px] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
          World Cup 2026
        </Link>
      </header>

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">World Cup 2026 host country</span>
          <p className="mt-8 text-3xl font-black text-[#101820] [font-family:cursive]">{country.name}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            {country.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            {country.shortDescription}
          </p>
          <InventoryAlert status="coming-soon" destinationName={country.name} className="mt-8" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Host cities in this country</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em]">
              Build the trip around match days first.
            </h2>
            <p className="mt-5 text-sm font-semibold leading-7 text-[#5a6670]">
              RadarScout separates stadium logistics from sightseeing, food, nightlife, and nearby day trips so travelers can keep each city route realistic.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cities.map(city => (
              <Link key={city.citySlug} href={`/world-cup-2026/${country.slug}/${city.citySlug}`} className="group bg-[#fffdf7] p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)] transition hover:-translate-y-1">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{city.stadiumName}</p>
                <h3 className="mt-3 font-serif text-3xl font-black leading-none group-hover:text-[#0f766e]">{city.cityName}</h3>
                <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#5a6670]">{city.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Match-day transport planning</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Airport and stadium transfers should be planned as dedicated logistics blocks, not squeezed between long tours.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Food and nightlife</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Food routes and nightlife are best placed after light sightseeing days or non-match evenings, with flexible timing.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">City highlights</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Private city tours help fans see more when hotel zones, traffic, and limited rest days make group timing difficult.
            </p>
          </article>
        </div>

        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best tour types for football travelers</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {tourTypes.map(type => (
              <span key={type} className="bg-[#101820] px-4 py-3 text-sm font-black text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                {type}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-[#101820] p-6 text-white shadow-[0_18px_40px_rgba(16,24,32,0.12)]">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Recommended host city routes</p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.035em]">
            Best city combinations for football travelers.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {routeIdeas.map(route => (
              <article key={route.title} className="border border-white/12 bg-white/[0.06] p-5">
                <h3 className="font-serif text-2xl font-black leading-none">{route.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">{route.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {route.citySlugs.map(citySlug => {
                    const linkedCity = cities.find(city => city.citySlug === citySlug)
                    if (!linkedCity) return null

                    return (
                      <Link key={citySlug} href={`/world-cup-2026/${country.slug}/${citySlug}`} className="bg-[#f59a3d] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                        {linkedCity.cityName}
                      </Link>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best city combinations</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Combine nearby host cities only when travel days and match times leave enough recovery space. Do not force long transfers into match days.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Match-day travel planning tips</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Plan airport arrival, hotel zone, stadium transfer, and post-match return before adding food tours, nightlife, or nearby day trips.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Internal planning links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm font-black text-[#0f766e]">
              <Link href="/world-cup-2026">World Cup 2026 hub</Link>
              <Link href={`/destinations/${country.slug === 'usa' ? 'united-states' : country.slug}`}>{country.name} destination guide</Link>
              <Link href="/tours">Thailand live partner tours</Link>
            </div>
          </article>
        </section>

        <ComingSoonPanel countryName={country.name} />

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">FAQ</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['Are partner tours available here now?', 'Not yet. These pages are ready for planning and SEO; bookable tours will appear only after signed Bókun suppliers are onboarded.'],
              ['Can I combine host cities?', 'Yes. The planning approach is designed for multi-city routes, but each transfer and match day should keep realistic buffers.'],
              ['Do you list affiliate products?', 'No. RadarScout does not add Viator, GetYourGuide, Klook, or affiliate products into the catalog.'],
              ['What should fans plan first?', 'Start with match dates, stadium city, airport, hotel zone, and transfer windows before adding private tours or day trips.'],
            ].map(([question, answer]) => (
              <article key={question} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <h3 className="text-lg font-black">{question}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
