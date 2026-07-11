import Link from 'next/link'
import React, { type ReactNode } from 'react'
import { cn } from './utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-rs-terracotta text-rs-ink shadow-rs-soft hover:bg-rs-terracotta-600 hover:text-white',
  secondary:
    'border border-rs-forest-500 bg-transparent text-rs-forest-700 hover:bg-rs-sand-100',
  ghost:
    'text-rs-forest-700 underline-offset-4 hover:underline',
}

export function Button({
  children,
  variant = 'primary',
  className,
  href,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'inline-flex min-h-[52px] items-center justify-center rounded-rs-pill px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta',
    variantClasses[variant],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
