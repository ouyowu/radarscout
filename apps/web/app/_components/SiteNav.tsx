import Link from 'next/link'

const links = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours' },
  { href: '/ai-trip-planner', label: 'AI Planner' },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary)]/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

        <div className="flex min-h-16 items-center justify-between">
          <Link href="/" className="font-[var(--font-heading)] text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
            Radar<span className="text-[var(--color-accent-orange-dark)]">Scout</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-black uppercase tracking-[0.08em] text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ai-trip-planner"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[var(--color-accent-orange-dark)]"
            >
              Start planning
            </Link>
          </div>

          <label
            htmlFor="nav-open"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[var(--color-border-light)] bg-white text-[var(--color-text-primary)] lg:hidden"
            aria-label="Open navigation menu"
          >
            <span className="text-sm font-black uppercase tracking-[0.08em]">Menu</span>
          </label>
        </div>

        <div className="hidden border-t border-[var(--color-border-light)] py-3 peer-checked:block lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center rounded-2xl px-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--color-text-secondary)] hover:bg-white"
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
