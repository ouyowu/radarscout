import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'

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
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold tracking-wide uppercase">
              Reddit Lead Generation
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Find High-Intent Leads on Reddit Automatically
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Every day, thousands of people ask Reddit what tool to use, which product to buy, or how to solve a problem your business solves. LeadPulse finds those threads in real time and scores them by purchase intent so you can reach the right people before your competitors do.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Start finding leads free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">3 keywords free · No credit card required</p>
          </div>
        </section>

        {/* Reddit as lead source */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Reddit is the most underrated lead source on the internet
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Reddit has over 50 million daily active users, and they&rsquo;re uniquely valuable as a lead source because they show up with specific, explicit intent. They&rsquo;re not passively scrolling a feed — they&rsquo;re asking questions, comparing options, and seeking recommendations. The purchase intent is baked into the post.
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  A thread in r/entrepreneur asking "what project management tool do you use for a 5-person remote team?" isn&rsquo;t just a question — it&rsquo;s a warm lead. The person is actively in the market. A thoughtful, genuinely helpful reply — one that mentions your product naturally — converts at a rate that paid ads can rarely match.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  The challenge is finding these threads before they get buried. Reddit moves fast. Manual searching is inconsistent and misses most opportunities. LeadPulse automates the entire discovery layer so you can focus on the conversation.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">High-intent Reddit signals</p>
                {[
                  '"Looking for a tool that does X"',
                  '"Anyone know a good alternative to [competitor]?"',
                  '"What\'s the best [product category] for a small team?"',
                  '"Frustrated with [competitor], thinking of switching"',
                  '"Just started [relevant job role], what do you use for X?"',
                  '"Our company needs to solve X — what do you recommend?"',
                ].map(signal => (
                  <div key={signal} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
                    <svg className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700 italic">{signal}</span>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The LeadPulse lead-gen workflow</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
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
                <div key={step} className="flex gap-5 bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI framing */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The math works in your favour</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                One customer from Reddit pays for years of LeadPulse. The question is how many you&rsquo;re missing today.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { figure: '50M+', label: 'Daily active Reddit users actively discussing their problems' },
                { figure: '< 60s', label: 'Alert delay from Reddit post to your dashboard' },
                { figure: '$29/mo', label: 'Pro plan — less than most single B2B customer LTVs' },
              ].map(({ figure, label }) => (
                <div key={figure} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-3xl font-bold text-orange-500 mb-2">{figure}</p>
                  <p className="text-sm text-gray-500 leading-snug">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center">
              <Link href="/pricing" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                See all pricing options →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-orange-500 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Start finding Reddit leads today</h2>
            <p className="mt-3 text-orange-100 text-sm sm:text-base">Free plan forever. 3 keywords. No credit card. Up and running in 2 minutes.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-white text-orange-600 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
              >
                Create free account →
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
      </main>

      <SiteFooter />
    </div>
  )
}
