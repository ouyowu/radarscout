import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@reddit-monitor/db'
import { InventoryAlert } from '@/app/_components/InventoryAlert'
import { getGlobalDestination, globalDestinations } from '@/lib/global-destinations'
import { productView } from '@/lib/bokunProductView'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type DestinationPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return globalDestinations.map(destination => ({ slug: destination.slug }))
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = getGlobalDestination(params.slug)
  if (!destination) return {}
  const title = destination.hasLiveInventory
    ? `${destination.name} AI Travel Planner & Live Bókun Partner Tours | RadarScout`
    : `${destination.name} Travel Planning Guide | Bókun Partner Tours Coming Soon`
  const description = destination.hasLiveInventory
    ? `${destination.shortDescription} Live bookable tours are supplied by signed Bókun partner operators.`
    : `${destination.shortDescription} Partner tours are coming soon; bookable inventory is currently live in Thailand only.`

  return {
    title,
    description,
    alternates: { canonical: `${base}/destinations/${destination.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${base}/destinations/${destination.slug}`,
    },
  }
}

async function ThailandLiveInventory() {
  const products = await db.bokunProduct.findMany({
    where: {
      active: true,
      NOT: {
        OR: [
          { title: { contains: 'Kenya', mode: 'insensitive' } },
          { title: { contains: 'Nairobi', mode: 'insensitive' } },
          { title: { contains: 'Maasai', mode: 'insensitive' } },
          { title: { contains: 'Mara', mode: 'insensitive' } },
          { title: { contains: 'Nakuru', mode: 'insensitive' } },
          { title: { contains: 'Giraffe', mode: 'insensitive' } },
        ],
      },
    },
    orderBy: [{ updatedAt: 'desc' }],
    take: 6,
    include: {
      supplier: {
        select: { title: true },
      },
    },
  })

  if (products.length === 0) {
    return <ComingSoonPanel liveInventory />
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Available partner tours</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-0.035em]">Thailand live Bókun inventory</h2>
        </div>
        <Link href="/tours" className="min-h-[44px] bg-[#101820] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
          View all Thailand tours
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {products.map(product => {
          const view = productView(product.rawJson, product.description, product.excerpt)

          return (
            <Link key={product.id} href={`/tours/${product.id}`} className="group overflow-hidden bg-[#fffdf7] shadow-[0_14px_34px_rgba(16,24,32,0.10)] transition hover:-translate-y-1">
              <div className="relative aspect-[4/3] bg-[#f1eadc]">
                {view.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={view.imageUrl} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-end bg-[linear-gradient(135deg,#0f766e,#d9ebe6_55%,#f7f5ef)] p-5">
                    <p className="text-3xl font-black text-white">{product.city ?? 'Thailand'}</p>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{product.supplier?.title ?? 'Bókun partner supplier'}</p>
                <h3 className="mt-3 line-clamp-2 font-serif text-2xl font-black leading-tight">{product.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[#5a6670]">
                  {view.summary ?? product.excerpt ?? 'Live partner-supplied tour available from the current Bókun inventory.'}
                </p>
                <p className="mt-4 text-sm font-black text-[#0f766e]">
                  Estimated planning time saved: 2-4 hours
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ComingSoonPanel({ liveInventory = false }: { liveInventory?: boolean }) {
  return (
    <div className="mt-8">
      <InventoryAlert status={liveInventory ? 'live' : 'coming-soon'} />
      <p className="mt-3 text-sm font-semibold leading-7 text-[#7c4a03]">
        {liveInventory
          ? 'Thailand is RadarScout’s first live Bókun supplier destination. If no products appear here, run the supplier and product sync workflow, then return to this page.'
          : 'Partner tours coming soon. We are currently onboarding trusted local Bókun suppliers in this destination.'}
      </p>
    </div>
  )
}

function FAQ({ hasLiveInventory }: { hasLiveInventory: boolean }) {
  const questions = [
    ['Are these tours bookable now?', hasLiveInventory ? 'Thailand has live partner-supplied Bókun inventory. Other destinations will show products only after signed local suppliers are onboarded.' : 'Not yet. This destination page is ready for SEO and planning, but bookable partner tours will appear only after Bókun suppliers are onboarded.'],
    ['Do you show Viator or GetYourGuide products?', 'No. RadarScout does not place Viator, GetYourGuide, Klook, or affiliate products into the bookable catalog.'],
    ['What does the AI planner compare?', 'The planner is designed to compare route fit, time saved, tour style, private versus group options, and available partner experiences.'],
    ['Can I plan multi-country trips?', 'Yes. RadarScout is being shaped around multi-country travel planning, but only destinations with signed partner inventory will show bookable tours.'],
  ]

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {questions.map(([question, answer]) => (
        <article key={question} className="bg-white p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
          <h3 className="text-lg font-black">{question}</h3>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">{answer}</p>
        </article>
      ))}
    </div>
  )
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const destination = getGlobalDestination(params.slug)
  if (!destination) notFound()

  const itineraryIdeas = [
    `Start with ${destination.topCities[0]} for city orientation and food.`,
    `Add ${destination.topCities[1] ?? destination.topCities[0]} for a second base or day trip.`,
    `Use private options when transfers, luggage, or timing would make group tours inefficient.`,
  ]

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

      <section className="relative overflow-hidden bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,32,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {destination.hasLiveInventory ? (
              <span className="bg-[#0f766e] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Live partner tours available</span>
            ) : (
              <span className="bg-[#101820] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">Partner tours coming soon</span>
            )}
            {destination.worldCup2026Relevant ? (
              <span className="bg-[#f59a3d] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-white">World Cup 2026 travel focus</span>
            ) : null}
          </div>
          <p className="mt-8 text-3xl font-black text-[#101820] [font-family:cursive]">{destination.name}</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            {destination.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#5a5147]">
            {destination.shortDescription}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <InventoryAlert
          status={destination.hasLiveInventory ? 'live' : 'coming-soon'}
          destinationName={destination.name}
          className="mb-8"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Why visit</p>
            <h2 className="mt-3 text-2xl font-black">A useful base for private planning</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">
              RadarScout helps turn destination ideas into realistic day-by-day routes, with partner tours added only when they are supplied by signed Bókun operators.
            </p>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Best time to visit</p>
            <h2 className="mt-3 text-2xl font-black">{destination.bestTimeToVisit}</h2>
          </article>
          <article className="bg-white p-6 shadow-[0_10px_0_rgba(16,24,32,0.05)]">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Recommended days</p>
            <h2 className="mt-3 text-2xl font-black">{destination.recommendedDays}</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#5a6670]">Enough time to balance city highlights, day tours, and lower-stress transfer windows.</p>
          </article>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Top cities</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {destination.topCities.map(city => (
                <span key={city} className="bg-[#fffdf7] px-4 py-3 text-sm font-black shadow-[0_8px_0_rgba(16,24,32,0.05)]">
                  {city}
                </span>
              ))}
            </div>
          </section>
          <section>
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Popular day tour types</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {destination.popularTourTypes.map(type => (
                <span key={type} className="bg-[#101820] px-4 py-3 text-sm font-black text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                  {type}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 bg-[#101820] p-6 text-white shadow-[0_18px_40px_rgba(16,24,32,0.12)]">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Suggested itinerary ideas</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {itineraryIdeas.map((idea, index) => (
              <article key={idea} className="border border-white/12 bg-white/[0.06] p-5">
                <p className="text-sm font-black text-[#eeb08f]">Day idea {index + 1}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">{idea}</p>
              </article>
            ))}
          </div>
        </section>

        {destination.hasLiveInventory ? <ThailandLiveInventory /> : <ComingSoonPanel />}

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">FAQ</p>
          <FAQ hasLiveInventory={destination.hasLiveInventory} />
        </section>
      </section>
    </main>
  )
}
