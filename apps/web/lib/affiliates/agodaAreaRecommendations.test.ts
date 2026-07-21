import { describe, expect, it } from 'vitest'
import {
  AGODA_AREA_CITY_SLUGS,
  validateAgodaAreaRecommendationCatalogue,
  validateAgodaAreaRecommendationRecord,
} from './agodaAreaRecommendations'

function areaRecord(city: string, suffix: string) {
  const cityNames: Record<string, string> = {
    bangkok: 'Bangkok',
    'chiang-mai': 'Chiang Mai',
    phuket: 'Phuket',
    pattaya: 'Pattaya',
    'koh-samui': 'Koh Samui',
    krabi: 'Krabi',
  }

  return {
    id: `${city}-${suffix}`,
    citySlug: city,
    city: cityNames[city] ?? city,
    areaSlug: suffix,
    name: `${city} ${suffix}`,
    bestFor: `Travelers who prefer ${suffix}`,
    summary: `A reviewed reason to stay around ${suffix}.`,
    tradeoffs: [`A reviewed tradeoff for ${suffix}.`],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-21T00:00:00.000Z',
  }
}

function completeCatalogue() {
  return AGODA_AREA_CITY_SLUGS.flatMap(city => [
    areaRecord(city, 'area-one'),
    areaRecord(city, 'area-two'),
  ])
}

describe('reviewed Agoda area recommendation contract', () => {
  it('covers exactly the six reviewed Thailand Planner cities', () => {
    expect(AGODA_AREA_CITY_SLUGS).toEqual([
      'bangkok',
      'chiang-mai',
      'phuket',
      'pattaya',
      'koh-samui',
      'krabi',
    ])
  })

  it('accepts only complete human-reviewed area copy', () => {
    expect(validateAgodaAreaRecommendationRecord(areaRecord('chiang-mai', 'nimman'))).toEqual({
      ok: true,
      data: areaRecord('chiang-mai', 'nimman'),
    })
  })

  it.each([
    ['hotel name', { hotelName: 'Invented Hotel' }],
    ['hotel id', { hotelId: '123' }],
    ['price', { price: 99 }],
    ['rating', { rating: 5 }],
    ['image', { imageUrl: 'https://example.com/hotel.jpg' }],
    ['availability', { availability: true }],
    ['candidate status', { reviewStatus: 'needs_owner_review' }],
    ['prebuilt affiliate URL', { affiliateHref: 'https://www.agoda.com/' }],
  ])('rejects forbidden %s fields', (_label, forbiddenField) => {
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('bangkok', 'riverside'),
      ...forbiddenField,
    })).toEqual({ ok: false, error: 'unexpected_field' })
  })

  it('rejects unsupported cities and incomplete review evidence', () => {
    expect(validateAgodaAreaRecommendationRecord(areaRecord('tokyo', 'shinjuku'))).toEqual({
      ok: false,
      error: 'invalid_city',
    })
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('phuket', 'old-town'),
      reviewedBy: '',
    })).toEqual({ ok: false, error: 'invalid_reviewed_by' })
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('phuket', 'old-town'),
      reviewedAt: 'not-a-date',
    })).toEqual({ ok: false, error: 'invalid_reviewed_at' })
  })

  it('requires an exact reviewed city label and stable city-area id', () => {
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('chiang-mai', 'nimman'),
      city: 'Chiangmai',
    })).toEqual({ ok: false, error: 'invalid_city_name' })
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('chiang-mai', 'nimman'),
      id: 'nimman',
    })).toEqual({ ok: false, error: 'invalid_id' })
  })

  it('requires one to four distinct human-reviewed tradeoffs', () => {
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('bangkok', 'riverside'),
      tradeoffs: [],
    })).toEqual({ ok: false, error: 'invalid_tradeoffs' })
    expect(validateAgodaAreaRecommendationRecord({
      ...areaRecord('bangkok', 'riverside'),
      tradeoffs: ['Farther from some sights.', 'Farther from some sights.'],
    })).toEqual({ ok: false, error: 'invalid_tradeoffs' })
  })

  it('requires two to four reviewed areas for every supported city', () => {
    expect(validateAgodaAreaRecommendationCatalogue(completeCatalogue())).toMatchObject({
      ok: true,
      data: { length: 12 },
    })

    const missingOneCity = completeCatalogue().filter(record => record.citySlug !== 'krabi')
    expect(validateAgodaAreaRecommendationCatalogue(missingOneCity)).toEqual({
      ok: false,
      error: 'incomplete_city_coverage',
    })

    const tooManyBangkokAreas = [
      ...completeCatalogue(),
      areaRecord('bangkok', 'area-three'),
      areaRecord('bangkok', 'area-four'),
      areaRecord('bangkok', 'area-five'),
    ]
    expect(validateAgodaAreaRecommendationCatalogue(tooManyBangkokAreas)).toEqual({
      ok: false,
      error: 'invalid_area_count',
    })
  })

  it('rejects duplicate area slugs instead of silently choosing one', () => {
    const records = completeCatalogue()
    records[1] = {
      ...records[1],
      id: records[0].id,
      areaSlug: records[0].areaSlug,
    }

    expect(validateAgodaAreaRecommendationCatalogue(records)).toEqual({
      ok: false,
      error: 'duplicate_area_slug',
    })
  })
})
