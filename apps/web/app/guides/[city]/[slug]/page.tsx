import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '../../../_components/JsonLd'
import { PublicSiteShell } from '../../../_components/PublicSiteShell'
import {
  getThailandGuideArticle,
  thailandGuideArticles,
} from '@/lib/guides/thailandGuides'
import { buildRadarScoutOrganization } from '@/lib/seo/radarscoutEntity'

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

export default function ThailandGuideArticlePage({ params }: { params: { city: string; slug: string } }) {
  const article = getThailandGuideArticle(params.city, params.slug)
  if (!article) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      buildRadarScoutOrganization(),
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
          <header className="border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-[1080px]">
              <nav aria-label="Breadcrumb" className="text-sm text-white/68">
                <Link href="/" className="hover:text-white">Home</Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <Link href="/guides" className="hover:text-white">Guides</Link>
                <span aria-hidden="true" className="mx-2">/</span>
                <Link href={`/guides/${article.citySlug}`} className="hover:text-white">{article.cityName}</Link>
              </nav>
              <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-rs-sage-200">{article.eyebrow}</p>
              <h1 className="mt-5 max-w-5xl font-rs-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.05em]">
                {article.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78">{article.description}</p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/68">
                <span>By <Link href={article.author.href} className="font-semibold text-white hover:text-rs-sage-200">{article.author.name}</Link></span>
                <span>Reviewed by {article.reviewedBy}</span>
                <time dateTime={article.updatedAt}>Updated {article.updatedAt}</time>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:px-8 lg:py-16">
            <div className="min-w-0">
              <section className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-sage-50 p-7">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-800">Quick answer</h2>
                <p className="mt-4 text-lg leading-8 text-rs-ink">{article.quickAnswer}</p>
              </section>

              <div className="mt-12 space-y-12">
                {article.sections.map(section => (
                  <section key={section.heading}>
                    <h2 className="font-rs-display text-4xl font-semibold leading-tight tracking-[-0.035em]">{section.heading}</h2>
                    <div className="mt-5 space-y-5 text-[1.03rem] leading-8 text-rs-muted">
                      {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                    {section.checklist ? (
                      <ul className="mt-6 space-y-3 rounded-rs-md border border-rs-sage-200/70 bg-white p-6 text-sm leading-7 text-rs-muted">
                        {section.checklist.map(item => <li key={item}>✓ {item}</li>)}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>

              <section className="mt-12 rounded-rs-lg bg-rs-forest-900 p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">RadarScout takeaway</p>
                <p className="mt-4 font-rs-display text-3xl font-semibold leading-tight">{article.takeaway}</p>
                <Link
                  href={article.plannerHref}
                  className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                >
                  {article.plannerLabel}
                </Link>
              </section>

              <section className="mt-12 border-t border-rs-sage-200/70 pt-8">
                <h2 className="font-rs-display text-3xl font-semibold">Editorial review and sources</h2>
                <p className="mt-4 text-sm leading-7 text-rs-muted">{article.reviewMethod}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {article.officialSources.map(source => (
                    <li key={source.href}>
                      <a href={source.href} rel="noopener noreferrer" className="font-semibold text-rs-forest-800 underline decoration-rs-sage-300 underline-offset-4 hover:text-rs-terracotta-600">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-6 shadow-rs-soft">
                <h2 className="font-rs-display text-2xl font-semibold">Best for</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-rs-muted">
                  {article.bestFor.map(item => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section className="rounded-rs-lg border border-rs-terracotta/35 bg-rs-sand-100 p-6">
                <h2 className="font-rs-display text-2xl font-semibold">May not fit</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-rs-muted">
                  {article.notIdealFor.map(item => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </aside>
          </div>
        </article>
      </main>
    </PublicSiteShell>
  )
}
