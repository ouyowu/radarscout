'use client'

import Link from 'next/link'
import React from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { track, type FunnelEvent, type FunnelEventProps } from '@/lib/analytics/track'

type TrackedLinkProps = {
  href: string
  children: ReactNode
  className?: string
  event: FunnelEvent
  eventProps?: FunnelEventProps
  ariaLabel?: string
}

export function TrackedLink({
  href,
  children,
  className,
  event,
  eventProps,
  ariaLabel,
}: TrackedLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
    track(event, eventProps)
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  )
}
