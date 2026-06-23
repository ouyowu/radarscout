import { describe, expect, it } from 'vitest'
import {
  ELEPHANT_FINDER_TITLE,
  buildElephantFinderViewModel,
  getInitialElephantFinderInput,
  updateElephantFinderInput,
} from '../ElephantCampFinderClient'
import { elephantCampProfiles } from '@/lib/elephantFinder/elephantCampProfiles'
import type { ElephantCampProductProfile } from '@/lib/elephantFinder/types'

function testProfile(
  productId: string,
  overrides: Partial<ElephantCampProductProfile> = {},
): ElephantCampProductProfile {
  return {
    productId,
    title: `Chiang Mai Elephant Experience ${productId}`,
    campName: `Camp ${productId}`,
    city: 'Chiang Mai',
    durationType: 'half_day',
    kidFriendlyScore: 3,
    ethicalScore: 3,
    interactionLevel: 3,
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
    detailHref: `/tours/${productId}`,
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
    interactionLevel: 5,
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
    expect(ELEPHANT_FINDER_TITLE).toBe('Find the right elephant camp in Chiang Mai')
  })

  it('form fields are operable through input updates', () => {
    const input = updateElephantFinderInput(getInitialElephantFinderInput(), {
      adults: 3,
      children: 2,
      hotelArea: 'nimman',
      wantsBathing: true,
      durationPreference: 'full_day',
    })

    expect(input.adults).toBe(3)
    expect(input.children).toBe(2)
    expect(input.hotelArea).toBe('nimman')
    expect(input.wantsBathing).toBe(true)
    expect(input.durationPreference).toBe('full_day')
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
      expect(recommendation.detailHref).toBe(`/tours/${recommendation.productId}`)
    }
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

    expect(familyView.recommendations[0].productId).toBe('real_elephant_family')
    expect(bathingView.recommendations[0].productId).toBe('real_elephant_bathing')
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

  it('default placeholder profiles do not expose fake product IDs', () => {
    const view = buildElephantFinderViewModel({
      input: getInitialElephantFinderInput(),
      profiles: elephantCampProfiles,
      submitted: true,
    })

    expect(view.recommendations).toEqual([])
    expect(view.needsRealProductIds).toBe(true)
    expect(JSON.stringify(view)).not.toContain('NEEDS_REAL_PRODUCT_ID')
  })
})
