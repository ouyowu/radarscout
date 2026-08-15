import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '../../../_components/JsonLd'
import { PublicSiteShell } from '../../../_components/PublicSiteShell'
import { TornEdge } from '../../../_components/design-system'
import { AgodaStayAreaPanel } from '../../../planner/AgodaStayAreaPanel'
import { AGODA_AREA_CITY_NAMES } from '@/lib/affiliates/agodaAreaRecommendations'
import { buildReviewedAgodaStayAreaOffers } from '@/lib/affiliates/agodaAffiliate'
import { reviewedAgodaAreaRecommendations } from '@/lib/affiliates/seed/reviewedAgodaAreas'
import {
  getThailandGuideArticle,
  thailandGuideArticles,
} from '@/lib/guides/thailandGuides'

// A guide reader has no planner session, so there is no confirmed trip context
// to pass on. Everything stays null and the Agoda link degrades to an area
// search without invented dates or occupancy.
const GUIDE_TRIP_CONTEXT = {
  startDate: null,
  endDate: null,
  groupSize: null,
  adultCount: null,
  childCount: null,
  travelerType: 'unspecified',
} as const

const GUIDE_STAY_DECISION_CONTEXT = {
  travelerType: 'unspecified',
  interests: [],
  budget: 'unspecified',
} as const

const base = 'https://www.radarscout.io'

export function generateStaticParams() {
  return thailandGuideArticles.map(article => ({ city: article.citySlug, slug: article.slug }))
}

export function generateMetadata({ params }: { params: { city: string; slug: string } }): Metadata {
  const article = getThailandGuideArticle(params.city, params.slug)
  if (!article) return { robots: { index: false, follow: false } }

  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: article.canonicalUrl },
    authors: [{ name: article.author.name, url: `${base}${article.author.href}` }],
    robots: { index: true, follow: true },
    openGraph: {
      title: article.seoTitle,
      description: article.description,
      type: 'article',
      url: article.canonicalUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: { card: 'summary_large_image', title: article.seoTitle, description: article.description },
  }
}

/**
 * The two halves of the verdict, side by side. A stay-area guide is read to
 * settle one question, so the answer sits above the article rather than in a
 * sidebar the reader reaches at the end.
 */
function VerdictColumn({
  label,
  items,
  tone,
}: {
  label: string
  items: readonly string[]
  tone: 'fit' | 'caution'
}) {
  const rule = tone === 'fit' ? 'bg-rs-forest-500' : 'bg-rs-terracotta'
  const mark = tone === 'fit' ? 'text-rs-forest-500' : 'text-rs-terracotta'

  return (
    <section className="relative rounded-rs-md border border-rs-sage-200 bg-rs-cloud p-6 shadow-rs-soft">
      <span aria-hidden="true" className={`absolute inset-y-6 left-0 w-[3px] rounded-full ${rule}`} />
      <h2 className="pl-4 text-xs font-semibold uppercase tracking-[0.18em] text-rs-muted">{label}</h2>
      <ul className="mt-4 space-y-3 pl-4 text-[0.95rem] leading-7 text-rs-ink">
        {items.map(item => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className={`mt-[0.1rem] font-semibold ${mark}`}>
              {tone === 'fit' ? '✓' : '—'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ThailandGuideArticlePage({ params }: { params: { city: string; slug: string } }) {
  const article = getThailandGuideArticle(params.city, params.slug)
  if (!article) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'RadarScout',
        url: base,
      },
      {
        '@type': 'Article',
        '@id': `${article.canonicalUrl}#article`,
        headline: article.title,
        description: article.description,
        url: article.canonicalUrl,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { '@id': `${base}/#organization`, name: article.author.name },
        publisher: { '@id': `${base}/#organization` },
        mainEntityOfPage: { '@id': article.canonicalUrl },
        about: [{ '@type': 'City', name: article.cityName }, { '@type': 'Country', name: 'Thailand' }],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          { '@type': 'ListItem', position: 2, name: 'Thailand Travel Guides', item: `${base}/guides` },
          { '@type': 'ListItem', position: 3, name: article.cityName, item: `${base}/guides/${article.citySlug}` },
          { '@type': 'ListItem', position: 4, name: article.title, item: article.canonicalUrl },
        ],
      },
    ],
  }

  return (
    <PublicSiteShell>
      <JsonLd data={articleSchema} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <article>
          <header className="rs-paper relative bg-rs-forest-900 px-4 pb-20 pt-14 text-white sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
            <div className="relative mx-auto max-w-[1080px]">
              <nav aria-label="Breadcrumb" className="text-sm text-white/68">
                <Link href="/" className="hover:text-white">Home</Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <Link href="/guides" className="hover:text-white">Guides</Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <Link href={`/guides/${article.citySlug}`} className="hover:text-white">{article.cityName}</Link>
              </nav>
              <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-rs-gold">{article.eyebrow}</p>
              <h1 className="mt-5 max-w-4xl text-balance font-rs-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
                {article.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">{article.description}</p>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/68">
                {/* The review stamp is the page's provenance, so it is pressed
                    onto the header rather than listed as another byline field. */}
                <span className="inline-flex -rotate-[1.5deg] items-center border border-rs-gold/55 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rs-gold">
                  Reviewed by {article.reviewedBy}
                </span>
                <span>
                  By{' '}
                  <Link href={article.author.href} className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                    {article.author.name}
                  </Link>
                </span>
                <time dateTime={article.updatedAt}>Updated {article.updatedAt}</time>
              </div>
            </div>

            <TornEdge tone="sand" className="absolute inset-x-0 bottom-0" />
          </header>

          <div className="mx-auto max-w-[1080px] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24">
            {/* The short answer, in the reviewer's own hand. */}
            <section className="rs-paper relative overflow-hidden rounded-rs-lg border border-rs-gold/35 bg-rs-cloud px-7 py-8 shadow-rs-soft sm:px-9 sm:py-10">
              <div className="relative">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-gold">The short answer</h2>
                <p className="rs-script mt-4 max-w-[38ch] text-[clamp(1.6rem,3.2vw,2.15rem)] leading-[1.35] text-rs-ink">
                  {article.quickAnswer}
                </p>
              </div>
            </section>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <VerdictColumn label="Best for" items={article.bestFor} tone="fit" />
              <VerdictColumn label="May not fit" items={article.notIdealFor} tone="caution" />
            </div>

            {/* Reading column: held near 68 characters so the article stays
                comfortable at the body size, independent of the wider blocks. */}
            <div className="mx-auto mt-16 max-w-[46rem] space-y-14">
              {article.sections.map(section => (
                <section key={section.heading}>
                  <h2 className="font-rs-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-rs-ink">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5 text-[1.06rem] leading-[1.78] text-rs-ink/85">
                    {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.checklist ? (
                    <ul className="mt-7 space-y-3 rounded-rs-md border border-rs-sage-200 bg-rs-cloud p-6 text-[0.95rem] leading-7 text-rs-ink">
                      {section.checklist.map(item => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.1rem] font-semibold text-rs-gold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {/* A reader who has just settled which neighbourhood wins is ready
                to look at rooms there, so the reviewed areas come before the
                planner call to action rather than after it. */}
            {article.stayAreaCitySlug ? (
              <div className="mt-16">
                <AgodaStayAreaPanel
                  destination={AGODA_AREA_CITY_NAMES[article.stayAreaCitySlug]}
                  offers={buildReviewedAgodaStayAreaOffers(reviewedAgodaAreaRecommendations)}
                  tripContext={GUIDE_TRIP_CONTEXT}
                  decisionContext={GUIDE_STAY_DECISION_CONTEXT}
                />
              </div>
            ) : null}

            <section className="rs-paper relative mt-16 overflow-hidden rounded-rs-lg bg-rs-forest-900 px-8 py-10 text-white sm:px-10">
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-gold">RadarScout takeaway</p>
                <p className="mt-5 max-w-[30ch] font-rs-display text-[clamp(1.65rem,3.4vw,2.35rem)] font-semibold leading-[1.14]">
                  {article.takeaway}
                </p>
                <Link
                  href={article.plannerHref}
                  className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-white transition hover:bg-rs-terracotta-600"
                >
                  {article.plannerLabel}
                </Link>
              </div>
            </section>

            <section className="mx-auto mt-16 max-w-[46rem] border-t border-rs-sage-200 pt-9">
              <h2 className="font-rs-display text-2xl font-semibold tracking-[-0.02em] text-rs-ink">
                Editorial review and sources
              </h2>
              <p className="mt-4 text-[0.95rem] leading-7 text-rs-muted">{article.reviewMethod}</p>
              <ul className="mt-6 space-y-3 text-[0.95rem]">
                {article.officialSources.map(source => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      rel="noopener noreferrer"
                      className="font-semibold text-rs-forest-700 underline decoration-rs-gold/60 underline-offset-4 transition hover:text-rs-terracotta-600 hover:decoration-rs-terracotta"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>
    </PublicSiteShell>
  )
}
