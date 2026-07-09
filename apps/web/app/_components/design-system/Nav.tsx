import Link from 'next/link'
import React, { type ReactNode } from 'react'
import { Button } from './Button'
import { cn } from './utils'

type NavLink = {
  href: string
  label: string
}

type NavProps = {
  logo: ReactNode
  links: NavLink[]
  cta?: NavLink
  className?: string
}

export function Nav({ logo, links, cta, className }: NavProps) {
  return (
    <header className={cn('sticky top-0 z-50 border-b border-white/10 bg-rs-forest-700 text-white shadow-rs-soft', className)}>
      <nav className="mx-auto flex min-h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="font-rs-display text-2xl font-semibold">{logo}</div>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta"
            >
              {link.label}
            </Link>
          ))}
          {cta ? (
            <Button href={cta.href} className="min-h-[44px] px-5">
              {cta.label}
            </Button>
          ) : null}
        </div>
        <span className="rounded-rs-pill border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 md:hidden">
          Menu
        </span>
      </nav>
    </header>
  )
}
