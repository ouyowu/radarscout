import Link from 'next/link'
import { publicFooterGroups } from '../_content/publicSite'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-light)] bg-rs-sand-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_1.3fr_auto] md:items-start">
        <div>
          <p className="font-rs-display text-2xl font-semibold tracking-[-0.04em] text-rs-ink">
            Radar<span className="text-rs-terracotta-600">Scout</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-rs-muted">
            Personalized Thailand day-trip discovery with safe booking partner handoff.
          </p>
        </div>

        <nav className="grid gap-5 sm:grid-cols-3" aria-label="Footer navigation">
          {publicFooterGroups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rs-ink">
                {group.label}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-rs-muted transition hover:text-rs-terracotta-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <p className="text-sm text-rs-muted">
          © {new Date().getFullYear()} RadarScout
        </p>
      </div>
    </footer>
  )
}
