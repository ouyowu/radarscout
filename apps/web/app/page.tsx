import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'

const heroImage =
  'https://images.unsplash.com/photo-1681129813299-0dce89ccc6cf?auto=format&fit=crop&fm=jpg&q=80&w=2400'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'RadarScout - Thailand Nightlife Intelligence',
    description:
      'Fresh Thailand nightlife questions, warnings, price checks, event chatter, and traveler signals from public communities.',
    alternates: { canonical: base },
    openGraph: {
      title: 'Thailand nightlife intelligence for travelers',
      description:
        'RadarScout watches public travel communities and turns noisy nightlife chatter into useful Thailand travel intelligence.',
      type: 'website',
      url: base,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Thailand nightlife intelligence' }],
    },
  }
}

const cities = [
  { name: 'Bangkok', focus: 'Rooftops, clubs, tourist zones, late-entry fees', score: '92' },
  { name: 'Pattaya', focus: 'Walking Street, price checks, solo traveler warnings', score: '88' },
  { name: 'Phuket', focus: 'Bangla Road, beach clubs, event timing', score: '81' },
  { name: 'Chiang Mai', focus: 'Live music, hidden bars, digital nomad meetups', score: '74' },
]

const signals = [
  {
    label: 'Warning',
    city: 'Bangkok',
    title: 'Late-entry fee reports around a large electronic event',
    note: 'Useful for a short traveler warning and ticket-check advice.',
    score: 8,
  },
  {
    label: 'Question',
    city: 'Pattaya',
    title: 'Solo visitor asking which area feels safest after midnight',
    note: 'Good reply opportunity and future safety FAQ material.',
    score: 9,
  },
  {
    label: 'Price check',
    city: 'Phuket',
    title: 'Travelers comparing current bar prices near Bangla Road',
    note: 'Useful for ThaiNight price transparency content.',
    score: 7,
  },
]

const standards = [
  'Freshness',
  'Traveler intent',
  'Location clarity',
  'Credibility',
  'Safety value',
  'Commercial potential',
]

export default async function LandingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <main className="min-h-screen bg-[#0b0908] text-[#f7f1e8]">
      <header className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-black/30 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="RadarScout home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d6b35a]/50 bg-[#15100d] text-sm font-black text-[#d6b35a]">
              RS
            </span>
            <span>
              <span className="block text-sm font-black uppercase text-white">RadarScout</span>
              <span className="block text-[11px] font-semibold uppercase text-[#d6b35a]">
                Thailand Nightlife Intel
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <a
              href="https://thainight.co"
              className="hidden min-h-11 items-center justify-center rounded-lg px-4 font-semibold text-[#f7f1e8]/80 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              ThaiNight
            </a>
            <Link
              href={isLoggedIn ? '/dashboard/matches' : '/auth/register'}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#d6b35a] px-4 font-bold text-[#16100b] hover:bg-[#e8c970]"
            >
              {isLoggedIn ? 'Open desk' : 'View feed'}
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative min-h-[84dvh] overflow-hidden">
        <img
          src={heroImage}
          alt="Bangkok neon street at night"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,6,0.96),rgba(8,7,6,0.72)_44%,rgba(8,7,6,0.18))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0908] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[84dvh] max-w-7xl items-end px-4 pb-12 pt-28 sm:px-6 lg:pb-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase text-[#d6b35a]">
              Public signals. Editor-grade nightlife intelligence.
            </p>
            <h1 className="text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Thailand Nightlife Intelligence
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f7f1e8]/78">
              RadarScout reads public travel communities and separates useful nightlife signals from noise:
              warnings, price checks, event questions, hidden gems, and solo-traveler concerns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://thainight.co"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#d6b35a] px-5 py-3 text-sm font-black text-[#17110c] hover:bg-[#e8c970]"
              >
                Explore ThaiNight
              </a>
              <Link
                href={isLoggedIn ? '/dashboard/matches' : '/auth/register'}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 bg-white/8 px-5 py-3 text-sm font-bold text-white hover:bg-white/14"
              >
                {isLoggedIn ? 'Open intelligence desk' : 'Start a monitor'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2a2119] bg-[#100c0a]">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 md:grid-cols-4">
          {[
            ['Sources watched', 'Reddit, RSS, travel forums'],
            ['Core cities', 'Bangkok, Pattaya, Phuket, Chiang Mai'],
            ['Signal types', 'Warnings, prices, events, questions'],
            ['Output layer', 'ThaiNight guides, maps, alerts'],
          ].map(([label, value]) => (
            <div key={label} className="border-[#2a2119] py-6 md:border-r md:last:border-r-0">
              <p className="text-xs font-bold uppercase text-[#8d8173]">{label}</p>
              <p className="mt-2 text-lg font-black text-[#f7f1e8]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-[#d6b35a]">Selected cities</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              A nightlife guide needs live local signals, not static blog posts.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#b8ad9d]">
              RadarScout is the listening layer behind ThaiNight. It finds what travelers are asking
              today, then ThaiNight turns the best findings into guides, venue cards, maps, warnings,
              offers, and newsletters.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {cities.map(city => (
              <article key={city.name} className="rounded-lg border border-[#2a2119] bg-[#15100d] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{city.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#a99b89]">{city.focus}</p>
                  </div>
                  <span className="rounded-lg border border-[#d6b35a]/35 bg-[#21180f] px-2.5 py-1 text-sm font-black text-[#d6b35a]">
                    {city.score}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe4] py-16 text-[#17110c] lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-black uppercase text-[#9b1c1f]">Inspection standard</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Every signal is treated like a field note.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5d5144]">
                The goal is not to publish everything. The goal is to identify which public posts are
                worth replying to, turning into a guide, or saving as a warning for travelers.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {standards.map(standard => (
                  <span key={standard} className="rounded-lg border border-[#ded3c3] bg-white px-3 py-1.5 text-sm font-bold text-[#4a4035]">
                    {standard}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {signals.map(signal => (
                <article key={signal.title} className="rounded-lg border border-[#ded3c3] bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#9b1c1f] px-2.5 py-1 text-xs font-black uppercase text-white">
                      {signal.label}
                    </span>
                    <span className="rounded-lg bg-[#eee5d7] px-2.5 py-1 text-xs font-bold uppercase text-[#665949]">
                      {signal.city}
                    </span>
                    <span className="ml-auto rounded-lg border border-[#d6b35a]/50 bg-[#fff7df] px-2.5 py-1 text-xs font-black text-[#7a5a05]">
                      {signal.score}/10
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-black">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#665949]">{signal.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'For travelers',
              body: 'See what other visitors are asking before you choose a district, event, or venue.',
            },
            {
              title: 'For ThaiNight',
              body: 'Turn live signals into city guides, warnings, venue pages, newsletters, and paid travel products.',
            },
            {
              title: 'For venues and partners',
              body: 'Understand what tourists worry about: pricing, safety, queues, entry rules, and location clarity.',
            },
          ].map(item => (
            <article key={item.title} className="rounded-lg border border-[#2a2119] bg-[#15100d] p-6">
              <h3 className="text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#a99b89]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2119] bg-[#0f0b09] py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#d6b35a]">The loop</p>
            <h2 className="mt-2 text-3xl font-black text-white">
              RadarScout discovers. ThaiNight publishes.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a99b89]">
              Keep RadarScout as the intelligence engine and make ThaiNight the public-facing travel brand.
              That gives you SEO pages, useful content, partner value, and repeat visitors.
            </p>
          </div>
          <a
            href="https://thainight.co"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#d6b35a] px-5 py-3 text-sm font-black text-[#17110c] hover:bg-[#e8c970]"
          >
            Go to ThaiNight
          </a>
        </div>
      </section>
    </main>
  )
}
