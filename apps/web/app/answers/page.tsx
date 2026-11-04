import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '../_components/JsonLd'
import { PublicSiteShell } from '../_components/PublicSiteShell'
import { TornEdge } from '../_components/design-system'
import {
  buildFaqPageSchema,
  groupAnswersByCity,
  latestAnswerReviewDate,
  thailandAnswers,
} from '@/lib/qa/thailandAnswers'

const base = 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'Thailand Trip Questions, Answered | RadarScout',
  description:
    'Short answers to the Thailand trip questions travelers actually ask — which day trip fits, which area to stay in, how to judge an elephant camp — each one taken from a reviewed guide.',
  alternates: { canonical: `${base}/answers` },
  openGraph: {
    title: 'Thailand Trip Questions, Answered | RadarScout',
    description:
      'Short answers to common Thailand trip questions, each taken from a reviewed RadarScout guide.',
    type: 'website',
    url: `${base}/answers`,
  },
}

export default function ThailandAnswersPage() {
  const grouped = groupAnswersByCity()
  const reviewedThrough = latestAnswerReviewDate()

  return (
    <PublicSiteShell>
      <JsonLd data={buildFaqPageSchema()} />
      <main className="bg-rs-sand-50 font-rs-body text-rs-ink">
        <header className="rs-paper relative bg-rs-forest-900 px-4 pb-20 pt-14 text-white sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
          <div className="relative mx-auto max-w-[1080px]">
            <nav aria-label="Breadcrumb" className="text-sm text-white/68">
              <Link href="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>Answers</span>
            </nav>

            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-rs-gold">
              Thailand questions
            </p>
            <h1 className="mt-5 max-w-3xl text-balance font-rs-display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
              The questions, answered short.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              Every answer below is the verdict from a guide someone reviewed by hand. Read the
              short version here, then open the guide for the reasoning and what to check.
            </p>

            {reviewedThrough ? (
              <p className="mt-9 inline-flex -rotate-[1.5deg] items-center border border-rs-gold/55 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-rs-gold">
                {thailandAnswers.length} answers · reviewed through {reviewedThrough}
              </p>
            ) : null}
          </div>

          <TornEdge tone="sand" className="absolute inset-x-0 bottom-0" />
        </header>

        <div className="mx-auto max-w-[1080px] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24">
          {grouped.length === 0 ? (
            <p className="mx-auto max-w-[46rem] text-[1.06rem] leading-[1.78] text-rs-ink/85">
              No reviewed answers are published yet.
            </p>
          ) : (
            <div className="mx-auto max-w-[46rem] space-y-14">
              {grouped.map(group => (
                <section key={group.cityName}>
                  <h2 className="font-rs-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-rs-ink">
                    {group.cityName}
                  </h2>

                  <dl className="mt-7 divide-y divide-rs-sage-200 border-y border-rs-sage-200">
                    {group.answers.map(answer => (
                      <div key={answer.id} className="py-7">
                        <dt className="font-rs-display text-[1.28rem] font-semibold leading-[1.25] tracking-[-0.015em] text-rs-ink">
                          {answer.question}
                        </dt>
                        <dd className="mt-3 text-[1.02rem] leading-[1.75] text-rs-ink/85">
                          {answer.answer}
                        </dd>
                        <dd className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                          <Link
                            href={answer.sourceHref}
                            className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-rs-forest-700 underline decoration-rs-gold/60 underline-offset-4 transition hover:text-rs-terracotta-600"
                          >
                            Read the full guide
                          </Link>
                          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-rs-muted">
                            Reviewed by {answer.reviewedBy}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          )}

          <section className="rs-paper relative mt-16 overflow-hidden rounded-rs-lg bg-rs-forest-900 px-8 py-10 text-white sm:px-10">
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rs-gold">
                Still deciding
              </p>
              <p className="mt-5 max-w-[30ch] font-rs-display text-[clamp(1.65rem,3.4vw,2.35rem)] font-semibold leading-[1.14]">
                Tell us the city and the days, and we will narrow it for you.
              </p>
              <Link
                href="/planner"
                className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-rs-pill bg-rs-terracotta px-7 text-sm font-bold text-white transition hover:bg-rs-terracotta-600"
              >
                Plan my Thailand days
              </Link>
            </div>
          </section>
        </div>
      </main>
    </PublicSiteShell>
  )
}
