import { describe, expect, it } from 'vitest'
import { AGODA_AREA_CITY_SLUGS } from './agodaAreaRecommendations'
import { prepareAgodaAreaPublicSeed } from './prepareAgodaAreaPublicSeed'

const cityNames: Record<string, string> = {
  bangkok: 'Bangkok',
  'chiang-mai': 'Chiang Mai',
  phuket: 'Phuket',
  pattaya: 'Pattaya',
  'koh-samui': 'Koh Samui',
  krabi: 'Krabi',
}

function candidate(citySlug: string, areaSlug: string, reviewStatus = 'approved') {
  return {
    id: `${citySlug}-${areaSlug}`,
    citySlug,
    city: cityNames[citySlug],
    areaSlug,
    name: `${cityNames[citySlug]} ${areaSlug}`,
    bestFor: `Travelers who prefer ${areaSlug}`,
    summary: `Reviewed local guidance for ${areaSlug}.`,
    tradeoffs: [`Reviewed tradeoff for ${areaSlug}.`],
    reviewStatus,
    affiliateHref: null,
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-22T00:00:00.000Z',
  }
}

function completePool() {
  return {
    schemaVersion: 1,
    status: 'owner_review_complete',
    missingCities: [],
    areas: AGODA_AREA_CITY_SLUGS.flatMap(citySlug => [
      candidate(citySlug, 'area-one'),
      candidate(citySlug, 'area-two'),
    ]),
  }
}

describe('Agoda private review input to public seed', () => {
  it('emits only reviewed public-safe area fields after complete owner review', () => {
    const result = prepareAgodaAreaPublicSeed(completePool())

    expect(result).toMatchObject({ ok: true, data: { length: 12 } })
    if (!result.ok) throw new Error(result.error)
    expect(result.data[0]).not.toHaveProperty('reviewStatus')
    expect(result.data[0]).not.toHaveProperty('affiliateHref')
    expect(result.data[0]).not.toHaveProperty('hotelName')
  })

  it('fails closed while owner review is still pending', () => {
    expect(prepareAgodaAreaPublicSeed({
      ...completePool(),
      status: 'candidate_review_required',
    })).toEqual({ ok: false, error: 'review_not_complete' })
  })

  it('rejects an embedded affiliate URL instead of committing a CID', () => {
    const pool = completePool()
    const unsafePool = {
      ...pool,
      areas: [
        { ...pool.areas[0], affiliateHref: 'https://www.agoda.com/?cid=1234567' },
        ...pool.areas.slice(1),
      ],
    }

    expect(prepareAgodaAreaPublicSeed(unsafePool)).toEqual({
      ok: false,
      error: 'embedded_affiliate_href',
    })
  })

  it('rejects hotel and commercial fields in private review input', () => {
    const pool = completePool()
    const unsafePool = {
      ...pool,
      areas: [{ ...pool.areas[0], hotelName: 'Invented Hotel' }, ...pool.areas.slice(1)],
    }

    expect(prepareAgodaAreaPublicSeed(unsafePool)).toEqual({
      ok: false,
      error: 'unexpected_candidate_field',
    })
  })

  it('requires the missing-city list to be empty', () => {
    expect(prepareAgodaAreaPublicSeed({
      ...completePool(),
      missingCities: ['krabi'],
    })).toEqual({ ok: false, error: 'missing_city_content' })
  })

  it('filters rejected candidates but still requires complete approved coverage', () => {
    const pool = completePool()
    pool.areas = pool.areas.map(area => area.citySlug === 'krabi'
      ? { ...area, reviewStatus: 'rejected' }
      : area)

    expect(prepareAgodaAreaPublicSeed(pool)).toEqual({
      ok: false,
      error: 'incomplete_city_coverage',
    })
  })
})
