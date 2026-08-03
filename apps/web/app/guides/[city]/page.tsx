import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '../../_components/JsonLd'
import { PublicSiteShell } from '../../_components/PublicSiteShell'
import { Section } from '../../_components/design-system/Section'
import { GuideArticleCard } from '../_components/GuideArticleCard'
import {
  getThailandGuideCity,
  guideCitySlugs,
  listThailandGuidesByCity,
} from '@/lib/guides/thailandGuides'

const base = 'https://www.radarscout.io'

export function generateStaticParams() {
  return guideCitySlugs.map(city => ({ city }))
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getThailandGuideCity(params.city)
  if (!city) return { robots: { index: false, follow: false } }

  const canonicalUrl = `${base}/guides/${city.slug}`
  return {
    title: `${city.title} | RadarScout`,
    description: city.description,
    alternates: { canonical: canonicalUrl },
    authors: [{ name: 'RadarScout Editorial Team', url: `${base}/about-us` }],
    robots: { index: true, follow: true },
    openGraph: { title: `${city.title} | RadarScout`, description: city.description, type: 'website', url: canonicalUrl },
    twitter: { card: 'summary_large_image', title: `${city.title} | RadarScout`, description: city.description },
  }
}

export default function ThailandGuideCityPage({ params }: { params: { city: string } }) {
  const city = getThailandGuideCity(params.city)
  if (!city) notFound()

  const articles = listThailandGuidesByCity(city.slug)
  const canonicalUrl = `${base}/guides/${city.slug}`
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
        name: city.title,
        description: city.description,
        author: { '@id': `${base}/#organization` },
        publisher: { '@id': `${base}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: articles.map((article, index) => ({
            '@type': 'ListItem', position: index + 1, url: article.canonicalUrl, name: article.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          { '@type': 'ListItem', position: 2, name: 'Thailand Travel Guides', item: `${base}/guides` },
          { '@type': 'ListItem', position: 3, name: city.name, item: canonicalUrl },
        ],
      },
    ],
  }

  return (
    <PublicSiteShell>
      <JsonLd data={structuredData} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/68">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/guides" className="hover:text-white">Guides</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>{city.name}</span>
            </nav>
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-rs-sage-200">Thailand city guides</p>
            <h1 className="mt-5 font-rs-display text-[clamp(3.2rem,8vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
              {city.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78">{city.intro}</p>
          </div>
        </section>

        <Section
          variant="cloud"
          eyebrow="Decision guides"
          title={`Plan ${city.name} with fewer assumptions`}
          lead="Start with the question that changes the trip. Each guide explains fit, trade-offs, and what still needs confirmation."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {articles.map(article => <GuideArticleCard key={article.href} article={article} />)}
          </div>
        </Section>

        <Section
          variant="sand"
          eyebrow="Continue planning"
          title={`Turn the ${city.name} decision into a realistic route`}
          lead="RadarScout keeps recommendations separate from the external transaction. Use the planner after the guide has narrowed the decision."
        >
          <div className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 shadow-rs-soft sm:flex sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-2xl text-sm leading-7 text-rs-muted">
              Tell RadarScout your days, group, pace, and interests. The planner compares only reviewed public coverage and explains why a result fits.
            </p>
            <Link
              href={city.plannerHref}
              className="mt-6 inline-flex min-h-[50px] shrink-0 items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white sm:mt-0"
            >
              Plan {city.name}
            </Link>
          </div>
        </Section>
      </main>
    </PublicSiteShell>
  )
}
