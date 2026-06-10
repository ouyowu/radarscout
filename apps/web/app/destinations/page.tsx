import type { Metadata } from 'next'
import Link from 'next/link'
import { globalDestinations } from '@/lib/global-destinations'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Global Travel Destinations | RadarScout AI Day Tour Planner',
  description:
    'Explore RadarScout destination guides for global travel cities. Thailand has live Bókun partner tours; more countries are being onboarded city by city.',
  alternates: { canonical: `${base}/destinations` },
}

export default function DestinationsPage() {
  const liveCount = globalDestinations.filter(destination => destination.hasLiveInventory).length
  const worldCupCount = globalDestinations.filter(destination => destination.worldCup2026Relevant).length

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <Link href="/tours" className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          Live tours
        </Link>
      </header>

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-3xl font-black text-[#101820] [font-family:cursive]">Global destination desk</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            Popular travel countries, planned city by city.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            RadarScout is expanding from Thailand into global travel destinations. Bookable tours only appear when they come from signed Bókun supplier partners.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.06)]">
              <p className="text-4xl font-black">{globalDestinations.length}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">Countries planned</p>
            </div>
            <div className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.06)]">
              <p className="text-4xl font-black">{liveCount}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">Live inventory country</p>
            </div>
            <div className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.06)]">
              <p className="text-4xl font-black">{worldCupCount}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">World Cup focus countries</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {globalDestinations.map(destination => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="group flex min-h-[360px] flex-col justify-between overflow-hidden bg-[#fffdf7] p-6 shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,24,32,0.16)]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  {destination.hasLiveInventory ? (
                    <span className="bg-[#0f766e] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
                      Live partner tours available
                    </span>
                  ) : (
                    <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
                      Partner tours coming soon
                    </span>
                  )}
                  {destination.worldCup2026Relevant ? (
                    <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
                      World Cup 2026 travel focus
                    </span>
                  ) : null}
                </div>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-[#0f766e]">{destination.region}</p>
                <h2 className="mt-3 font-serif text-4xl font-black leading-none tracking-[-0.035em] group-hover:text-[#0f766e]">
                  {destination.name}
                </h2>
                <p className="mt-4 line-clamp-4 text-sm font-semibold leading-7 text-[#5a6670]">
                  {destination.shortDescription}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7b8790]">Top cities</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#101820]">
                  {destination.topCities.slice(0, 4).join(' / ')}
                </p>
                <span className="mt-5 inline-flex min-h-[44px] items-center bg-[#101820] px-5 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                  View destination
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
