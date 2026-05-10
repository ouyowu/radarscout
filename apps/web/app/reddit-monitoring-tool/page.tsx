import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://leadpulse.ai'
  return {
    title: 'Best Reddit Monitoring Tool for Business in 2025 | LeadPulse',
    description:
      'Compare the best Reddit monitoring tools. LeadPulse beats F5Bot, manual searching, and IFTTT with real-time alerts, AI intent scoring, and reply drafts — all in one place.',
    alternates: { canonical: `${base}/reddit-monitoring-tool` },
    openGraph: {
      title: 'Best Reddit Monitoring Tool for Business in 2025 | LeadPulse',
      description:
        'Real-time Reddit monitoring with AI intent scoring. See how LeadPulse compares to F5Bot, IFTTT, and manual searching.',
      type: 'website',
      url: `${base}/reddit-monitoring-tool`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'LeadPulse Reddit Monitoring Tool Comparison' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Best Reddit Monitoring Tool for Business in 2025 | LeadPulse',
      description: 'Real-time Reddit monitoring + AI intent scoring. Compare vs F5Bot and manual searching.',
      images: [`${base}/og.png`],
    },
  }
}

const tools = [
  {
    name: 'Manual search',
    cost: 'Free',
    delay: 'Days/weeks',
    aiScoring: false,
    replyDraft: false,
    coverage: 'Partial',
    verdict: 'Works for one-off research. Completely unsustainable as a repeatable process.',
  },
  {
    name: 'IFTTT / Zapier',
    cost: 'Free–$20/mo',
    delay: '15–60 min',
    aiScoring: false,
    replyDraft: false,
    coverage: 'Basic RSS',
    verdict: 'Clunky to set up, limited to RSS feeds, no AI filtering. Falls apart on complex keywords.',
  },
  {
    name: 'F5Bot',
    cost: 'Free',
    delay: '~1 hour',
    aiScoring: false,
    replyDraft: false,
    coverage: 'All of Reddit',
    verdict: 'Great free option. But you get every match with zero context — noise overload at scale.',
  },
  {
    name: 'LeadPulse',
    cost: 'Free–$79/mo',
    delay: '< 60 seconds',
    aiScoring: true,
    replyDraft: true,
    coverage: 'All of Reddit',
    verdict: 'Built for business. Real-time alerts + AI scoring + reply drafts. The only tool that tells you which leads to act on.',
    highlight: true,
  },
]

function Check() {
  return (
    <svg className="h-5 w-5 text-orange-500 mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function Dash() {
  return <span className="block text-center text-gray-300 text-lg leading-none" aria-label="Not available">—</span>
}

export default function RedditMonitoringToolPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold tracking-wide uppercase">
              Reddit Monitoring Tool
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              The Reddit Monitoring Tool That Turns Mentions into Revenue
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Most Reddit monitoring solutions give you raw data and leave you to figure out what to do with it. LeadPulse goes further — AI scores every mention for purchase intent, so you know which conversations are worth your time before you even open them.
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

        {/* Why dedicated tool beats manual */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Why a dedicated Reddit monitoring tool beats doing it manually
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Every week, founders and marketers discover that manually searching Reddit is both time-consuming and wildly unreliable. You check once a day, miss most things, and the conversations you do find have already moved on. Reddit&rsquo;s search is notoriously poor — it returns stale results and misses recent posts.
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  The window to add value on Reddit is narrow. A comment posted within the first hour of a thread going live gets read by everyone who follows. The same comment posted six hours later gets ignored. Monitoring manually means you&rsquo;re almost always in the second category.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  A dedicated Reddit monitoring tool removes the discovery burden entirely. You define what you care about once, and the tool surfaces relevant conversations the moment they appear. The only decision you need to make is whether to respond — not whether you even know the conversation exists.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { problem: 'Manual search misses 90%+ of mentions', solution: 'LeadPulse watches 24/7 — nothing is missed' },
                  { problem: 'Reddit\'s own search returns stale results', solution: 'Real-time crawler catches posts within 60 seconds' },
                  { problem: 'No way to prioritise which threads matter', solution: 'AI intent score 1–10 on every match' },
                  { problem: 'Responding takes time to draft each reply', solution: 'One-click AI reply drafts built in' },
                ].map(({ problem, solution }) => (
                  <div key={problem} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <svg className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-500">{problem}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-gray-900">{solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tool comparison table */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reddit monitoring tools compared</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">How the most common options stack up for business use.</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[640px] px-4 sm:px-0">
                <table className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-4 font-medium text-gray-500">Tool</th>
                      <th className="px-4 py-4 font-medium text-gray-500 text-center">Cost</th>
                      <th className="px-4 py-4 font-medium text-gray-500 text-center">Alert speed</th>
                      <th className="px-4 py-4 font-medium text-gray-500 text-center">AI scoring</th>
                      <th className="px-4 py-4 font-medium text-gray-500 text-center">Reply drafts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tools.map(({ name, cost, delay, aiScoring, replyDraft, highlight }) => (
                      <tr
                        key={name}
                        className={highlight ? 'bg-orange-50 hover:bg-orange-100/50 transition-colors' : 'hover:bg-gray-50 transition-colors'}
                      >
                        <td className={`px-5 py-3.5 font-medium ${highlight ? 'text-orange-700' : 'text-gray-700'}`}>
                          {name}
                          {highlight && (
                            <span className="ml-2 text-xs font-semibold bg-orange-500 text-white px-1.5 py-0.5 rounded">You are here</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-600 text-xs">{cost}</td>
                        <td className={`px-4 py-3.5 text-center text-xs font-medium ${highlight ? 'text-orange-700' : 'text-gray-500'}`}>{delay}</td>
                        <td className="px-4 py-3.5">{aiScoring ? <Check /> : <Dash />}</td>
                        <td className="px-4 py-3.5">{replyDraft ? <Check /> : <Dash />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verdict cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map(({ name, verdict, highlight }) => (
                <div
                  key={name}
                  className={`rounded-xl border p-4 ${highlight ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${highlight ? 'text-orange-600' : 'text-gray-400'}`}>{name}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature overview */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What makes LeadPulse different</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Real-time crawler — alerts in under 60 seconds, not hours',
                'AI intent scoring 1–10 on every keyword match',
                'One-sentence AI summary so you know the context instantly',
                'Filter dashboard by intent tier (high / medium / low)',
                'One-click reply draft tailored to your product description',
                'Enable or disable keywords without deleting them',
                'Covers all of Reddit via r/all — posts and comments',
                'Free plan with 3 keywords, no credit card, no time limit',
              ].map(feature => (
                <div key={feature} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <svg className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-8">
              <Link href="/pricing" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                See which features are on each plan →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-orange-500 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The only Reddit monitoring tool with AI built in</h2>
            <p className="mt-3 text-orange-100 text-sm sm:text-base">Start free. No credit card. Up and running in 2 minutes.</p>
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
                Compare plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
