import type { Metadata } from 'next'
import React from 'react'
import {
  PartnerInterestPage,
  type PartnerInterestPageContent,
} from '../_components/PartnerInterestPage'

export const SUPPLIERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Supplier interest',
  headline: 'List your Thailand experience with RadarScout',
  intro:
    'RadarScout can help match your local experience with travelers looking for the right fit, then send them to your trusted booking partner path.',
  audience: [
    'Local operators and activity providers in Thailand.',
    'Elephant sanctuaries, cooking schools, nature guides, and cultural experience teams.',
    'Owner-managed experiences with clear public details and a customer-facing booking link.',
  ],
  helps: [
    'Turns public experience details into traveler-friendly discovery and comparison copy.',
    'Matches experiences by destination, traveler style, duration, intensity, and interests.',
    'Keeps the handoff partner-direct so your existing operating process remains intact.',
  ],
  doesNotReplace: [
    'Your current booking tools or operator workflow.',
    'Your team’s responsibility for final operating details and guest communication.',
    'A supplier dashboard; early intake is checked manually before anything goes live.',
  ],
  intake: [
    'Public title, photos, destination, duration, and experience summary.',
    'Trust notes such as suitability, safety boundaries, and who the experience is best for.',
    'A customer-facing public booking link that travelers can open safely.',
  ],
  ctaLabel: 'Share your experience details',
  ctaHref: 'mailto:hello@radarscout.io?subject=RadarScout%20supplier%20interest',
}

export const metadata: Metadata = {
  title: 'Suppliers | RadarScout',
  description:
    'Share your Thailand experience with RadarScout for manual supplier intake and AI-guided discovery consideration.',
  robots: { index: false, follow: false },
}

export default function SuppliersPage() {
  return <PartnerInterestPage content={SUPPLIERS_PAGE_CONTENT} />
}
