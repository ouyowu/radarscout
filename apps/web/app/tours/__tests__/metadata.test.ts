import { describe, expect, it } from 'vitest'
import { metadata } from '../page'

describe('tours page metadata', () => {
  it('keeps /tours noindex/nofollow while public-safe copy is being remediated', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('keeps product discovery metadata out of index/follow opening work', () => {
    expect(metadata.title).toBe('Thailand Experience Discovery | RadarScout')
    expect(metadata.alternates?.canonical).toBe('https://www.radarscout.io/tours')
  })
})
