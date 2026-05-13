import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'RadarScout Use Cases — Reddit Lead Generation',
    description:
      'See how SaaS founders, marketing agencies, and B2B sales teams use RadarScout to find high-intent Reddit conversations before competitors do.',
    alternates: { canonical: `${base}/use-cases` },
    openGraph: {
      title: 'RadarScout Use Cases — Reddit Lead Generation',
      description:
        'See how SaaS founders, marketing agencies, and B2B sales teams use RadarScout to find high-intent Reddit conversations.',
      type: 'website',
      url: `${base}/use-cases`,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Use Cases' }],
    },
  }
}

const card   = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px' } as const
const cardHi = { background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '16px' } as const

const useCases = [
  {
    segment: 'SaaS Founders',
    headline: 'Find people switching away from your competitors',
    keywords: ['"[competitor] alternative"', '"frustrated with [tool]"', '"looking for [category]"'],
    result: 'Reply before anyone else, convert frustrated users',
    icon: (
      <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    segment: 'Marketing Agencies',
    headline: 'Find new clients actively looking for your services',
    keywords: ['"looking for agency"', '"need help with SEO"', '"recommend marketing tool"'],
    result: 'First-mover advantage in every conversation',
    icon: (
      <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    segment: 'B2B Sales Teams',
    headline: 'Real-time buying signals from Reddit',
    keywords: ['Competitor names', 'Category keywords', 'Pain point phrases'],
    result: 'Replace expensive outbound with inbound intent data',
    icon: (
      <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
] as const

export default async function UseCasesPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen" style={{ background: 'white', color: '#111827' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #e5e7eb' }}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6">
          <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="flex-shrink-0 flex items-center" aria-label="RadarScout home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="RadarScout" height={36} style={{ width: 'auto' }} />
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/use-cases" className="text-[0.9375rem] font-medium text-[#FF4500] hover:text-[#e63e00] transition-colors">
                Use Cases
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>

            <label
              htmlFor="nav-open"
              className="lg:hidden flex items-center justify-center h-11 w-11 -mr-2 cursor-pointer text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          <div className="hidden peer-checked:block lg:hidden pb-4" style={{ borderTop: '1px solid #e5e7eb' }}>
            <div className="flex flex-col pt-3 gap-1">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-gray-600 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-gray-100">
                Pricing
              </Link>
              <Link href="/use-cases" className="text-[0.9375rem] font-medium text-[#FF4500] px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-gray-100">
                Use Cases
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-[#FF4500] px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-gray-100">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-600 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-gray-100">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="mt-1 text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2.5 rounded-xl text-center transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-label font-semibold text-[#FF4500] uppercase tracking-wide mb-3">Use Cases</p>
          <h1 className="text-h1 sm:text-display font-extrabold text-gray-900">
            Who RadarScout is for
          </h1>
          <p className="mt-5 text-body-lg text-gray-500 max-w-2xl mx-auto">
            Monitor Reddit 24/7 for high-intent conversations. Here&rsquo;s how different teams use RadarScout to turn buying signals into customers.
          </p>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────────── */}
      <section className="pb-14 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-8">
            {useCases.map(({ segment, headline, keywords, result, icon }, i) => (
              <div key={segment} style={{ ...card, padding: '32px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                  {/* Copy — swap order on even rows via CSS order */}
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-xl flex-shrink-0"
                        style={{ background: 'rgba(255,69,0,0.12)' }}
                      >
                        {icon}
                      </div>
                      <span className="text-label font-bold text-[#FF4500] uppercase tracking-wide">{segment}</span>
                    </div>
                    <h2 className="text-h2 font-bold text-gray-900 mb-4">{headline}</h2>
                    <p className="text-body font-semibold text-gray-700">
                      ✓ {result}
                    </p>
                  </div>

                  {/* Keywords card */}
                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <div style={{ ...cardHi, padding: '20px' }}>
                      <p className="text-label font-semibold text-gray-400 uppercase tracking-wide mb-3">Monitor these keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map(kw => (
                          <span
                            key={kw}
                            className="text-label font-medium text-[#FF4500] px-3 py-1"
                            style={{ background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: '999px' }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }} className="py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-h2 font-bold text-white">Start finding leads free today</h2>
          <p className="mt-3 text-body text-white/75">Free forever · No credit card · Setup in 2 minutes</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={isLoggedIn ? '/dashboard' : '/auth/register'}
              className="inline-flex items-center justify-center bg-white text-[#c93500] font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF4500]"
            >
              {isLoggedIn ? 'Go to dashboard →' : 'Create free account →'}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-semibold text-[0.9375rem] text-white px-6 py-3 rounded-xl transition-colors min-h-[44px]"
              style={{ border: '1px solid rgba(255,255,255,0.35)' }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e5e7eb' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[0.9375rem] font-semibold text-gray-900">RadarScout</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/pricing" className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/use-cases" className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Use Cases</Link>
            <Link href="/f5bot-alternative" className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">F5Bot alternative</Link>
            <Link href="/auth/login" className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Register</Link>
          </nav>
          <p className="text-label text-gray-400">© {new Date().getFullYear()} RadarScout</p>
        </div>
      </footer>

    </div>
  )
}
