import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'The F5Bot Alternative That Actually Finds You Customers | RadarScout',
    description:
      'F5Bot tells you when you\'re mentioned. RadarScout tells you when someone wants to buy. AI intent scoring, real-time alerts, and reply drafts — free to start.',
    alternates: { canonical: `${base}/f5bot-alternative` },
    openGraph: {
      title: 'The F5Bot Alternative That Actually Finds You Customers',
      description:
        'F5Bot tells you when you\'re mentioned. RadarScout tells you when someone wants to buy. AI intent scoring + reply drafts.',
      type: 'website',
      url: `${base}/f5bot-alternative`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'RadarScout — F5Bot alternative with AI filtering' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'The F5Bot Alternative That Actually Finds You Customers | RadarScout',
      description: 'F5Bot tells you when you\'re mentioned. RadarScout tells you when someone wants to buy.',
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
    <svg className="h-5 w-5 flex-shrink-0 text-white/20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

const rows = [
  { feature: 'Price',               f5bot: 'Free only',  us: 'Free + paid tiers' },
  { feature: 'Alert delay',         f5bot: '~1 hour',    us: '< 60 seconds'      },
  { feature: 'AI intent scoring',   f5bot: false,        us: true                },
  { feature: 'AI reply drafts',     f5bot: false,        us: true                },
  { feature: 'Filter by intent',    f5bot: false,        us: true                },
  { feature: 'Slack / webhook',     f5bot: false,        us: true                },
  { feature: 'API access',          f5bot: false,        us: true                },
  { feature: 'Team accounts',       f5bot: false,        us: true                },
]

/* Shared style tokens */
const card   = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' } as const
const cardHi = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' } as const

export default function F5BotAlternativePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.87)' }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.82)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <nav className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="text-[0.9375rem] font-semibold text-white/90 hover:text-white transition-colors">
              RadarScout
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-[0.9375rem] font-medium text-white/55 hover:text-white/90 transition-colors">
                Pricing
              </Link>
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
        </nav>
      </header>

      <main>

        {/* ── HERO ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-label font-semibold uppercase"
              style={{ background: 'rgba(255,69,0,0.12)', color: '#FF6B35' }}
            >
              F5Bot Alternative
            </span>
            <h1 className="text-h1 sm:text-display font-extrabold text-white/95">
              The F5Bot alternative that actually finds you <span className="text-[#FF4500]">customers</span>
            </h1>
            <p className="mt-5 text-body-lg text-white/55 max-w-2xl mx-auto">
              F5Bot is a solid free tool — but it sends every match without any filtering. RadarScout adds AI intent scoring so you only see Reddit mentions from people who are actually ready to buy.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
              >
                Switch from F5Bot in 2 minutes →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center font-semibold text-[0.9375rem] text-white/70 hover:text-white/90 px-6 py-3 rounded-xl transition-colors min-h-[44px]"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Compare plans
              </Link>
            </div>
            <p className="mt-4 text-label text-white/35">Free plan forever · No credit card required</p>
          </div>
        </section>

        {/* ── KEY MESSAGE STRIP ── */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 0 }}>
              <div className="flex items-center gap-4 py-6 sm:pr-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                  className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <svg className="h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-label font-semibold text-white/30 uppercase mb-0.5">F5Bot</p>
                  <p className="text-sm font-medium text-white/60">Tells you when you&rsquo;re mentioned</p>
                </div>
              </div>
              <div
                className="flex items-center gap-4 py-6 sm:pl-8"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl"
                  style={{ background: 'rgba(255,69,0,0.12)' }}
                >
                  <svg className="h-5 w-5 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-label font-semibold text-[#FF6B35] uppercase mb-0.5">RadarScout</p>
                  <p className="text-sm font-medium text-white/85">Tells you when someone wants to buy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NOISE PROBLEM ── */}
        <section className="py-14 sm:py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-h2 font-bold text-white/90 mb-4">
                  The problem with F5Bot: too much noise
                </h2>
                <p className="text-body-lg text-white/50 mb-4">
                  F5Bot was built in 2014 as a free personal project. It does exactly what it promises — it watches Reddit and emails you every time your keyword appears. The problem is <em className="text-white/65 not-italic">every</em> time. No filtering, no scoring, no way to tell a curious lurker from someone ready to hand over their credit card.
                </p>
                <p className="text-body-lg text-white/50 mb-4">
                  If you track a broad keyword like &ldquo;project management software&rdquo; or &ldquo;best CRM&rdquo;, you can easily receive hundreds of alerts a week. Most of them are people complaining, debating, or just mentioning the topic in passing. Wading through all of that to find one real lead is exhausting — and most teams simply stop checking.
                </p>
                <p className="text-body-lg text-white/50">
                  There&rsquo;s also the alert delay. F5Bot typically sends digests on an hourly or multi-hour schedule. On Reddit, conversations move fast. By the time you see the alert, the thread is already buried and the window to reply helpfully has closed.
                </p>
              </div>
              <div style={{ ...cardHi, borderRadius: '16px' }} className="p-6 space-y-4">
                <p className="text-label font-bold text-white/35 uppercase">Why teams leave F5Bot</p>
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
                    <span className="text-sm text-white/60">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW LEADPULSE FIXES IT ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-white/90">How RadarScout is different</h2>
              <p className="mt-2 text-body text-white/45 max-w-2xl mx-auto">
                Built for founders and marketers who need signal, not noise. Every match is scored and summarized by AI before it reaches you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI intent scoring',
                  body: 'Every Reddit mention is scored 1–10 for purchase intent using Claude AI. A post asking "what\'s the best CRM for a 10-person startup?" scores a 9. A post saying "CRM is a weird acronym" scores a 1. You see both — but you know which to respond to first.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
                {
                  title: 'Real-time alerts (< 60s)',
                  body: 'Our crawler watches r/all continuously. You get an alert within 60 seconds of a match — not an hour later. On Reddit, speed matters. The first thoughtful reply in a thread gets seen by thousands; the reply posted three hours later gets none.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  title: 'AI reply drafts',
                  body: 'When you spot a high-intent lead, RadarScout can draft a Reddit reply on your behalf — one that leads with genuine value and naturally mentions your product. Copy it, tweak it, and post. The whole process takes under a minute.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                },
              ].map(({ title, body, icon }) => (
                <div key={title} style={{ ...card, borderRadius: '16px' }} className="p-6">
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

        {/* ── COMPARISON TABLE ── */}
        <section className="py-14 sm:py-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-bold text-white/90">F5Bot vs RadarScout — side by side</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[480px] px-4 sm:px-0">
                <div style={{ ...card, borderRadius: '16px', overflow: 'hidden' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <th className="text-left px-5 sm:px-6 py-4 font-medium text-white/40 w-2/5">Feature</th>
                        <th className="px-5 sm:px-6 py-4 font-medium text-white/40 text-center">F5Bot</th>
                        <th className="px-5 sm:px-6 py-4 font-semibold text-[#FF6B35] text-center">RadarScout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(({ feature, f5bot, us }) => (
                        <tr key={feature} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td className="px-5 sm:px-6 py-3.5 font-medium text-white/70">{feature}</td>
                          <td className="px-5 sm:px-6 py-3.5 text-center">
                            {typeof f5bot === 'boolean' ? (
                              f5bot
                                ? <div className="flex justify-center"><CheckIcon /></div>
                                : <div className="flex justify-center"><XIcon /></div>
                            ) : (
                              <span className="text-white/40">{f5bot}</span>
                            )}
                          </td>
                          <td className="px-5 sm:px-6 py-3.5 text-center">
                            {typeof us === 'boolean' ? (
                              us
                                ? <div className="flex justify-center"><CheckIcon /></div>
                                : <div className="flex justify-center"><XIcon /></div>
                            ) : (
                              <span className="font-medium text-white/85">{us}</span>
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

        {/* ── FAQ ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-white/90 mb-8 text-center">Common questions</h2>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                {
                  q: 'Can I import my existing F5Bot keywords?',
                  a: "You can add all your keywords manually in a few minutes — just type them into the RadarScout dashboard one by one. There's no bulk import tool yet, but most users have fewer than 20 keywords and set them up in under two minutes.",
                },
                {
                  q: 'Is there a free tier like F5Bot?',
                  a: 'Yes. RadarScout has a free plan that lets you monitor 3 keywords forever with no credit card required. The free plan includes real-time alerts. AI intent scoring and reply drafts are Pro features.',
                },
                {
                  q: 'Does RadarScout monitor Hacker News too?',
                  a: 'Reddit only for now — we cover r/all (all subreddits). Hacker News support is on the roadmap. For most use cases, Reddit has significantly more relevant conversations than HN.',
                },
                {
                  q: 'How does the AI scoring actually work?',
                  a: 'When a keyword match is found, we send the post title and excerpt to Claude AI with a prompt asking it to score purchase intent 1–10 and write a one-sentence summary. The score and summary appear in your dashboard so you can instantly see which matches are worth your attention.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <summary className="flex items-center justify-between py-4 cursor-pointer text-white/80 font-medium text-body select-none [&::-webkit-details-marker]:hidden list-none min-h-[44px] hover:text-white/95 transition-colors">
                    <span>{q}</span>
                    <svg
                      className="h-5 w-5 text-white/30 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 ml-4"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
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

        {/* ── CTA BANNER ── */}
        <section style={{ background: 'linear-gradient(135deg, #c93500 0%, #FF4500 50%, #ff6b35 100%)' }} className="py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-h2 font-bold text-white">Switch from F5Bot in 2 minutes</h2>
            <p className="mt-3 text-body text-white/75">Free plan forever. No credit card. Your keywords are live in under 2 minutes.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-white text-[#c93500] font-semibold text-[0.9375rem] px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF4500]"
              >
                Switch from F5Bot free →
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
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-label font-semibold text-white/30 uppercase tracking-wide mb-4">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pricing" className="text-sm font-medium text-white/55 hover:text-white/90 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>Pricing plans →</Link>
            <Link href="/reddit-keyword-monitor" className="text-sm font-medium text-white/55 hover:text-white/90 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>Reddit keyword monitor →</Link>
            <Link href="/reddit-mention-alerts" className="text-sm font-medium text-white/55 hover:text-white/90 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>Reddit mention alerts →</Link>
            <Link href="/auth/register" className="text-sm font-medium text-[#FF6B35] hover:text-[#FF4500] transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(255,69,0,0.25)' }}>Get started free →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[0.9375rem] font-semibold text-white/90">RadarScout</span>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            <Link href="/pricing"          className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Pricing</Link>
            <Link href="/f5bot-alternative" className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">F5Bot Alternative</Link>
            <Link href="/auth/login"       className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Sign in</Link>
            <Link href="/auth/register"    className="text-[0.9375rem] text-white/40 hover:text-white/70 transition-colors">Register</Link>
          </nav>
          <p className="text-label text-white/25">© {new Date().getFullYear()} RadarScout</p>
        </div>
      </footer>

    </div>
  )
}
