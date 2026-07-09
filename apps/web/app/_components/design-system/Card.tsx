import Link from 'next/link'
import React, { type ReactNode } from 'react'
import { cn } from './utils'

type CardProps = {
  children: ReactNode
  className?: string
  href?: string
  ariaLabel?: string
}

type ExperienceCardProps = {
  title: string
  summary: string
  eyebrow?: string
  tags?: string[]
  href?: string
  imageAlt?: string
  className?: string
}

export function Card({ children, className, href, ariaLabel }: CardProps) {
  const classes = cn(
    'overflow-hidden rounded-rs-md border border-rs-sage-200/70 bg-rs-cloud shadow-rs-soft',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={cn('block transition hover:-translate-y-1', classes)} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}

export function ExperienceCard({
  title,
  summary,
  eyebrow,
  tags = [],
  href,
  imageAlt = '',
  className,
}: ExperienceCardProps) {
  return (
    <Card href={href} className={className} ariaLabel={href ? title : undefined}>
      <div
        aria-label={imageAlt || undefined}
        className="relative flex aspect-[4/3] items-end bg-[linear-gradient(135deg,var(--rs-forest-700),var(--rs-sand-100)_55%,var(--rs-terracotta))] p-5"
      >
        <div className="absolute inset-0 bg-rs-forest-900/25" />
        {eyebrow ? (
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/90">{eyebrow}</p>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <h3 className="font-rs-display text-[clamp(1.25rem,2vw,1.375rem)] font-medium leading-tight text-rs-ink">{title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-rs-muted">{summary}</p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-forest-700">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
