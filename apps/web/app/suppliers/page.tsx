import type { Metadata } from 'next'
import React from 'react'
import { PartnerInterestPage } from '../_components/PartnerInterestPage'
import { SUPPLIERS_PAGE_CONTENT } from '../_components/partnerInterestContent'

export const metadata: Metadata = {
  title: 'Suppliers | RadarScout',
  description:
    'Share your Thailand experience with RadarScout for manual supplier intake and AI-guided discovery consideration.',
  robots: { index: false, follow: false },
}

export default function SuppliersPage() {
  return <PartnerInterestPage content={SUPPLIERS_PAGE_CONTENT} />
}
