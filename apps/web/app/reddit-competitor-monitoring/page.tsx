import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'
import { JsonLd } from '../_components/JsonLd'
import { RelatedGuides } from '../_components/RelatedGuides'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Reddit Competitor Monitoring: Find Churn and Switch Intent | RadarScout',
    description:
      'A practical guide to monitoring competitor mentions on Reddit, spotting switch intent, and responding without sounding spammy.',
    alternates: { canonical: `${base}/reddit-competitor-monitoring` },
    openGraph: {
      title: 'Reddit Competitor Monitoring: Find Churn and Switch Intent',
      description:
        'Track competitor complaints, alternative searches, and product comparison threads on Reddit.',
      type: 'article',
      url: `${base}/reddit-competitor-monitoring`,
      images: [{ url: `${base}/images/reddit-competitor-monitoring.svg`, width: 1200, height: 720, alt: 'Reddit competitor monitoring dashboard' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Competitor Monitoring: Find Churn and Switch Intent',
      description: 'Track competitor complaints, alternative searches, and product comparison threads on Reddit.',
      images: [`${base}/images/reddit-competitor-monitoring.svg`],
    },
  }
}

const keywordGroups = [
  {
    title: 'Direct competitor names',
    examples: ['competitor brand', 'competitor pricing', 'competitor support'],
    note: 'Useful for brand mentions, complaints, and feature comparisons.',
  },
  {
    title: 'Alternative searches',
    examples: ['competitor alternative', 'replace competitor', 'switch from competitor'],
    note: 'Usually higher intent than a plain brand mention.',
  },
  {
    title: 'Pain-point phrases',
    examples: ['too expensive', 'slow support', 'hard to set up'],
    note: 'Catches buyers before they know which alternative to search for.',
  },
]

const workflow = [
  'Add competitor, alternative, and pain-point keywords.',
  'Review only threads with clear frustration, comparison, or switching language.',
  'Reply with useful context first; mention your product only if it fits the thread.',
]

export default function RedditCompetitorMonitoringPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteNav />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Reddit Competitor Monitoring: Find Churn and Switch Intent',
          description:
            'A practical guide to monitoring competitor mentions on Reddit, spotting switch intent, and responding without sounding spammy.',
          image: `${base}/images/reddit-competitor-monitoring.svg`,
          author: {
            '@type': 'Organization',
            name: 'RadarScout',
          },
          publisher: {
            '@type': 'Organization',
            name: 'RadarScout',
            logo: {
              '@type': 'ImageObject',
              url: `${base}/logo-icon.svg`,
            },
          },
          datePublished: '2026-06-05',
          dateModified: '2026-06-05',
          mainEntityOfPage: `${base}/reddit-competitor-monitoring`,
        }}
      />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              Competitor monitoring
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl">
              Reddit competitor monitoring that finds buyers ready to switch
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Competitor mentions on Reddit are not just brand-awareness data. The useful ones are
              complaints, comparison threads, pricing objections, and alternative searches. Those are
              the moments when a helpful reply can turn into a customer conversation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/register" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                Track competitors free
              </Link>
              <Link href="/reddit-monitoring-tool" className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Compare monitoring tools
              </Link>
            </div>
          </div>
          <img
            src="/images/reddit-competitor-monitoring.svg"
            alt="Illustration of competitor monitoring alerts in RadarScout"
            width={1200}
            height={720}
            className="w-full rounded-3xl border border-orange-100 shadow-sm"
          />
        </section>

        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              The competitor keywords worth monitoring
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              Start with a small keyword set. If every mention goes into your inbox, you will train
              yourself to ignore the alerts. The goal is to catch moments with buying context.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {keywordGroups.map(group => (
                <article key={group.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-gray-950">{group.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {group.examples.map(example => (
                      <li key={example} className="rounded-lg bg-orange-50 px-3 py-2 font-mono text-sm text-orange-700">
                        {example}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{group.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950">
                How to respond without sounding like a drive-by salesperson
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Reddit rewards useful replies and punishes obvious pitches. Treat competitor threads
                as a chance to help someone make a better decision, not as a cold outbound channel.
              </p>
            </div>
            <ol className="space-y-4">
              {workflow.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-2xl border border-gray-200 p-5">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-7 text-gray-700">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-orange-500 py-12 text-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Start with 3 competitor keywords free</h2>
              <p className="mt-2 text-orange-50">No credit card. Add your competitors and see which Reddit threads matter.</p>
            </div>
            <Link href="/auth/register" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50">
              Create free account
            </Link>
          </div>
        </section>
      </main>
      <RelatedGuides exclude="/reddit-competitor-monitoring" />
      <SiteFooter />
    </div>
  )
}
