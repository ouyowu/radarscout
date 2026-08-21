import { describe, expect, it } from 'vitest'
import {
  calculateKeywordPriority,
  listKeywordOpportunities,
} from './keywordOpportunities'

describe('keyword opportunities', () => {
  it('uses the transparent commercial-intent, AI-substitution, and handoff formula', () => {
    expect(calculateKeywordPriority({
      commercialIntent: 90,
      aiSubstitutionRisk: 20,
      partnerHandoffPotential: 80,
    })).toBe(576000)
  })

  it('fails closed for out-of-range editorial scores', () => {
    expect(calculateKeywordPriority({
      commercialIntent: 101,
      aiSubstitutionRisk: 20,
      partnerHandoffPotential: 80,
    })).toBeNull()
  })

  it('ranks the five approved decision keywords while leaving revenue unmeasured', () => {
    const opportunities = listKeywordOpportunities()

    expect(opportunities.map(opportunity => opportunity.keyword)).toEqual([
      'Living Green vs Big Boy for a 6-year-old',
      'Which Chiang Mai elephant sanctuary has the shortest transfer from Nimman?',
      'Best elephant sanctuary for families staying in Nimman',
      'Phi Phi vs James Bond Island with children',
      'Which Bangkok area is best for families before an Ayutthaya day trip?',
    ])
    expect(opportunities.every(opportunity => opportunity.expectedRevenuePerContentCost.status === 'not_measured')).toBe(true)
    expect(opportunities.every(opportunity => opportunity.expectedRevenuePerContentCost.value === null)).toBe(true)
  })
})
