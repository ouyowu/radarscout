'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { track } from '@/lib/analytics/track'
import type { SafeAffiliateAnalyticsContext } from '@/lib/affiliates/affiliateTripContext'
import type { RecommendationReasonCode } from '@/lib/ai-trip/recommendation-signals'
import {
  buildPartnerHandoffAnalyticsProps,
  createPartnerHandoffRecord,
  resolveReviewedBookingHandoffProvider,
} from '@/lib/affiliates/partnerHandoff'

type TrackedBookingPartnerHandoffProps = {
  href: string
  rel: 'nofollow sponsored noopener noreferrer'
  productId: string
  source: 'ai-trip-planner' | 'tour-detail'
  placement: 'tour_detail_primary' | 'tour_detail_sticky' | 'tour_detail_compare' | 'post_handoff_next_step'
  reasonCode?: RecommendationReasonCode
  city: string
  hasDates: SafeAffiliateAnalyticsContext['hasDates']
  hasGroupSize: SafeAffiliateAnalyticsContext['hasGroupSize']
  hasOccupancy: SafeAffiliateAnalyticsContext['hasOccupancy']
  travelerType: SafeAffiliateAnalyticsContext['travelerType']
  className?: string
  onTrackedClick?: () => void
  children: ReactNode
}

export function TrackedBookingPartnerHandoff({
  href,
  rel,
  productId,
  source,
  placement,
  reasonCode,
  city,
  hasDates,
  hasGroupSize,
  hasOccupancy,
  travelerType,
  className,
  onTrackedClick,
  children,
}: TrackedBookingPartnerHandoffProps) {
  const provider = resolveReviewedBookingHandoffProvider(href)
  if (!provider) return null

  const handoff = createPartnerHandoffRecord({
    href,
    provider,
    placement,
    destination: city,
    productId,
    recommendationSource: source,
    reasonCode,
    // The server-rendered product page only passes handoffs that already passed
    // validatePublicBookingPartnerHandoff.
    trustedPublicHandoff: true,
    safeIntent: {
      hasDates,
      hasGroupSize,
      hasOccupancy,
      travelerType,
    },
  })

  if (!handoff) return null

  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track('booking_partner_handoff_clicked', {
      ...buildPartnerHandoffAnalyticsProps(handoff),
    })
    onTrackedClick?.()
  }

  return (
    <a
      href={handoff.href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
