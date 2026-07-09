import React, { type ReactNode } from 'react'
import { cn } from './utils'

type SectionVariant = 'sand' | 'cloud' | 'forest'

type SectionProps = {
  children: ReactNode
  variant?: SectionVariant
  eyebrow?: string
  title?: string
  lead?: string
  className?: string
  contentClassName?: string
}

const variantClasses: Record<SectionVariant, string> = {
  sand: 'bg-rs-sand-50 text-rs-ink',
  cloud: 'bg-rs-cloud text-rs-ink',
  forest: 'bg-rs-forest-900 text-white',
}

export function Section({
  children,
  variant = 'sand',
  eyebrow,
  title,
  lead,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn('py-16 sm:py-24 lg:py-32', variantClasses[variant], className)}>
      <div className={cn('mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8', contentClassName)}>
        {eyebrow || title || lead ? (
          <div className="mb-10 max-w-3xl">
            {eyebrow ? (
              <p className={cn('text-xs font-semibold uppercase tracking-[0.18em]', variant === 'forest' ? 'text-rs-sage-200' : 'text-rs-forest-500')}>
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-3 font-rs-display text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
                {title}
              </h2>
            ) : null}
            {lead ? (
              <p className={cn('mt-5 text-lg leading-8', variant === 'forest' ? 'text-white/78' : 'text-rs-muted')}>
                {lead}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
