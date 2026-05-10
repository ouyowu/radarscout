import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://leadpulse.ai'
  return {
    title: 'Best F5Bot Alternative with AI Lead Filtering | LeadPulse',
    description:
      'F5Bot floods you with noise. LeadPulse uses AI to score every Reddit mention for purchase intent — so you only see the leads worth your time. Free plan available.',
    alternates: { canonical: `${base}/f5bot-alternative` },
    openGraph: {
      title: 'Best F5Bot Alternative with AI Lead Filtering | LeadPulse',
      description:
        'F5Bot floods you with noise. LeadPulse uses AI to score every Reddit mention for purchase intent — so you only see the leads worth your time.',
      type: 'website',
      url: `${base}/f5bot-alternative`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'LeadPulse — F5Bot alternative with AI filtering' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Best F5Bot Alternative with AI Lead Filtering | LeadPulse',
      description: 'F5Bot floods you with noise. LeadPulse uses AI intent scoring so you only see leads worth your time.',
      images: [`${base}/og.png`],
    },
  }
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-orange-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-5 w-5 text-gray-300 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

const rows = [
  { feature: 'Price', f5bot: 'Free only', us: 'Free + paid tiers' },
  { feature: 'Alert delay', f5bot: '~1 hour', us: '< 60 seconds' },
  { feature: 'AI intent scoring', f5bot: false, us: true },
  { feature: 'AI reply drafts', f5bot: false, us: true },
  { feature: 'Filter by intent score', f5bot: false, us: true },
  { feature: 'Slack / webhook', f5bot: false, us: true },
  { feature: 'API access', f5bot: false, us: true },
  { feature: 'Team accounts', f5bot: false, us: true },
]

export default function F5BotAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold tracking-wide uppercase">
              F5Bot Alternative
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              The Best F5Bot Alternative with AI Lead Filtering
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              F5Bot is a solid free tool — but it sends every match without any filtering. LeadPulse adds AI intent scoring so you only see Reddit mentions from people who are actually ready to buy.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Start for free →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                Compare plans
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">Free plan forever · No credit card required</p>
          </div>
        </section>

        {/* The noise problem */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  The problem with F5Bot: too much noise
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  F5Bot was built in 2014 as a free personal project. It does exactly what it promises — it watches Reddit and emails you every time your keyword appears. The problem is <em>every</em> time. No filtering, no scoring, no way to tell a curious lurker from someone ready to hand over their credit card.
                </p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  If you track a broad keyword like "project management software" or "best CRM", you can easily receive hundreds of alerts a week. Most of them are people complaining, debating, or just mentioning the topic in passing. Wading through all of that to find one real lead is exhausting — and most teams simply stop checking.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  There&rsquo;s also the alert delay. F5Bot typically sends digests on an hourly or multi-hour schedule. On Reddit, conversations move fast. By the time you see the alert, the thread is already buried and the window to reply helpfully has closed.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Why teams leave F5Bot</p>
                {[
                  'Receives 200+ alerts/week but only 3 are real leads',
                  'No way to filter by purchase intent or urgency',
                  'Hourly digest means missing fast-moving conversations',
                  'No Slack integration — alerts land in a buried inbox',
                  'No team features or shared keyword dashboards',
                  'Alerts for competitors, spam, and off-topic threads',
                ].map(text => (
                  <div key={text} className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How LeadPulse fixes it */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How LeadPulse is different</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                Built for founders and marketers who need signal, not noise. Every match is scored and summarized by AI before it reaches you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI intent scoring',
                  body: 'Every Reddit mention is scored 1–10 for purchase intent using Claude AI. A post asking "what\'s the best CRM for a 10-person startup?" scores a 9. A post saying "CRM is a weird acronym" scores a 1. You see both — but you know which to respond to first.',
                  icon: (
                    <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
                {
                  title: 'Real-time alerts (< 60s)',
                  body: 'Our crawler watches r/all continuously. You get an alert within 60 seconds of a match — not an hour later. On Reddit, speed matters. The first thoughtful reply in a thread gets seen by thousands; the reply posted three hours later gets none.',
                  icon: (
                    <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  title: 'AI reply drafts',
                  body: 'When you spot a high-intent lead, LeadPulse can draft a Reddit reply on your behalf — one that leads with genuine value and naturally mentions your product. Copy it, tweak it, and post. The whole process takes under a minute.',
                  icon: (
                    <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                },
              ].map(({ title, body, icon }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6">
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

        {/* Comparison table */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">F5Bot vs LeadPulse — side by side</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[480px] px-4 sm:px-0">
                <table className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 sm:px-6 py-4 font-medium text-gray-500 w-2/5">Feature</th>
                      <th className="px-5 sm:px-6 py-4 font-medium text-gray-500 text-center">F5Bot</th>
                      <th className="px-5 sm:px-6 py-4 font-semibold text-orange-600 text-center">LeadPulse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(({ feature, f5bot, us }) => (
                      <tr key={feature} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 sm:px-6 py-3.5 text-gray-700 font-medium">{feature}</td>
                        <td className="px-5 sm:px-6 py-3.5 text-center">
                          {typeof f5bot === 'boolean' ? (
                            f5bot ? <CheckIcon /> : <div className="flex justify-center"><XIcon /></div>
                          ) : (
                            <span className="text-gray-500">{f5bot}</span>
                          )}
                        </td>
                        <td className="px-5 sm:px-6 py-3.5 text-center">
                          {typeof us === 'boolean' ? (
                            us ? <div className="flex justify-center"><CheckIcon /></div> : <div className="flex justify-center"><XIcon /></div>
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

        {/* FAQ */}
        <section className="py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Common questions</h2>
            <div className="border-t border-gray-100">
              {[
                {
                  q: 'Can I import my existing F5Bot keywords?',
                  a: 'You can add all your keywords manually in a few minutes — just type them into the LeadPulse dashboard one by one. There\'s no bulk import tool yet, but most users have fewer than 20 keywords and set them up in under two minutes.',
                },
                {
                  q: 'Is there a free tier like F5Bot?',
                  a: 'Yes. LeadPulse has a free plan that lets you monitor 3 keywords forever with no credit card required. The free plan includes real-time alerts. AI intent scoring and reply drafts are Pro features.',
                },
                {
                  q: 'Does LeadPulse monitor Hacker News too?',
                  a: 'Reddit only for now — we cover r/all (all subreddits). Hacker News support is on the roadmap. For most use cases, Reddit has significantly more relevant conversations than HN.',
                },
                {
                  q: 'How does the AI scoring actually work?',
                  a: 'When a keyword match is found, we send the post title and excerpt to Claude AI with a prompt asking it to score purchase intent 1–10 and write a one-sentence summary. The score and summary appear in your dashboard so you can instantly see which matches are worth your attention.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group border-b border-gray-100">
                  <summary className="flex items-center justify-between py-4 cursor-pointer text-gray-900 font-medium text-sm sm:text-base select-none [&::-webkit-details-marker]:hidden list-none min-h-[44px]">
                    <span>{q}</span>
                    <svg className="h-5 w-5 text-gray-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-orange-500 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Try the smarter F5Bot alternative</h2>
            <p className="mt-3 text-orange-100 text-sm sm:text-base">Free plan forever. No credit card. Up and running in 2 minutes.</p>
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
