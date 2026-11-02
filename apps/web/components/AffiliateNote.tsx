import React from 'react'

type AffiliateNoteProps = {
  className?: string
  compact?: boolean
}

export function AffiliateNote({ className, compact = false }: AffiliateNoteProps) {
  return (
    <p className={`mt-2 text-xs ${className ?? 'text-gray-500'}`}>
      {compact ? (
        <a href="/affiliate-disclosure" className="underline">
          We may earn a commission. How we make money
        </a>
      ) : (
        <>
          We may earn a commission if you book through this link, at no extra cost to you.{' '}
          <a href="/affiliate-disclosure" className="underline">How we make money</a>
        </>
      )}
    </p>
  )
}
