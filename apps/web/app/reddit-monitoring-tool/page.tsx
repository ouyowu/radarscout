import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Best Reddit Monitoring Tool for Business in 2025 | RadarScout',
    description:
      'Compare the best Reddit monitoring tools. RadarScout beats F5Bot, manual searching, and IFTTT with real-time alerts, AI intent scoring, and reply drafts — all in one place.',
    alternates: { canonical: `${base}/reddit-monitoring-tool` },
    openGraph: {
      title: 'Best Reddit Monitoring Tool for Business in 2025 | RadarScout',
      description:
        'Real-time Reddit monitoring with AI intent scoring. See how RadarScout compares to F5Bot, IFTTT, and manual searching.',
      type: 'website',
      url: `${base}/reddit-monitoring-tool`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'RadarScout Reddit Monitoring Tool Comparison' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Best Reddit Monitoring Tool for Business in 2025 | RadarScout',
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
    name: 'RadarScout',
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
    <svg className="h-5 w-5 text-[#FF4500] mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function Dash() {
  return <span className="block text-center text-gray-300 text-lg leading-none" aria-label="Not available">—</span>
}

export default function RedditMonitoringToolPage() {
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
              Reddit Monitoring Tool
            </span>
            <h1 className="text-h1 sm:text-display font-extrabold text-gray-900 leading-tight tracking-tight">
              The Reddit Monitoring Tool That Turns Mentions into Revenue
            </h1>
            <p className="mt-5 text-body-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Most Reddit monitoring solutions give you raw data and leave you to figure out what to do with it. RadarScout goes further — AI scores every mention for purchase intent, so you know which conversations are worth your time before you even open them.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
              >
                Start monitoring free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-200 text-gray-600 font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-label text-gray-400">3 keywords free forever · No credit card required</p>
          </div>
        </section>

        {/* Why dedicated tool beats manual */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h3 sm:text-h2 font-bold text-gray-900 mb-4">
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
                  { problem: 'Manual search misses 90%+ of mentions', solution: 'RadarScout watches 24/7 — nothing is missed' },
                  { problem: 'Reddit\'s own search returns stale results', solution: 'Real-time crawler catches posts within 60 seconds' },
                  { problem: 'No way to prioritise which threads matter', solution: 'AI intent score 1–10 on every match' },
                  { problem: 'Responding takes time to draft each reply', solution: 'One-click AI reply drafts built in' },
                ].map(({ problem, solution }) => (
                  <div
                    key={problem}
                    className="rounded-xl p-4"
                    style={{ background: 'white', border: '1px solid #e5e7eb' }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <svg className="h-4 w-4 text-red-400/70 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-400">{problem}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-4 w-4 text-[#FF4500] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-gray-800">{solution}</p>
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
              <h2 className="text-h3 sm:text-h2 font-bold text-gray-900">Reddit monitoring tools compared</h2>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">How the most common options stack up for business use.</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[640px] px-4 sm:px-0">
                <table
                  className="w-full rounded-2xl overflow-hidden text-sm"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th className="text-left px-5 py-4 font-medium text-gray-400">Tool</th>
                      <th className="px-4 py-4 font-medium text-gray-400 text-center">Cost</th>
                      <th className="px-4 py-4 font-medium text-gray-400 text-center">Alert speed</th>
                      <th className="px-4 py-4 font-medium text-gray-400 text-center">AI scoring</th>
                      <th className="px-4 py-4 font-medium text-gray-400 text-center">Reply drafts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map(({ name, cost, delay, aiScoring, replyDraft, highlight }, i) => (
                      <tr
                        key={name}
                        style={{
                          background: highlight ? 'rgba(255,69,0,0.06)' : undefined,
                          borderTop: i === 0 ? undefined : '1px solid #f3f4f6',
                        }}
                      >
                        <td className="px-5 py-3.5 font-medium" style={{ color: highlight ? '#FF6B35' : '#374151' }}>
                          {name}
                          {highlight && (
                            <span className="ml-2 text-xs font-semibold bg-[#FF4500] text-white px-1.5 py-0.5 rounded">You are here</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-500 text-xs">{cost}</td>
                        <td
                          className="px-4 py-3.5 text-center text-xs font-medium"
                          style={{ color: highlight ? '#FF6B35' : '#6b7280' }}
                        >
                          {delay}
                        </td>
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
                  className="rounded-xl p-4"
                  style={
                    highlight
                      ? { background: 'rgba(255,69,0,0.06)', border: '1px solid rgba(255,69,0,0.25)' }
                      : { background: '#f9fafb', border: '1px solid #e5e7eb' }
                  }
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wide mb-1"
                    style={{ color: highlight ? '#FF6B35' : '#9ca3af' }}
                  >
                    {name}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">{verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature overview */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-h3 sm:text-h2 font-bold text-gray-900">What makes RadarScout different</h2>
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
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: 'white', border: '1px solid #e5e7eb' }}
                >
                  <svg className="h-5 w-5 text-[#FF4500] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-8">
              <Link href="/pricing" className="text-sm font-semibold text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                See which features are on each plan →
              </Link>
            </p>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-14 sm:py-20" style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-h3 sm:text-h2 font-bold text-white">The only Reddit monitoring tool with AI built in</h2>
            <p className="mt-3 text-white/75 text-sm sm:text-base">Start free. No credit card. Up and running in 2 minutes.</p>
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
            <Link href="/reddit-keyword-monitor" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>Reddit keyword monitor →</Link>
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
