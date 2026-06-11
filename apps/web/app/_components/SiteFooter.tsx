import Link from 'next/link'

const footerLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours' },
  { href: '/ai-trip-planner', label: 'AI Planner' },
  { href: 'mailto:hello@radarscout.io?subject=B%C3%B3kun%20Supplier%20Partnership%20Inquiry', label: 'Supplier partners' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_1.3fr_auto] md:items-start">
        <div>
          <p className="font-[var(--font-heading)] text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
            Radar<span className="text-[var(--color-accent-orange-dark)]">Scout</span>
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-[var(--color-text-secondary)]">
            AI-powered Destination DMC Portal for selected top travel destinations.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm font-semibold text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} RadarScout
        </p>
      </div>
    </footer>
  )
}
