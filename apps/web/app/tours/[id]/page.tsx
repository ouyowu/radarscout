import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '@/app/_components/AdventureHero'
import { DmcTrustBar } from '@/app/_components/DmcTrustBar'
import { EditorialBanner } from '@/app/_components/EditorialBanner'
import { FAQAccordion } from '@/app/_components/FAQAccordion'
import { PartnerInventoryNotice } from '@/app/_components/PartnerInventoryNotice'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

type TourDetailPreviewPageProps = {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: TourDetailPreviewPageProps): Metadata {
  return {
    title: 'Thailand Tour Detail Preview | RadarScout',
    description:
      'A display-only RadarScout preview shell for curated Thailand supplier experiences powered by signed Bókun supplier partners.',
    alternates: { canonical: `${base}/tours/${encodeURIComponent(params.id)}` },
  }
}

const trustItems = [
  { label: 'Page status', value: 'Display-only preview' },
  { label: 'Live destination', value: 'Thailand first' },
  { label: 'Supplier source', value: 'Signed Bókun partners' },
  { label: 'Purchase flow', value: 'Not enabled here' },
]

const futureSupportItems = [
  'Verified supplier experience details once connected',
  'Availability options after partner product data is ready',
  'Private custom itinerary fit and timing guidance',
  'Pickup, duration, inclusions, and guest notes when supplied by partners',
]

const safetyItems = [
  'This page does not query a product database.',
  'This page does not call Bókun or availability services.',
  'This page does not create an inquiry or reservation.',
  'Product details will appear only from signed supplier partner data.',
]

const faqItems = [
  {
    question: 'Is this a real product detail page?',
    answer:
      'Not yet. This is a display-only preview shell. Real product-level details will appear only when connected to signed Bókun supplier partner inventory.',
  },
  {
    question: 'Does the reference in the URL confirm an available tour?',
    answer:
      'No. The route parameter is shown only as a preview reference. It is not used to query a database or confirm supplier availability in this UI phase.',
  },
  {
    question: 'Can I reserve this experience here?',
    answer:
      'No. Real booking flow is not enabled on this page. Travelers can return to the tours preview or email RadarScout with availability questions.',
  },
  {
    question: 'Which destination has live inventory first?',
    answer:
      'Thailand is currently RadarScout’s first live inventory destination. Other destinations remain planning-only or partner tours coming soon.',
  },
]

function displayReference(id: string) {
  const trimmed = id.trim()
  if (!trimmed) return 'preview'
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}...` : trimmed
}

export default function TourDetailPreviewPage({ params }: TourDetailPreviewPageProps) {
  const reference = displayReference(params.id)

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="bg-[var(--color-bg-primary)] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/tours"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border-light)] bg-white px-5 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
          >
            Back to tours
          </Link>
        </div>
      </section>

      <AdventureHero
        eyebrow="Tour detail preview"
        title="Thailand Supplier Experience Preview"
        subtitle="A display-only preview shell for curated Thailand supplier experiences. Bookable product details are powered by signed Bókun supplier partners, and real booking flow is not enabled on this page."
        actions={[
          { label: 'Return to tours', href: '/tours' },
          { label: 'Thailand destination', href: '/destinations/thailand', variant: 'secondary' },
        ]}
        trustNote="Thailand is RadarScout’s first live inventory destination. Non-Thailand destinations remain planning-only or partner tours coming soon."
      />

      <DmcTrustBar items={trustItems} />

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
              Experience reference
            </p>
            <h1 className="mt-3 break-words font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
              {reference}
            </h1>
            <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              This reference is displayed for route preview only. It is not used here to query product details, confirm availability, or create a request.
            </p>
          </div>

          <PartnerInventoryNotice status="live" currentDestination="Thailand" />
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                Future detail support
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-5xl font-black leading-none tracking-[-0.045em]">
                What this page will support later.
              </h2>
            </div>
            <p className="text-base font-semibold leading-8 text-[var(--color-text-secondary)]">
              Product-level content will be shown only when it comes from connected signed supplier partner data. This preview keeps the detail page route ready without inventing supplier, price, rating, review, or availability information.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {futureSupportItems.map(item => (
              <article key={item} className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-5 shadow-lg">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">
                  Planned
                </p>
                <p className="mt-3 text-sm font-bold leading-7 text-[var(--color-text-secondary)]">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-[var(--color-bg-dark)] p-6 text-white shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">
              Safety boundary
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Real booking flow is not enabled on this page.
            </h2>
            <div className="mt-5 grid gap-3 text-sm font-semibold leading-7 text-white/75">
              {safetyItems.map(item => (
                <p key={item} className="rounded-2xl bg-white/10 px-4 py-3">{item}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-ai-feature)]">
              Next safe actions
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
              Continue planning without creating a transaction.
            </h2>
            <div className="mt-6 grid gap-3">
              <Link
                href="/tours"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-sm font-black uppercase tracking-[0.1em] text-white"
              >
                Return to tours preview
              </Link>
              <Link
                href="/destinations/thailand"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]"
              >
                View Thailand destination
              </Link>
              <a
                href="mailto:hello@radarscout.io?subject=B%C3%B3kun%20Supplier%20Partnership%20Inquiry"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border-medium)] bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]"
              >
                Email supplier partnership
              </a>
            </div>
          </div>
        </div>
      </section>

      <EditorialBanner
        label="Coming soon product detail data"
        title="Verified supplier details will be connected in a later data phase."
        body="This preview keeps RadarScout’s product-detail route ready while protecting supplier and inventory boundaries. Product descriptions, inclusions, pickup notes, and guest requirements should come from signed partner data only."
        href="/tours"
        ctaLabel="Back to tours"
      />

      <FAQAccordion items={faqItems} title="Tour detail preview FAQ" />
    </main>
  )
}

