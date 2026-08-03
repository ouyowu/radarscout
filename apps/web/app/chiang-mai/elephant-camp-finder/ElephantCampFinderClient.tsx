'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics/track'
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
export const BATHING_HELPER_NOTE =
  'We only highlight bathing when it is clearly listed by the booking partner.'
export const OPTION_ROW_CLASS =
  'flex min-h-[44px] items-center gap-3 rounded-[0.9rem] border border-[#eadfce] bg-[#fffdf7] px-3 py-2 text-sm font-semibold leading-5 text-[#36414a]'
export const FORM_SECTION_CLASS =
  'rounded-[1.1rem] border border-[#eadfce] bg-[#fffdf7] p-4'
export const CHAT_PLANNER_TITLE = 'Plan with RadarScout'
export const CHIANG_MAI_PLANNER_SECTION_ID = 'plan-with-radarscout'
export const CHAT_PLANNER_HELPER =
  'Start with your travel style, choose your pace, then see matching experiences.'
export const CHAT_PLANNER_CHIP_CLASS =
  'inline-flex min-h-[44px] items-center rounded-full px-4 text-xs font-black uppercase tracking-[0.08em]'
export const CHAT_PLANNER_SUBMIT_LABEL = 'See matching experiences'
export const FINE_TUNE_DETAILS_TITLE = 'Fine-tune details'
export const FINE_TUNE_DETAILS_HELPER =
  'Adjust group size, hotel area, and specific preferences if you want a more precise match.'
export const ITINERARY_SUMMARY_CARD_CLASS =
  'rounded-[1.25rem] border border-[#d8eadf] bg-white p-3 sm:p-4'
export const ITINERARY_SUMMARY_SEGMENTS_CLASS = 'mt-3 grid gap-2 sm:mt-4 sm:gap-3'
export const ITINERARY_SUMMARY_SEGMENT_CLASS = 'rounded-[1rem] bg-[#f8f4ea] p-2.5 sm:p-3'
export const RECOMMENDATION_RESULTS_CLASS = 'mt-4 grid gap-3 sm:mt-5 sm:gap-4'

type ChatPlannerStep = {
  id: string
  question: string
  multiSelect?: boolean
  options: {
    id: string
    label: string
    patch: Partial<ElephantFinderInput>
  }[]
}

type ItinerarySummary = {
  title: string
  summary: string
  segments: {
    label: 'Morning' | 'Midday' | 'Afternoon'
    text: string
  }[]
}

export const CHAT_PLANNER_STEPS: ChatPlannerStep[] = [
  {
    id: 'style',
    question: 'What kind of Chiang Mai day are you planning?',
    options: [
      {
        id: 'gentle-elephant',
        label: 'Gentle elephant day',
        patch: {
          wantsElephantCare: true,
          wantsGentleFamilyExperience: true,
          wantsNatureDayTrip: false,
          wantsCookingOrFood: false,
          ethicalPriority: true,
        },
      },
      {
        id: 'family-half-day',
        label: 'Family-friendly half day',
        patch: {
          adults: 2,
          children: 1,
          durationPreference: 'half_day',
          wantsGentleFamilyExperience: true,
          wantsElephantCare: true,
        },
      },
      {
        id: 'cooking-food',
        label: 'Cooking + local food',
        patch: {
          wantsCookingOrFood: true,
          wantsNatureDayTrip: false,
          wantsElephantCare: false,
        },
      },
      {
        id: 'nature-day',
        label: 'Nature day trip',
        patch: {
          wantsNatureDayTrip: true,
          wantsCookingOrFood: false,
          durationPreference: 'full_day',
        },
      },
      {
        id: 'low-intensity',
        label: 'Low-intensity experience',
        patch: { wantsGentleFamilyExperience: true, transferSensitivity: 'high' },
      },
      {
        id: 'photo-friendly',
        label: 'Photo-friendly experience',
        patch: { wantsCloseInteraction: true },
      },
    ],
  },
  {
    id: 'group',
    question: 'Who are you traveling with?',
    options: [
      { id: 'solo', label: 'Solo', patch: { adults: 1, children: 0 } },
      { id: 'couple', label: 'Couple', patch: { adults: 2, children: 0 } },
      {
        id: 'family',
        label: 'Family',
        patch: { adults: 2, children: 1, wantsGentleFamilyExperience: true },
      },
      { id: 'friends', label: 'Friends', patch: { adults: 3, children: 0 } },
      { id: 'group', label: 'Group', patch: { adults: 4, children: 0 } },
    ],
  },
  {
    id: 'time',
    question: 'How much time do you have?',
    options: [
      { id: 'half-day', label: 'Half day', patch: { durationPreference: 'half_day' } },
      { id: 'full-day', label: 'Full day', patch: { durationPreference: 'full_day' } },
      { id: 'flexible-time', label: 'Flexible', patch: { durationPreference: 'either' } },
    ],
  },
  {
    id: 'preferences',
    question: 'Any must-have preferences?',
    multiSelect: true,
    options: [
      { id: 'feeding', label: 'Feeding', patch: { wantsFeeding: true } },
      { id: 'bathing-listed', label: 'Bathing if clearly listed', patch: { wantsBathing: true } },
      { id: 'ethical-priority', label: 'Ethical priority', patch: { ethicalPriority: true } },
      {
        id: 'easy-pace',
        label: 'Easy pace',
        patch: { wantsGentleFamilyExperience: true, transferSensitivity: 'high' },
      },
      {
        id: 'hotel-area-friendly',
        label: 'Hotel-area friendly',
        patch: { transferSensitivity: 'high' },
      },
    ],
  },
]

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

export function applyChatPlannerChoice(
  input: ElephantFinderInput,
  choiceId: string,
): ElephantFinderInput {
  const option = CHAT_PLANNER_STEPS.flatMap(step => step.options).find(
    option => option.id === choiceId,
  )

  return option ? updateElephantFinderInput(input, option.patch) : input
}

export function updateChatPlannerSelections(
  selections: Record<string, string[]>,
  stepId: string,
  choiceId: string,
): Record<string, string[]> {
  const step = CHAT_PLANNER_STEPS.find(step => step.id === stepId)

  if (!step?.multiSelect) {
    return { ...selections, [stepId]: [choiceId] }
  }

  const currentChoices = selections[stepId] ?? []
  const nextChoices = currentChoices.includes(choiceId)
    ? currentChoices.filter(currentChoice => currentChoice !== choiceId)
    : [...currentChoices, choiceId]

  return { ...selections, [stepId]: nextChoices }
}

export function getChatPlannerSelectedLabels(selections: Record<string, string[]>): string[] {
  return CHAT_PLANNER_STEPS.flatMap(step => {
    const selectedChoiceIds = selections[step.id] ?? []

    return step.options
      .filter(option => selectedChoiceIds.includes(option.id))
      .map(option => option.label)
  })
}

export function buildItinerarySummaryFromPlanner(params: {
  input: ElephantFinderInput
  selectedLabels: string[]
  submitted: boolean
}): ItinerarySummary | null {
  if (!params.submitted || params.selectedLabels.length === 0) return null

  if (params.selectedLabels.includes('Low-intensity experience')) {
    return {
      title: 'Your suggested Chiang Mai day',
      summary: 'A flexible plan that prioritizes an easier pace over packing too much into the day.',
      segments: [
        { label: 'Morning', text: 'Choose a lighter experience that does not feel rushed.' },
        { label: 'Midday', text: 'Compare options by comfort, transfer fit, and group pace.' },
        { label: 'Afternoon', text: 'Leave room for rest or a simple handoff to the partner.' },
      ],
    }
  }

  if (params.input.wantsCookingOrFood) {
    return {
      title: 'Your suggested Chiang Mai day',
      summary:
        'A full-day food-focused plan that pairs local cooking or food experiences with a relaxed Chiang Mai pace.',
      segments: [
        { label: 'Morning', text: 'Begin with a local experience or partner-hosted activity.' },
        { label: 'Midday', text: 'Make food or cooking the center of the day.' },
        { label: 'Afternoon', text: 'Compare experiences that keep the pace relaxed.' },
      ],
    }
  }

  if (params.input.wantsNatureDayTrip) {
    return {
      title: 'Your suggested Chiang Mai day',
      summary: 'A full-day nature-focused plan for travelers who want more time outside the city.',
      segments: [
        { label: 'Morning', text: 'Start earlier for a nature-focused day outside central Chiang Mai.' },
        { label: 'Midday', text: 'Choose experiences with stronger outdoor or scenery fit.' },
        { label: 'Afternoon', text: 'Keep the plan flexible for a longer return toward Chiang Mai.' },
      ],
    }
  }

  if (
    params.input.wantsElephantCare ||
    params.input.wantsGentleFamilyExperience ||
    params.input.durationPreference === 'half_day'
  ) {
    return {
      title: 'Your suggested Chiang Mai day',
      summary: 'A gentle half-day plan focused on elephant care and family-friendly pacing.',
      segments: [
        { label: 'Morning', text: 'Start with a gentle elephant care experience.' },
        { label: 'Midday', text: 'Keep the plan light and easy for the group.' },
        { label: 'Afternoon', text: 'Leave space to return toward Chiang Mai or rest.' },
      ],
    }
  }

  return null
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

function RecommendationCard({
  recommendation,
  resultPosition,
  resultCount,
}: {
  recommendation: ElephantFinderRecommendation
  resultPosition: number
  resultCount: number
}) {
  return (
    <article className="flex flex-col rounded-[1.5rem] border border-[#e8dfd2] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
        {matchLabel(recommendation.matchType)}
      </p>
      <h3 className="mt-2 text-xl font-black leading-tight text-[#101820]">
        {recommendation.title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-[#5a6670]">{recommendation.campName}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#e9f6f2] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#0f766e]">
          Chiang Mai
        </span>
        <span className="rounded-full bg-[#f8f4ea] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#6b5d4d]">
          Partner handoff
        </span>
      </div>

      <div className="mt-4 rounded-[1rem] bg-[#f8f4ea] p-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">
          Why this matches
        </p>
        <ul className="mt-2 space-y-2">
          {recommendation.reasons.map(reason => (
            <li key={reason} className="text-sm font-semibold leading-6 text-[#36414a]">
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1rem] border border-[#d8eadf] bg-[#f5fbf7] p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            Best for
          </p>
          <ul className="mt-2 space-y-1">
            {recommendation.bestFor.map(item => (
              <li key={item} className="text-xs font-semibold leading-5 text-[#36414a]">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1rem] border border-[#eadfce] bg-[#fffdf7] p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">
            Not ideal for
          </p>
          <ul className="mt-2 space-y-1">
            {recommendation.notIdealFor.map(item => (
              <li key={item} className="text-xs font-semibold leading-5 text-[#6b5d4d]">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-[1rem] border border-[#f3d6aa] bg-[#fff8e8] p-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#a35c09]">
          Review before choosing
        </p>
        <ul className="mt-2 space-y-1">
          {recommendation.cautionNotes.map(note => (
            <li key={note} className="text-xs font-semibold leading-5 text-[#8a4f07]">
              • {note}
            </li>
          ))}
          <li className="text-xs font-semibold leading-5 text-[#8a4f07]">
            • Confirm current pickup coverage and timing on the partner page.
          </li>
          <li className="text-xs font-semibold leading-5 text-[#8a4f07]">
            • Review current cancellation terms before choosing.
          </li>
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
        {recommendation.externalHandoff ? (
          <a
            href={recommendation.ctaHref}
            rel={recommendation.linkRel}
            target="_blank"
            onClick={() => track('booking_partner_handoff_clicked', {
              provider: 'bokun',
              placement: 'planner_filtered_matches',
              city: 'Chiang Mai',
              productId: recommendation.recommendationId,
              attributionSource: 'bokun_public_widget',
              targetHost: 'widgets.bokun.io',
              resultPosition,
              resultCount,
            })}
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
      <p className="mt-2 text-xs font-semibold leading-5 text-[#6b5d4d]">
        Opens the partner page in a new tab so you can review details there.
      </p>
    </article>
  )
}

function ItinerarySummaryCard({ summary }: { summary: ItinerarySummary }) {
  return (
    <div className={ITINERARY_SUMMARY_CARD_CLASS}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
        Planning summary
      </p>
      <h3 className="mt-2 text-lg font-black text-[#101820]">{summary.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#5a6670] sm:leading-6">
        {summary.summary}
      </p>
      <div className={ITINERARY_SUMMARY_SEGMENTS_CLASS}>
        {summary.segments.map(segment => (
          <div key={segment.label} className={ITINERARY_SUMMARY_SEGMENT_CLASS}>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6b5d4d]">
              {segment.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-[#36414a] sm:leading-6">
              {segment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ElephantCampFinderClient({ profiles }: ElephantCampFinderClientProps) {
  const [input, setInput] = useState<ElephantFinderInput>(() => getInitialElephantFinderInput())
  const [submitted, setSubmitted] = useState(false)
  const [selectedChatChoices, setSelectedChatChoices] = useState<Record<string, string[]>>({})

  const view = buildElephantFinderViewModel({ input, profiles, submitted })
  const recommendationFingerprint = view.recommendations
    .map(recommendation => recommendation.recommendationId)
    .join('|')

  useEffect(() => {
    if (!submitted || view.recommendations.length === 0) return

    view.recommendations.forEach((recommendation, index) => {
      track('finder_recommendations_rendered', {
        provider: 'bokun',
        placement: 'planner_filtered_matches',
        city: 'Chiang Mai',
        productId: recommendation.recommendationId,
        attributionSource: 'bokun_public_widget',
        targetHost: 'widgets.bokun.io',
        source: 'planner',
        resultPosition: index + 1,
        resultCount: view.recommendations.length,
      })
    })
  }, [recommendationFingerprint, submitted])

  function patchInput(patch: Partial<ElephantFinderInput>) {
    setInput(current => updateElephantFinderInput(current, patch))
    if (submitted) setSubmitted(false)
  }

  function chooseChatPlannerOption(stepId: string, choiceId: string) {
    track('finder_planner_choice_selected', { stepId, choiceId })
    setSelectedChatChoices(current => updateChatPlannerSelections(current, stepId, choiceId))
    setInput(current => applyChatPlannerChoice(current, choiceId))
    if (submitted) setSubmitted(false)
  }

  function resetChatPlanner() {
    setInput(getInitialElephantFinderInput())
    setSelectedChatChoices({})
    setSubmitted(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    track('finder_matching_experiences_clicked', { source: 'form' })
    setSubmitted(true)
  }

  function showMatches() {
    track('finder_matching_experiences_clicked', { source: 'planner' })
    setSubmitted(true)
  }

  const selectedChatLabels = getChatPlannerSelectedLabels(selectedChatChoices)
  const itinerarySummary = buildItinerarySummaryFromPlanner({
    input,
    selectedLabels: selectedChatLabels,
    submitted,
  })

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.5rem] border border-[#ded7ca] bg-white p-5 shadow-[0_12px_28px_rgba(17,24,39,0.06)]"
      >
        <section
          id={CHIANG_MAI_PLANNER_SECTION_ID}
          className="rounded-[1.1rem] border border-[#d8eadf] bg-[#f5fbf7] p-4"
        >
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            {CHAT_PLANNER_TITLE}
          </p>
          <h2 className="mt-2 text-xl font-black text-[#101820]">
            Start with your travel style.
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
            {CHAT_PLANNER_HELPER}
          </p>

          <div className="mt-4 space-y-4">
            {CHAT_PLANNER_STEPS.map(step => (
              <div key={step.id} className="rounded-[1rem] bg-white p-3">
                <p className="text-sm font-black text-[#36414a]">{step.question}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.options.map(option => {
                    const selected = selectedChatChoices[step.id]?.includes(option.id) ?? false

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => chooseChatPlannerOption(step.id, option.id)}
                        aria-pressed={selected}
                        className={
                          selected
                            ? `${CHAT_PLANNER_CHIP_CLASS} bg-[#0f766e] text-white`
                            : `${CHAT_PLANNER_CHIP_CLASS} border border-[#d8eadf] bg-[#f5fbf7] text-[#0f766e]`
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1rem] border border-[#d8eadf] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
              Your planner picks
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#5a6670]">
              {selectedChatLabels.length > 0
                ? selectedChatLabels.join(' · ')
                : 'Choose a few chips to shape your Chiang Mai experience matches.'}
            </p>
            <button
              type="button"
              onClick={resetChatPlanner}
              className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-[#d8eadf] px-4 text-xs font-black uppercase tracking-[0.08em] text-[#0f766e]"
            >
              Reset planner
            </button>
            <button
              type="button"
              onClick={showMatches}
              className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#0f766e] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#115e59]"
            >
              {CHAT_PLANNER_SUBMIT_LABEL}
            </button>
          </div>
        </section>

        <div className="mt-5 rounded-[1.1rem] border border-[#eadfce] bg-[#fcfaf5] p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a6a43]">
            Optional
          </p>
          <h2 className="mt-2 text-lg font-black text-[#101820]">{FINE_TUNE_DETAILS_TITLE}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#6b5d4d]">
            {FINE_TUNE_DETAILS_HELPER}
          </p>
        </div>

        <section className={`mt-5 ${FORM_SECTION_CLASS}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            Group size / location
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-black text-[#36414a]">
              Number of adults
              <input
                type="number"
                min={1}
                value={input.adults}
                onChange={event => patchInput({ adults: Number(event.target.value) })}
                className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
              />
            </label>
            <label className="text-sm font-black text-[#36414a]">
              Number of children
              <input
                type="number"
                min={0}
                value={input.children}
                onChange={event => patchInput({ children: Number(event.target.value) })}
                className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-black text-[#36414a]">
            Hotel area
            <select
              value={input.hotelArea}
              onChange={event => patchInput({ hotelArea: event.target.value as ElephantFinderInput['hotelArea'] })}
              className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
            >
              {hotelAreaOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <fieldset className={`mt-4 ${FORM_SECTION_CLASS}`}>
          <legend className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            Experience interests
          </legend>
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
              <label key={key} className={OPTION_ROW_CLASS}>
                <input
                  type="checkbox"
                  checked={Boolean(input[key as keyof ElephantFinderInput])}
                  onChange={event => patchInput({ [key]: event.target.checked } as Partial<ElephantFinderInput>)}
                  className="h-4 w-4 shrink-0 accent-[#0f766e]"
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-3 rounded-[0.9rem] bg-[#f8f4ea] px-3 py-2 text-xs font-semibold leading-5 text-[#6b5d4d]">
            {BATHING_HELPER_NOTE}
          </p>
        </fieldset>

        <div className={`mt-4 grid gap-4 ${FORM_SECTION_CLASS}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            Duration / pace
          </h3>
          <label className="text-sm font-black text-[#36414a]">
            Duration preference
            <select
              value={input.durationPreference}
              onChange={event => patchInput({ durationPreference: event.target.value as ElephantFinderInput['durationPreference'] })}
              className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
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
              className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
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
              className="mt-2 w-full border border-[#ded7ca] bg-white px-3 py-3 font-semibold"
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
          {CHAT_PLANNER_SUBMIT_LABEL}
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
            Answer the questions, then click See matching experiences to compare Chiang Mai experiences.
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
          <div className={RECOMMENDATION_RESULTS_CLASS}>
            {itinerarySummary ? <ItinerarySummaryCard summary={itinerarySummary} /> : null}
            {view.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.recommendationId}
                recommendation={recommendation}
                resultPosition={index + 1}
                resultCount={view.recommendations.length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
