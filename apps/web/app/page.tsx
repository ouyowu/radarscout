import Link from 'next/link'
import { auth } from '@/lib/auth'
import { LiveDemoWidget } from '@/components/LiveDemoWidget'

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

function IntentBadge({ score, subreddit }: { score: number; subreddit: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        className="inline-flex items-center gap-1 text-label font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(255,69,0,0.15)', color: '#FF6B35' }}
      >
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
        Intent {score}/10
      </span>
      <span className="text-label text-white/40">r/{subreddit}</span>
    </div>
  )
}

const comparisonTools = [
  { name: 'F5Bot',     aiScoring: false,            replyAssistant: false,          leadGen: false,          highlight: false },
  { name: 'Syften',   aiScoring: false,            replyAssistant: false,          leadGen: 'Basic',        highlight: false },
  { name: 'RadarScout',aiScoring: 'AI intent 1–10', replyAssistant: 'Reply drafts', leadGen: 'Built for it', highlight: true  },
]

/* Reusable inline-style tokens */
const card   = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' } as const
const cardHi = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '16px' } as const

export default async function LandingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.87)' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.82)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6">
          <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-[0.9375rem] text-white/90 flex-shrink-0 hover:text-white transition-colors">
              RadarScout
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-white/55 hover:text-white/90 transition-colors">
                Pricing
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[0.9375rem] font-medium text-white/55 hover:text-white/90 transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>

            <label
              htmlFor="nav-open"
              className="lg:hidden flex items-center justify-center h-11 w-11 -mr-2 cursor-pointer text-white/55 hover:text-white/90 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          <div className="hidden peer-checked:block lg:hidden pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col pt-3 gap-1">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-white/65 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-white/5">
                Pricing
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-[#FF4500] px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-white/5">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[0.9375rem] font-medium text-white/65 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] flex items-center hover:bg-white/5">
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
      <section className="relative overflow-hidden">
        {/* Ambient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{ top: '-220px', left: '-120px', height: '520px', width: '520px', borderRadius: '50%', background: 'rgba(255,69,0,0.11)', filter: 'blur(90px)', animation: 'blob-drift 22s ease-in-out infinite' }}
          aria-hidden="true"
        />
        <div
          className="absolute pointer-events-none"
          style={{ bottom: '-180px', right: '-120px', height: '440px', width: '440px', borderRadius: '50%', background: 'rgba(100,50,220,0.07)', filter: 'blur(90px)', animation: 'blob-drift 28s ease-in-out infinite reverse' }}
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Copy */}
            <div
              className="text-center lg:text-left"
              style={{ animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              <h1 className="text-h1 sm:text-display font-extrabold text-white/95">
                Find <span className="text-[#FF4500]">customers</span> already asking for tools like yours
              </h1>
              <p className="mt-5 text-body-lg text-white/55 max-w-md mx-auto lg:mx-0">
                RadarScout monitors Reddit 24/7 and uses AI to surface high-intent posts — people actively looking for what you sell. Reply before your competitors do.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href={isLoggedIn ? '/dashboard' : '/auth/register'}
                  className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                >
                  {isLoggedIn ? 'Go to dashboard →' : 'Start finding leads free →'}
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center font-semibold text-[0.9375rem] text-white/70 hover:text-white/90 px-6 py-3 rounded-xl transition-colors min-h-[44px]"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  Try live demo →
                </Link>
              </div>
              <p className="mt-4 text-label text-white/35">
                Free forever · No credit card · Setup in 2 minutes
              </p>
            </div>

            {/* Live demo widget */}
            <div
              className="mt-10 lg:mt-0"
              style={{ animation: 'fade-up 0.7s 0.12s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              <LiveDemoWidget />
            </div>

          </div>
        </div>
      </section>

      {/* ── PAIN POINTS ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Stop missing opportunities',
                body: 'High-value Reddit posts disappear in hours. We catch them the moment they\'re posted.',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Only high-intent leads',
                body: 'AI scores every mention 1–10 for purchase intent. You only see people who are ready to buy.',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Reply before competitors',
                body: 'Get notified within minutes. First reply gets 3× more clicks.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ ...card, padding: '24px' }}>
                <div
                  className="flex items-center justify-center h-11 w-11 rounded-xl mb-4"
                  style={{ background: 'rgba(255,69,0,0.12)' }}
                >
                  {icon}
                </div>
                <h3 className="text-h3 font-semibold text-white/90 mb-2">{title}</h3>
                <p className="text-body text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ICP CALLOUT ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-white/90">Built for people who sell things online</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Indie Hackers */}
            <div style={{ ...card, padding: '24px' }} className="flex flex-col">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl mb-4 flex-shrink-0" style={{ background: 'rgba(255,69,0,0.12)' }}>
                <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-h3 font-semibold text-white/90 mb-2">Indie Hackers &amp; Solo Founders</h3>
              <p className="text-body text-white/50 leading-relaxed mb-4">
                Monitor keywords like &ldquo;alternative to [competitor]&rdquo; or &ldquo;looking for [your category]&rdquo;. Find your first 100 customers on Reddit.
              </p>
              <div className="mt-auto" style={{ ...cardHi, padding: '14px' }}>
                <IntentBadge score={9} subreddit="SaaS" />
                <p className="text-sm text-white/70 leading-relaxed">
                  &ldquo;Anyone know a good Stripe analytics tool? Been using Baremetrics but it&rsquo;s too expensive&hellip;&rdquo;
                </p>
              </div>
            </div>

            {/* Agencies */}
            <div style={{ ...card, padding: '24px' }} className="flex flex-col">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl mb-4 flex-shrink-0" style={{ background: 'rgba(255,69,0,0.12)' }}>
                <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-h3 font-semibold text-white/90 mb-2">Marketing Agencies</h3>
              <p className="text-body text-white/50 leading-relaxed mb-4">
                Track brand mentions, monitor competitors, and find new client opportunities — all in one dashboard. Show clients real ROI.
              </p>
              <div className="mt-auto" style={{ ...cardHi, padding: '14px' }}>
                <IntentBadge score={8} subreddit="Entrepreneur" />
                <p className="text-sm text-white/70 leading-relaxed">
                  &ldquo;Looking to hire an SEO agency for our SaaS. Budget is $3k/month&hellip;&rdquo;
                </p>
              </div>
            </div>

            {/* B2B SaaS */}
            <div style={{ ...card, padding: '24px' }} className="flex flex-col">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl mb-4 flex-shrink-0" style={{ background: 'rgba(255,69,0,0.12)' }}>
                <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-h3 font-semibold text-white/90 mb-2">B2B SaaS Teams</h3>
              <p className="text-body text-white/50 leading-relaxed mb-4">
                Replace expensive social listening tools. Get real-time buying signals from 500M+ Reddit users.
              </p>
              <div className="mt-auto" style={{ ...cardHi, padding: '14px' }}>
                <p className="text-label font-medium text-white/35 uppercase mb-2">Example keywords</p>
                {['"switching from [competitor]"', '"frustrated with [tool]"', '"software comparison"'].map(kw => (
                  <div key={kw} className="text-sm text-white/60 py-0.5">{kw}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-14 sm:py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-white/90">Up and running in 2 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                step: '01',
                title: 'Add keywords',
                body: 'Your product name, competitor names, category terms like "looking for [X]". RadarScout watches all of them simultaneously across every subreddit.',
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'AI filters the noise',
                body: 'Intent scoring removes memes, rants, and irrelevant mentions. You get a ranked feed — highest purchase intent at the top.',
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Reply and win customers',
                body: 'Get notified instantly. Use AI draft to reply in seconds — leads with genuine value, naturally mentions your product.',
                icon: (
                  <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
            ].map(({ step, title, body, icon }) => (
              <div key={step} className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center h-11 w-11 rounded-xl mb-4 flex-shrink-0" style={{ background: 'rgba(255,69,0,0.12)' }}>
                  {icon}
                </div>
                <p className="text-label font-bold text-[#FF4500] uppercase mb-2">{step}</p>
                <h3 className="text-h3 font-semibold text-white/90 mb-2">{title}</h3>
                <p className="text-body text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 text-center sm:divide-x sm:divide-white/10">
            {[
              'Monitoring 500M+ Reddit posts',
              'AI-scored for purchase intent',
              'Trusted by indie hackers and agencies',
            ].map(item => (
              <span key={item} className="text-body text-white/35 sm:px-8 leading-relaxed">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-h2 font-bold text-white/90">How RadarScout compares</h2>
            <p className="mt-2 text-body text-white/45">Built for lead gen — not just monitoring.</p>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[520px] px-4 sm:px-0 sm:min-w-0">
              <div style={{ ...card, overflow: 'hidden' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <th className="text-left px-5 sm:px-6 py-4 font-medium text-white/40 w-2/5">Tool</th>
                      <th className="px-4 py-4 font-medium text-white/40 text-center">AI scoring</th>
                      <th className="px-4 py-4 font-medium text-white/40 text-center">Reply assistant</th>
                      <th className="px-4 py-4 font-medium text-white/40 text-center">Lead gen focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTools.map(({ name, aiScoring, replyAssistant, leadGen, highlight }) => (
                      <tr
                        key={name}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: highlight ? 'rgba(255,69,0,0.06)' : undefined,
                        }}
                      >
                        <td className={`px-5 sm:px-6 py-3.5 font-semibold ${highlight ? 'text-[#FF6B35]' : 'text-white/70'}`}>
                          {name}
                          {highlight && (
                            <span className="ml-2 text-label font-semibold bg-[#FF4500] text-white px-1.5 py-0.5 rounded">You</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {typeof aiScoring === 'boolean'
                            ? aiScoring
                              ? <CheckIcon className="h-5 w-5 text-[#FF4500] mx-auto" />
                              : <XIcon className="h-5 w-5 text-white/20 mx-auto" />
                            : <span className="text-label font-medium text-[#FF6B35]">{aiScoring}</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {typeof replyAssistant === 'boolean'
                            ? replyAssistant
                              ? <CheckIcon className="h-5 w-5 text-[#FF4500] mx-auto" />
                              : <XIcon className="h-5 w-5 text-white/20 mx-auto" />
                            : <span className="text-label font-medium text-[#FF6B35]">{replyAssistant}</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {typeof leadGen === 'boolean'
                            ? leadGen
                              ? <CheckIcon className="h-5 w-5 text-[#FF4500] mx-auto" />
                              : <XIcon className="h-5 w-5 text-white/20 mx-auto" />
                            : <span className={`text-label font-medium ${highlight ? 'text-[#FF6B35]' : 'text-white/50'}`}>{leadGen}</span>}
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

      {/* ── PRICING TEASER ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-h2 font-bold text-white/90">Start free, scale as you grow</h2>
            <p className="mt-2 text-body text-white/45">No credit card required to get started.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Free */}
            <div style={{ ...card, padding: '20px' }}>
              <p className="text-label font-semibold text-white/45 uppercase mb-1">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white/90">$0</span>
                <span className="text-body text-white/35">forever</span>
              </div>
              <p className="mt-1 text-label text-white/35">For testing the waters</p>
              <p className="mt-2 text-body text-white/50">3 keywords · email alerts</p>
            </div>
            {/* Pro */}
            <div className="relative" style={{ background: 'rgba(255,69,0,0.08)', border: '1.5px solid rgba(255,69,0,0.5)', borderRadius: '16px', padding: '20px' }}>
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF4500] text-white text-label font-semibold px-3 py-1 rounded-full whitespace-nowrap"
              >
                Most popular
              </span>
              <p className="text-label font-semibold text-[#FF6B35] uppercase mb-1">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white/90">$29</span>
                <span className="text-body text-white/35">/month</span>
              </div>
              <p className="mt-1 text-label text-white/35">For founders ready to scale lead gen</p>
              <p className="mt-2 text-body text-white/60">10 keywords · AI scoring + drafts</p>
            </div>
            {/* Team */}
            <div style={{ ...card, padding: '20px' }}>
              <p className="text-label font-semibold text-purple-400 uppercase mb-1">Team</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white/90">$79</span>
                <span className="text-body text-white/35">/month</span>
              </div>
              <p className="mt-1 text-label text-white/35">For agencies managing multiple clients</p>
              <p className="mt-2 text-body text-white/50">Unlimited keywords · team accounts</p>
            </div>
          </div>
          <p className="text-center">
            <Link href="/pricing" className="text-[0.9375rem] font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
              See full feature comparison →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-h2 font-bold text-white/90 mb-8 text-center">Frequently asked questions</h2>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              {
                q: 'How is this different from F5Bot?',
                a: "F5Bot sends every mention — including memes, rants, and spam. RadarScout uses AI to score each post for purchase intent, so you only see people who are actually ready to buy.",
              },
              {
                q: 'What keywords should I monitor?',
                a: "Start with: competitor names + \"alternative\", your product category + \"looking for\", pain points your product solves. We have a keyword guide in the dashboard.",
              },
              {
                q: 'How fast are the alerts?',
                a: "Within 1–3 minutes of a post going live. First-mover advantage is real on Reddit.",
              },
              {
                q: "Is this against Reddit's terms?",
                a: "No — we use Reddit's official API. We help you find conversations to join naturally, not to spam or scrape data.",
              },
              {
                q: 'Can I try it before paying?',
                a: "Yes. Free plan includes 3 keywords forever. No credit card required.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <summary className="flex items-center justify-between py-4 cursor-pointer text-white/80 font-medium text-body select-none [&::-webkit-details-marker]:hidden list-none min-h-[44px] hover:text-white/95 transition-colors">
                  <span>{q}</span>
                  <svg
                    className="h-5 w-5 text-white/30 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="pb-5 text-body text-white/50 leading-relaxed">{a}</p>
              </details>
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
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[0.9375rem] font-semibold text-white/90">RadarScout</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/pricing" className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
            <Link href="/f5bot-alternative" className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">F5Bot alternative</Link>
            <Link href="/auth/login" className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Register</Link>
          </nav>
          <p className="text-label text-white/25">© {new Date().getFullYear()} RadarScout</p>
        </div>
      </footer>

    </div>
  )
}
