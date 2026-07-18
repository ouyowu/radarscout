'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import type { AffiliatePlacement, AffiliateProvider } from '@/lib/affiliates/affiliatePartners'
import { track } from '@/lib/analytics/track'

type TrackedAffiliateLinkProps = {
  href: string
  provider: AffiliateProvider
  placement: AffiliatePlacement
  destination: string
  campaign: string
  children: ReactNode
  className?: string
}

export function TrackedAffiliateLink({
  href,
  provider,
  placement,
  destination,
  campaign,
  children,
  className,
}: TrackedAffiliateLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track('affiliate_partner_handoff_clicked', {
      provider,
      placement,
      destination,
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
