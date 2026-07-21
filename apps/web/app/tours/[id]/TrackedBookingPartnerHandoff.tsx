'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { track } from '@/lib/analytics/track'

type TrackedBookingPartnerHandoffProps = {
  href: string
  rel: 'nofollow sponsored noopener noreferrer'
  productId: string
  source: 'ai-trip-planner' | 'tour-detail'
  placement: 'tour_detail_primary' | 'tour_detail_sticky'
  city: string
  hasDates: boolean
  className?: string
  children: ReactNode
}

export function TrackedBookingPartnerHandoff({
  href,
  rel,
  productId,
  source,
  placement,
  city,
  hasDates,
  className,
  children,
}: TrackedBookingPartnerHandoffProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track('booking_partner_handoff_clicked', {
      provider: 'viator',
      placement,
      city,
      destination: city,
      hasDates,
      productId,
      source,
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
