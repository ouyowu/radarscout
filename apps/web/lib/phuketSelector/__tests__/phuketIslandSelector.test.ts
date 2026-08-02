import { describe, expect, it } from 'vitest'

import { loadReviewedViatorPublicCatalogue } from '@/lib/viator/reviewedViatorPublicCatalogue'
import {
  selectPhuketIslandDayMatches,
  type PhuketIslandSelectorInput,
} from '../phuketIslandSelector'

const defaultInput: PhuketIslandSelectorInput = {
  experience: 'scenery',
  travelerType: 'couple',
  pace: 'balanced',
}

describe('selectPhuketIslandDayMatches', () => {
  it('returns exactly three reviewed Phuket water-day products with safe Viator handoffs', () => {
    const products = loadReviewedViatorPublicCatalogue()
    const matches = selectPhuketIslandDayMatches(products, defaultInput)

    expect(matches).toHaveLength(3)
    expect(new Set(matches.map(match => match.product.id)).size).toBe(3)
    expect(matches.map(match => match.product.id)).not.toContain('viator_100246p6')

    for (const match of matches) {
      expect(match.product.destination).toBe('Phuket')
      expect(match.product.bookingPartnerHandoff).toMatchObject({
        label: 'Check availability',
        rel: 'nofollow sponsored noopener noreferrer',
      })
      expect(match.product.bookingPartnerHandoff.href).toMatch(
        /^https:\/\/(?:[^/]+\.)?viator\.com\/.+[?&]pid=P00309837(?:&|$)/,
      )
      expect(match.whyRecommended).toBeTruthy()
      expect(match.bestFor.length).toBeGreaterThan(0)
      expect(match.notFor.length).toBeGreaterThan(0)
      expect(match.watchOut).toContain('Viator')
    }
  })

  it('changes the shortlist deterministically when traveler priorities change', () => {
    const products = loadReviewedViatorPublicCatalogue()
    const relaxed = selectPhuketIslandDayMatches(products, {
      experience: 'relaxed',
      travelerType: 'couple',
      pace: 'gentle',
    })
    const active = selectPhuketIslandDayMatches(products, {
      experience: 'snorkeling',
      travelerType: 'friends',
      pace: 'active',
    })

    expect(relaxed.map(match => match.product.id)).not.toEqual(
      active.map(match => match.product.id),
    )
    expect(selectPhuketIslandDayMatches(products, defaultInput)).toEqual(
      selectPhuketIslandDayMatches(products, defaultInput),
    )
  })
})
