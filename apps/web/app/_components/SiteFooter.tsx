import Link from 'next/link'
import { publicFooterGroups } from '../_content/publicSite'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_1.3fr_auto] md:items-start">
        <div>
          <p className="font-[var(--font-heading)] text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)]">
            Radar<span className="text-[var(--color-accent-orange-dark)]">Scout</span>
          </p>
          <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-[var(--color-text-secondary)]">
            Personalized Thailand day-trip discovery with safe booking partner handoff.
          </p>
        </div>

        <nav className="grid gap-5 sm:grid-cols-3" aria-label="Footer navigation">
          {publicFooterGroups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-primary)]">
                {group.label}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-orange-dark)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <p className="text-sm font-semibold text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} RadarScout
        </p>
      </div>
    </footer>
  )
}
