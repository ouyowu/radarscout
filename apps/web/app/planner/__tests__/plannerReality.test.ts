import { describe, expect, it } from 'vitest'
import { buildPlannerRealityModel } from '../plannerReality'

describe('Planner trip reality model', () => {
  it('summarizes only reviewed coverage and leaves missing days explicit', () => {
    const model = buildPlannerRealityModel({
      destination: 'Chiang Mai',
      durationDays: 3,
      assignedDayCount: 1,
      mapCoverageDayCount: 2,
      reviewedMatchCount: 6,
      visibleMatchCount: 3,
      pace: 'balanced',
      selectedThemes: ['Food'],
      signals: [{
        whyRecommended: 'This reviewed Chiang Mai experience matches your interest in food.',
        bestFor: ['Couples', 'A balanced itinerary'],
        watchOut: 'Review duration and meeting details on Viator before choosing.',
      }],
    })

    expect(model.statusLabel).toBe('Ready to compare, with room left open')
    expect(model.verdict).toContain('1 reviewed day-tour stop is ready to compare')
    expect(model.verdict).toContain('2 days remain flexible')
    expect(model.assignedDayCount).toBe(1)
    expect(model.reviewedCoveragePercent).toBe(33)
    expect(model.mapCoverageDayCount).toBe(2)
    expect(model.visibleMatchCount).toBe(3)
    expect(model.selectedThemes).toEqual(['Food'])
    expect(model.whyThisRoute).toEqual([
      'This reviewed Chiang Mai experience matches your interest in food.',
    ])
  })

  it('deduplicates decision signals and never creates an unsupported score or price', () => {
    const repeatedSignal = {
      whyRecommended: 'A reviewed route match.',
      bestFor: ['Families', 'Families'],
      watchOut: 'Confirm current details on Viator.',
    }
    const model = buildPlannerRealityModel({
      destination: 'Phuket',
      durationDays: 2,
      assignedDayCount: 2,
      mapCoverageDayCount: 2,
      reviewedMatchCount: 4,
      visibleMatchCount: 4,
      pace: 'chill',
      selectedThemes: [],
      signals: [repeatedSignal, repeatedSignal],
    })
    const serialized = JSON.stringify(model)

    expect(model.statusLabel).toBe('Ready to compare')
    expect(model.reviewedCoveragePercent).toBe(100)
    expect(model.bestFor).toEqual(['Families'])
    expect(model.whyThisRoute).toEqual(['A reviewed route match.'])
    expect(serialized).not.toMatch(/safety rating|daily cost|crowd forecast|\/100/i)
  })

  it('clamps reviewed coverage to a truthful 0-100 ratio', () => {
    const model = buildPlannerRealityModel({
      destination: 'Bangkok',
      durationDays: 2,
      assignedDayCount: 9,
      mapCoverageDayCount: 0,
      reviewedMatchCount: 3,
      visibleMatchCount: 3,
      pace: 'packed',
      selectedThemes: [],
      signals: [],
    })

    expect(model.assignedDayCount).toBe(2)
    expect(model.reviewedCoveragePercent).toBe(100)
  })
})
