import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from './_components/SiteNav'
import { SiteFooter } from './_components/SiteFooter'
import { JsonLd } from './_components/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'RadarScout — Real-Time Reddit Monitoring for Leads and Mentions',
    description:
      'Get alerted when Reddit mentions your brand, competitors, or product category. RadarScout monitors Reddit, filters noisy matches, and helps teams reply faster.',
    alternates: { canonical: base },
    openGraph: {
      title: 'RadarScout — Real-Time Reddit Monitoring',
      description:
        'Monitor Reddit for brand mentions, competitor complaints, and high-intent buyer conversations.',
      type: 'website',
      url: base,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Reddit monitoring' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'RadarScout — Real-Time Reddit Monitoring',
      description: 'Find Reddit leads, mentions, and competitor conversations before they go cold.',
      images: [`${base}/og-image.png`],
    },
  }
}

const comparison = [
  ['Free plan', 'Free', 'Free plan'],
  ['AI filtering', 'No', 'Yes'],
  ['Alert speed', 'Slow digests', 'Fast alerts'],
  ['Slack webhook', 'No', 'Available on paid plans'],
]

const steps = [
  ['Add keywords', 'Track your brand, competitors, product category, and buyer pain points.'],
  ['We monitor Reddit', 'RadarScout watches public Reddit conversations and filters noisy matches.'],
  ['Get notified', 'Open the match, understand the context, and reply while the thread is still active.'],
]

const faqs = [
  ['Is RadarScout free?', 'Yes. The free plan includes 3 monitored keywords, so you can test real Reddit alerts before upgrading.'],
  ['How fast are alerts?', 'RadarScout is built for fast monitoring. Most relevant matches appear quickly enough to reply before the thread goes stale.'],
  ['Is it Reddit only?', 'The core product focuses on Reddit because it is where product comparisons, complaints, and buying questions happen publicly.'],
  ['How is this different from F5Bot?', 'F5Bot is useful for basic free alerts. RadarScout adds product workflows around filtering, lead discovery, competitor monitoring, and reply speed.'],
  ['Can I cancel anytime?', 'Yes. Paid plans are subscription-based and can be cancelled from billing when you no longer need monitoring.'],
]

export default function LandingPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteNav />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'RadarScout',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: base,
          description:
            'Real-time Reddit monitoring for brand mentions, competitor complaints, product alternatives, and high-intent buyer conversations.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free plan with 3 monitored keywords.',
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer,
            },
          })),
        }}
      />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              Reddit monitoring for teams
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Get notified when Reddit mentions you
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              RadarScout monitors Reddit for brand mentions, competitor complaints, product
              alternatives, and high-intent buying questions, then helps you respond before the
              conversation goes cold.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/register" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                Start for free
              </Link>
              <Link href="/pricing" className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">3 keywords free forever. No credit card required.</p>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Live match</p>
                  <p className="mt-1 text-sm text-gray-500">r/SaaS • just now</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  9/10 intent
                </span>
              </div>
              <div className="space-y-4 py-5">
                <div>
                  <p className="text-sm font-semibold text-gray-950">
                    Looking for an F5Bot alternative with better filtering
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    We get too many noisy alerts and miss the threads where people are actually
                    comparing tools...
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Suggested action</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    Reply with a short comparison, mention filtering only after answering their
                    current workflow problem.
                  </p>
                </div>
              </div>
              <Link href="/demo" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                View demo
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-950">Better than F5Bot for teams</h2>
              <p className="mt-3 text-gray-600">F5Bot is a good free alert tool. RadarScout is built for business workflows.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="min-w-[640px] w-full text-left text-sm">
                <thead className="bg-white text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Feature</th>
                    <th className="px-5 py-4 font-semibold">F5Bot</th>
                    <th className="px-5 py-4 font-semibold text-orange-600">RadarScout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparison.map(([feature, f5bot, us]) => (
                    <tr key={feature}>
                      <td className="px-5 py-4 font-medium text-gray-950">{feature}</td>
                      <td className="px-5 py-4 text-gray-600">{f5bot}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-950">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([title, body], index) => (
              <article key={title} className="rounded-2xl border border-gray-200 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-950">Latest guides</h2>
                <p className="mt-3 text-gray-600">Practical articles for turning Reddit conversations into customers.</p>
              </div>
              <Link href="/pricing" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-orange-600 hover:text-orange-700">
                See pricing
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['Reddit competitor monitoring', '/reddit-competitor-monitoring'],
                ['Reddit customer discovery', '/reddit-customer-discovery'],
                ['Reddit monitoring tool comparison', '/reddit-monitoring-tool'],
              ].map(([title, href]) => (
                <Link key={href} href={href} className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-200 hover:bg-orange-50">
                  <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Read the guide →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-950">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-gray-200 p-5">
                <summary className="cursor-pointer text-base font-semibold text-gray-950">{question}</summary>
                <p className="mt-3 leading-7 text-gray-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-orange-500 py-12 text-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Start monitoring Reddit in minutes</h2>
              <p className="mt-2 text-orange-50">Track 3 keywords free and upgrade only when you need more coverage.</p>
            </div>
            <Link href="/auth/register" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50">
              Create free account
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
