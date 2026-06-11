import Link from 'next/link'
import { ScriptLabel } from './ScriptLabel'

type HeroAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
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
  eyebrow = 'AI-powered Destination DMC Portal',
  title,
  subtitle,
  actions = [],
  imageUrl,
  imageAlt = '',
  trustNote,
}: AdventureHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-secondary)] px-4 py-16 text-[var(--color-text-primary)] sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(26,26,26,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div>
          <ScriptLabel>{eyebrow}</ScriptLabel>
          <h1 className="mt-4 max-w-4xl font-[var(--font-heading)] text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
          {actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.variant === 'secondary'
                      ? 'inline-flex min-h-[44px] items-center justify-center border border-[var(--color-text-primary)] bg-white px-7 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text-primary)]'
                      : 'inline-flex min-h-[44px] items-center justify-center bg-[var(--color-accent-orange)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[var(--color-accent-orange-dark)]'
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
          {trustNote ? (
            <p className="mt-5 border-l-4 border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-pale)] px-4 py-3 text-sm font-bold leading-6 text-[#7c4a03]">
              {trustNote}
            </p>
          ) : null}
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-[var(--color-bg-muted)] shadow-2xl">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={imageAlt} className="h-full min-h-[320px] w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[320px] items-end bg-[linear-gradient(135deg,#1a1a1a,#4a7c59_55%,#ff9933)] p-8">
              <p className="max-w-sm font-[var(--font-heading)] text-5xl font-black leading-none text-white">
                Curated local experiences, not endless listings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
