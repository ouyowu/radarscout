import Link from 'next/link'
import React, { type ReactNode } from 'react'
import { DecisionGuide } from './DecisionGuide'
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
  tags?: readonly string[]
  href?: string
  imageUrl?: string
  imageAlt?: string
  whyRecommended?: string
  bestFor?: readonly string[]
  watchOut?: string
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

/**
 * A strip of tape holding a print to the journal page. Decorative: the card it
 * sits on already carries the accessible name.
 */
function TapeStrip() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-2 border-x border-white/40 bg-[#e5d6b4]/60 shadow-[0_1px_3px_rgba(36,26,18,0.18)]"
    />
  )
}

export function ExperienceCard({
  title,
  summary,
  eyebrow,
  tags = [],
  href,
  imageUrl,
  imageAlt = '',
  whyRecommended,
  bestFor = [],
  watchOut,
  className,
}: ExperienceCardProps) {
  const hasDecisionGuide = Boolean(whyRecommended && watchOut)

  return (
    <Card
      href={href}
      className={cn('rs-polaroid relative', className)}
      ariaLabel={href ? title : undefined}
    >
      <TapeStrip />
      {/* Paper mat on three sides; the text block below supplies the deep
          bottom margin, which is what makes the print read as a polaroid. */}
      <div className="p-3 pb-0">
        <div
          aria-label={!imageUrl ? imageAlt || undefined : undefined}
          className="relative flex aspect-[4/3] items-end overflow-hidden bg-[linear-gradient(135deg,var(--rs-sand-100),var(--color-accent-orange-pale)_55%,var(--rs-terracotta))] p-4"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-rs-ink/60 via-transparent to-transparent" />
          {eyebrow ? (
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/90">{eyebrow}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <h3 className="font-rs-display text-[clamp(1.25rem,2vw,1.375rem)] font-medium leading-tight text-rs-ink">{title}</h3>
        {hasDecisionGuide ? (
          <DecisionGuide
            whyRecommended={whyRecommended!}
            bestFor={bestFor}
            watchOut={watchOut!}
            compact
          />
        ) : (
          <p className="line-clamp-3 text-sm leading-6 text-rs-muted">{summary}</p>
        )}
        {!hasDecisionGuide && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-forest-700">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {href ? (
          <>
            <p className="pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-rs-terracotta-600">
              View experience
            </p>
            <span className="sr-only">Review details before partner handoff</span>
          </>
        ) : null}
      </div>
    </Card>
  )
}
