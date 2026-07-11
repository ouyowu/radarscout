import Link from 'next/link'
import { publicNavLinks } from '../_content/publicSite'

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-light)] bg-rs-sand-50/95 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

        <div className="flex min-h-[72px] items-center justify-between">
          <Link href="/" className="font-rs-display text-2xl font-semibold tracking-[-0.04em] text-rs-ink">
            Radar<span className="text-rs-terracotta-600">Scout</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {publicNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-rs-muted transition hover:text-rs-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ai-trip-planner"
              className="inline-flex min-h-[46px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white"
            >
              Plan a day
            </Link>
          </div>

          <label
            htmlFor="nav-open"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-rs-pill border border-[var(--color-border-light)] bg-white px-4 text-rs-ink lg:hidden"
            aria-label="Open navigation menu"
          >
            <span className="text-sm font-semibold">Menu</span>
          </label>
        </div>

        <div className="hidden border-t border-[var(--color-border-light)] py-3 peer-checked:block lg:hidden">
          <div className="flex flex-col gap-1">
            {publicNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center rounded-rs-sm px-3 text-sm font-semibold text-rs-muted hover:bg-white hover:text-rs-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
