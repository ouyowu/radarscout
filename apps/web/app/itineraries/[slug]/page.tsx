import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InventoryAlert } from '@/app/_components/InventoryAlert'
import { getItinerary, itineraries } from '@/lib/itineraries'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type ItineraryPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return itineraries.map(itinerary => ({ slug: itinerary.slug }))
}

export function generateMetadata({ params }: ItineraryPageProps): Metadata {
  const itinerary = getItinerary(params.slug)
  if (!itinerary) return {}

  return {
    title: itinerary.seoTitle,
    description: itinerary.seoDescription,
    alternates: { canonical: `${base}/itineraries/${itinerary.slug}` },
    openGraph: {
      title: itinerary.seoTitle,
      description: itinerary.seoDescription,
      type: 'website',
      url: `${base}/itineraries/${itinerary.slug}`,
    },
  }
}

function PartnerTourSection({ hasLiveInventory }: { hasLiveInventory: boolean }) {
  if (hasLiveInventory) {
    return (
      <div className="mt-8 bg-[#101820] p-6 text-white shadow-[0_18px_40px_rgba(16,24,32,0.12)]">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Available partner tours</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.035em]">Thailand live partner tours are available now.</h2>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/75">
          Browse current Thailand experiences supplied by signed Bókun partner operators. RadarScout does not add external affiliate products into the bookable catalog.
        </p>
        <Link href="/tours" className="mt-6 inline-flex min-h-[44px] items-center bg-[#f59a3d] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          View Thailand tours
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-8 border-l-4 border-[#f59a3d] bg-[#fff8e8] p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[#7c4a03]">Available partner tours</p>
      <h2 className="mt-3 text-2xl font-black text-[#101820]">Partner tours for this route are coming soon.</h2>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#7c4a03]">
        We are onboarding trusted local Bókun suppliers. Until then, this page is a planning guide and does not display bookable third-party or affiliate products.
      </p>
    </div>
  )
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary = getItinerary(params.slug)
  if (!itinerary) notFound()

  const status = itinerary.hasLiveInventory ? 'live' : 'planning-only'

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#101820]">
      <header className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[-0.03em]">
          Radar<span className="text-[#0f766e]">Scout</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/ai-trip-planner" className="min-h-[44px] px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
            AI Planner
          </Link>
          <Link href="/destinations" className="min-h-[44px] px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-[#101820]">
            Destinations
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
              {itinerary.days} days
            </span>
            <span className="bg-[#0f766e] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">
              {itinerary.hasLiveInventory ? 'Live partner tours available' : 'Planning guide'}
            </span>
          </div>
          <p className="mt-8 text-3xl font-black text-[#101820] [font-family:cursive]">
            {itinerary.countries.join(' + ')}
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            {itinerary.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            {itinerary.routeSummary}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="bg-white/80 p-5 shadow-[0_8px_0_rgba(16,24,32,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">Destinations</p>
              <p className="mt-2 text-sm font-black leading-6">{itinerary.destinations.join(', ')}</p>
            </article>
            <article className="bg-white/80 p-5 shadow-[0_8px_0_rgba(16,24,32,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">Travel style</p>
              <p className="mt-2 text-sm font-black leading-6">{itinerary.travelStyle}</p>
            </article>
            <article className="bg-white/80 p-5 shadow-[0_8px_0_rgba(16,24,32,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">Who this is for</p>
              <p className="mt-2 text-sm font-black leading-6">{itinerary.whoThisIsFor}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <InventoryAlert status={status} destinationName={itinerary.countries.join(', ')} className="mb-10" />

        <section>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Day-by-day route</p>
          <div className="mt-6 grid gap-5">
            {itinerary.dayByDayPlan.map(day => (
              <article key={`${itinerary.slug}-${day.day}`} className="grid gap-5 bg-[#fffdf7] p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)] md:grid-cols-[150px_1fr]">
                <div>
                  <span className="inline-flex min-h-[44px] items-center bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.1em] text-white">
                    Day {day.day}
                  </span>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{day.location}</p>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-black leading-tight">{day.title}</h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{day.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best experience types to add</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {itinerary.bestExperienceTypes.map(type => (
                <span key={type} className="bg-[#101820] px-4 py-3 text-sm font-black text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                  {type}
                </span>
              ))}
            </div>
          </div>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Estimated planning time saved</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em]">{itinerary.estimatedPlanningTimeSaved}</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              Saved by grouping route order, transfers, day tours, and timing rules into one clean planning outline.
            </p>
          </article>
        </section>

        <PartnerTourSection hasLiveInventory={itinerary.hasLiveInventory} />

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Related planning links</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {itinerary.relatedLinks.map(link => (
              <Link key={link.href} href={link.href} className="min-h-[44px] bg-white px-4 py-3 text-sm font-black text-[#101820] shadow-[0_8px_0_rgba(16,24,32,0.05)] transition hover:-translate-y-0.5">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">FAQ</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {itinerary.faq.map(({ question, answer }) => (
              <article key={question} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
                <h2 className="text-lg font-black">{question}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
