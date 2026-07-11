import type { Metadata } from 'next'
import { FAQAccordion } from './_components/FAQAccordion'
import { PromptHero } from './_components/PromptHero'
import { PublicSiteShell } from './_components/PublicSiteShell'
import { TrackedLink } from './_components/TrackedLink'
import { ExperienceCard, Section } from './_components/design-system'
import {
  homepageFaqItems,
  homepageSteps,
  homepageTrustItems,
} from './_content/publicSite'
import { pilotPartnerProducts } from '@/lib/partnerProducts/seed/pilotPartnerProducts'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'RadarScout | Personalized Thailand Experience Planner',
  description:
    'Describe your ideal Thailand day and compare hand-picked experiences for elephant care, cooking, nature, and family-friendly days, then continue with a trusted booking partner.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout | Personalized Thailand Experience Planner',
    description:
      'Compare Thailand experiences, draft a day plan, and continue with a trusted booking partner when you are ready.',
    type: 'website',
    url: base,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout | Personalized Thailand Experience Planner',
    description:
      'Compare Thailand experiences, draft a day plan, and continue with a booking partner when you are ready.',
  },
}

const featuredPartnerExperiences = pilotPartnerProducts.slice(0, 4)
const chiangMaiPlannerHref = '/chiang-mai/elephant-camp-finder#plan-with-radarscout'

export default function LandingPage() {
  return (
    <PublicSiteShell>
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <PromptHero />

        <section className="border-y border-rs-sage-200/70 bg-rs-sand-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3">
            {homepageTrustItems.map(item => (
              <div key={item.label} className="rounded-rs-md bg-rs-cloud px-5 py-4 shadow-[0_10px_24px_rgba(15,36,28,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-forest-500">{item.label}</p>
                <p className="mt-2 font-rs-display text-xl font-medium leading-tight text-rs-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <Section
          variant="cloud"
          eyebrow="Reviewed Thailand day trips"
          title="Start with real experiences, not an endless catalogue."
          lead="Each card links to a RadarScout detail page for a reviewed partner product. Current operating details stay with the booking partner."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredPartnerExperiences.map(product => (
              <ExperienceCard
                key={product.id}
                href={`/tours/${encodeURIComponent(product.id)}`}
                eyebrow={product.destination}
                title={product.title}
                summary={product.shortSummary}
                tags={product.tags.slice(0, 3)}
                imageUrl={product.imageUrl}
                imageAlt={product.imageAlt ?? product.title}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <TrackedLink
              href="/tours"
              event="homepage_finder_entry_clicked"
              eventProps={{ source: 'featured_experiences' }}
              className="inline-flex min-h-[52px] items-center justify-center rounded-rs-pill border border-rs-forest-500 bg-white px-6 text-sm font-semibold uppercase tracking-[0.12em] text-rs-forest-700 transition hover:bg-rs-sand-100"
            >
              Browse experiences
            </TrackedLink>
          </div>
        </Section>

        <Section
          variant="sand"
          eyebrow="How it works"
          title="One clear path from trip idea to current partner details."
        >
          <div id="how-it-works" className="grid gap-5 lg:grid-cols-3">
            {homepageSteps.map((item, index) => (
              <article key={item.title} className="rounded-rs-lg border border-rs-sage-200/70 bg-rs-cloud p-7 shadow-rs-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-terracotta">Step {index + 1}</p>
                <h2 className="mt-4 font-rs-display text-[clamp(1.75rem,3vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-rs-ink">
                  {item.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-rs-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section variant="forest" className="relative overflow-hidden" contentClassName="relative z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(213,124,72,0.24),transparent_30%),linear-gradient(135deg,var(--rs-forest-900),var(--rs-forest-700))]" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rs-sage-200">First active city flow</p>
              <h2 className="mt-4 max-w-3xl font-rs-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
                Plan a Chiang Mai elephant, food, or nature day.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
                Use the guided finder to choose your travel style, compare reviewed matches, and inspect the suggested day before opening a product detail.
              </p>
            </div>
            <TrackedLink
              href={chiangMaiPlannerHref}
              event="homepage_finder_entry_clicked"
              eventProps={{ source: 'section' }}
              className="relative inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-rs-terracotta-600"
            >
              Plan with RadarScout
            </TrackedLink>
          </div>
        </Section>

        <FAQAccordion items={[...homepageFaqItems]} title="RadarScout day-trip planning FAQ" />
      </main>
    </PublicSiteShell>
  )
}
