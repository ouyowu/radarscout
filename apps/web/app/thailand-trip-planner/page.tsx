import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQAccordion } from '../_components/FAQAccordion'
import { JsonLd } from '../_components/JsonLd'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { TrackedLink } from '../_components/TrackedLink'
import { ExperienceCard, Section } from '../_components/design-system'
import { featuredViatorExperiences } from '../_content/homepageFeaturedExperiences'

const base = 'https://www.radarscout.io'
const canonicalPath = '/thailand-trip-planner'
const canonicalUrl = `${base}${canonicalPath}`

export const metadata: Metadata = {
  title: 'AI Trip Planner Thailand Guide | Realistic Itineraries | RadarScout',
  description:
    'Looking for an AI trip planner for Thailand? Build a realistic route from reviewed day tours, local trade-offs, and trusted booking-partner handoffs.',
  alternates: { canonical: canonicalUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI Trip Planner Thailand Guide | RadarScout',
    description:
      'Plan a realistic Thailand route with reviewed day tours, clear fit reasons, and practical trade-offs.',
    type: 'website',
    url: canonicalUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trip Planner Thailand Guide | RadarScout',
    description:
      'Plan a realistic Thailand route with reviewed day tours and practical local trade-offs.',
  },
}

const cityStartingPoints = [
  {
    name: 'Bangkok',
    href: '/thailand/bangkok',
    planHref: '/planner?idea=Bangkok%203%20days%20food%20temples',
    summary:
      'Balance temples, canals, food, and practical day trips without sending every day across the city.',
    bestFor: 'First-time Thailand trips, food, culture, and short regional day trips.',
    check: 'Traffic, meeting points, dress rules, and the travel time between districts.',
  },
  {
    name: 'Chiang Mai',
    href: '/thailand/chiang-mai',
    planHref: '/planner?idea=Chiang%20Mai%203%20days%20nature%20food',
    summary:
      'Compare nature, cooking, temples, and elephant-care experiences from a reviewed shortlist.',
    bestFor: 'Slower itineraries, families, couples, food, and mountain day trips.',
    check: 'Pickup area, activity intensity, animal-care practices, and seasonal air quality.',
  },
  {
    name: 'Phuket',
    href: '/thailand/phuket',
    planHref: '/planner?idea=Phuket%203%20days%20islands%20snorkeling',
    summary:
      'Separate island days, water activities, and land-based options so the route stays realistic.',
    bestFor: 'Island hopping, snorkeling, couples, families, and beach-based stays.',
    check: 'Sea conditions, transfer time, pier location, and what the operator includes.',
  },
] as const

const planningSteps = [
  {
    title: 'Describe the trip',
    body: 'Tell RadarScout the Thailand city, number of days, interests, pace, and who is traveling.',
  },
  {
    title: 'Compare reviewed matches',
    body: 'The guided planner uses deterministic trip rules and reviewed product records instead of inventing experiences.',
  },
  {
    title: 'Inspect the trade-offs',
    body: 'Read why an option fits, who it suits, and what to check before continuing to the partner page.',
  },
] as const

const differentiators = [
  {
    title: 'Why recommended',
    body: 'Every highlighted experience needs a clear destination and traveler-fit reason, not a generic popularity claim.',
  },
  {
    title: 'Best for',
    body: 'Use group type, pace, interests, and trip length to understand whether the experience belongs in your plan.',
  },
  {
    title: 'What to check',
    body: 'Review timing, transfers, physical demands, seasonality, inclusions, and current partner terms before continuing.',
  },
] as const

const faqItems = [
  {
    question: 'Is RadarScout an AI trip planner for Thailand?',
    answer:
      'RadarScout offers a guided planning experience for Thailand. It parses your trip brief, applies deterministic itinerary rules, and matches reviewed experience records. It does not invent products or claim to confirm current partner details.',
  },
  {
    question: 'Can RadarScout plan more than one Thailand city?',
    answer:
      'You can describe the cities and trip length you are considering. Coverage is strongest where reviewed products and map coverage exist, and it expands city by city rather than pretending every destination has equal depth.',
  },
  {
    question: 'Does RadarScout sell the tours?',
    answer:
      'No. RadarScout helps you plan and compare. Product details lead to the reviewed partner handoff, where current terms and the next step are confirmed.',
  },
  {
    question: 'How are Thailand experiences selected?',
    answer:
      'The public shortlist uses reviewed product records with a valid destination, useful traveler themes, original RadarScout decision-support copy, and a verified partner handoff.',
  },
] as const

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
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: 'AI Trip Planner Thailand Guide',
      description: metadata.description,
      isPartOf: { '@id': `${base}/#website` },
      about: {
        '@type': 'Country',
        name: 'Thailand',
      },
      publisher: { '@id': `${base}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: base,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Thailand Trip Planner',
          item: canonicalUrl,
        },
      ],
    },
  ],
}

export default function ThailandTripPlannerHubPage() {
  return (
    <PublicSiteShell>
      <JsonLd data={structuredData} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <section className="relative overflow-hidden border-b border-rs-sage-200/70 bg-rs-forest-900 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(213,124,72,0.34),transparent_28%),radial-gradient(circle_at_18%_78%,rgba(173,196,181,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-[1240px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/66">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span>Thailand Trip Planner</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-sage-200">
                  Thailand planning guide
                </p>
                <h1 className="mt-5 max-w-4xl font-rs-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
                  Plan a realistic Thailand trip
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
                  Looking for an AI trip planner for Thailand? RadarScout turns your city, duration,
                  pace, and interests into a practical route built from reviewed day tours and
                  explicit trade-offs.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <TrackedLink
                    href="/planner"
                    event="homepage_finder_entry_clicked"
                    eventProps={{ source: 'thailand_trip_planner_hub' }}
                    className="inline-flex min-h-[54px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold uppercase tracking-[0.12em] text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
                  >
                    Build my Thailand plan
                  </TrackedLink>
                  <Link
                    href="/tours"
                    className="inline-flex min-h-[54px] items-center justify-center rounded-rs-pill border border-white/40 px-7 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                  >
                    Browse reviewed day tours
                  </Link>
                </div>
              </div>

              <aside className="rounded-rs-lg border border-white/16 bg-white/8 p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">
                  What the planner does
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-white/78">
                  <li>Keeps the requested destination and duration explicit.</li>
                  <li>Uses reviewed Thailand experience records.</li>
                  <li>Explains fit and trade-offs before partner details.</li>
                  <li>Leaves current terms to the trusted booking partner.</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <Section
          variant="cloud"
          eyebrow="How it works"
          title="Guided planning without invented travel products."
          lead="RadarScout is a recommendation layer. The planner helps you structure the trip and compare reviewed options; it does not run its own inventory, availability, or transaction system."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {planningSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-sand-50 p-7 shadow-rs-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
                  Step {index + 1}
                </p>
                <h2 className="mt-4 font-rs-display text-3xl font-semibold leading-tight">
                  {step.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-rs-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          variant="sand"
          eyebrow="Popular starting points"
          title="Start with the Thailand city that anchors your day trips."
          lead="These links open reviewed city results and a prepared planner idea. They do not imply that every city has the same product or map coverage."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {cityStartingPoints.map(city => (
              <article
                key={city.name}
                className="flex h-full flex-col rounded-rs-lg border border-rs-sage-200/70 bg-white p-7 shadow-rs-soft"
              >
                <h2 className="font-rs-display text-4xl font-semibold tracking-[-0.03em]">
                  {city.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-rs-muted">{city.summary}</p>
                <dl className="mt-6 space-y-4 border-t border-rs-sage-200/70 pt-5 text-sm">
                  <div>
                    <dt className="font-semibold text-rs-forest-700">Best for</dt>
                    <dd className="mt-1 leading-6 text-rs-muted">{city.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-rs-forest-700">What to check</dt>
                    <dd className="mt-1 leading-6 text-rs-muted">{city.check}</dd>
                  </div>
                </dl>
                <div className="mt-auto flex flex-wrap gap-4 pt-7 text-sm font-semibold">
                  <Link href={city.href} className="text-rs-terracotta-600 underline-offset-4 hover:underline">
                    Open the {city.name} guide
                  </Link>
                  <Link href={city.planHref} className="text-rs-forest-700 underline-offset-4 hover:underline">
                    Plan this city
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          variant="forest"
          eyebrow="Local decision support"
          title="Why RadarScout is different"
          lead="The useful part is not producing more generic itinerary text. It is showing the traveler why an option belongs in the trip and what could make it a poor fit."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {differentiators.map(item => (
              <article key={item.title} className="rounded-rs-lg border border-white/14 bg-white/8 p-7">
                <h2 className="font-rs-display text-3xl font-semibold">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/72">{item.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          variant="cloud"
          eyebrow="Reviewed experience shortlist"
          title="A practical place to start comparing Thailand day tours."
          lead="These experience pages use original RadarScout decision-support copy and link to reviewed partner handoffs. Check current details on the partner page."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredViatorExperiences.map(product => (
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
                watchOut="Check meeting details, timing, inclusions, and current terms on the booking partner page."
              />
            ))}
          </div>
        </Section>

        <section className="border-y border-rs-sage-200/70 bg-rs-sand-100 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 text-sm leading-7 text-rs-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              RadarScout may earn from eligible partner referrals. Editorial fit decisions remain
              separate from the partner handoff.
            </p>
            <Link
              href="/affiliate-disclosure"
              className="shrink-0 font-semibold text-rs-forest-700 underline-offset-4 hover:underline"
            >
              Read the affiliate disclosure
            </Link>
          </div>
        </section>

        <section className="border-b border-rs-sage-200/70 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta-600">
                Editorial method
              </p>
              <h2 className="mt-3 font-rs-display text-3xl font-semibold">
                Reviewed by the RadarScout Editorial Team
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-rs-muted">
                We review destination fit, traveler fit, practical timing and transfer caveats,
                display-safe product content, and the verified affiliate handoff. Current product
                terms are confirmed on the booking partner page.
              </p>
            </div>
            <p className="text-sm text-rs-muted">Last reviewed: July 29, 2026</p>
          </div>
        </section>

        <FAQAccordion items={[...faqItems]} title="Thailand trip planner FAQ" />
      </main>
    </PublicSiteShell>
  )
}
