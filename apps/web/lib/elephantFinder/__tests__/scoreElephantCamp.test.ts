import { describe, expect, it } from 'vitest'
import { scoreElephantCampProducts } from '../scoreElephantCamp'
import type { ElephantCampProductProfile, ElephantFinderInput } from '../types'

const baseInput: ElephantFinderInput = {
  adults: 2,
  children: 0,
  hotelArea: 'old_city',
  durationPreference: 'either',
  wantsFeeding: false,
  wantsBathing: false,
  wantsCloseInteraction: false,
  wantsGentleFamilyExperience: false,
  ethicalPriority: false,
  transferSensitivity: 'medium',
  budgetSensitivity: 'medium',
}

function profile(
  productId: string,
  overrides: Partial<ElephantCampProductProfile> = {},
): ElephantCampProductProfile {
  return {
    productId,
    title: `Elephant Experience ${productId}`,
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

describe('scoreElephantCampProducts', () => {
  it('weights family-friendly products when children are in the group', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, children: 2, wantsGentleFamilyExperience: true },
      profiles: [
        profile('family', { kidFriendlyScore: 5, physicalIntensity: 'low' }),
        profile('intense', { kidFriendlyScore: 1, physicalIntensity: 'high' }),
      ],
    })

    expect(recommendations[0].productId).toBe('family')
  })

  it('prioritizes products with bathing when bathing is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsBathing: true },
      profiles: [
        profile('dry', { bathingAvailable: false }),
        profile('bath', { bathingAvailable: true }),
      ],
    })

    expect(recommendations[0].productId).toBe('bath')
  })

  it('prioritizes products with feeding when feeding is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsFeeding: true },
      profiles: [
        profile('walk', { feedingAvailable: false }),
        profile('feed', { feedingAvailable: true }),
      ],
    })

    expect(recommendations[0].productId).toBe('feed')
  })

  it('prioritizes easier transfer when transfer sensitivity is high', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, transferSensitivity: 'high', hotelArea: 'nimman' },
      profiles: [
        profile('far', { pickupAreas: ['outside_city'], transferConvenienceScore: 1 }),
        profile('easy', { pickupAreas: ['nimman'], transferConvenienceScore: 5 }),
      ],
    })

    expect(recommendations[0].productId).toBe('easy')
  })

  it('prioritizes budget products when budget sensitivity is high', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, budgetSensitivity: 'high' },
      profiles: [
        profile('premium', { priceLevel: 'premium' }),
        profile('budget', { priceLevel: 'budget' }),
      ],
    })

    expect(recommendations[0].productId).toBe('budget')
  })

  it('prioritizes high ethical score when ethical priority is selected', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, ethicalPriority: true },
      profiles: [
        profile('standard', { ethicalScore: 2 }),
        profile('ethical', { ethicalScore: 5 }),
      ],
    })

    expect(recommendations[0].productId).toBe('ethical')
  })

  it('prioritizes half-day products when half-day is preferred', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, durationPreference: 'half_day' },
      profiles: [
        profile('full', { durationType: 'full_day' }),
        profile('half', { durationType: 'half_day' }),
      ],
    })

    expect(recommendations[0].productId).toBe('half')
  })

  it('excludes placeholder product IDs from final recommendations', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [
        profile('NEEDS_REAL_PRODUCT_ID', { kidFriendlyScore: 5 }),
        profile('real_1'),
        profile('real_2'),
        profile('real_3'),
      ],
    })

    expect(recommendations.map(r => r.productId)).not.toContain('NEEDS_REAL_PRODUCT_ID')
  })

  it('returns recommendations sorted by score', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsCloseInteraction: true },
      profiles: [
        profile('low', { interactionLevel: 1 }),
        profile('high', { interactionLevel: 5 }),
        profile('medium', { interactionLevel: 3 }),
      ],
    })

    expect(recommendations.map(r => r.productId)).toEqual(['high', 'medium', 'low'])
    expect(recommendations[0].score).toBeGreaterThanOrEqual(recommendations[1].score)
    expect(recommendations[1].score).toBeGreaterThanOrEqual(recommendations[2].score)
  })

  it('returns the top 3 unique products', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [
        profile('one', { kidFriendlyScore: 5 }),
        profile('two', { ethicalScore: 5 }),
        profile('three', { transferConvenienceScore: 5 }),
        profile('four', { interactionLevel: 5 }),
      ],
    })

    expect(recommendations).toHaveLength(3)
    expect(new Set(recommendations.map(r => r.productId)).size).toBe(3)
  })
})
