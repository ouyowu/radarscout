'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics/track'
import { TornEdge } from './design-system'
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
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] overflow-hidden bg-[#101817] text-white">
      <Image
        src="/images/thailand-planner-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none -z-30 object-cover object-[62%_center] sm:object-center"
      />
      {/* Warm brown-black scrims rather than the previous cold green-black: the
          photograph is a gold sunset, and a cool overlay fought it. Lighter on
          the right so the temple and the sun stay legible behind the copy. */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#1c110a]/15" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(24,14,8,0.9)_0%,rgba(24,14,8,0.68)_38%,rgba(24,14,8,0.16)_66%,rgba(24,14,8,0.34)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(18,10,6,0.8)_0%,transparent_46%,rgba(18,10,6,0.12)_100%)]" />

      {/* The page is a field journal; the hero photograph is pasted onto it. */}
      <TornEdge tone="sand" className="absolute inset-x-0 bottom-0 z-10" />

      <div className="mx-auto flex w-full max-w-[1240px] items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="w-full max-w-4xl">
          <p className="inline-flex rounded-rs-pill border border-white/25 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f0c98a] shadow-sm backdrop-blur-sm">
            Curated Viator shortlist · Thailand day trips
          </p>

          <h1 className="mt-7 max-w-4xl text-balance font-rs-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white [text-shadow:0_3px_28px_rgba(0,0,0,0.45)]">
            Your Thailand day,{' '}
            <span className="rs-script text-[1.12em] font-medium tracking-[0.01em] text-[#e8a23c]">
              planned around you.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            We narrow the options before you compare—then explain why each match fits, who it suits, and what to check.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-9 flex max-w-3xl flex-col gap-3 rounded-[1.75rem] border border-white/20 bg-black/25 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-md sm:flex-row"
          >
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
              className="min-h-[60px] w-full flex-1 rounded-rs-pill border border-white/80 bg-white px-6 text-base font-semibold text-rs-ink shadow-rs-soft outline-none placeholder:text-rs-muted focus:border-[#e8a23c] focus:ring-4 focus:ring-[#e8a23c]/20"
            />
            <button
              type="submit"
              className="inline-flex min-h-[60px] items-center justify-center rounded-rs-pill bg-[#e8a23c] px-8 text-sm font-bold text-[#241a12] shadow-rs-soft transition hover:bg-[#f5bd63] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0c98a]"
            >
              Plan my trip
            </button>
          </form>

          <div className="mt-5 flex max-w-3xl flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Popular ideas</span>
            {exampleChips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => go(chip, 'hero_chip')}
                className="inline-flex min-h-[40px] items-center rounded-rs-pill border border-white/25 bg-black/25 px-4 text-sm font-semibold text-white transition hover:border-[#e8a23c] hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c98a]"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-6 text-sm font-semibold text-white/85">
            <span>✓ Hand-reviewed shortlist</span>
            <span>✓ Clear reasons to choose</span>
            <span>✓ Verified Viator handoff</span>
          </div>
          <p className="sr-only">Thailand-first · Personalized matching · Trusted booking partner handoff</p>
        </div>
      </div>
    </section>
  )
}
