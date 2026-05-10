import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://leadpulse.ai'
  return {
    title: 'Reddit Lead Finder — Automatically Find Buyers on Reddit | LeadPulse',
    description:
      'Find high-intent leads on Reddit automatically. LeadPulse monitors every subreddit for buying signals, scores purchase intent with AI, and helps you respond before competitors do.',
    alternates: { canonical: `${base}/reddit-lead-finder` },
    openGraph: {
      title: 'Reddit Lead Finder — Automatically Find Buyers on Reddit | LeadPulse',
      description:
        'Find high-intent leads on Reddit automatically. AI intent scoring + real-time alerts so you reach buyers first.',
      type: 'website',
      url: `${base}/reddit-lead-finder`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'LeadPulse Reddit Lead Finder' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Lead Finder — Find Buyers on Reddit Automatically | LeadPulse',
      description: 'Find high-intent leads on Reddit automatically. AI scoring + alerts in < 60s.',
      images: [`${base}/og.png`],
    },
  }
}

export default function RedditLeadFinderPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.87)' }}>

      {/* Nav */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.82)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[0.9375rem] font-semibold text-white/90 hover:text-white transition-colors">
            LeadPulse
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-[0.9375rem] font-medium text-white/55 hover:text-white/90 transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{ background: 'rgba(255,69,0,0.12)', color: '#FF6B35' }}
            >
              Reddit Lead Generation
            </span>
            <h1 className="text-h1 sm:text-display font-extrabold text-white/95 leading-tight tracking-tight">
              Find High-Intent Leads on Reddit Automatically
            </h1>
            <p className="mt-5 text-body-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
              Every day, thousands of people ask Reddit what tool to use, which product to buy, or how to solve a problem your business solves. LeadPulse finds those threads in real time and scores them by purchase intent so you can reach the right people before your competitors do.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
              >
                Start finding leads free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-white/15 text-white/70 font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:text-white/90 hover:bg-white/[0.08] transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-label text-white/30">3 keywords free · No credit card required</p>
          </div>
        </section>

        {/* Reddit as lead source */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h3 sm:text-h2 font-bold text-white/90 mb-4">
                  Reddit is the most underrated lead source on the internet
                </h2>
                <p className="text-white/50 leading-relaxed mb-4">
                  Reddit has over 50 million daily active users, and they&rsquo;re uniquely valuable as a lead source because they show up with specific, explicit intent. They&rsquo;re not passively scrolling a feed — they&rsquo;re asking questions, comparing options, and seeking recommendations. The purchase intent is baked into the post.
                </p>
                <p className="text-white/50 leading-relaxed mb-4">
                  A thread in r/entrepreneur asking &ldquo;what project management tool do you use for a 5-person remote team?&rdquo; isn&rsquo;t just a question — it&rsquo;s a warm lead. The person is actively in the market. A thoughtful, genuinely helpful reply — one that mentions your product naturally — converts at a rate that paid ads can rarely match.
                </p>
                <p className="text-white/50 leading-relaxed">
                  The challenge is finding these threads before they get buried. Reddit moves fast. Manual searching is inconsistent and misses most opportunities. LeadPulse automates the entire discovery layer so you can focus on the conversation.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-label font-bold text-white/30 uppercase tracking-widest mb-4">High-intent Reddit signals</p>
                {[
                  '"Looking for a tool that does X"',
                  '"Anyone know a good alternative to [competitor]?"',
                  '"What\'s the best [product category] for a small team?"',
                  '"Frustrated with [competitor], thinking of switching"',
                  '"Just started [relevant job role], what do you use for X?"',
                  '"Our company needs to solve X — what do you recommend?"',
                ].map(signal => (
                  <div
                    key={signal}
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <svg className="h-4 w-4 text-[#FF4500] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-white/65 italic">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The lead-finding workflow */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h3 sm:text-h2 font-bold text-white/90">The LeadPulse lead-gen workflow</h2>
              <p className="mt-2 text-white/45 text-sm sm:text-base max-w-xl mx-auto">
                From keyword to closed deal — a repeatable process that works while you sleep.
              </p>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Define your high-intent keyword list',
                  body: 'Add the phrases your best prospects use when they\'re ready to buy: competitor alternatives, pain-point searches, product category questions. LeadPulse watches all of them simultaneously.',
                },
                {
                  step: '2',
                  title: 'AI scores every match for you',
                  body: 'When a keyword match appears, our AI scores it 1–10 for purchase intent and writes a one-sentence summary. You see a ranked feed of leads — highest intent at the top, guaranteed.',
                },
                {
                  step: '3',
                  title: 'Draft a reply in seconds',
                  body: 'Describe your product once. For any high-intent lead, click "Draft reply" and LeadPulse writes a Reddit-native response that leads with genuine value. Edit, copy, and post — the whole process takes under 60 seconds.',
                },
                {
                  step: '4',
                  title: 'Track which keywords convert',
                  body: 'Over time, you\'ll see which keywords bring the highest-intent leads. Double down on what works. Disable or refine what doesn\'t. Your lead-gen machine gets smarter every week.',
                },
              ].map(({ step, title, body }) => (
                <div
                  key={step}
                  className="flex gap-5 rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FF4500] text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white/85 mb-1">{title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI framing */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-h3 sm:text-h2 font-bold text-white/90">The math works in your favour</h2>
              <p className="mt-2 text-white/45 text-sm sm:text-base max-w-xl mx-auto">
                One customer from Reddit pays for years of LeadPulse. The question is how many you&rsquo;re missing today.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { figure: '50M+', label: 'Daily active Reddit users actively discussing their problems' },
                { figure: '< 60s', label: 'Alert delay from Reddit post to your dashboard' },
                { figure: '$29/mo', label: 'Pro plan — less than most single B2B customer LTVs' },
              ].map(({ figure, label }) => (
                <div
                  key={figure}
                  className="rounded-xl p-6 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-3xl font-bold text-[#FF4500] mb-2">{figure}</p>
                  <p className="text-sm text-white/50 leading-snug">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center">
              <Link href="/pricing" className="text-sm font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                See all pricing options →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-14 sm:py-20" style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-h3 sm:text-h2 font-bold text-white">Start finding Reddit leads today</h2>
            <p className="mt-3 text-white/75 text-sm sm:text-base">Free plan forever. 3 keywords. No credit card. Up and running in 2 minutes.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-white text-[#FF4500] font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF4500]"
              >
                Create free account →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-white/30 text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:bg-white/10 transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-label text-white/30">© 2025 LeadPulse. All rights reserved.</p>
          <nav className="flex items-center gap-6" aria-label="Footer">
            <Link href="/pricing" className="text-label text-white/35 hover:text-white/70 transition-colors">Pricing</Link>
            <Link href="/auth/login" className="text-label text-white/35 hover:text-white/70 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="text-label text-white/35 hover:text-white/70 transition-colors">Get started</Link>
          </nav>
        </div>
      </footer>

    </div>
  )
}
