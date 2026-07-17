import { describe, expect, it } from 'vitest'

import { listMatchingReviewedViatorProductCandidates } from './reviewedViatorMatching'

describe('listMatchingReviewedViatorProductCandidates', () => {
  it('returns reviewed Bangkok products as safe affiliate handoff candidates', () => {
    const candidates = listMatchingReviewedViatorProductCandidates({
      city: 'Bangkok',
      search: 'dinner cruise',
      take: 3,
    })

    expect(candidates).not.toHaveLength(0)
    expect(candidates[0]).toMatchObject({
      id: expect.stringMatching(/^viator_/),
      city: 'Bangkok',
      location: 'Bangkok',
      retailPrice: null,
      currency: null,
      ctaLabel: 'Check availability',
      ctaRel: 'nofollow sponsored noopener noreferrer',
      externalHandoff: true,
    })
    expect(candidates[0].ctaHref).toMatch(/^https:\/\/(?:www\.)?viator\.com\//)
    expect(candidates[0].ctaHref).toContain('pid=')
    expect(candidates[0].imageUrl).toMatch(/^https:\/\//)
  })

  it('matches reviewed products by destination and interest text without calling the Viator API', () => {
    const candidates = listMatchingReviewedViatorProductCandidates({
      city: 'Phuket',
      search: 'phi phi speedboat islands',
      take: 3,
    })

    expect(candidates[0]?.title).toMatch(/Phi Phi/i)
    expect(candidates.every(candidate => candidate.city === 'Phuket')).toBe(true)
  })

  it('falls back to reviewed products in the requested city when a city-only plan has no specific product terms', () => {
    const candidates = listMatchingReviewedViatorProductCandidates({
      city: 'Krabi',
      search: 'Krabi 3 days',
      take: 3,
    })

    expect(candidates).toHaveLength(3)
    expect(candidates.every(candidate => candidate.city === 'Krabi')).toBe(true)
  })

  it('never exposes commercial or raw source fields in an AI candidate', () => {
    const [candidate] = listMatchingReviewedViatorProductCandidates({
      city: 'Koh Samui',
      take: 1,
    })

    expect(Object.keys(candidate ?? {})).not.toEqual(expect.arrayContaining([
      'price',
      'availability',
      'inventory',
      'reviews',
      'rating',
      'raw',
      'supplier',
    ]))
  })

  it('matches a newly reviewed Ko Lanta cooking experience without a live Viator request', () => {
    const candidates = listMatchingReviewedViatorProductCandidates({
      city: 'Ko Lanta',
      search: 'Thai cooking class',
      take: 3,
    })

    expect(candidates[0]).toMatchObject({
      id: 'viator_110534p380',
      city: 'Ko Lanta',
      retailPrice: null,
      currency: null,
      ctaLabel: 'Check availability',
      externalHandoff: true,
    })
    expect(candidates[0]?.ctaHref).toContain('pid=')
  })
})
