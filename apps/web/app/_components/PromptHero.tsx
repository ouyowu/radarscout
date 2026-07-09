'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics/track'
import { buildIdeaHref, exampleChips } from './promptHero.helpers'

/**
 * Prompt-first homepage hero. The very first thing a visitor sees is an input:
 * describe your ideal Thailand day, and continue into the planner with that idea
 * prefilled. Honest framing — personalized matching over a reviewed set, no
 * unsupported commerce claim.
 */
export function PromptHero() {
  const router = useRouter()
  const [idea, setIdea] = useState('')

  function go(nextIdea: string, source: string) {
    track('homepage_finder_entry_clicked', { source })
    router.push(buildIdeaHref(nextIdea))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    go(idea, 'hero_prompt')
  }

  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-dark)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f241c_0%,#1b4638_54%,#3a2a17_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:26px_26px]" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--color-accent-orange)]">
          Thailand, thoughtfully planned
        </p>

        <h1 className="mx-auto mt-5 max-w-3xl font-[var(--font-heading)] text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl">
          Tell us your ideal Thailand day. We match it to real, reviewed experiences.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-white/80 sm:text-lg">
          Describe the trip you want — elephants, food, nature, family days, city time — and
          compare hand-picked Thailand experiences, then continue with a trusted booking partner.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label htmlFor="hero-trip-idea" className="sr-only">
            Describe your ideal Thailand trip
          </label>
          <input
            id="hero-trip-idea"
            name="idea"
            type="text"
            value={idea}
            onChange={event => setIdea(event.target.value)}
            placeholder="e.g. Gentle elephant day in Chiang Mai with cooking and nature"
            className="min-h-[56px] w-full flex-1 rounded-full border border-white/15 bg-white px-6 text-base font-semibold text-[var(--color-text-primary)] shadow-2xl outline-none placeholder:text-[var(--color-text-secondary)] focus:ring-4 focus:ring-white/40"
          />
          <button
            type="submit"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-8 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[var(--color-accent-orange-dark)]"
          >
            Plan my trip
          </button>
        </form>

        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">Try</span>
          {exampleChips.map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => go(chip, 'hero_chip')}
              className="inline-flex min-h-[38px] items-center rounded-full border border-white/20 bg-white/10 px-4 text-sm font-bold text-white/90 transition hover:bg-white/20"
            >
              {chip}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-xs font-bold uppercase tracking-[0.12em] text-white/55">
          Thailand-first · Personalized matching · Trusted booking partner handoff
        </p>
      </div>
    </section>
  )
}
