'use client'

import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { track } from '@/lib/analytics/track'

type TrackedBookingPartnerHandoffProps = {
  href: string
  rel: 'nofollow sponsored noopener noreferrer'
  productId: string
  source: 'ai-trip-planner' | 'tour-detail'
  className?: string
  children: ReactNode
}

export function TrackedBookingPartnerHandoff({
  href,
  rel,
  productId,
  source,
  className,
  children,
}: TrackedBookingPartnerHandoffProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track('booking_partner_handoff_clicked', { productId, source })
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
