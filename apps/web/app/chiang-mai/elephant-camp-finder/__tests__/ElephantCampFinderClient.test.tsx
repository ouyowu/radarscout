import { describe, expect, it } from 'vitest'
import {
  BATHING_HELPER_NOTE,
  ELEPHANT_FINDER_TITLE,
  buildElephantFinderViewModel,
  COMING_SOON_CTA_HREF,
  COMING_SOON_CTA_LABEL,
  COMING_SOON_MESSAGE,
  COMING_SOON_TITLE,
  FORM_SECTION_CLASS,
  getInitialElephantFinderInput,
  OPTION_ROW_CLASS,
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
