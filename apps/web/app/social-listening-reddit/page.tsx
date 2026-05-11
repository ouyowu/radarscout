import type { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Reddit Social Listening Tools: Complete Guide 2025 | RadarScout',
    description:
      'The complete guide to Reddit social listening in 2025. Compare Brand24, Mention, and RadarScout. Learn how to find buying signals, track competitors, and set up your first campaign.',
    alternates: { canonical: `${base}/social-listening-reddit` },
    openGraph: {
      title: 'Reddit Social Listening Tools: Complete Guide 2025 | RadarScout',
      description:
        'How to find buying signals on Reddit in 2025. Tool comparison, step-by-step campaign setup, and why Reddit beats Twitter for B2B intent signals.',
      type: 'website',
      url: `${base}/social-listening-reddit`,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: 'Reddit Social Listening Guide 2025' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Social Listening Tools: Complete Guide 2025 | RadarScout',
      description: 'How to find buying signals, track competitors, and set up social listening on Reddit in 2025.',
      images: [`${base}/og.png`],
    },
  }
}

const card   = { background: '#f9fafb', border: '1px solid #e5e7eb' } as const
const cardHi = { background: '#f3f4f6', border: '1px solid #e5e7eb' } as const

export default function SocialListeningRedditPage() {
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
            <p className="text-label font-semibold text-[#FF4500] uppercase tracking-wide mb-3">Social Listening · Reddit</p>
            <h1 className="text-h1 sm:text-display font-extrabold text-gray-900">
              Reddit Social Listening Tools: Complete Guide 2025
            </h1>
            <p className="mt-5 text-body-lg text-gray-500 max-w-2xl mx-auto">
              Reddit has 500 million users, long-form conversations, and zero algorithmic suppression of honest opinions. For B2B founders, marketers, and sales teams, it&rsquo;s the best source of unfiltered buying signals on the internet — if you know how to listen.
            </p>
          </div>
        </section>

        {/* ── WHAT IS REDDIT SOCIAL LISTENING ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">What is Reddit social listening?</h2>
            <p className="text-body-lg text-gray-500 mb-4">
              Social listening is the practice of monitoring online conversations for mentions of your brand, product category, or competitors. On most platforms — Twitter, LinkedIn, Instagram — the signal is diluted by performance posts, influencer noise, and brand accounts.
            </p>
            <p className="text-body-lg text-gray-500 mb-4">
              Reddit is different. Posts are anonymous, communities are niche, and users are direct. When someone asks &ldquo;what&rsquo;s the best CRM for a 10-person startup?&rdquo; on r/entrepreneur, that&rsquo;s a genuine buyer with a real need. No PR spin, no influencer deal, no algorithm shaping what gets seen.
            </p>
            <p className="text-body-lg text-gray-500">
              Reddit social listening means monitoring these conversations in real time — tracking keywords across subreddits, scoring posts for purchase intent, and responding before your competitors do. Done well, it&rsquo;s one of the highest-ROI marketing activities available to a bootstrapped SaaS founder or small marketing team.
            </p>
          </div>
        </section>

        {/* ── WHY REDDIT BEATS TWITTER ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-gray-900">Why Reddit beats Twitter for B2B signals</h2>
              <p className="mt-2 text-body text-gray-400 max-w-2xl mx-auto">
                Not all social listening is equal. Reddit has structural advantages for finding commercial intent.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Long-form context',
                  body: 'Reddit users write paragraphs. A post asking for software recommendations includes budget, pain points, current stack, and timeline. Twitter gives you 280 characters. The Reddit post is 10× more actionable for a sales response.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Niche communities',
                  body: 'There are subreddits for every industry, job function, and product category. r/SaaS, r/Entrepreneur, r/smallbusiness, r/webdev, r/marketing. Your target buyers self-segment into communities. You don\'t have to guess who to target.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'No algorithmic suppression',
                  body: 'Twitter hides posts unless you pay. LinkedIn throttles organic reach. Reddit threads rank by upvotes from real readers. A helpful reply that adds value surfaces to the top — organic reach is still real here.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                },
                {
                  title: 'Genuine purchase intent',
                  body: 'People search Reddit specifically to get recommendations from other buyers, not from brands. &ldquo;Looking for an alternative to [X]&rdquo; and &ldquo;need help choosing between A and B&rdquo; are high-conversion signals that rarely appear on Twitter without being a brand account post.',
                  icon: (
                    <svg className="h-6 w-6 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                },
              ].map(({ title, body, icon }) => (
                <div key={title} style={{ ...card, borderRadius: '16px' }} className="p-6 flex gap-4">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,69,0,0.12)' }}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-body text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW TO FIND BUYING INTENT ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">How to find buying intent on Reddit</h2>
            <p className="text-body-lg text-gray-500 mb-6">
              Not every Reddit mention is worth your time. The key is knowing which patterns signal genuine commercial intent versus casual conversation. Here are the three signal types that convert best:
            </p>
            <div className="space-y-4">
              {[
                {
                  type: 'Explicit recommendation requests',
                  examples: ['"looking for a [product category]"', '"what CRM do you use?"', '"best tool for X"', '"suggest a [tool] for our team"'],
                  why: 'The user has a defined need and is actively evaluating options. These are the highest-intent posts on Reddit.',
                },
                {
                  type: 'Competitor dissatisfaction',
                  examples: ['"frustrated with [competitor]"', '"[tool] is too expensive"', '"switching from X to something else"', '"[product] keeps breaking"'],
                  why: 'The user already pays for a solution, is unhappy, and is open to switching. These leads convert at a higher rate than cold outreach.',
                },
                {
                  type: 'Alternative searches',
                  examples: ['"[competitor] alternative"', '"something like X but cheaper"', '"open source alternative to [tool]"', '"X shut down — what do I use now?"'],
                  why: 'Users are at a decision point. They know what they want, have experience with a comparable product, and are ready to move.',
                },
              ].map(({ type, examples, why }) => (
                <div key={type} style={{ ...cardHi, borderRadius: '12px' }} className="p-5">
                  <h3 className="text-h3 font-semibold text-gray-900 mb-2">{type}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {examples.map(ex => (
                      <span
                        key={ex}
                        className="text-label font-medium text-[#FF4500] px-3 py-1"
                        style={{ background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: '999px' }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                  <p className="text-body text-gray-500">{why}</p>
                </div>
              ))}
            </div>

            {/* Inline CTA */}
            <div className="mt-10 p-6 text-center" style={{ ...card, borderRadius: '16px' }}>
              <p className="text-body font-semibold text-gray-900 mb-3">See these signals in your niche right now</p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px]"
              >
                Start monitoring Reddit free →
              </Link>
              <p className="mt-2 text-label text-gray-400">Free forever · No credit card</p>
            </div>
          </div>
        </section>

        {/* ── TOOL COMPARISON ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold text-gray-900">Reddit social listening tools compared</h2>
              <p className="mt-2 text-body text-gray-400 max-w-2xl mx-auto">
                Brand24, Mention, and RadarScout all monitor Reddit — but they&rsquo;re built for very different use cases.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  tool: 'Brand24',
                  tagline: 'Enterprise social listening',
                  price: 'From $199/month',
                  pros: ['Monitors Reddit + 25 other sources', 'Sentiment analysis', 'Mention volume charts', 'Team collaboration features'],
                  cons: ['Expensive for small teams', 'Not optimised for lead gen', 'No AI intent scoring for Reddit', 'No reply draft feature'],
                  verdict: 'Good for enterprise PR and brand monitoring across all channels. Overkill for lead generation. Most small teams pay for Reddit coverage they never use.',
                  highlight: false,
                },
                {
                  tool: 'Mention',
                  tagline: 'Mid-market social monitoring',
                  price: 'From $49/month',
                  pros: ['Multi-platform coverage', 'Real-time alerts', 'Influencer identification', 'Clean dashboard'],
                  cons: ['Reddit data can lag by hours', 'No purchase-intent scoring', 'No AI reply drafts', 'No campaign/keyword grouping'],
                  verdict: 'Better pricing than Brand24, similar use case. Solid for tracking brand mentions and PR signals but not built for Reddit-specific lead gen.',
                  highlight: false,
                },
                {
                  tool: 'RadarScout',
                  tagline: 'Reddit-first lead generation',
                  price: 'Free · $29/month Pro',
                  pros: ['Reddit-native, sub-60s alerts', 'AI intent scoring 1–10', 'Campaign mode with negative keywords', 'AI reply drafts', 'Free plan forever'],
                  cons: ['Reddit only (for now)', 'No legacy brand-monitoring reports'],
                  verdict: 'Built specifically for founders, marketers, and sales teams who want to turn Reddit conversations into customers. Not a general social listening tool — a Reddit lead engine.',
                  highlight: true,
                },
              ].map(({ tool, tagline, price, pros, cons, verdict, highlight }) => (
                <div
                  key={tool}
                  style={{
                    borderRadius: '16px',
                    ...(highlight
                      ? { background: 'rgba(255,69,0,0.05)', border: '1.5px solid rgba(255,69,0,0.35)' }
                      : card),
                  }}
                  className="p-6 flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-h3 font-bold text-gray-900">{tool}</h3>
                      {highlight && (
                        <span className="text-label font-semibold bg-[#FF4500] text-white px-2 py-0.5 rounded">Best for leads</span>
                      )}
                    </div>
                    <p className="text-label text-gray-400">{tagline}</p>
                    <p className="text-body font-semibold text-gray-700 mt-1">{price}</p>
                  </div>
                  <div className="space-y-1 mb-3">
                    {pros.map(p => (
                      <div key={p} className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-[#FF4500] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600">{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 mb-4">
                    {cons.map(c => (
                      <div key={c} className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-400">{c}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mt-auto pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>{verdict}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STEP BY STEP ── */}
        <section className="py-14 sm:py-20" style={{ background: '#f9fafb' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-4">Setting up your first Reddit social listening campaign</h2>
            <p className="text-body-lg text-gray-500 mb-8">
              You can have a working Reddit monitoring setup in under 10 minutes. Here&rsquo;s the exact process, step by step.
            </p>
            <div className="space-y-4">
              {[
                {
                  step: '01',
                  title: 'Sign up for RadarScout (free)',
                  body: 'Create your account at radarscout.io. No credit card required. You get 3 live keywords on the free plan — enough to test whether Reddit has conversations worth joining in your niche.',
                },
                {
                  step: '02',
                  title: 'Create a campaign',
                  body: 'A Campaign groups related keywords together so your feed stays organised. Create one for each product, competitor, or customer segment you want to track. Examples: "Competitor alternatives", "Pain points", "Buying intent".',
                },
                {
                  step: '03',
                  title: 'Choose your keywords',
                  body: 'Start with three proven patterns: (1) "[competitor name] alternative", (2) "looking for [your product category]", (3) "[pain point your product solves]". These reliably surface high-intent posts. Add more as you see what matches come in.',
                },
                {
                  step: '04',
                  title: 'Set a minimum intent score (Pro)',
                  body: 'On the Pro plan, set a minimum score — try 7 out of 10 to start. RadarScout\'s AI scores every match and only surfaces posts above your threshold. A score of 7+ means the user is actively evaluating a solution, not just mentioning a topic.',
                },
                {
                  step: '05',
                  title: 'Reply to high-intent posts',
                  body: 'When a high-intent match appears, read the post, then click "Draft reply". RadarScout generates a non-salesy, value-first response tailored to your product. Edit it to match your voice, then post it. The first genuinely helpful reply in a Reddit thread gets read by everyone.',
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

            {/* Inline CTA #2 */}
            <div className="mt-10 p-6 text-center" style={{ ...card, borderRadius: '16px' }}>
              <p className="text-body font-semibold text-gray-900 mb-3">Ready to set up your first campaign?</p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-xl transition-colors min-h-[44px]"
              >
                Start free — no credit card →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-8 text-center">Common questions</h2>
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              {[
                {
                  q: 'Does RadarScout monitor all subreddits?',
                  a: 'Yes — RadarScout monitors r/all, which covers every public subreddit on Reddit. You can optionally restrict a keyword to a specific subreddit if you want to focus on a particular community.',
                },
                {
                  q: 'How is this different from Google Alerts for Reddit?',
                  a: 'Google Alerts for Reddit is delayed by hours or days and has no intent scoring. RadarScout monitors Reddit directly, sends alerts within 60 seconds of a match, and uses AI to score each post for purchase intent — so you only see the conversations worth acting on.',
                },
                {
                  q: 'What are the best subreddits for B2B leads?',
                  a: 'The most active for buying signals are r/SaaS, r/Entrepreneur, r/startups, r/smallbusiness, r/webdev, r/marketing, and r/freelance. But the best subreddits depend on your product — set up keyword tracking across r/all first and let the data show you where your conversations happen.',
                },
                {
                  q: 'Is replying to Reddit posts allowed?',
                  a: "Yes, provided you add genuine value. Reddit communities reward helpful replies and penalise spam. RadarScout's AI drafts lead with real advice and mention your product only where relevant. Always read the subreddit rules before posting.",
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
            <h2 className="text-h2 font-bold text-white">Start listening to Reddit for free</h2>
            <p className="mt-3 text-body text-white/75">3 keywords · Real-time alerts · No credit card</p>
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
            <Link href="/gummysearch-alternative" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg" style={{ border: '1px solid #e5e7eb' }}>GummySearch alternative →</Link>
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
            <Link href="/pricing"                    className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/f5bot-alternative"          className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">F5Bot Alternative</Link>
            <Link href="/gummysearch-alternative"    className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">GummySearch Alternative</Link>
            <Link href="/social-listening-reddit"    className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Social Listening</Link>
            <Link href="/auth/login"                 className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Sign in</Link>
            <Link href="/auth/register"              className="text-[0.9375rem] text-gray-500 hover:text-gray-700 transition-colors">Register</Link>
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
              name: 'Does RadarScout monitor all subreddits?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — RadarScout monitors r/all, which covers every public subreddit on Reddit.',
              },
            },
            {
              '@type': 'Question',
              name: 'How is this different from Google Alerts for Reddit?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Google Alerts for Reddit is delayed by hours or days and has no intent scoring. RadarScout monitors Reddit directly, sends alerts within 60 seconds, and uses AI to score each post for purchase intent.',
              },
            },
            {
              '@type': 'Question',
              name: 'What are the best subreddits for B2B leads?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The most active for buying signals are r/SaaS, r/Entrepreneur, r/startups, r/smallbusiness, r/webdev, r/marketing, and r/freelance.',
              },
            },
          ],
        }) }}
      />

    </div>
  )
}
