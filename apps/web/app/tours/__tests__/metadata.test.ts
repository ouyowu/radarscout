import { describe, expect, it } from 'vitest'
import { metadata } from '../page'

describe('tours page metadata', () => {
  it('keeps /tours noindex/nofollow while public-safe copy is being remediated', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('keeps product preview metadata out of index/follow opening work', () => {
    expect(metadata.title).toBe('Thailand Tours Marketplace Preview | RadarScout')
    expect(metadata.alternates?.canonical).toBe('https://www.radarscout.io/tours')
  })
})
