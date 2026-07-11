import Link from 'next/link'
import { ScriptLabel } from './ScriptLabel'
import { TrackedLink } from './TrackedLink'
import type { FunnelEvent, FunnelEventProps } from '@/lib/analytics/track'

type HeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
  analytics?: {
    event: FunnelEvent
    props?: FunnelEventProps
  }
}

type AdventureHeroProps = {
  eyebrow?: string
  title: string
  subtitle: string
  actions?: HeroAction[]
  imageUrl?: string
  imageAlt?: string
  trustNote?: string
}

export function AdventureHero({
  eyebrow = 'Thoughtful travel planning',
  title,
  subtitle,
  actions = [],
  imageUrl,
  imageAlt = '',
  trustNote,
}: AdventureHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffaf5_0%,#fff3ee_70%,#feeabf_150%)] px-4 py-14 text-rs-ink sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-rs-trust/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div>
          <ScriptLabel>{eyebrow}</ScriptLabel>
          <h1 className="mt-4 max-w-4xl font-rs-display text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-rs-muted">
            {subtitle}
          </p>
          {actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map(action => {
                const className = action.variant === 'secondary'
                  ? 'inline-flex min-h-[52px] items-center justify-center rounded-rs-pill border border-rs-forest-500 bg-white px-7 text-sm font-semibold text-rs-forest-700'
                  : 'inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-rs-ink transition hover:bg-rs-terracotta-600 hover:text-white'

                return action.analytics ? (
                  <TrackedLink
                    key={action.href}
                    href={action.href}
                    event={action.analytics.event}
                    eventProps={action.analytics.props}
                    className={className}
                  >
                    {action.label}
                  </TrackedLink>
                ) : (
                  <Link key={action.href} href={action.href} className={className}>
                    {action.label}
                  </Link>
                )
              })}
            </div>
          ) : null}
          {trustNote ? (
            <p className="mt-5 rounded-rs-sm border border-rs-sage-200 bg-white/75 px-4 py-3 text-sm font-semibold leading-6 text-rs-forest-700">
              {trustNote}
            </p>
          ) : null}
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-rs-lg border border-[var(--color-border-light)] bg-rs-sand-100 shadow-rs-soft">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-end bg-[linear-gradient(135deg,#feeabf,#fff3ee_55%,#2a9d8f)] p-8">
              <p className="max-w-sm font-rs-display text-4xl font-semibold leading-none text-rs-ink">
                Curated local experiences, not endless listings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
