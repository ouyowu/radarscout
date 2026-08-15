import React from 'react'
import Link from 'next/link'

import { thailandGuideArticles } from '@/lib/guides/thailandGuides'

/**
 * Prints taped onto the journal page, each carrying the reviewer's own
 * one-line verdict. The copy is the guide's real takeaway and reviewer — this
 * section never invents a quote.
 *
 * `photo` is the slot for a real photograph. Until one exists the print falls
 * back to a scene, so the row is never a set of holes. To add a picture, drop
 * the file in `public/images/guides/` and map it by slug below.
 */
const PHOTO_BY_SLUG: Record<string, string> = {
  // 'old-city-vs-nimman-where-to-stay': '/images/guides/chiang-mai-nimman.jpg',
}

const SCENES = [
  { from: '#2A2036', via: '#7E4436', to: '#D68B45' },
  { from: '#20301F', via: '#4C5C2E', to: '#C89A44' },
  { from: '#181C2E', via: '#5B3350', to: '#C9603F' },
] as const

function PrintScene({ index }: { index: number }) {
  const s = SCENES[index % SCENES.length]
  const id = `note-scene-${index}`

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.from} />
          <stop offset="0.55" stopColor={s.via} />
          <stop offset="1" stopColor={s.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />
      <circle cx="292" cy="198" r="24" fill="#F6D08A" opacity="0.85" />
      <path fill="#1A1118" d="M0,300 L0,236 L54,218 L108,234 L150,200 L164,170 L178,200 L228,226 L292,208 L344,230 L400,212 L400,300 Z" />
      <path fill="#120C12" d="M0,300 L0,270 L72,256 L146,272 L220,252 L300,270 L400,250 L400,300 Z" />
    </svg>
  )
}

export function FieldNotes() {
  const notes = thailandGuideArticles.slice(0, 3)
  if (notes.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-rs-forest-900 px-4 pb-20 pt-4 text-white sm:px-6 sm:pb-28 lg:px-8">
      <div className="rs-paper pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
        <div className="lg:pt-10">
          <h2 className="font-rs-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Field<br />Notes
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-24 rounded-full bg-rs-terracotta" />
          <p className="mt-6 max-w-[32ch] text-base leading-8 text-white/74">
            Every guide carries the verdict of the person who looked, in their own words —
            not a score averaged out of strangers.
          </p>
          <Link
            href="/guides"
            className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-rs-pill bg-rs-terracotta px-6 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-rs-terracotta-600"
          >
            Read the guides
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="grid gap-7 sm:grid-cols-3 sm:gap-5">
          {notes.map((article, index) => {
            const photo = PHOTO_BY_SLUG[article.slug]

            return (
              <li key={article.slug} className="rs-polaroid relative">
                <Link
                  href={article.href}
                  className="relative block bg-rs-sand-50 p-2.5 pb-5 text-rs-ink shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-shadow duration-300 hover:shadow-[0_26px_56px_rgba(0,0,0,0.55)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2.5 left-1/2 h-6 w-[88px] -translate-x-1/2 -rotate-2 border-x border-white/40 bg-[#e5d6b4]/60 shadow-[0_1px_3px_rgba(36,26,18,0.2)]"
                  />
                  <span className="relative block aspect-[4/3] overflow-hidden bg-rs-ink">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    ) : (
                      <PrintScene index={index} />
                    )}
                  </span>
                  <span className="mt-3.5 block px-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-rs-muted">
                    {article.cityName}
                  </span>
                  <span className="rs-script mt-1.5 block px-1.5 text-[1.15rem] leading-[1.4] text-rs-ink">
                    {article.takeaway}
                  </span>
                  <span className="mt-3.5 block px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-rs-muted">
                    {article.reviewedBy}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
