import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_FEED_V1_SCHEMA_VERSION,
  loadActivityFeedV1,
} from './activityFeedV1'

describe('Activity Feed v1 adapter', () => {
  it('adapts the existing reviewed catalogue without adding a second source', () => {
    const items = loadActivityFeedV1({ take: 20 })

    expect(items).toHaveLength(20)
    expect(items.every((item) => item.schemaVersion === ACTIVITY_FEED_V1_SCHEMA_VERSION)).toBe(true)
    expect(items.every((item) => item.destination.country === 'Thailand')).toBe(true)
    expect(items.every((item) => item.partnerHandoff.provider === 'Viator')).toBe(true)
    expect(items.every((item) => item.partnerHandoff.label === 'Check availability')).toBe(true)
    expect(items.every((item) => item.partnerHandoff.availabilityClaimed === false)).toBe(true)
  })

  it('keeps unreviewed commercial and logistics fields explicit', () => {
    const [item] = loadActivityFeedV1({ take: 1 })

    expect(item.startingPrice).toEqual({ status: 'not_reviewed', value: null })
    expect(item.duration).toEqual({ status: 'not_reviewed', value: null })
    expect(item.pickupArea).toEqual({ status: 'not_reviewed', value: [] })
    expect(item.childPolicy).toEqual({ status: 'not_reviewed', value: null })
    expect(item.fitnessLevel).toEqual({ status: 'not_reviewed', value: null })
    expect(item.cancellationPolicy).toEqual({ status: 'not_reviewed', value: null })
    expect(item.ethicalAttributes).toEqual({ status: 'not_reviewed', value: [] })
  })

  it('supports deterministic destination filtering and bounded reads', () => {
    const first = loadActivityFeedV1({ destination: 'chiang mai', take: 3 })
    const second = loadActivityFeedV1({ destination: 'chiang mai', take: 3 })

    expect(first).toHaveLength(3)
    expect(first).toEqual(second)
    expect(first.every((item) => item.destination.city === 'Chiang Mai')).toBe(true)
    expect(loadActivityFeedV1({ destination: 'not-a-thailand-city' })).toEqual([])
  })

  it('does not expose provider payload or forbidden commercial fields', () => {
    const serialized = JSON.stringify(loadActivityFeedV1({ take: 20 }))

    for (const forbidden of [
      'raw',
      'availability',
      'inventory',
      'commission',
      'supplier',
      'reviewCount',
      'rating',
    ]) {
      expect(serialized).not.toContain(`"${forbidden}"`)
    }
  })
})

