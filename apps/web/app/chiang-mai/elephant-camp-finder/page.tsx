import type { Metadata } from 'next'
import { ElephantCampFinderClient } from './ElephantCampFinderClient'
import { ELEPHANT_FINDER_INTRO_COPY, ELEPHANT_FINDER_TITLE } from './copy'
import { elephantCampProfiles } from '@/lib/elephantFinder/elephantCampProfiles'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: `${ELEPHANT_FINDER_TITLE} | RadarScout`,
  description:
    'Answer a few quick questions and match with owner-managed Chiang Mai elephant, nature, and local experiences.',
  alternates: { canonical: `${base}/chiang-mai/elephant-camp-finder` },
  robots: { index: false, follow: false },
}

export default function ChiangMaiElephantCampFinderPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f3] text-[#111827]">
      <section className="relative overflow-hidden bg-[#1E2D59] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,124,72,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8d7bf]">
            Chiang Mai Experience Finder
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
            {ELEPHANT_FINDER_TITLE}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Answer a few quick questions and we’ll match you with owner-managed Chiang Mai elephant, nature, and local experiences.
          </p>
          <a
            href="#elephant-finder"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#D57C48] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c66b37]"
          >
            Start matching
          </a>
        </div>
      </section>

      <section id="elephant-finder" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
            Rule-based MVP
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#101820]">
            Match first, then choose your experience
          </h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#5a6670]">
            {ELEPHANT_FINDER_INTRO_COPY}
          </p>
        </div>

        <ElephantCampFinderClient profiles={elephantCampProfiles} />
      </section>
    </main>
  )
}
