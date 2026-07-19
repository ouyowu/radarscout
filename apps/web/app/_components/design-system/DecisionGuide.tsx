import React from 'react'
import { cn } from './utils'

type DecisionGuideProps = {
  whyRecommended: string
  bestFor: readonly string[]
  watchOut: string
  compact?: boolean
  className?: string
}

export function DecisionGuide({
  whyRecommended,
  bestFor,
  watchOut,
  compact = false,
  className,
}: DecisionGuideProps) {
  return (
    <div
      aria-label="Traveler decision guide"
      className={cn('grid gap-3', compact ? '' : 'md:grid-cols-3 md:gap-5', className)}
    >
      <div className="rounded-rs-sm bg-rs-sand-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-forest-500">
          Why recommended
        </p>
        <p className="mt-2 text-sm leading-6 text-rs-muted">{whyRecommended}</p>
      </div>
      <div className="rounded-rs-sm bg-[#f3fbf9] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-trust">
          Best for
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {bestFor.map(item => (
            <span
              key={item}
              className="rounded-rs-pill bg-white px-3 py-1 text-xs font-semibold text-rs-forest-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-rs-sm bg-[#fff3ee] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-terracotta-600">
          Before you choose
        </p>
        <p className="mt-2 text-sm leading-6 text-rs-muted">{watchOut}</p>
      </div>
    </div>
  )
}
