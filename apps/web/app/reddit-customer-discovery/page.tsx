import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '../_components/SiteNav'
import { SiteFooter } from '../_components/SiteFooter'
import { JsonLd } from '../_components/JsonLd'
import { RelatedGuides } from '../_components/RelatedGuides'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  return {
    title: 'Reddit Customer Discovery: Find Real Buyer Language | RadarScout',
    description:
      'Use Reddit customer discovery to find pain points, objections, feature requests, and buyer language before you write landing pages or outreach.',
    alternates: { canonical: `${base}/reddit-customer-discovery` },
    openGraph: {
      title: 'Reddit Customer Discovery: Find Real Buyer Language',
      description:
        'A practical workflow for turning Reddit discussions into keywords, positioning, and helpful replies.',
      type: 'article',
      url: `${base}/reddit-customer-discovery`,
      images: [{ url: `${base}/images/reddit-customer-discovery.svg`, width: 1200, height: 720, alt: 'Reddit customer discovery workflow' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reddit Customer Discovery: Find Real Buyer Language',
      description: 'Turn Reddit discussions into keywords, positioning, and helpful replies.',
      images: [`${base}/images/reddit-customer-discovery.svg`],
    },
  }
}

const signals = [
  ['Pain points', 'What people complain about before they search for a tool.'],
  ['Alternatives', 'Which products they compare, replace, or warn others about.'],
  ['Objections', 'Pricing, trust, setup, support, and workflow concerns.'],
  ['Exact phrasing', 'The words buyers use naturally, before marketing cleans them up.'],
]

const steps = [
  {
    title: 'Monitor category and pain keywords',
    body: 'Add phrases around the problem, not just your product name. The best discovery comes from people describing their situation before they know your category exists.',
  },
  {
    title: 'Save threads with context',
    body: 'A useful thread includes who the user is, what they tried, what failed, and what outcome they want. Thin mentions are less valuable than detailed complaints.',
  },
  {
    title: 'Turn patterns into product language',
    body: 'Use repeated phrasing in landing pages, FAQs, onboarding copy, and reply drafts. Reddit gives you the rough version of what your customers already believe.',
  },
]

export default function RedditCustomerDiscoveryPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteNav />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Reddit Customer Discovery: Find Real Buyer Language',
          description:
            'Use Reddit customer discovery to find pain points, objections, feature requests, and buyer language before you write landing pages or outreach.',
          image: `${base}/images/reddit-customer-discovery.svg`,
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
          mainEntityOfPage: `${base}/reddit-customer-discovery`,
        }}
      />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              Customer discovery
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl">
              Reddit customer discovery for teams that need real buyer language
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Interviews are useful, but Reddit shows what people say when nobody is asking them to
              be polite. Monitor the right keywords and you can find pain points, objections,
              competitor frustrations, and exact phrases to reuse in product and marketing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/register" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                Start discovering free
              </Link>
              <Link href="/use-cases" className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                See use cases
              </Link>
            </div>
          </div>
          <img
            src="/images/reddit-customer-discovery.svg"
            alt="Illustration of a customer discovery workflow from keywords to replies"
            width={1200}
            height={720}
            className="w-full rounded-3xl border border-gray-200 shadow-sm"
          />
        </section>

        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">What Reddit reveals that surveys miss</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {signals.map(([title, body]) => (
                <article key={title} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
                  <p className="mt-2 leading-7 text-gray-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-950">A simple discovery workflow</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-gray-200 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-gray-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-[680px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Discovery source</th>
                  <th className="px-5 py-4 font-semibold">Best for</th>
                  <th className="px-5 py-4 font-semibold">Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-4 font-medium text-gray-950">Customer interviews</td>
                  <td className="px-5 py-4 text-gray-600">Deep context and follow-up questions</td>
                  <td className="px-5 py-4 text-gray-600">Slow, biased by who agrees to talk</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-gray-950">Surveys</td>
                  <td className="px-5 py-4 text-gray-600">Quantifying known questions</td>
                  <td className="px-5 py-4 text-gray-600">Weak at discovering unknown language</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-gray-950">Reddit monitoring</td>
                  <td className="px-5 py-4 text-gray-600">Raw buyer language and fresh problems</td>
                  <td className="px-5 py-4 text-gray-600">Needs filtering so noise does not pile up</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <RelatedGuides exclude="/reddit-customer-discovery" />
      <SiteFooter />
    </div>
  )
}
