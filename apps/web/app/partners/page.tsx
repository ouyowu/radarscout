import type { Metadata } from 'next'
import React from 'react'
import { PartnerInterestPage } from '../_components/PartnerInterestPage'
import { PARTNERS_PAGE_CONTENT } from '../_components/partnerInterestContent'

export const metadata: Metadata = {
  title: 'Partners | RadarScout',
  description:
    'Partner with RadarScout to help travelers discover trusted Thailand experiences through AI-guided discovery and partner-direct handoff.',
  robots: { index: false, follow: false },
}

export default function PartnersPage() {
  return <PartnerInterestPage content={PARTNERS_PAGE_CONTENT} />
}
