import { describe, expect, it } from 'vitest'

import { listMatchingPartnerProductCandidates } from './matching'

describe('listMatchingPartnerProductCandidates', () => {
  it('returns reviewed Chiang Mai partner products as safe handoff candidates for elephant searches', () => {
    const candidates = listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'elephants',
      take: 3,
    })

    expect(candidates).toHaveLength(3)
    expect(candidates[0]).toMatchObject({
      id: expect.stringMatching(/^partner_cm_/),
      city: 'Chiang Mai',
      location: 'Chiang Mai',
      retailPrice: null,
      currency: null,
      ctaLabel: 'Check availability',
      ctaRel: 'nofollow sponsored noopener noreferrer',
      externalHandoff: true,
    })
    expect(candidates[0].ctaHref).toMatch(/^https:\/\/widgets\.bokun\.io\/online-sales\//)
  })

  it('matches food and cooking searches against reviewed partner product text', () => {
    const candidates = listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'food',
      take: 5,
    })

    expect(candidates.map(candidate => candidate.title).join(' ')).toMatch(/Cooking|Pad Thai/)
    expect(candidates.every(candidate => candidate.city === 'Chiang Mai')).toBe(true)
  })

  it('prioritizes product-specific partner matches for Bigboy, bamboo rafting, and Inthanon searches', () => {
    expect(listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'Bigboy half day morning elephant',
      take: 3,
    })[0].id).toBe('partner_cm_1236811')

    expect(listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'elephant bamboo rafting nature adventure',
      take: 3,
    })[0].id).toBe('partner_cm_1236830')

    expect(listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'Inthanon Heaven Trail elephant nature',
      take: 3,
    })[0].id).toBe('partner_cm_1232798')
  })

  it('prioritizes afternoon products for afternoon half-day searches', () => {
    const candidates = listMatchingPartnerProductCandidates({
      city: 'Chiang Mai',
      search: 'afternoon half day elephant sanctuary',
      take: 3,
    })

    expect(candidates[0].title).toMatch(/Afternoon/)
    expect(candidates[0].title).not.toMatch(/Morning/)
  })

  it('does not return Chiang Mai partner products for another city filter', () => {
    expect(listMatchingPartnerProductCandidates({
      city: 'Bangkok',
      search: 'elephants',
      take: 5,
    })).toEqual([])
  })
})
