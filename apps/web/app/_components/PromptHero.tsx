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
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffaf5_0%,#fff3ee_55%,#feeabf_145%)] text-rs-ink">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#f9ab00]/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-rs-trust/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-rs-pill border border-rs-sage-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rs-forest-700 shadow-sm">
            Curated Viator shortlist · Thailand day trips
          </p>

          <h1 className="mt-6 max-w-3xl font-rs-display text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-rs-ink">
            Tell us your ideal Thailand day. We narrow it to real, reviewed Viator experiences.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-rs-muted">
            We narrow the options before you compare, then explain why each match fits, who it suits, and what to check before you choose.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label htmlFor="hero-trip-idea" className="sr-only">
              Describe your ideal Thailand trip
            </label>
            <input
              id="hero-trip-idea"
              name="idea"
              type="text"
              value={idea}
              onChange={event => setIdea(event.target.value)}
              placeholder="e.g. Gentle elephant and cooking day in Chiang Mai"
              className="min-h-[60px] w-full flex-1 rounded-rs-pill border border-[var(--color-border-light)] bg-white px-6 text-base font-semibold text-rs-ink shadow-rs-soft outline-none placeholder:text-rs-muted focus:border-rs-trust focus:ring-4 focus:ring-rs-trust/15"
            />
            <button
              type="submit"
              className="inline-flex min-h-[60px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-8 text-sm font-bold text-rs-ink shadow-rs-soft transition hover:bg-rs-terracotta-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rs-terracotta-600"
            >
              Plan my trip
            </button>
          </form>

          <div className="mt-5 flex max-w-2xl flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-rs-muted">Popular ideas</span>
            {exampleChips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => go(chip, 'hero_chip')}
                className="inline-flex min-h-[40px] items-center rounded-rs-pill border border-[var(--color-border-light)] bg-white/80 px-4 text-sm font-semibold text-rs-ink transition hover:border-rs-terracotta hover:bg-white"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-rs-forest-700">
            <span>✓ Hand-reviewed shortlist</span>
            <span>✓ Clear reasons to choose</span>
            <span>✓ Verified Viator handoff</span>
          </div>
          <p className="sr-only">Thailand-first · Personalized matching · Trusted booking partner handoff</p>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-5 rotate-2 rounded-[2.5rem] bg-rs-terracotta/15" />
          <div className="relative rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-[0_24px_60px_rgba(45,52,54,0.12)] sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border-light)] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rs-trust">Your day, structured</p>
                <h2 className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">From one idea to clear choices</h2>
              </div>
              <span className="rounded-rs-pill bg-rs-sand-100 px-3 py-1 text-xs font-semibold text-rs-muted">3 steps</span>
            </div>
            <ol className="mt-6 space-y-4">
              {[
                ['1', 'Share the day you want', 'City, interests, pace, group, and preferences'],
                ['2', 'Review the trip brief', 'See what RadarScout understood before matching'],
                ['3', 'Compare real experiences', 'Open details, then check with the booking partner'],
              ].map(([number, title, body]) => (
                <li key={number} className="flex gap-4 rounded-rs-md bg-rs-sand-50 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rs-terracotta text-sm font-bold text-rs-ink">{number}</span>
                  <div>
                    <p className="font-semibold text-rs-ink">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-rs-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
