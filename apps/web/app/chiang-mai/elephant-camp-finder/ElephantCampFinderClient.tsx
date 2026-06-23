'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { scoreElephantCampProducts } from '@/lib/elephantFinder/scoreElephantCamp'
import type {
  ElephantCampProductProfile,
  ElephantFinderInput,
  ElephantFinderRecommendation,
} from '@/lib/elephantFinder/types'
import { ELEPHANT_FINDER_TITLE } from './copy'

export { ELEPHANT_FINDER_TITLE } from './copy'
export const COMING_SOON_TITLE = 'Chiang Mai Experience Finder is coming soon'
export const COMING_SOON_MESSAGE =
  'We’re connecting owner-managed Chiang Mai elephant, nature, and local experiences. Please browse our current Thailand experiences for now.'
export const COMING_SOON_CTA_LABEL = 'Browse Thailand experiences'
export const COMING_SOON_CTA_HREF = '/tours'

const hotelAreaOptions: { value: ElephantFinderInput['hotelArea']; label: string }[] = [
  { value: 'old_city', label: 'Old City' },
  { value: 'nimman', label: 'Nimman' },
  { value: 'riverside', label: 'Riverside' },
  { value: 'night_bazaar', label: 'Night Bazaar' },
  { value: 'mae_rim', label: 'Mae Rim' },
  { value: 'outside_city', label: 'Outside Chiang Mai' },
  { value: 'not_sure', label: 'Not sure' },
]

export function getInitialElephantFinderInput(): ElephantFinderInput {
  return {
    adults: 2,
    children: 0,
    hotelArea: 'not_sure',
    durationPreference: 'either',
    wantsFeeding: false,
    wantsBathing: false,
    wantsCloseInteraction: false,
    wantsElephantCare: false,
    wantsCookingOrFood: false,
    wantsNatureDayTrip: false,
    wantsGentleFamilyExperience: false,
    ethicalPriority: true,
    transferSensitivity: 'medium',
    budgetSensitivity: 'medium',
  }
}

export function updateElephantFinderInput(
  input: ElephantFinderInput,
  patch: Partial<ElephantFinderInput>,
): ElephantFinderInput {
  return { ...input, ...patch }
}

export function buildElephantFinderViewModel(params: {
  input: ElephantFinderInput
  profiles: ElephantCampProductProfile[]
  submitted: boolean
}): {
  emptyState: boolean
  showComingSoon: boolean
  recommendations: ElephantFinderRecommendation[]
} {
  if (!params.submitted) {
    return { emptyState: true, showComingSoon: false, recommendations: [] }
  }

  const recommendations = scoreElephantCampProducts(params)

  return {
    emptyState: false,
    showComingSoon: recommendations.length === 0,
    recommendations,
  }
}

type ElephantCampFinderClientProps = {
  profiles: ElephantCampProductProfile[]
}

function matchLabel(matchType: ElephantFinderRecommendation['matchType']) {
  if (matchType === 'best_match') return 'Best match for your group'
  if (matchType === 'family_friendly') return 'Good for families'
  if (matchType === 'best_value') return 'Best value alternative'
  return 'Alternative option'
}

function RecommendationCard({ recommendation }: { recommendation: ElephantFinderRecommendation }) {
  return (
    <article className="flex flex-col rounded-[1.5rem] border border-[#e8dfd2] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
        {matchLabel(recommendation.matchType)}
      </p>
      <h3 className="mt-2 text-xl font-black leading-tight text-[#101820]">
        {recommendation.title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-[#5a6670]">{recommendation.campName}</p>

      <ul className="mt-4 space-y-2">
        {recommendation.reasons.map(reason => (
          <li key={reason} className="text-sm font-semibold leading-6 text-[#36414a]">
            • {reason}
          </li>
        ))}
      </ul>

      {recommendation.cautionNotes.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {recommendation.cautionNotes.map(note => (
            <li key={note} className="text-xs font-semibold leading-5 text-[#a35c09]">
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
        {recommendation.externalHandoff ? (
          <a
            href={recommendation.ctaHref}
            rel={recommendation.linkRel}
            target="_blank"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
          >
            {recommendation.ctaLabel}
          </a>
        ) : (
          <Link
            href={recommendation.ctaHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
          >
            {recommendation.ctaLabel}
          </Link>
        )}
      </div>
    </article>
  )
}

export function ElephantCampFinderClient({ profiles }: ElephantCampFinderClientProps) {
  const [input, setInput] = useState<ElephantFinderInput>(() => getInitialElephantFinderInput())
  const [submitted, setSubmitted] = useState(false)

  const view = buildElephantFinderViewModel({ input, profiles, submitted })

  function patchInput(patch: Partial<ElephantFinderInput>) {
    setInput(current => updateElephantFinderInput(current, patch))
    if (submitted) setSubmitted(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.5rem] border border-[#ded7ca] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.06)]"
      >
        <h2 className="text-xl font-black text-[#101820]">Tell us about your group</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-black text-[#36414a]">
            Number of adults
            <input
              type="number"
              min={1}
              value={input.adults}
              onChange={event => patchInput({ adults: Number(event.target.value) })}
              className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
            />
          </label>
          <label className="text-sm font-black text-[#36414a]">
            Number of children
            <input
              type="number"
              min={0}
              value={input.children}
              onChange={event => patchInput({ children: Number(event.target.value) })}
              className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-black text-[#36414a]">
          Hotel area
          <select
            value={input.hotelArea}
            onChange={event => patchInput({ hotelArea: event.target.value as ElephantFinderInput['hotelArea'] })}
            className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
          >
            {hotelAreaOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm font-black text-[#36414a]">Experience preferences</legend>
          <div className="mt-3 grid gap-3">
            {[
              ['wantsFeeding', 'Feeding elephants'],
              ['wantsBathing', 'Bathing elephants'],
              ['wantsCloseInteraction', 'More hands-on interaction'],
              ['wantsElephantCare', 'Elephant care experience'],
              ['wantsNatureDayTrip', 'Nature / mountain day trip'],
              ['wantsCookingOrFood', 'Cooking / local food experience'],
              ['wantsGentleFamilyExperience', 'Gentle family-friendly experience'],
              ['ethicalPriority', 'Ethical / no riding'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 text-sm font-semibold text-[#36414a]">
                <input
                  type="checkbox"
                  checked={Boolean(input[key as keyof ElephantFinderInput])}
                  onChange={event => patchInput({ [key]: event.target.checked } as Partial<ElephantFinderInput>)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4">
          <label className="text-sm font-black text-[#36414a]">
            Duration preference
            <select
              value={input.durationPreference}
              onChange={event => patchInput({ durationPreference: event.target.value as ElephantFinderInput['durationPreference'] })}
              className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
            >
              <option value="either">Either</option>
              <option value="half_day">Half day</option>
              <option value="full_day">Full day</option>
            </select>
          </label>

          <label className="text-sm font-black text-[#36414a]">
            Transfer sensitivity
            <select
              value={input.transferSensitivity}
              onChange={event => patchInput({ transferSensitivity: event.target.value as ElephantFinderInput['transferSensitivity'] })}
              className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="text-sm font-black text-[#36414a]">
            Budget sensitivity
            <select
              value={input.budgetSensitivity}
              onChange={event => patchInput({ budgetSensitivity: event.target.value as ElephantFinderInput['budgetSensitivity'] })}
              className="mt-2 w-full border border-[#ded7ca] bg-[#fffdf7] px-3 py-3 font-semibold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#0f766e] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#115e59]"
        >
          Get my match
        </button>
      </form>

      <section className="rounded-[1.5rem] border border-[#d8eadf] bg-[#f5fbf7] p-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0f766e]">
          Your recommendation
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
          Best Chiang Mai experience matches
        </h2>

        {view.emptyState ? (
          <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
            Answer the questions, then click Get my match to compare Chiang Mai experiences.
          </p>
        ) : view.showComingSoon ? (
          <div className="mt-5 rounded-[1rem] border border-[#f3d6aa] bg-[#fff8e8] p-4">
            <p className="text-sm font-black text-[#a35c09]">{COMING_SOON_TITLE}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b5d4d]">
              {COMING_SOON_MESSAGE}
            </p>
            <Link
              href={COMING_SOON_CTA_HREF}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
            >
              {COMING_SOON_CTA_LABEL}
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {view.recommendations.map(recommendation => (
              <RecommendationCard key={recommendation.recommendationId} recommendation={recommendation} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
