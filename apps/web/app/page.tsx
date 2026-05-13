import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'RadarScout — Thailand Nightlife Intelligence Feed',
    description:
      'Monitor Reddit, X, Quora, RSS and travel communities for fresh Thailand nightlife tips, warnings, questions and hidden gems.',
    alternates: { canonical: base },
    openGraph: {
      title: 'Thailand nightlife intelligence for travelers',
      description:
        'RadarScout finds fresh Thailand nightlife tips, warnings, questions and hidden gems from public travel communities.',
      type: 'website',
      url: base,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Thailand nightlife intelligence' }],
    },
  }
}

const cities = ['Bangkok', 'Pattaya', 'Phuket', 'Chiang Mai']
const categories = ['Bars', 'Clubs', 'Massage', 'Scams', 'Prices', 'Dating', 'Transport', 'Safety']

const sampleSignals = [
  {
    city: 'Bangkok',
    category: 'Safety',
    title: 'First-time visitor asking whether Nana or Soi Cowboy is safer tonight',
    score: 9,
  },
  {
    city: 'Pattaya',
    category: 'Price',
    title: 'Travelers comparing current Walking Street bar prices and common tourist traps',
    score: 8,
  },
  {
    city: 'Phuket',
    category: 'Hidden gem',
    title: 'Fresh thread about quieter late-night areas away from Bangla Road',
    score: 7,
  },
]

export default async function LandingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">RadarScout</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="font-medium text-gray-500 hover:text-gray-900">Pricing</Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/register" className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700">
                Start free
              </Link>
            )}
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Thailand nightlife intelligence feed
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-6xl">
            Fresh nightlife tips, warnings, questions and hidden gems for Thailand travelers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            RadarScout monitors Reddit, X, Quora, RSS feeds and travel communities, then classifies each signal by city, nightlife category, credibility, traveler intent and commercial value for thainight.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={isLoggedIn ? '/dashboard/matches' : '/auth/register'}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              {isLoggedIn ? 'Open intelligence feed' : 'Start monitoring'}
            </Link>
            <Link
              href="/api/thainight/intelligence"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View thainight JSON
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Discovery here. Guides, maps, PDFs, newsletter and Telegram conversion in thainight.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Live signal examples</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">thainight ready</span>
          </div>
          <div className="space-y-3">
            {sampleSignals.map(signal => (
              <article key={signal.title} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">{signal.city}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{signal.category}</span>
                  <span className="ml-auto rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">{signal.score}/10</span>
                </div>
                <p className="text-sm font-medium leading-6 text-gray-800">{signal.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-950">What RadarScout discovers</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {cities.map(city => (
              <div key={city} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-900">{city}</p>
                <p className="mt-1 text-sm text-gray-500">City-level nightlife questions, warnings and fresh venue chatter.</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <span key={category} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-600">
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-950">RadarScout is the discovery engine.</h2>
          <p className="mt-3 text-gray-600">
            It collects public signals, summarizes them, scores credibility and commercial value, and exposes a clean JSON/RSS feed for downstream products.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">thainight is the conversion layer.</h2>
          <p className="mt-3 text-gray-600">
            It turns intelligence into city guides, maps, daily traveler questions, paid PDFs, newsletters, Telegram posts and service recommendations.
          </p>
        </div>
      </section>

      <section className="bg-gray-950 py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Build the Thailand nightlife information loop.</h2>
          <p className="mt-3 text-gray-300">
            RadarScout finds what travelers are asking right now. thainight packages it into useful, monetizable travel content.
          </p>
          <Link
            href={isLoggedIn ? '/dashboard' : '/auth/register'}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            {isLoggedIn ? 'Go to dashboard' : 'Create free account'}
          </Link>
        </div>
      </section>
    </main>
  )
}
