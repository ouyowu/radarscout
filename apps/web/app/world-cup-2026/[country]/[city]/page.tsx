import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InventoryAlert } from '@/app/_components/InventoryAlert'
import { getWorldCupCitiesByCountry, getWorldCupCity, worldCupHostCities } from '@/lib/world-cup-2026'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type CityPageProps = {
  params: {
    country: string
    city: string
  }
}

export function generateStaticParams() {
  return worldCupHostCities.map(city => ({
    country: city.countrySlug,
    city: city.citySlug,
  }))
}

export function generateMetadata({ params }: CityPageProps): Metadata {
  const city = getWorldCupCity(params.country, params.city)
  if (!city) return {}

  return {
    title: `World Cup 2026 ${city.cityName} Travel Guide | Partner Tours Coming Soon`,
    description: `Plan World Cup 2026 travel in ${city.cityName}. Partner tours are coming soon; bookable Bókun partner inventory is currently live in Thailand only.`,
    alternates: { canonical: `${base}/world-cup-2026/${city.countrySlug}/${city.citySlug}` },
  }
}

function ComingSoonPanel({ cityName }: { cityName: string }) {
  return (
    <div className="mt-8">
      <InventoryAlert status="coming-soon" destinationName={cityName} />
      <h2 className="text-2xl font-black text-[#101820]">Partner tours coming soon in {cityName}</h2>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#7c4a03]">
        Partner tours coming soon. We are onboarding local Bókun suppliers for this host city.
      </p>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-[#7c4a03]">
        No Viator, GetYourGuide, Klook, affiliate, or manually inserted unbookable products are shown here.
      </p>
    </div>
  )
}

export default function WorldCupCityPage({ params }: CityPageProps) {
  const city = getWorldCupCity(params.country, params.city)
  if (!city) notFound()

  const siblingCities = getWorldCupCitiesByCountry(city.countrySlug).filter(item => item.citySlug !== city.citySlug).slice(0, 4)
  const experienceTypes = Array.from(new Set([
    'Airport transfer',
    'Stadium transfer',
    'Private city tour',
    'Food tour',
    'Night tour',
    'Day trip nearby',
    ...city.popularTourTypes,
  ])).slice(0, 10)

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href={`/world-cup-2026/${city.countrySlug}`} className="min-h-[44px] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
          {city.countryName}
        </Link>
      </header>

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">World Cup 2026 host city</span>
            <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Partner tours coming soon</span>
          </div>
          <p className="mt-8 text-3xl font-black text-[#101820] [font-family:cursive]">{city.cityName}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            World Cup 2026 Travel Guide for {city.cityName}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            Plan match-day transfers, private city tours, food experiences, and day trips around your World Cup schedule. Partner tours will appear here as we onboard local Bókun suppliers.
          </p>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#5a5147]">{city.shortDescription}</p>
          <InventoryAlert status="coming-soon" destinationName={city.cityName} className="mt-8" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Stadium</p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-none">{city.stadiumName}</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#5a6670]">
              Build the day around stadium timing first, then add meals, short walks, or transfers only where the route is realistic.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Airport transfer</p>
            <h2 className="mt-3 text-2xl font-black">Confirm airport, hotel zone, luggage, and arrival timing.</h2>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Stadium transfer</p>
            <h2 className="mt-3 text-2xl font-black">Keep match transport separate from full day tours.</h2>
          </article>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Airport arrival planning</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[#5a6670]">
              {city.airportTips.map(tip => <li key={tip}>• {tip}</li>)}
            </ul>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Hotel to stadium transfer</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[#5a6670]">
              {city.stadiumTransferNotes.map(note => <li key={note}>• {note}</li>)}
            </ul>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best areas to stay</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[#5a6670]">
              {city.bestAreasToStay.map(area => <li key={area}>• {area}</li>)}
            </ul>
          </article>
        </section>

        <section className="mt-10 bg-[#101820] p-6 text-white shadow-[0_18px_40px_rgba(16,24,32,0.12)]">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Match-day essentials</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {city.matchDayEssentials.map((essential, index) => (
              <article key={essential} className="border border-white/12 bg-white/[0.06] p-5">
                <p className="text-sm font-black text-[#eeb08f]">Essential {index + 1}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">{essential}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {city.matchDayPlan.map((step, index) => (
              <div key={step} className="bg-white/[0.08] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#eeb08f]">Plan step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/76">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="bg-[#fffdf7] p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">2-day fan itinerary</p>
            <div className="mt-5 space-y-4">
              {city.twoDayFanItinerary.map((item, index) => (
                <div key={item} className="border-l-4 border-[#f59a3d] pl-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7c4a03]">Day {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold leading-7 text-[#5a6670]">{item}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="bg-[#fffdf7] p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">3-day fan itinerary</p>
            <div className="mt-5 space-y-4">
              {city.threeDayFanItinerary.map((item, index) => (
                <div key={item} className="border-l-4 border-[#101820] pl-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#101820]">Day {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold leading-7 text-[#5a6670]">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best experience types for this city</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {experienceTypes.map(type => (
                <span key={type} className="bg-[#101820] px-4 py-3 text-sm font-black text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                  {type}
                </span>
              ))}
            </div>
          </section>
          <section>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Day trips nearby</p>
            <div className="mt-4 grid gap-3">
              {city.nearbyDayTripIdeas.map(dayTrip => (
                <p key={dayTrip} className="bg-[#fffdf7] px-4 py-3 text-sm font-semibold leading-7 shadow-[0_8px_0_rgba(16,24,32,0.05)]">
                  {dayTrip}
                </p>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Food experience ideas</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[#5a6670]">
              {city.foodExperienceIdeas.map(idea => <li key={idea}>• {idea}</li>)}
            </ul>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Private tour ideas</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[#5a6670]">
              {city.privateTourIdeas.map(idea => <li key={idea}>• {idea}</li>)}
            </ul>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Internal planning links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm font-black text-[#0f766e]">
              {city.internalLinks.map(link => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold leading-6 text-[#5a6670]">
              Thailand currently has live partner tours. World Cup host-city tours will stay Coming Soon until local Bókun suppliers are onboarded.
            </p>
          </article>
        </section>

        <ComingSoonPanel cityName={city.cityName} />

        {siblingCities.length > 0 ? (
          <section className="mt-12">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Other host cities in {city.countryName}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {siblingCities.map(sibling => (
                <Link key={sibling.citySlug} href={`/world-cup-2026/${sibling.countrySlug}/${sibling.citySlug}`} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)] transition hover:-translate-y-1">
                  <h3 className="font-serif text-2xl font-black leading-none">{sibling.cityName}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">{sibling.stadiumName}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">FAQ</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {city.faq.map(({ question, answer }) => (
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
