import type { Metadata } from 'next'
import React from 'react'
import { PartnerInterestPage } from '../_components/PartnerInterestPage'
import { DESTINATION_PARTNERS_PAGE_CONTENT } from '../_components/partnerInterestContent'

export const metadata: Metadata = {
  title: 'Destination Partners | RadarScout',
  description:
    'Work with RadarScout to organize destination expertise into AI-guided discovery flows for trusted local experiences.',
  robots: { index: false, follow: false },
}

export default function DestinationPartnersPage() {
  return <PartnerInterestPage content={DESTINATION_PARTNERS_PAGE_CONTENT} />
}
