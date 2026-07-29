import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '../../_components/JsonLd'
import { PublicSiteShell } from '../../_components/PublicSiteShell'
import { TrackedLink } from '../../_components/TrackedLink'
import { ExperienceCard, Section } from '../../_components/design-system'
import { loadReviewedViatorPublicCatalogue } from '@/lib/viator/reviewedViatorPublicCatalogue'
import {
  cityHubContent,
  cityHubSlugs,
  isCityHubSlug,
  type CityHubSlug,
} from '../cityHubContent'

const base = 'https://www.radarscout.io'
const editorialUpdatedAt = '2026-07-29'

export function generateStaticParams() {
  return cityHubSlugs.map(city => ({ city }))
}

function getCity(city: string) {
  return isCityHubSlug(city) ? cityHubContent[city] : null
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = getCity(params.city)
  if (!city) return { robots: { index: false, follow: false } }

  const canonicalUrl = `${base}/thailand/${params.city}`

  return {
    title: `${city.title} | RadarScout`,
    description: city.description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${city.title} | RadarScout`,
      description: city.description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${city.title} | RadarScout`,
      description: city.description,
    },
  }
}

function structuredDataFor(citySlug: CityHubSlug) {
  const city = cityHubContent[citySlug]
  const canonicalUrl = `${base}/thailand/${citySlug}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: city.title,
        description: city.description,
        dateModified: editorialUpdatedAt,
        author: {
          '@type': 'Organization',
          name: 'RadarScout Editorial Team',
          url: `${base}/about-us`,
        },
        about: {
          '@type': 'City',
          name: city.name,
          containedInPlace: {
            '@type': 'Country',
            name: 'Thailand',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Thailand Trip Planner',
            item: `${base}/thailand-trip-planner`,
          },
          { '@type': 'ListItem', position: 3, name: city.name, item: canonicalUrl },
        ],
      },
    ],
  }
}

export default function ThailandCityHubPage({ params }: { params: { city: string } }) {
  if (!isCityHubSlug(params.city)) notFound()

  const city = cityHubContent[params.city]
  const products = loadReviewedViatorPublicCatalogue({ city: city.catalogueCity }).slice(0, 6)
  const plannerHref = `/planner?idea=${encodeURIComponent(city.plannerIdea)}`

  return (
    <PublicSiteShell>
      <JsonLd data={structuredDataFor(params.city)} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/68">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <Link href="/thailand-trip-planner" className="hover:text-white">
                Thailand Trip Planner
              </Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>{city.name}</span>
            </nav>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-sage-200">
                  {city.eyebrow}
                </p>
                <h1 className="mt-5 max-w-4xl font-rs-display text-[clamp(3rem,7vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
                  {city.name} day trips, planned realistically
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78">{city.intro}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <TrackedLink
                    href={plannerHref}
                    event="homepage_finder_entry_clicked"
                    eventProps={{ source: `city_hub_${params.city}` }}
                    className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold uppercase tracking-[0.1em] text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                  >
                    Plan a {city.name} trip
                  </TrackedLink>
                  <Link
                    href={`/tours?city=${encodeURIComponent(city.name)}`}
                    className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill border border-white/40 px-7 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10"
                  >
                    Browse reviewed tours
                  </Link>
                </div>
              </div>

              <aside className="rounded-rs-lg border border-white/16 bg-white/8 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">
                  Best for
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/78">
                  {city.bestFor.map(item => <li key={item}>{item}</li>)}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <Section
          variant="cloud"
          eyebrow="Build a realistic route"
          title={`What matters when planning ${city.name}`}
          lead="RadarScout focuses on destination fit, traveler fit, and practical trade-offs. Current commercial terms and transaction status remain on the Viator page."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 shadow-rs-soft">
              <h2 className="font-rs-display text-3xl font-semibold">How to structure the days</h2>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-rs-muted">
                {city.planningAdvice.map(item => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-sand-50 p-7 shadow-rs-soft">
              <h2 className="font-rs-display text-3xl font-semibold">What to check before choosing</h2>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-rs-muted">
                {city.watchOut.map(item => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
        </Section>

        <Section
          variant="sand"
          eyebrow="Reviewed shortlist"
          title={`Reviewed ${city.name} experiences`}
          lead="These cards come from RadarScout's reviewed public catalogue. Product pages explain fit and trade-offs before the external Viator handoff."
        >
          {products.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ExperienceCard
                  key={product.id}
                  href={product.detailHref}
                  eyebrow={product.destination}
                  title={product.title}
                  summary={product.summary}
                  tags={product.tags.slice(0, 3)}
                  imageUrl={product.imageUrl}
                  imageAlt={product.title}
                  whyRecommended={product.summary}
                  bestFor={product.tags.slice(0, 3)}
                  watchOut="Check timing, transfers, inclusions, and current details on the Viator page."
                />
              ))}
            </div>
          ) : (
            <div className="rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 text-sm leading-7 text-rs-muted">
              No reviewed public matches are available for this city yet. Use the planner to
              compare only the coverage RadarScout can currently verify.
            </div>
          )}
        </Section>

        <section className="border-y border-rs-sage-200/70 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
                How we review
              </p>
              <h2 className="mt-3 font-rs-display text-3xl font-semibold">
                Reviewed by the RadarScout Editorial Team
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-rs-muted">
                We check destination fit, traveler fit, timing and transfer caveats, seasonal
                considerations, display-safe product fields, and the verified affiliate handoff.
                Current product terms remain the responsibility of Viator.
              </p>
            </div>
            <p className="text-sm text-rs-muted">Last reviewed: July 29, 2026</p>
          </div>
        </section>
      </main>
    </PublicSiteShell>
  )
}
