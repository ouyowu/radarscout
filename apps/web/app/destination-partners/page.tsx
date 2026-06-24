import type { Metadata } from 'next'
import React from 'react'
import {
  PartnerInterestPage,
  type PartnerInterestPageContent,
} from '../_components/PartnerInterestPage'

export const DESTINATION_PARTNERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Destination partners',
  headline: 'Help travelers discover the best local experiences in your destination',
  intro:
    'RadarScout can organize destination knowledge into guided discovery flows that help travelers compare trusted local experiences before handoff.',
  audience: [
    'DMCs, local tourism organizations, and destination managers.',
    'Local agencies building curated experience portfolios.',
    'Teams that understand which operators and activities are relevant for each traveler type.',
  ],
  helps: [
    'Structures destination expertise into clear planning paths for families, couples, groups, and independent travelers.',
    'Connects destination themes with trusted local experiences and partner-direct handoff.',
    'Starts with manual collaboration and curated intake before any deeper integration is considered.',
  ],
  doesNotReplace: [
    'Your destination strategy, supplier relationships, or local quality process.',
    'The booking partner or operator responsible for final traveler details.',
    'An API integration; this stage is static interest collection and manual collaboration only.',
  ],
  intake: [
    'Destination focus, traveler segments, and priority experience categories.',
    'Recommended local operators or experiences with public-safe details.',
    'A contact person for manual partnership scoping.',
  ],
  ctaLabel: 'Discuss a destination partnership',
  ctaHref: 'mailto:hello@radarscout.io?subject=RadarScout%20destination%20partnership',
}

export const metadata: Metadata = {
  title: 'Destination Partners | RadarScout',
  description:
    'Work with RadarScout to organize destination expertise into AI-guided discovery flows for trusted local experiences.',
  robots: { index: false, follow: false },
}

export default function DestinationPartnersPage() {
  return <PartnerInterestPage content={DESTINATION_PARTNERS_PAGE_CONTENT} />
}
