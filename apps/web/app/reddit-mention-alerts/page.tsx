import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Real-Time Reddit Mention Alerts for Your Brand | RadarScout',
    description:
      'Get instant Reddit mention alerts when anyone discusses your brand, product, or competitors. Respond fast, protect your reputation, and find your advocates automatically.',
    alternates: { canonical: `${base}/reddit-mention-alerts` },
    openGraph: {
      title: 'Real-Time Reddit Mention Alerts for Your Brand | RadarScout',
      description:
        'Get instant Reddit mention alerts when anyone discusses your brand, product, or competitors. Alerts in under 60 seconds.',
      type: 'website',
      url: `${base}/reddit-mention-alerts`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'RadarScout Reddit Mention Alerts' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Real-Time Reddit Mention Alerts for Your Brand | RadarScout',
      description: 'Get instant Reddit mention alerts for your brand. Respond in under 60 seconds.',
      images: [`${base}/og.png`],
    },
  }
}

export default function RedditMentionAlertsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'white', color: '#111827' }}>

      {/* Nav */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[0.9375rem] font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            RadarScout
          </Link>
          <div className="flex items-center gap-4">
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
      </header>

      <main>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{ background: 'rgba(255,69,0,0.12)', color: '#FF6B35' }}
            >
              Reddit Mention Alerts
            </span>
            <h1 className="text-h1 sm:text-display font-extrabold text-gray-900 leading-tight tracking-tight">
              Real-Time Reddit Mention Alerts for Your Brand
            </h1>
            <p className="mt-5 text-body-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Reddit is where real opinions form. RadarScout monitors every subreddit 24/7 and alerts you within 60 seconds when someone mentions your brand — so you can respond before the thread goes cold or negative sentiment spreads.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
              >
                Start free monitoring →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-200 text-gray-600 font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                See plans
              </Link>
            </div>
            <p className="mt-4 text-label text-gray-400">3 keywords free forever · No credit card required</p>
          </div>
        </section>

        {/* Why brand monitoring matters */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h3 sm:text-h2 font-bold text-gray-900 mb-4">
                  Why Reddit brand monitoring matters in 2025
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Reddit has more than 50 million daily active users, and they&rsquo;re brutally honest. Unlike Twitter or LinkedIn, Reddit rewards authenticity — which means product recommendations there carry outsized weight. A single well-received comment in the right subreddit can drive hundreds of signups overnight.
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  But Reddit also moves fast. A negative thread about your brand can reach the front page of r/all before your marketing team even wakes up. Without real-time mention alerts, you find out about brand crises days later — after the damage is done and the conversation has already shaped public perception.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  The brands that win on Reddit are the ones that show up in conversations quickly, authentically, and with something genuinely useful to say. RadarScout gives you the speed and context to do exactly that.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { stat: '< 60s', label: 'Time from Reddit post to your alert' },
                  { stat: '24/7', label: 'Monitoring across all public subreddits' },
                  { stat: '1–10', label: 'AI intent score on every mention' },
                ].map(({ stat, label }) => (
                  <div
                    key={stat}
                    className="rounded-xl p-5 flex items-center gap-5"
                    style={{ background: 'white', border: '1px solid #e5e7eb' }}
                  >
                    <p className="text-3xl font-bold text-[#FF4500] flex-shrink-0 w-20">{stat}</p>
                    <p className="text-sm text-gray-500 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h3 sm:text-h2 font-bold text-gray-900">Three ways teams use Reddit mention alerts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Protect your reputation',
                  body: 'When a user has a bad experience and vents on Reddit, speed matters. A prompt, honest response from the brand — especially one that offers to help — regularly turns a complaint thread into a positive story. Letting it sit for 12 hours does the opposite. RadarScout gets you there in under a minute.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: 'Find your advocates',
                  body: 'Some of your best customers are already recommending you on Reddit without any prompting. They answer questions in niche subreddits, mention your product in comparison threads, and defend you in debates. Mention alerts let you find these people, thank them, and build real relationships — or even turn them into affiliates.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Track competitors in real time',
                  body: 'Add your top competitors as keywords alongside your own brand. When someone asks "is [competitor] worth it?" or "looking for an alternative to [competitor]", that\'s a warm lead — they\'re already in the market. Be the first to reply with a helpful comparison and earn the click.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
              ].map(({ title, body, icon }) => (
                <div
                  key={title}
                  className="rounded-2xl p-6"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-xl mb-4"
                    style={{ background: 'rgba(255,69,0,0.12)' }}
                  >
                    {icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What keywords to monitor */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-h3 sm:text-h2 font-bold text-gray-900">What keywords to monitor for brand protection</h2>
              <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Most teams start with these and add more as they discover their own patterns.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { category: 'Your brand', examples: 'Exact brand name, common misspellings, product names, app name' },
                { category: 'Competitor names', examples: 'Competitor brand names, their product names, "alternative to [competitor]"' },
                { category: 'Problem keywords', examples: '"looking for a tool that", "does anyone know a good", "frustrated with"' },
                { category: 'Category terms', examples: 'Your product category, industry jargon your ideal customers use' },
              ].map(({ category, examples }) => (
                <div
                  key={category}
                  className="rounded-xl p-5"
                  style={{ background: 'white', border: '1px solid #e5e7eb' }}
                >
                  <p className="text-sm font-semibold text-gray-800 mb-1">{category}</p>
                  <p className="text-sm text-gray-500">{examples}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8">
              <Link href="/pricing" className="text-sm font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                See how many keywords each plan includes →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-14 sm:py-20" style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-h3 sm:text-h2 font-bold text-white">Never miss a brand mention on Reddit again</h2>
            <p className="mt-3 text-white/75 text-sm sm:text-base">Free plan forever. Set up in under 2 minutes. No credit card required.</p>
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
                Compare plans
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Related pages */}
      <section style={{ borderTop: '1px solid #e5e7eb' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-label font-semibold text-gray-400 uppercase tracking-wide mb-4">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/f5bot-alternative" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>F5Bot alternative →</Link>
            <Link href="/gummysearch-alternative" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>GummySearch alternative →</Link>
            <Link href="/social-listening-reddit" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Reddit social listening →</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Pricing plans →</Link>
            <Link href="/reddit-lead-finder" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Reddit lead finder →</Link>
            <Link href="/auth/register" className="text-sm font-medium text-[#FF6B35] hover:text-[#FF4500] transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,69,0,0.25)' }}>Get started free →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-label text-gray-400">© 2025 RadarScout. All rights reserved.</p>
          <nav className="flex items-center gap-6" aria-label="Footer">
            <Link href="/pricing" className="text-label text-gray-500 hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/auth/login" className="text-label text-gray-500 hover:text-gray-700 transition-colors">Sign in</Link>
            <Link href="/auth/register" className="text-label text-gray-500 hover:text-gray-700 transition-colors">Get started</Link>
          </nav>
        </div>
      </footer>

    </div>
  )
}
