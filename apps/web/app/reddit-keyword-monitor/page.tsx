import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://leadpulse.ai'
  return {
    title: 'Reddit Keyword Monitor for Business — Real-Time Alerts | LeadPulse',
    description:
      'Monitor Reddit for any keyword in real time. LeadPulse watches r/all 24/7, scores every mention with AI, and sends you only the conversations worth joining.',
    alternates: { canonical: `${base}/reddit-keyword-monitor` },
    openGraph: {
      title: 'Reddit Keyword Monitor for Business — Real-Time Alerts | LeadPulse',
      description:
        'Monitor Reddit for any keyword in real time. Alerts in under 60 seconds, AI intent scoring, and draft replies — all in one tool.',
      type: 'website',
      url: `${base}/reddit-keyword-monitor`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'LeadPulse Reddit Keyword Monitor' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Keyword Monitor for Business | LeadPulse',
      description: 'Monitor Reddit for any keyword in real time. AI scoring + alerts in < 60s.',
      images: [`${base}/og.png`],
    },
  }
}

const features = [
  {
    title: 'Track any keyword across all of Reddit',
    body: 'Add brand names, product categories, competitor names, pain-point phrases, or anything else. LeadPulse monitors r/all continuously — every new post and comment across every public subreddit.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Alerts in under 60 seconds',
    body: 'The moment a match is found, it appears in your dashboard and an email digest goes out. Reddit conversations move fast — being the first helpful reply gets you seen by thousands of readers.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    title: 'AI intent scoring 1–10',
    body: 'Not all mentions are equal. Our AI scores each match for purchase intent and generates a one-sentence summary. High-intent posts are highlighted so you can prioritize without reading every thread.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Enable / disable keywords instantly',
    body: 'Toggle individual keywords on or off without deleting them. Running a seasonal campaign? Pause those keywords when it ends and re-enable them next year in one click.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: 'Filter matches by intent tier',
    body: 'Your dashboard lets you filter matches by "High intent (7+)", "Medium (4–6)", or "Low (1–3)". When you open the dashboard, Pro users land on the high-intent view by default — no sifting needed.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
  },
  {
    title: 'One-click reply drafts',
    body: 'Describe your product once. Whenever you see a high-intent lead, click "Draft reply" and LeadPulse generates a Reddit-native response that leads with value and naturally introduces your product — ready to copy and post.',
    icon: (
      <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
]

export default function RedditKeywordMonitorPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold tracking-wide uppercase">
              Reddit Keyword Monitor
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Reddit Keyword Monitor Built for Business Growth
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              LeadPulse watches every subreddit in real time and uses AI to score each mention for purchase intent. Stop sifting through noise — see only the conversations that matter to your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Start monitoring free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">3 keywords free forever · No credit card required</p>
          </div>
        </section>

        {/* Features grid */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything you need to monitor Reddit</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                One tool for keyword tracking, intent scoring, and lead engagement — nothing else to install.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ title, body, icon }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-50 mb-4">
                    {icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Up and running in 2 minutes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {[
                {
                  step: '01',
                  title: 'Add your keywords',
                  body: 'Enter the words and phrases you want to track — your brand name, product category, competitor names, or any pain-point phrase your target customers use when asking for help on Reddit.',
                },
                {
                  step: '02',
                  title: 'We watch Reddit 24/7',
                  body: 'Our crawler scans r/all continuously — every new post and comment across all public subreddits. Each match is scored by AI for purchase intent before it reaches your dashboard.',
                },
                {
                  step: '03',
                  title: 'Reply at the right moment',
                  body: 'You get an alert within 60 seconds. Open the match, read the AI summary, and decide whether to reply. On Pro, click "Draft reply" and LeadPulse writes the first version for you.',
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-orange-50 mb-4 flex-shrink-0">
                    <span className="text-sm font-bold text-orange-500">{step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who is it for */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who uses a Reddit keyword monitor?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: 'SaaS Founders', use: 'Track competitor names and pain-point keywords. Reach prospects the moment they start evaluating alternatives.' },
                { role: 'Growth Marketers', use: 'Find communities where your target audience hangs out. Monitor campaign keywords and measure organic buzz.' },
                { role: 'Agencies', use: 'Manage Reddit monitoring for multiple clients from a single dashboard. Deliver lead gen as a service.' },
                { role: 'Brand Managers', use: 'Know within seconds when someone mentions your brand — positive or negative — and respond before it escalates.' },
              ].map(({ role, use }) => (
                <div key={role} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{use}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-orange-500 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Start your Reddit keyword monitor today</h2>
            <p className="mt-3 text-orange-100 text-sm sm:text-base">3 keywords free, forever. No credit card. Cancel anytime.</p>
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
