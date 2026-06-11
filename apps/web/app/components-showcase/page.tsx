import { AdventureHero } from '../_components/AdventureHero'
import { DestinationCapsuleCard } from '../_components/DestinationCapsuleCard'
import { DmcTrustBar } from '../_components/DmcTrustBar'
import { EditorialBanner } from '../_components/EditorialBanner'
import { ExperienceCategoryGrid } from '../_components/ExperienceCategoryGrid'
import { FAQAccordion } from '../_components/FAQAccordion'
import { GuideBlogCard } from '../_components/GuideBlogCard'
import { PartnerInventoryNotice } from '../_components/PartnerInventoryNotice'
import { SupplierPartnerCTA } from '../_components/SupplierPartnerCTA'
import { TestimonialBand } from '../_components/TestimonialBand'
import { TourCollectionSection } from '../_components/TourCollectionSection'
import { WarmNewsletterFooter } from '../_components/WarmNewsletterFooter'
import { StickyMobileCTA } from '../_components/StickyMobileCTA'

const demoCategories = [
  { title: 'Curated day tours', description: 'Short, high-signal experiences that fit realistic route timing.' },
  { title: 'Private trips', description: 'Flexible route ideas for travelers who want a custom pace.' },
  { title: 'Transfers', description: 'Airport and city movement planned around comfort and reliability.' },
  { title: 'Food and culture', description: 'Local experiences that help travelers understand the destination.' },
]

const demoTours = [
  {
    title: 'UI Demo: Bangkok Food and Canal Route',
    href: '/components-showcase',
    summary: 'Demo-only card showing how a curated tour can be presented. This is not a real bookable product.',
    tourStyle: 'Food and culture',
    bestFor: 'First-time visitors',
    inventoryStatus: 'demo' as const,
  },
  {
    title: 'UI Demo: Private Island Day Plan',
    href: '/components-showcase',
    summary: 'Demo-only card for visual testing. Real inventory must come from signed Bókun supplier partners.',
    tourStyle: 'Private experience',
    bestFor: 'Private custom planning',
    inventoryStatus: 'demo' as const,
  },
  {
    title: 'UI Demo: Airport Transfer Experience',
    href: '/components-showcase',
    summary: 'Demo-only transfer card used to test layout, labels, and warm DMC styling.',
    tourStyle: 'Transfer',
    bestFor: 'Smooth arrivals',
    inventoryStatus: 'demo' as const,
  },
]

export default function ComponentsShowcasePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        title="RadarScout UI component showcase"
        subtitle="This page is a local UI demo only. Demo cards are not real bookable products, reviews, ratings, or supplier inventory."
        actions={[
          { label: 'Explore demo cards', href: '#tour-cards' },
          { label: 'Back home', href: '/', variant: 'secondary' },
        ]}
        trustNote="UI demo only. Real bookable products must come from signed Bókun supplier partners."
      />

      <DmcTrustBar
        items={[
          { label: 'Inventory boundary', value: 'Signed Bókun partners only' },
          { label: 'Coverage style', value: 'Selected destinations' },
          { label: 'Planning model', value: 'AI-assisted DMC portal' },
          { label: 'Demo status', value: 'No booking enabled' },
        ]}
      />

      <ExperienceCategoryGrid title="Premium DMC-style experience categories" categories={demoCategories} />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <DestinationCapsuleCard
          name="Thailand"
          href="/components-showcase"
          status="live"
          region="Southeast Asia"
          summary="Demo card showing live inventory styling."
          highlights={['Day tours', 'Transfers', 'Food', 'Nature']}
        />
        <DestinationCapsuleCard
          name="Japan"
          href="/components-showcase"
          status="coming-soon"
          region="East Asia"
          summary="Demo card showing partner onboarding styling."
          highlights={['Culture', 'Food', 'Private routes']}
        />
        <DestinationCapsuleCard
          name="Europe Routes"
          href="/components-showcase"
          status="planning"
          region="Europe"
          summary="Demo card showing planning-only destination styling."
          highlights={['Multi-country', 'Transfers', 'City days']}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PartnerInventoryNotice status="live" destinationName="Thailand" />
        <div className="mt-4">
          <PartnerInventoryNotice status="coming-soon" destinationName="Japan" />
        </div>
      </section>

      <div id="tour-cards">
        <TourCollectionSection
          title="Demo curated tour cards"
          subtitle="These cards are UI placeholders only and do not represent live products."
          tours={demoTours}
        />
      </div>

      <EditorialBanner
        label="Editorial travel desk"
        title="Plan around time value, route fit, and supplier readiness."
        body="RadarScout pages should feel like a destination expert desk, with clear inventory boundaries and no fake marketplace promises."
      />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
        <GuideBlogCard
          title="UI Demo: How to plan a warmer route"
          href="/components-showcase"
          category="Planning guide"
          summary="A demo editorial card for layout testing only."
        />
        <GuideBlogCard
          title="UI Demo: Choosing the right day tour style"
          href="/components-showcase"
          category="DMC guide"
          summary="A demo editorial card that does not imply real inventory."
        />
      </section>

      <TestimonialBand
        quote="Use this band only for verified proof later, not invented customer reviews."
        attribution="RadarScout UI demo rule"
        isDemo
      />

      <FAQAccordion
        items={[
          {
            question: 'Does this showcase enable booking?',
            answer: 'No. It is a static UI demo and does not call APIs, write data, send email, or create bookings.',
          },
          {
            question: 'Are the demo cards real products?',
            answer: 'No. They are explicitly marked as UI demos. Real bookable products must come from signed Bókun supplier partners.',
          },
        ]}
      />

      <SupplierPartnerCTA />
      <WarmNewsletterFooter />
      <StickyMobileCTA label="Back home" href="/" secondaryLabel="Partners" secondaryHref="/partners" />
    </main>
  )
}
