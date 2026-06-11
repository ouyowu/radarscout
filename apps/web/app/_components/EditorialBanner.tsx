import Link from 'next/link'
import { ScriptLabel } from './ScriptLabel'

type EditorialBannerProps = {
  label: string
  title: string
  body: string
  href?: string
  ctaLabel?: string
}

export function EditorialBanner({ label, title, body, href, ctaLabel = 'Read more' }: EditorialBannerProps) {
  return (
    <section className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-white p-6 shadow-xl md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <ScriptLabel>{label}</ScriptLabel>
          <h2 className="mt-3 max-w-3xl font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{body}</p>
        </div>
        {href ? (
          <Link href={href} className="inline-flex min-h-[44px] items-center justify-center bg-[var(--color-accent-orange)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
