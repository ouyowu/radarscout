import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function PublicSiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-rs-sand-50 text-rs-ink">
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  )
}
