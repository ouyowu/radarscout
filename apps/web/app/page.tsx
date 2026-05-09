import Link from 'next/link'
import { auth } from '@/lib/auth'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

const comparisonRows: { feature: string; f5bot: string | boolean; us: string | boolean }[] = [
  { feature: 'Price', f5bot: 'Free only', us: 'Free plan + paid tiers' },
  { feature: 'Alert speed', f5bot: '~1 hour', us: '< 60 seconds' },
  { feature: 'AI filtering', f5bot: false, us: true },
  { feature: 'Slack webhook', f5bot: false, us: true },
]

export default async function LandingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* CSS-only hamburger — must come before everything it styles via peer-checked */}
          <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 text-sm flex-shrink-0">
              Reddit Monitor
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger label — mobile only */}
            <label
              htmlFor="nav-open"
              className="lg:hidden flex items-center justify-center h-11 w-11 -mr-2 cursor-pointer text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          {/* Mobile menu — shown when checkbox is checked */}
          <div className="hidden peer-checked:block lg:hidden border-t border-gray-100 pb-4">
            <div className="flex flex-col pt-3 gap-1">
              <Link href="/pricing" className="text-sm text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center">
                Pricing
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-sm font-semibold text-orange-600 px-3 py-2.5 rounded-lg hover:bg-orange-50 transition-colors min-h-[44px] flex items-center">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="mt-1 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-center transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Get notified when Reddit mentions you
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0">
              Reddit Monitor scans r/all 24/7 and emails you within 60 seconds when your keywords appear. Track your brand, competitors, or any topic in real time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href={isLoggedIn ? '/dashboard' : '/auth/register'}
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors min-h-[44px]"
              >
                {isLoggedIn ? 'Go to dashboard →' : 'Start for free →'}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">No credit card required · 3 keywords free forever</p>
          </div>

          {/* Right: mock alert card — desktop only */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Keyword match</span>
                      <span className="text-xs text-gray-400">just now</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">&ldquo;rust programming&rdquo; in r/programming</p>
                    <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
                      &ldquo;Rust is amazing for systems programming. I switched from C++ six months ago and the toolchain is just so much better&hellip;&rdquo;
                    </p>
                    <span className="mt-3 inline-flex items-center text-xs font-medium text-orange-600">
                      View on Reddit →
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['< 60s', 'alert delay'], ['24/7', 'monitoring'], ['r/all', 'coverage']].map(([val, label]) => (
                  <div key={label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <p className="text-base font-bold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why switch from F5Bot?</h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">F5Bot is great — but it was built for 2014. We&rsquo;re built for 2025.</p>
          </div>
          {/* overflow-x-auto for mobile — negative horizontal margin lets table reach the edge */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[480px] px-4 sm:px-0 sm:min-w-0">
              <table className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 sm:px-6 py-4 font-medium text-gray-500 w-2/5">Feature</th>
                    <th className="px-5 sm:px-6 py-4 font-medium text-gray-500 w-[30%]">F5Bot</th>
                    <th className="px-5 sm:px-6 py-4 font-semibold text-orange-600 w-[30%]">Reddit Monitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comparisonRows.map(({ feature, f5bot, us }) => (
                    <tr key={feature} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 sm:px-6 py-4 text-gray-700 font-medium">{feature}</td>
                      <td className="px-5 sm:px-6 py-4 text-center">
                        {typeof f5bot === 'boolean' ? (
                          f5bot
                            ? <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                            : <XIcon className="mx-auto h-5 w-5 text-gray-300" />
                        ) : (
                          <span className="text-gray-500">{f5bot}</span>
                        )}
                      </td>
                      <td className="px-5 sm:px-6 py-4 text-center">
                        {typeof us === 'boolean' ? (
                          us
                            ? <CheckIcon className="mx-auto h-5 w-5 text-orange-500" />
                            : <XIcon className="mx-auto h-5 w-5 text-gray-300" />
                        ) : (
                          <span className="font-medium text-gray-900">{us}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Up and running in 2 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-50 mb-4 flex-shrink-0">
                <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Step 1</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Add keywords</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Enter the words or phrases you want to track — your brand, product name, competitors, or any topic.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-50 mb-4 flex-shrink-0">
                <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Step 2</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">We monitor Reddit</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Our crawler scans r/all continuously — every new post and comment, 24 hours a day, 7 days a week.</p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-50 mb-4 flex-shrink-0">
                <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Step 3</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Get notified</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Receive an email digest within 60 seconds of a match. Click through directly to the Reddit thread.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Start free, scale as you grow</h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">No credit card required to get started.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-400">forever</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">3 keywords · email alerts</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-orange-400 p-5 relative">
              <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">Most popular</span>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$19</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">30 keywords · digest emails</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Team</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$49</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">100 keywords · priority support</p>
            </div>
          </div>
          <p className="text-center">
            <Link href="/pricing" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
              See full feature comparison →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="border-t border-gray-100">
            {[
              {
                q: 'Is it really free?',
                a: 'Yes. The free plan lets you monitor 3 keywords with no time limit and no credit card required. Upgrade only when you need more coverage.',
              },
              {
                q: 'How fast are the alerts?',
                a: 'Our crawler scans r/all continuously. In most cases you receive an email digest within 60 seconds of a matching post or comment appearing on Reddit.',
              },
              {
                q: 'Does it only monitor Reddit?',
                a: 'Yes, Reddit only for now. We cover all subreddits via r/all — both posts and comments. Support for Hacker News and other platforms is on the roadmap.',
              },
              {
                q: 'How is this different from F5Bot?',
                a: "F5Bot is a great free service, but alerts can be delayed by up to an hour and there's no API, Slack integration, or AI filtering. Reddit Monitor is built for teams and businesses that need real-time signals.",
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime from your billing page — no lock-in, no cancellation fee. Your plan downgrades to Free at the end of the billing period and you keep all your keywords.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group border-b border-gray-100">
                <summary className="flex items-center justify-between py-4 cursor-pointer text-gray-900 font-medium text-sm sm:text-base select-none [&::-webkit-details-marker]:hidden list-none min-h-[44px]">
                  <span>{q}</span>
                  <svg
                    className="h-5 w-5 text-gray-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Start monitoring in 2 minutes</h2>
          <p className="mt-3 text-orange-100 text-sm sm:text-base">Free plan forever. No credit card. Cancel anytime.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={isLoggedIn ? '/dashboard' : '/auth/register'}
              className="inline-flex items-center justify-center bg-white text-orange-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors min-h-[44px]"
            >
              {isLoggedIn ? 'Go to dashboard →' : 'Create free account →'}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-orange-300 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors min-h-[44px]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900">Reddit Monitor</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Register</Link>
          </nav>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Reddit Monitor</p>
        </div>
      </footer>

    </div>
  )
}
