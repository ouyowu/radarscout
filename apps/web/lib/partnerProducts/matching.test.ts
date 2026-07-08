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

  it('does not return Chiang Mai partner products for another city filter', () => {
    expect(listMatchingPartnerProductCandidates({
      city: 'Bangkok',
      search: 'elephants',
      take: 5,
    })).toEqual([])
  })
})
