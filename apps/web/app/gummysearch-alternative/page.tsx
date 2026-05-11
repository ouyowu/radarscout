import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Best GummySearch Alternative in 2025 | RadarScout',
    description:
      'GummySearch shut down in November 2024. RadarScout is the best replacement — real-time Reddit monitoring, AI intent scoring, campaign mode, and reply drafts. Free plan available.',
    alternates: { canonical: `${base}/gummysearch-alternative` },
    openGraph: {
      title: 'Best GummySearch Alternative in 2025 | RadarScout',
      description:
        'GummySearch shut down in 2024. RadarScout fills the gap with real-time monitoring, AI intent scoring, and reply drafts. Free to start.',
      type: 'website',
      url: `${base}/gummysearch-alternative`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'RadarScout — GummySearch alternative' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Best GummySearch Alternative in 2025 | RadarScout',
      description: 'GummySearch shut down in 2024. RadarScout is the best replacement for Reddit audience research and lead generation.',
      images: [`${base}/og.png`],
    },
  }
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-[#FF4500] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

const comparisonRows = [
  { feature: 'Status',               gummy: 'shut-down', us: 'live'  },
  { feature: 'Real-time monitoring', gummy: false,       us: true    },
  { feature: 'AI intent scoring',    gummy: false,       us: true    },
  { feature: 'Campaign mode',        gummy: false,       us: true    },
  { feature: 'Free plan',            gummy: false,       us: true    },
  { feature: 'Reply drafts',         gummy: false,       us: true    },
]

const card   = { background: '#f9fafb', border: '1px solid #e5e7eb' } as const
const cardHi = { background: '#f3f4f6', border: '1px solid #e5e7eb' } as const

export default function GummySearchAlternativePage() {
  return (
    <div className="min-h-screen" style={{ background: 'white', color: '#111827' }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #e5e7eb' }}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="text-[0.9375rem] font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              RadarScout
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
              >
                Get started free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-label font-semibold text-[#FF4500] uppercase tracking-wide mb-3">GummySearch Alternative</p>
            <h1 className="text-h1 sm:text-display font-extrabold text-gray-900">
              Best GummySearch Alternative in 2025
            </h1>
            <p className="mt-5 text-body-lg text-gray-500 max-w-2xl mx-auto">
              GummySearch shut down in November 2024, leaving thousands of users without a Reddit monitoring tool. RadarScout picks up where it left off — and goes further with AI intent scoring, campaign mode, and reply drafts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
              >
                Try RadarScout free — no credit card →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center font-semibold text-[0.9375rem] text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl transition-colors min-h-[44px]"
                style={{ border: '1px solid #e5e7eb' }}
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHAT HAPPENED ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">What happened to GummySearch?</h2>
            <p className="text-body-lg text-gray-500 mb-4">
              GummySearch was a beloved tool for indie hackers, product researchers, and growth marketers. It let users explore Reddit audiences by topic — surfacing which subreddits were most active, what pain points came up repeatedly, and which posts got the highest engagement. For anyone doing customer research or searching for product-market fit signals, it was irreplaceable.
            </p>
            <p className="text-body-lg text-gray-500 mb-4">
              In late 2024, GummySearch shut down. The founder cited the challenges of maintaining a Reddit API-dependent product after Reddit significantly increased its API pricing. Thousands of users — indie hackers, SaaS founders, marketers, and researchers — were left without a replacement.
            </p>
            <p className="text-body-lg text-gray-500">
              If you landed here, you&rsquo;re probably one of them. The good news: RadarScout was built to solve exactly the problem GummySearch solved — and then some.
            </p>
          </div>
        </section>

        {/* ── WHAT MADE GUMMYSEARCH VALUABLE ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-gray-900">What made GummySearch valuable</h2>
              <p className="mt-2 text-body text-gray-400 max-w-2xl mx-auto">
                Three core capabilities that made it the go-to Reddit research tool for founders.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Audience research',
                  body: "GummySearch helped you understand exactly who was talking about your category on Reddit — their vocabulary, concerns, and what they wanted. This raw customer insight was invaluable for positioning and copywriting.",
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Subreddit analysis',
                  body: "It showed you which subreddits were most active for a given topic, how engaged the communities were, and whether a community was receptive to product recommendations — saving hours of manual Reddit browsing.",
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Pain point discovery',
                  body: "GummySearch surfaced recurring complaints and unmet needs across Reddit — the exact language your target customers used when venting about problems your product could solve. Pure gold for landing page copy and feature prioritisation.",
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
              ].map(({ title, body, icon }) => (
                <div key={title} style={{ ...card, borderRadius: '16px' }} className="p-6">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl mb-4" style={{ background: 'rgba(255,69,0,0.12)' }}>
                    {icon}
                  </div>
                  <h3 className="text-h3 font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-body text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW RADARSCOUT FILLS THE GAP ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">How RadarScout fills the gap</h2>
            <p className="text-body-lg text-gray-500 mb-4">
              RadarScout is a real-time Reddit monitoring platform with AI-powered intent scoring. Where GummySearch was primarily a research tool — great for understanding audiences but passive — RadarScout is built for action. It watches Reddit 24/7 and surfaces conversations at the moment they happen, so you can reply before anyone else.
            </p>
            <p className="text-body-lg text-gray-500 mb-6">
              The AI intent scoring engine reads each matched post and scores it 1–10 for purchase intent. A post asking &ldquo;what&rsquo;s a good alternative to [competitor]?&rdquo; scores 9. A post that just mentions a keyword in passing scores 2. You only need to act on the 9s. Campaign mode lets you group keywords by theme — competitors, product category, pain points — so your feed is always organised and actionable.
            </p>
            <p className="text-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px]"
              >
                Try RadarScout free →
              </Link>
            </p>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold text-gray-900">GummySearch vs RadarScout</h2>
              <p className="mt-2 text-body text-gray-400">Feature-for-feature comparison</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[480px] px-4 sm:px-0">
                <div style={{ ...card, borderRadius: '16px', overflow: 'hidden' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th className="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 w-2/5">Feature</th>
                        <th className="px-5 sm:px-6 py-4 font-medium text-gray-400 text-center">GummySearch</th>
                        <th className="px-5 sm:px-6 py-4 font-semibold text-[#FF6B35] text-center">RadarScout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map(({ feature, gummy, us }) => (
                        <tr key={feature} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td className="px-5 sm:px-6 py-3.5 font-medium text-gray-600">{feature}</td>
                          <td className="px-5 sm:px-6 py-3.5 text-center">
                            {gummy === 'shut-down' ? (
                              <span className="text-label text-gray-400">Shut down</span>
                            ) : typeof gummy === 'boolean' ? (
                              gummy
                                ? <div className="flex justify-center"><CheckIcon /></div>
                                : <div className="flex justify-center"><XIcon /></div>
                            ) : (
                              <span className="text-gray-400">{gummy}</span>
                            )}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-center">
                            {us === 'live' ? (
                              <span className="text-label font-medium text-[#FF6B35]">✅ Live</span>
                            ) : typeof us === 'boolean' ? (
                              us
                                ? <div className="flex justify-center"><CheckIcon /></div>
                                : <div className="flex justify-center"><XIcon /></div>
                            ) : (
                              <span className="font-medium text-gray-800">{us}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY RADARSCOUT GOES FURTHER ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">Beyond research — active lead generation</h2>
            <p className="text-body-lg text-gray-500 mb-4">
              GummySearch was excellent for passive research: understanding your market, finding where conversations happened, and mining historical discussions. RadarScout is built for a different use case — active, real-time lead generation. It catches the moment someone posts a buying signal and gets you there first.
            </p>
            <p className="text-body-lg text-gray-500">
              The AI reply draft feature means you can go from spotting a high-intent post to posting a genuinely helpful, non-salesy reply in under a minute. The first reply in a Reddit thread gets seen by every reader who opens it. RadarScout&rsquo;s speed advantage — alerts in under 60 seconds — makes that first-mover position achievable consistently, not just occasionally.
            </p>
          </div>
        </section>

        {/* ── HOW TO MIGRATE ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-4">How to migrate your GummySearch workflow</h2>
            <p className="text-body-lg text-gray-500 mb-8">
              If you had saved searches, audience segments, or tracked subreddits in GummySearch, you can rebuild that setup in RadarScout in under five minutes. Here&rsquo;s how.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {[
                {
                  step: '01',
                  title: 'Create a free RadarScout account',
                  body: 'Sign up at radarscout.io — no credit card required. Your free plan includes 3 live keywords and real-time Reddit monitoring from day one.',
                },
                {
                  step: '02',
                  title: 'Create a campaign for each topic area',
                  body: 'In GummySearch you had audience segments. In RadarScout you have Campaigns. Create one campaign per product, competitor, or customer segment you were tracking.',
                },
                {
                  step: '03',
                  title: 'Add your keywords',
                  body: 'Take the search terms you used in GummySearch — product categories, competitor names, pain-point phrases — and add them as keywords inside each campaign. Use phrases like "alternative to [competitor]", "frustrated with [tool]", and "looking for [category]".',
                },
                {
                  step: '04',
                  title: 'Set your intent threshold',
                  body: 'On the Pro plan, set a minimum intent score (e.g. 7+) so your feed only shows posts where someone is actively looking to buy, switch, or hire — not just mentioning a keyword in passing.',
                },
                {
                  step: '05',
                  title: 'Watch your live feed',
                  body: 'RadarScout monitors Reddit 24/7. New matches appear in your dashboard within 60 seconds. Use the AI reply draft to respond to high-intent posts before your competitors do.',
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-5" style={{ padding: '20px', ...card, borderRadius: '12px' }}>
                  <span className="text-label font-bold text-[#FF4500] uppercase flex-shrink-0 w-6 pt-0.5">{step}</span>
                  <div>
                    <h3 className="text-h3 font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-body text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-8 text-center">Common questions</h2>
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              {[
                {
                  q: 'Is GummySearch really gone for good?',
                  a: 'Yes. GummySearch shut down in November 2024. The service is no longer available and there is no announced return date. If you had an active subscription, you would have received a shutdown notice by email.',
                },
                {
                  q: 'Can I do the same audience research in RadarScout?',
                  a: 'Yes, and in real time. Set up campaigns around your topic areas, competitor names, and pain-point phrases. RadarScout surfaces every new matching post across all subreddits, scored by AI for purchase intent. You get a live view of what your target audience is saying right now — not a historical snapshot.',
                },
                {
                  q: 'Is there a free plan?',
                  a: 'Yes. RadarScout has a free plan that lets you monitor 3 keywords forever with no credit card required. Real-time alerts are included on the free plan. AI intent scoring and reply drafts are paid features starting at $29/month.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <summary className="flex items-center justify-between py-4 cursor-pointer text-gray-700 font-medium text-body select-none [&::-webkit-details-marker]:hidden list-none min-h-[44px] hover:text-gray-900 transition-colors">
                    <span>{q}</span>
                    <svg className="h-5 w-5 text-gray-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="pb-5 text-body text-gray-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }} className="py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-h2 font-bold text-white">Start free — no credit card</h2>
            <p className="mt-3 text-body text-white/75">Free forever · 3 keywords · Setup in 2 minutes</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-white text-[#c93500] font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF4500]"
              >
                Create free account →
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

      </main>

      {/* ── RELATED PAGES ── */}
      <section style={{ borderTop: '1px solid #e5e7eb' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-label font-semibold text-gray-400 uppercase tracking-wide mb-4">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/f5bot-alternative" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>F5Bot alternative →</Link>
            <Link href="/social-listening-reddit" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Reddit social listening guide →</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Pricing plans →</Link>
            <Link href="/auth/register" className="text-sm font-medium text-[#FF6B35] hover:text-[#FF4500] transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,69,0,0.25)' }}>Get started free →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #e5e7eb' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[0.9375rem] font-semibold text-gray-900">RadarScout</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            <Link href="/pricing"                  className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/f5bot-alternative"        className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">F5Bot Alternative</Link>
            <Link href="/gummysearch-alternative"  className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">GummySearch Alternative</Link>
            <Link href="/auth/login"               className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Sign in</Link>
            <Link href="/auth/register"            className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Register</Link>
          </nav>
          <p className="text-label text-gray-400">© {new Date().getFullYear()} RadarScout</p>
        </div>
      </footer>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'RadarScout',
          description: 'AI-powered Reddit keyword monitoring and lead generation tool',
          url: 'https://radarscout.io',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          operatingSystem: 'Web',
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is GummySearch really gone for good?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. GummySearch shut down in November 2024. The service is no longer available and there is no announced return date.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I do the same audience research in RadarScout?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, and in real time. Set up campaigns around your topic areas, competitor names, and pain-point phrases. RadarScout surfaces every new matching post across all subreddits, scored by AI for purchase intent.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is there a free plan?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Yes. RadarScout has a free plan that lets you monitor 3 keywords forever with no credit card required.",
              },
            },
          ],
        }) }}
      />

    </div>
  )
}
