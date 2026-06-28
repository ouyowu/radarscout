import React from 'react'

export type PartnerInterestPageContent = {
  eyebrow: string
  headline: string
  intro: string
  audience: string[]
  helps: string[]
  doesNotReplace: string[]
  intake: string[]
  reviewNote: string
  ctaLabel: string
  ctaHref: string
}

type PartnerInterestPageProps = {
  content: PartnerInterestPageContent
}

function CardList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--color-border-light)] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.06)]">
      <h2 className="font-[var(--font-heading)] text-2xl font-black tracking-[-0.025em] text-[var(--color-text-primary)]">
        {title}
      </h2>
      <ul className="mt-4 space-y-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
        {items.map(item => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-orange)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function PartnerInterestPage({ content }: PartnerInterestPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <section className="relative overflow-hidden bg-[var(--color-bg-dark)] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,153,51,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#ffd5ad]">
            {content.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-[var(--font-heading)] text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/78 sm:text-lg">
            {content.intro}
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-white/12 bg-white/8 p-4 text-sm font-semibold leading-7 text-white/74">
            {content.reviewNote}
          </p>
          <a
            href={content.ctaHref}
            className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-accent-orange-dark)]"
          >
            {content.ctaLabel}
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <CardList title="Who it is for" items={content.audience} />
        <CardList title="How RadarScout helps" items={content.helps} />
        <CardList title="What we do not replace" items={content.doesNotReplace} />
        <CardList title="What we need to start" items={content.intake} />
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[1.75rem] border border-[var(--color-border-light)] bg-white p-6 shadow-[0_12px_28px_rgba(17,24,39,0.06)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-accent-orange-dark)]">
              Manual collaboration first
            </p>
            <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-black tracking-[-0.035em]">
              Start with a short partner conversation.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
              These pages collect interest only. RadarScout does not add a portal, traveler account, or booking engine in this step.
            </p>
          </div>
          <a
            href={content.ctaHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-bg-dark)] px-6 text-sm font-black uppercase tracking-[0.1em] text-white"
          >
            {content.ctaLabel}
          </a>
        </div>
      </section>
    </main>
  )
}
