import { describe, expect, it } from 'vitest'
import {
  applyChatPlannerChoice,
  BATHING_HELPER_NOTE,
  buildItinerarySummaryFromPlanner,
  CHAT_PLANNER_CHIP_CLASS,
  CHAT_PLANNER_HELPER,
  CHAT_PLANNER_SUBMIT_LABEL,
  CHAT_PLANNER_STEPS,
  CHAT_PLANNER_TITLE,
  ELEPHANT_FINDER_TITLE,
  buildElephantFinderViewModel,
  COMING_SOON_CTA_HREF,
  COMING_SOON_CTA_LABEL,
  COMING_SOON_MESSAGE,
  COMING_SOON_TITLE,
  FORM_SECTION_CLASS,
  FINE_TUNE_DETAILS_HELPER,
  FINE_TUNE_DETAILS_TITLE,
  getChatPlannerSelectedLabels,
  getInitialElephantFinderInput,
  ITINERARY_SUMMARY_CARD_CLASS,
  ITINERARY_SUMMARY_SEGMENT_CLASS,
  ITINERARY_SUMMARY_SEGMENTS_CLASS,
  OPTION_ROW_CLASS,
  RECOMMENDATION_RESULTS_CLASS,
  updateChatPlannerSelections,
  updateElephantFinderInput,
} from '../ElephantCampFinderClient'
import { elephantCampProfiles } from '@/lib/elephantFinder/elephantCampProfiles'
import type { ElephantCampProductProfile } from '@/lib/elephantFinder/types'

function testProfile(
  id: string,
  overrides: Partial<ElephantCampProductProfile> = {},
): ElephantCampProductProfile {
  return {
    source: 'bokun_owner_managed',
    bokunId: `bokun_${id}`,
    internalProductId: id,
    title: `Chiang Mai Elephant Experience ${id}`,
    campName: `Camp ${id}`,
    city: 'Chiang Mai',
    category: 'elephant_care',
    durationType: 'half_day',
    kidFriendlyScore: 3,
    ethicalScore: 3,
    elephantInteractionLevel: 3,
    foodOrCookingFocus: false,
    natureFocus: false,
    bathingAvailable: false,
    feedingAvailable: false,
    walkingAvailable: true,
    photoFriendly: true,
    transferConvenienceScore: 3,
    physicalIntensity: 'medium',
    bestFor: ['First-time visitors'],
    notIdealFor: [],
    pickupAreas: ['old_city'],
    priceLevel: 'mid',
    ...overrides,
  }
}

const profiles = [
  testProfile('real_elephant_family', {
    title: 'Family Gentle Elephant Walk',
    kidFriendlyScore: 5,
    physicalIntensity: 'low',
    feedingAvailable: true,
  }),
  testProfile('real_elephant_bathing', {
    title: 'Hands-on Elephant Bathing Visit',
    bathingAvailable: true,
    elephantInteractionLevel: 5,
  }),
  testProfile('real_elephant_budget', {
    title: 'Best Value Elephant Half Day',
    priceLevel: 'budget',
  }),
  testProfile('real_elephant_full_day', {
    title: 'Full Day Ethical Elephant Care',
    durationType: 'full_day',
    ethicalScore: 5,
  }),
]

describe('ElephantCampFinderClient view model', () => {
  it('page exposes the expected title', () => {
    expect(ELEPHANT_FINDER_TITLE).toBe('Find the right Chiang Mai experience')
  })

  it('form fields are operable through input updates', () => {
    const input = updateElephantFinderInput(getInitialElephantFinderInput(), {
      adults: 3,
      children: 2,
      hotelArea: 'nimman',
      wantsBathing: true,
      wantsCookingOrFood: true,
      wantsNatureDayTrip: true,
      durationPreference: 'full_day',
    })

    expect(input.adults).toBe(3)
    expect(input.children).toBe(2)
    expect(input.hotelArea).toBe('nimman')
    expect(input.wantsBathing).toBe(true)
    expect(input.wantsCookingOrFood).toBe(true)
    expect(input.wantsNatureDayTrip).toBe(true)
    expect(input.durationPreference).toBe('full_day')
  })

  it('uses larger mobile-friendly option row tap targets', () => {
    expect(OPTION_ROW_CLASS).toContain('min-h-[44px]')
    expect(OPTION_ROW_CLASS).toContain('items-center')
    expect(OPTION_ROW_CLASS).toContain('gap-3')
  })

  it('uses grouped form sections for guided planning inputs', () => {
    expect(FORM_SECTION_CLASS).toContain('rounded-[1.1rem]')
    expect(FORM_SECTION_CLASS).toContain('border')
    expect(FORM_SECTION_CLASS).toContain('p-4')
  })

  it('defines a deterministic chat-style planner without LLM/API behavior', () => {
    expect(CHAT_PLANNER_TITLE).toBe('Plan with RadarScout')
    expect(CHAT_PLANNER_HELPER).toBe(
      'Start with your travel style, choose your pace, then see matching experiences.',
    )
    expect(CHAT_PLANNER_SUBMIT_LABEL).toBe('See matching experiences')
    expect(CHAT_PLANNER_STEPS.map(step => step.question)).toEqual([
      'What kind of Chiang Mai day are you planning?',
      'Who are you traveling with?',
      'How much time do you have?',
      'Any must-have preferences?',
    ])
    expect(CHAT_PLANNER_STEPS[0].options.map(option => option.label)).toEqual([
      'Gentle elephant day',
      'Family-friendly half day',
      'Cooking + local food',
      'Nature day trip',
      'Low-intensity experience',
      'Photo-friendly experience',
    ])
    expect(CHAT_PLANNER_STEPS[1].options.map(option => option.label)).toEqual([
      'Solo',
      'Couple',
      'Family',
      'Friends',
      'Group',
    ])
    expect(CHAT_PLANNER_STEPS[3].options.map(option => option.label)).toEqual([
      'Feeding',
      'Bathing if clearly listed',
      'Ethical priority',
      'Easy pace',
      'Hotel-area friendly',
    ])

    const serialized = JSON.stringify({
      CHAT_PLANNER_HELPER,
      CHAT_PLANNER_STEPS,
      CHAT_PLANNER_SUBMIT_LABEL,
    })
    expect(serialized).not.toMatch(/\/api\//i)
    expect(serialized).not.toMatch(/\/api\/bokun/i)
    expect(serialized).not.toMatch(/llm/i)
    expect(serialized).not.toMatch(/openai/i)
    expect(serialized).not.toMatch(/ai booked this/i)
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/guaranteed slot/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
    expect(serialized).not.toMatch(/reservation complete/i)
    expect(serialized).not.toMatch(/Bókun backend/i)
    expect(serialized).not.toMatch(/Bókun database/i)
    expect(serialized).not.toMatch(/Bókun-powered/i)
    expect(serialized).not.toMatch(/fake reviews/i)
    expect(serialized).not.toMatch(/fake ratings/i)
  })

  it('uses 44px chat planner chip tap targets', () => {
    expect(CHAT_PLANNER_CHIP_CLASS).toContain('min-h-[44px]')
    expect(CHAT_PLANNER_CHIP_CLASS).toContain('items-center')
    expect(CHAT_PLANNER_CHIP_CLASS).toContain('rounded-full')
  })

  it('uses compact mobile spacing for the itinerary summary before expanding on desktop', () => {
    expect(ITINERARY_SUMMARY_CARD_CLASS).toContain('p-3')
    expect(ITINERARY_SUMMARY_CARD_CLASS).toContain('sm:p-4')
    expect(ITINERARY_SUMMARY_CARD_CLASS).not.toContain('mt-5')
    expect(ITINERARY_SUMMARY_SEGMENTS_CLASS).toContain('mt-3')
    expect(ITINERARY_SUMMARY_SEGMENTS_CLASS).toContain('gap-2')
    expect(ITINERARY_SUMMARY_SEGMENTS_CLASS).toContain('sm:mt-4')
    expect(ITINERARY_SUMMARY_SEGMENTS_CLASS).toContain('sm:gap-3')
    expect(ITINERARY_SUMMARY_SEGMENT_CLASS).toContain('p-2.5')
    expect(ITINERARY_SUMMARY_SEGMENT_CLASS).toContain('sm:p-3')
    expect(RECOMMENDATION_RESULTS_CLASS).toContain('mt-4')
    expect(RECOMMENDATION_RESULTS_CLASS).toContain('gap-3')
    expect(RECOMMENDATION_RESULTS_CLASS).toContain('sm:mt-5')
    expect(RECOMMENDATION_RESULTS_CLASS).toContain('sm:gap-4')
  })

  it('keeps the detailed form available as secondary fine-tuning copy', () => {
    expect(FINE_TUNE_DETAILS_TITLE).toBe('Fine-tune details')
    expect(FINE_TUNE_DETAILS_HELPER).toBe(
      'Adjust group size, hotel area, and specific preferences if you want a more precise match.',
    )

    const serialized = JSON.stringify({ FINE_TUNE_DETAILS_TITLE, FINE_TUNE_DETAILS_HELPER })
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/guaranteed slot/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
    expect(serialized).not.toMatch(/Bókun backend/i)
    expect(serialized).not.toMatch(/Bókun database/i)
    expect(serialized).not.toMatch(/Bókun-powered/i)
  })

  it('maps chat planner choices into the existing ElephantFinderInput shape', () => {
    let input = getInitialElephantFinderInput()
    input = applyChatPlannerChoice(input, 'gentle-elephant')
    input = applyChatPlannerChoice(input, 'family')
    input = applyChatPlannerChoice(input, 'half-day')
    input = applyChatPlannerChoice(input, 'feeding')
    input = applyChatPlannerChoice(input, 'bathing-listed')

    expect(input).toMatchObject({
      adults: 2,
      children: 1,
      durationPreference: 'half_day',
      wantsElephantCare: true,
      wantsGentleFamilyExperience: true,
      wantsFeeding: true,
      wantsBathing: true,
      ethicalPriority: true,
    })
  })

  it('maps quick style choices into recommendation-affecting finder state', () => {
    expect(applyChatPlannerChoice(getInitialElephantFinderInput(), 'family-half-day')).toMatchObject({
      adults: 2,
      children: 1,
      durationPreference: 'half_day',
      wantsGentleFamilyExperience: true,
      wantsElephantCare: true,
    })
    expect(applyChatPlannerChoice(getInitialElephantFinderInput(), 'cooking-food')).toMatchObject({
      wantsCookingOrFood: true,
      wantsNatureDayTrip: false,
      wantsElephantCare: false,
    })
    expect(applyChatPlannerChoice(getInitialElephantFinderInput(), 'nature-day')).toMatchObject({
      wantsNatureDayTrip: true,
      wantsCookingOrFood: false,
      durationPreference: 'full_day',
    })
  })

  it('tracks selected prompt chips and supports reset-friendly empty state', () => {
    let selections: Record<string, string[]> = {}
    selections = updateChatPlannerSelections(selections, 'style', 'gentle-elephant')
    selections = updateChatPlannerSelections(selections, 'group', 'family')
    selections = updateChatPlannerSelections(selections, 'time', 'half-day')
    selections = updateChatPlannerSelections(selections, 'preferences', 'feeding')
    selections = updateChatPlannerSelections(selections, 'preferences', 'bathing-listed')

    expect(getChatPlannerSelectedLabels(selections)).toEqual([
      'Gentle elephant day',
      'Family',
      'Half day',
      'Feeding',
      'Bathing if clearly listed',
    ])

    selections = {}
    expect(getChatPlannerSelectedLabels(selections)).toEqual([])
  })

  it('keeps style, group, and time single-choice while preferences can be multi-choice', () => {
    let selections: Record<string, string[]> = {}
    selections = updateChatPlannerSelections(selections, 'style', 'gentle-elephant')
    selections = updateChatPlannerSelections(selections, 'style', 'nature-day')
    selections = updateChatPlannerSelections(selections, 'preferences', 'feeding')
    selections = updateChatPlannerSelections(selections, 'preferences', 'bathing-listed')

    expect(getChatPlannerSelectedLabels(selections)).toEqual([
      'Nature day trip',
      'Feeding',
      'Bathing if clearly listed',
    ])
  })

  it('ignores unknown chat planner choices safely', () => {
    const input = getInitialElephantFinderInput()

    expect(applyChatPlannerChoice(input, 'unknown-choice')).toBe(input)
  })

  it('does not build an itinerary summary before planner submit', () => {
    const summary = buildItinerarySummaryFromPlanner({
      input: getInitialElephantFinderInput(),
      selectedLabels: ['Gentle elephant day', 'Family', 'Half day'],
      submitted: false,
    })

    expect(summary).toBeNull()
  })

  it('builds a deterministic gentle family half-day summary', () => {
    const summary = buildItinerarySummaryFromPlanner({
      input: {
        ...getInitialElephantFinderInput(),
        children: 1,
        durationPreference: 'half_day',
        wantsElephantCare: true,
        wantsGentleFamilyExperience: true,
        wantsFeeding: true,
      },
      selectedLabels: ['Gentle elephant day', 'Family', 'Half day', 'Feeding'],
      submitted: true,
    })

    expect(summary).toEqual({
      title: 'Your suggested Chiang Mai day',
      summary: 'A gentle half-day plan focused on elephant care and family-friendly pacing.',
      segments: [
        { label: 'Morning', text: 'Start with a gentle elephant care experience.' },
        { label: 'Midday', text: 'Keep the plan light and easy for the group.' },
        { label: 'Afternoon', text: 'Leave space to return toward Chiang Mai or rest.' },
      ],
    })
  })

  it('builds a deterministic cooking and local food full-day summary', () => {
    const summary = buildItinerarySummaryFromPlanner({
      input: {
        ...getInitialElephantFinderInput(),
        durationPreference: 'full_day',
        wantsCookingOrFood: true,
      },
      selectedLabels: ['Cooking + local food', 'Couple', 'Full day', 'Easy pace'],
      submitted: true,
    })

    expect(summary?.summary).toBe(
      'A full-day food-focused plan that pairs local cooking or food experiences with a relaxed Chiang Mai pace.',
    )
    expect(summary?.segments).toEqual([
      { label: 'Morning', text: 'Begin with a local experience or partner-hosted activity.' },
      { label: 'Midday', text: 'Make food or cooking the center of the day.' },
      { label: 'Afternoon', text: 'Compare experiences that keep the pace relaxed.' },
    ])
  })

  it('builds a deterministic nature day trip full-day summary', () => {
    const summary = buildItinerarySummaryFromPlanner({
      input: {
        ...getInitialElephantFinderInput(),
        durationPreference: 'full_day',
        wantsNatureDayTrip: true,
      },
      selectedLabels: ['Nature day trip', 'Friends', 'Full day', 'Hotel-area friendly'],
      submitted: true,
    })

    expect(summary?.summary).toBe(
      'A full-day nature-focused plan for travelers who want more time outside the city.',
    )
    expect(summary?.segments).toEqual([
      { label: 'Morning', text: 'Start earlier for a nature-focused day outside central Chiang Mai.' },
      { label: 'Midday', text: 'Choose experiences with stronger outdoor or scenery fit.' },
      { label: 'Afternoon', text: 'Keep the plan flexible for a longer return toward Chiang Mai.' },
    ])
  })

  it('keeps itinerary summary copy free of booking and availability claims', () => {
    const summary = buildItinerarySummaryFromPlanner({
      input: {
        ...getInitialElephantFinderInput(),
        durationPreference: 'either',
        wantsGentleFamilyExperience: true,
        transferSensitivity: 'high',
      },
      selectedLabels: ['Low-intensity experience', 'Flexible'],
      submitted: true,
    })
    const serialized = JSON.stringify(summary)

    expect(summary?.summary).toBe(
      'A flexible plan that prioritizes an easier pace over packing too much into the day.',
    )
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/guaranteed slot/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
    expect(serialized).not.toMatch(/reservation complete/i)
    expect(serialized).not.toMatch(/AI booked this/i)
    expect(serialized).not.toMatch(/Bókun backend/i)
    expect(serialized).not.toMatch(/Bókun database/i)
    expect(serialized).not.toMatch(/Bókun-powered/i)
    expect(serialized).not.toMatch(/fake reviews/i)
    expect(serialized).not.toMatch(/fake ratings/i)
  })

  it('shows a conservative bathing helper note without guarantee or live wording', () => {
    expect(BATHING_HELPER_NOTE).toBe(
      'We only highlight bathing when it is clearly listed by the booking partner.',
    )
    expect(BATHING_HELPER_NOTE).not.toMatch(/guaranteed/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/available now/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/live availability/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/live slots/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/instant confirmation/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/\bcheckout\b/i)
    expect(BATHING_HELPER_NOTE).not.toMatch(/\bpayment\b/i)
  })

  it('does not show recommendations before submit', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles,
      submitted: false,
    })

    expect(view.recommendations).toEqual([])
    expect(view.emptyState).toBe(true)
  })

  it('shows recommendation cards after submit', () => {
    const view = buildElephantFinderViewModel({
      input: { ...getInitialElephantFinderInput(), children: 1, wantsGentleFamilyExperience: true },
      profiles,
      submitted: true,
    })

    expect(view.emptyState).toBe(false)
    expect(view.recommendations).toHaveLength(3)
    expect(view.recommendations[0].title).toBe('Family Gentle Elephant Walk')
  })

  it('recommendation cards link to /tours/{id}', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles,
      submitted: true,
    })

    for (const recommendation of view.recommendations) {
      expect(recommendation.ctaHref).toBe(`/tours/${recommendation.internalProductId}`)
      expect(recommendation.ctaLabel).toBe('View experience')
    }
  })

  it('supports safe external handoff links without using Bókun IDs as tour URLs', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: [
        testProfile('external_source', {
          bokunId: '1232729',
          internalProductId: undefined,
          bookingHandoffUrl: 'https://example.com/chiang-mai-experience',
        }),
      ],
      submitted: true,
    })

    expect(view.recommendations[0]).toMatchObject({
      bokunId: '1232729',
      ctaHref: 'https://example.com/chiang-mai-experience',
      ctaLabel: 'Check availability',
      externalHandoff: true,
      linkRel: 'nofollow sponsored noopener noreferrer',
    })
    expect(view.recommendations[0].ctaHref).not.toBe('/tours/1232729')
  })

  it('updates recommendations after preferences change', () => {
    const familyView = buildElephantFinderViewModel({
      input: { ...getInitialElephantFinderInput(), children: 2, wantsGentleFamilyExperience: true },
      profiles,
      submitted: true,
    })
    const bathingView = buildElephantFinderViewModel({
      input: { ...getInitialElephantFinderInput(), wantsBathing: true, wantsCloseInteraction: true },
      profiles,
      submitted: true,
    })

    expect(familyView.recommendations[0].internalProductId).toBe('real_elephant_family')
    expect(bathingView.recommendations[0].internalProductId).toBe('real_elephant_bathing')
  })

  it('does not include forbidden booking, checkout, fake availability, rating, or review claims', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles,
      submitted: true,
    })
    const serialized = JSON.stringify(view)

    expect(serialized).not.toMatch(/\bbooking\b/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/guaranteed bathing/i)
    expect(serialized).not.toMatch(/guaranteed pickup/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\brating\b/i)
    expect(serialized).not.toMatch(/review count/i)
    expect(serialized).not.toMatch(/\d+(?:\.\d+)?\s*stars?/i)
    expect(serialized).not.toMatch(/\d+(?:,\d+)*\s*reviews?/i)
  })

  it('does not call itinerary draft API or Bókun API', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles,
      submitted: true,
    })
    const serialized = JSON.stringify(view)

    expect(serialized).not.toContain('/api/ai-trip/itinerary-draft')
    expect(serialized).not.toMatch(/\/api\/bokun/i)
  })

  it('default profiles do not expose internal placeholder details', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: elephantCampProfiles,
      submitted: true,
    })
    const serialized = JSON.stringify(view)

    expect(view.recommendations).toHaveLength(3)
    expect(view.showComingSoon).toBe(false)
    expect(serialized).not.toContain('NEEDS_REAL_PRODUCT_ID')
    expect(serialized).not.toContain('Real product IDs needed')
    expect(serialized).not.toMatch(/placeholder/i)
  })

  it('default profiles render external Check availability handoff links', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: elephantCampProfiles,
      submitted: true,
    })

    expect(view.recommendations).toHaveLength(3)
    for (const recommendation of view.recommendations) {
      expect(recommendation.externalHandoff).toBe(true)
      expect(recommendation.ctaLabel).toBe('Check availability')
      expect(recommendation.ctaHref).toMatch(/^https:\/\/widgets\.bokun\.io\/online-sales\//)
      expect(recommendation.linkRel).toBe('nofollow sponsored noopener noreferrer')
      expect(recommendation.ctaHref).not.toBe(`/tours/${recommendation.bokunId}`)
    }
  })

  it('does not expose profile assumption comments in the public view model', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: elephantCampProfiles,
      submitted: true,
    })
    const serialized = JSON.stringify(view)

    expect(serialized).not.toMatch(/manual classifications/i)
    expect(serialized).not.toMatch(/supplier net rates/i)
    expect(serialized).not.toMatch(/partner rates/i)
    expect(serialized).not.toMatch(/booking confirmations/i)
  })

  it('does not show coming-soon copy when renderable Chiang Mai profiles exist', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: elephantCampProfiles,
      submitted: true,
    })

    expect(view.showComingSoon).toBe(false)
    expect(JSON.stringify(view)).not.toContain(COMING_SOON_TITLE)
  })

  it('excludes the Bangkok and Pattaya product from normal Chiang Mai recommendations', () => {
    const view = buildElephantFinderViewModel({
      input: { ...getInitialElephantFinderInput(), hotelArea: 'outside_city', wantsElephantCare: true },
      profiles: elephantCampProfiles,
      submitted: true,
    })

    expect(elephantCampProfiles.find(profile => profile.bokunId === '1232799')?.city).toBe(
      'Bangkok & Pattaya',
    )
    expect(view.recommendations.map(recommendation => recommendation.bokunId)).not.toContain(
      '1232799',
    )
  })

  it('uses public-safe coming-soon copy and a safe fallback CTA', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: [],
      submitted: true,
    })

    expect(view.showComingSoon).toBe(true)
    expect(COMING_SOON_TITLE).toBe('Chiang Mai Experience Finder is coming soon')
    expect(COMING_SOON_MESSAGE).toBe(
      'We’re connecting owner-managed Chiang Mai elephant, nature, and local experiences. Please browse our current Thailand experiences for now.',
    )
    expect(COMING_SOON_CTA_LABEL).toBe('Browse Thailand experiences')
    expect(COMING_SOON_CTA_HREF).toBe('/tours')
  })
})
