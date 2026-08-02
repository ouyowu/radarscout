'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import type { AffiliatePlacement, AffiliateProvider } from '@/lib/affiliates/affiliatePartners'
import type { AffiliateTripContext } from '@/lib/affiliates/affiliateTripContext'
import {
  buildPartnerHandoffAnalyticsProps,
  createPartnerHandoffRecord,
} from '@/lib/affiliates/partnerHandoff'
import { track } from '@/lib/analytics/track'

type TrackedAffiliateLinkProps = {
  href: string
  provider: AffiliateProvider
  placement: AffiliatePlacement
  destination: string
  campaign: string
  tripContext?: AffiliateTripContext
  children: ReactNode
  className?: string
}

export function TrackedAffiliateLink({
  href,
  provider,
  placement,
  destination,
  campaign,
  tripContext,
  children,
  className,
}: TrackedAffiliateLinkProps) {
  const handoff = createPartnerHandoffRecord({
    href,
    provider,
    placement,
    destination,
    campaign,
    tripContext,
  })

  if (!handoff) return null

  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track('affiliate_partner_handoff_clicked', {
      ...buildPartnerHandoffAnalyticsProps(handoff),
    })
  }

  return (
    <a
      href={handoff.href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
