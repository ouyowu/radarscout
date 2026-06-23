import { describe, expect, it } from 'vitest'
import { ownerManagedBokunProfiles } from '../ownerManagedBokunProfiles'
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
  wantsElephantCare: false,
  wantsCookingOrFood: false,
  wantsNatureDayTrip: false,
  wantsGentleFamilyExperience: false,
  ethicalPriority: false,
  transferSensitivity: 'medium',
  budgetSensitivity: 'medium',
}

function profile(
  id: string,
  overrides: Partial<ElephantCampProductProfile> = {},
): ElephantCampProductProfile {
  return {
    source: 'bokun_owner_managed',
    bokunId: `bokun_${id}`,
    internalProductId: id,
    title: `Elephant Experience ${id}`,
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

describe('scoreElephantCampProducts', () => {
  it('weights family-friendly products when children are in the group', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, children: 2, wantsGentleFamilyExperience: true },
      profiles: [
        profile('family', { kidFriendlyScore: 5, physicalIntensity: 'low' }),
        profile('intense', { kidFriendlyScore: 1, physicalIntensity: 'high' }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('family')
  })

  it('prioritizes products with bathing when bathing is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsBathing: true },
      profiles: [
        profile('dry', { bathingAvailable: false }),
        profile('bath', { bathingAvailable: true }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('bath')
  })

  it('prioritizes products with feeding when feeding is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsFeeding: true },
      profiles: [
        profile('walk', { feedingAvailable: false }),
        profile('feed', { feedingAvailable: true }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('feed')
  })

  it('prioritizes easier transfer when transfer sensitivity is high', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, transferSensitivity: 'high', hotelArea: 'nimman' },
      profiles: [
        profile('far', { pickupAreas: ['outside_city'], transferConvenienceScore: 1 }),
        profile('easy', { pickupAreas: ['nimman'], transferConvenienceScore: 5 }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('easy')
  })

  it('prioritizes budget products when budget sensitivity is high', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, budgetSensitivity: 'high' },
      profiles: [
        profile('premium', { priceLevel: 'premium' }),
        profile('budget', { priceLevel: 'budget' }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('budget')
  })

  it('prioritizes high ethical score when ethical priority is selected', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, ethicalPriority: true },
      profiles: [
        profile('standard', { ethicalScore: 2 }),
        profile('ethical', { ethicalScore: 5 }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('ethical')
  })

  it('prioritizes half-day products when half-day is preferred', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, durationPreference: 'half_day' },
      profiles: [
        profile('full', { durationType: 'full_day' }),
        profile('half', { durationType: 'half_day' }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('half')
  })

  it('excludes placeholder product IDs from final recommendations', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [
        profile('placeholder', {
          internalProductId: 'NEEDS_REAL_PRODUCT_ID',
          bookingHandoffUrl: undefined,
          kidFriendlyScore: 5,
        }),
        profile('real_1'),
        profile('real_2'),
        profile('real_3'),
      ],
    })

    expect(recommendations.map(r => r.internalProductId)).not.toContain('NEEDS_REAL_PRODUCT_ID')
  })

  it('returns recommendations sorted by score', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsCloseInteraction: true },
      profiles: [
        profile('low', { elephantInteractionLevel: 1 }),
        profile('high', { elephantInteractionLevel: 5 }),
        profile('medium', { elephantInteractionLevel: 3 }),
      ],
    })

    expect(recommendations.map(r => r.internalProductId)).toEqual(['high', 'medium', 'low'])
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
        profile('four', { elephantInteractionLevel: 5 }),
      ],
    })

    expect(recommendations).toHaveLength(3)
    expect(new Set(recommendations.map(r => r.recommendationId)).size).toBe(3)
  })

  it('returns the top 3 unique owner-managed Chiang Mai recommendations', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: ownerManagedBokunProfiles,
    })

    expect(recommendations).toHaveLength(3)
    expect(new Set(recommendations.map(r => r.recommendationId)).size).toBe(3)
    expect(recommendations.every(recommendation => recommendation.city === 'Chiang Mai')).toBe(
      true,
    )
  })

  it('uses internal product IDs for RadarScout tour links', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [profile('internal_tour_1', { bokunId: '1232729' })],
    })

    expect(recommendations[0]).toMatchObject({
      internalProductId: 'internal_tour_1',
      ctaHref: '/tours/internal_tour_1',
      ctaLabel: 'View experience',
      externalHandoff: false,
    })
  })

  it('uses safe external handoff links when no internal product exists', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [
        profile('external_source', {
          bokunId: '1232731',
          internalProductId: undefined,
          bookingHandoffUrl: 'https://example.com/owner-managed-experience',
        }),
      ],
    })

    expect(recommendations[0]).toMatchObject({
      bokunId: '1232731',
      recommendationId: 'bokun:1232731',
      ctaHref: 'https://example.com/owner-managed-experience',
      ctaLabel: 'Check availability',
      externalHandoff: true,
      linkRel: 'nofollow sponsored noopener noreferrer',
    })
    expect(recommendations[0].ctaHref).not.toBe('/tours/1232731')
  })

  it('does not recommend profiles with neither internal product nor handoff URL', () => {
    const recommendations = scoreElephantCampProducts({
      input: baseInput,
      profiles: [
        profile('unlinked', {
          internalProductId: undefined,
          bookingHandoffUrl: undefined,
        }),
      ],
    })

    expect(recommendations).toEqual([])
  })

  it('prioritizes cooking and local food experiences when requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsCookingOrFood: true },
      profiles: [
        profile('elephant'),
        profile('cooking', {
          category: 'cooking_or_food',
          foodOrCookingFocus: true,
          elephantInteractionLevel: 0,
        }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('cooking')
  })

  it('boosts the owner-managed cooking profile when cooking or food is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsCookingOrFood: true },
      profiles: ownerManagedBokunProfiles,
    })

    expect(recommendations.map(recommendation => recommendation.bokunId)).toContain('1232736')
    expect(
      recommendations.find(recommendation => recommendation.bokunId === '1232736')?.reasons,
    ).toContain('Good fit for cooking or local food')
  })

  it('prioritizes nature day trips when requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsNatureDayTrip: true },
      profiles: [
        profile('elephant'),
        profile('nature', {
          category: 'nature_day_trip',
          natureFocus: true,
          elephantInteractionLevel: 0,
        }),
      ],
    })

    expect(recommendations[0].internalProductId).toBe('nature')
  })

  it('boosts the Inthanon nature profile when nature day trip is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsNatureDayTrip: true, wantsElephantCare: false },
      profiles: ownerManagedBokunProfiles,
    })

    expect(recommendations.map(recommendation => recommendation.bokunId)).toContain('1232798')
    expect(
      recommendations.find(recommendation => recommendation.bokunId === '1232798')?.reasons,
    ).toContain('Good fit for a nature day trip')
  })

  it('boosts family-friendly low-intensity owner-managed profiles for families', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, children: 2, wantsGentleFamilyExperience: true },
      profiles: ownerManagedBokunProfiles,
    })

    expect(recommendations.map(recommendation => recommendation.bokunId)).toContain('1232729')
    expect(
      recommendations.find(recommendation => recommendation.bokunId === '1232729')?.reasons,
    ).toContain('Good for families')
  })

  it('boosts elephant profiles when elephant care is requested', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsElephantCare: true },
      profiles: ownerManagedBokunProfiles,
    })

    expect(recommendations.some(recommendation => recommendation.title.toLowerCase().includes('elephant'))).toBe(
      true,
    )
    expect(
      recommendations.some(recommendation =>
        recommendation.reasons.includes('Matches your elephant care preference'),
      ),
    ).toBe(true)
  })

  it('excludes non-Chiang-Mai owner-managed products from Chiang Mai recommendations', () => {
    const recommendations = scoreElephantCampProducts({
      input: { ...baseInput, wantsElephantCare: true, hotelArea: 'outside_city' },
      profiles: ownerManagedBokunProfiles,
    })

    expect(ownerManagedBokunProfiles.find(profile => profile.bokunId === '1232799')?.city).toBe(
      'Bangkok & Pattaya',
    )
    expect(recommendations.map(recommendation => recommendation.bokunId)).not.toContain('1232799')
  })
})
