import type { Metadata } from 'next'
import React from 'react'
import {
  PartnerInterestPage,
  type PartnerInterestPageContent,
} from '../_components/PartnerInterestPage'

export const PARTNERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Partner program',
  headline: 'Sell trusted Thailand experiences with AI-guided discovery',
  intro:
    'RadarScout helps travelers discover, compare, and choose trusted local experiences, then continue to a booking partner when they are ready.',
  audience: [
    'Travel agents who want a clearer way to match clients with Thailand experiences.',
    'Hotels and concierges helping guests choose the right local day.',
    'Local travel planners and creators with Thailand travel traffic.',
  ],
  helps: [
    'Organizes traveler intent into guided discovery flows instead of a crowded marketplace list.',
    'Highlights trusted local experiences by destination, category, style, and pace.',
    'Supports partner-direct handoff while keeping final booking details with the booking partner.',
  ],
  doesNotReplace: [
    'Your existing client relationship or advisory process.',
    'The operator or booking partner responsible for final traveler details.',
    'A private agent portal; early partner interest is handled manually.',
  ],
  intake: [
    'Your audience, destination focus, and typical traveler needs.',
    'The types of Thailand experiences you want to recommend.',
    'The best contact path for a short partnership conversation.',
  ],
  ctaLabel: 'Contact RadarScout about partnerships',
  ctaHref: 'mailto:hello@radarscout.io?subject=RadarScout%20partner%20interest',
}

export const metadata: Metadata = {
  title: 'Partners | RadarScout',
  description:
    'Partner with RadarScout to help travelers discover trusted Thailand experiences through AI-guided discovery and partner-direct handoff.',
  robots: { index: false, follow: false },
}

export default function PartnersPage() {
  return <PartnerInterestPage content={PARTNERS_PAGE_CONTENT} />
}
