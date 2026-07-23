'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import type { AffiliatePlacement, AffiliateProvider } from '@/lib/affiliates/affiliatePartners'
import {
  buildSafeAffiliateAnalyticsContext,
  type AffiliateTripContext,
} from '@/lib/affiliates/affiliateTripContext'
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
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    const safeTripContext = buildSafeAffiliateAnalyticsContext(tripContext)

    track('affiliate_partner_handoff_clicked', {
      provider,
      placement,
      city: destination,
      destination,
      ...safeTripContext,
      campaign,
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
