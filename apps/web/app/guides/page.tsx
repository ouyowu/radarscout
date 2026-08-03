import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '../_components/JsonLd'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { Section } from '../_components/design-system/Section'
import { GuideArticleCard } from './_components/GuideArticleCard'
import {
  guideCitySlugs,
  thailandGuideArticles,
  thailandGuideCities,
} from '@/lib/guides/thailandGuides'

const base = 'https://www.radarscout.io'
const canonicalUrl = `${base}/guides`

export const metadata: Metadata = {
  title: 'Thailand Travel Guides & Local Decision Help | RadarScout',
  description:
    'Original Thailand travel guides that explain what fits, what does not, and what to check before choosing Bangkok, Chiang Mai, and Phuket experiences.',
  alternates: { canonical: canonicalUrl },
  authors: [{ name: 'RadarScout Editorial Team', url: `${base}/about-us` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Thailand Travel Guides & Local Decision Help | RadarScout',
    description:
      'Decision-focused Thailand guides for Bangkok, Chiang Mai, and Phuket.',
    type: 'website',
    url: canonicalUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thailand Travel Guides | RadarScout',
    description: 'Original Thailand guidance built around traveler fit and practical trade-offs.',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: 'RadarScout',
      url: base,
    },
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      url: canonicalUrl,
      name: 'Thailand Travel Guides',
      description: metadata.description,
      isPartOf: { '@id': `${base}/#website` },
      author: { '@id': `${base}/#organization` },
      publisher: { '@id': `${base}/#organization` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: thailandGuideArticles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: article.canonicalUrl,
          name: article.title,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: base },
        { '@type': 'ListItem', position: 2, name: 'Thailand Travel Guides', item: canonicalUrl },
      ],
    },
  ],
}

export default function ThailandGuidesHubPage() {
  return (
    <PublicSiteShell>
      <JsonLd data={structuredData} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/68">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>Guides</span>
            </nav>
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-rs-sage-200">
              Original Thailand editorial
            </p>
            <h1 className="mt-5 max-w-5xl font-rs-display text-[clamp(3.2rem,8vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              Thailand travel guides for better decisions
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/78">
              Skip the generic list. RadarScout explains why an option fits, who may not enjoy it,
              and which practical question still needs an answer before you continue.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/thailand-trip-planner"
                className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold uppercase tracking-[0.1em] text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
              >
                Plan a Thailand trip
              </Link>
              <Link
                href="#latest-guides"
                className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill border border-white/35 px-7 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10"
              >
                Browse guides
              </Link>
            </div>
          </div>
        </section>

        <Section
          variant="cloud"
          eyebrow="Choose a city"
          title="Start with the decision in front of you"
          lead="Each city collection focuses on stable trade-offs and realistic traveler fit. Live commercial details stay with the external transaction partner."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {guideCitySlugs.map(slug => {
              const city = thailandGuideCities[slug]
              return (
                <article key={slug} className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 shadow-rs-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
                    City collection
                  </p>
                  <h2 className="mt-4 font-rs-display text-4xl font-semibold">{city.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-rs-muted">{city.intro}</p>
                  <Link
                    href={`/guides/${slug}`}
                    className="mt-6 inline-flex min-h-[44px] items-center font-bold text-rs-forest-800 hover:text-rs-terracotta-600"
                  >
                    Explore {city.name} guides →
                  </Link>
                </article>
              )
            })}
          </div>
        </Section>

        <div id="latest-guides">
          <Section
            variant="sand"
            eyebrow="Launch collection"
            title="Three decisions worth getting right"
            lead="Every launch guide is written and reviewed by RadarScout. No partner descriptions, ratings, or transaction claims are reproduced as editorial facts."
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {thailandGuideArticles.map(article => (
                <GuideArticleCard key={article.href} article={article} />
              ))}
            </div>
          </Section>
        </div>

        <section className="border-y border-rs-sage-200/70 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">Editorial standard</p>
              <h2 className="mt-3 font-rs-display text-4xl font-semibold">How RadarScout reviews guides</h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-rs-muted">
              <p>
                We separate stable decision guidance from changing commercial facts. Our editorial layer covers destination fit,
                transfer burden, activity intensity, and questions travelers should ask. The external partner remains responsible
                for current product terms and the transaction.
              </p>
              <p>
                Articles show an author, review method, publication date, and latest review date. We update a guide when its core
                decision logic changes; we do not manufacture freshness by changing a date without reviewing the content.
              </p>
              <Link href="/about-us" className="inline-flex min-h-[44px] items-center font-bold text-rs-forest-800 hover:text-rs-terracotta-600">
                About RadarScout’s editorial approach →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
