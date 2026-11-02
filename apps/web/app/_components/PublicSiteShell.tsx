import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function PublicSiteShell({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={`min-h-screen bg-rs-sand-50 text-rs-ink${className ? ` ${className}` : ''}`}>
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  )
}
