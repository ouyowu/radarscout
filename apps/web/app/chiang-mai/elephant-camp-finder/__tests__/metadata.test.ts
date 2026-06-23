import { describe, expect, it } from 'vitest'
import { ELEPHANT_FINDER_INTRO_COPY } from '../copy'
import { metadata } from '../page'

describe('Chiang Mai elephant camp finder metadata', () => {
  it('uses a clean string browser title', () => {
    expect(metadata.title).toBe('Find the right Chiang Mai experience | RadarScout')
    expect(String(metadata.title)).not.toContain('[object Object]')
  })

  it('keeps the finder noindex/nofollow while owner-managed profiles are being verified', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('does not expose forbidden live availability copy in the public intro', () => {
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/live slots/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/live availability/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/available now/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/guaranteed slot/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/instant confirmation/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/\bcheckout\b/i)
    expect(ELEPHANT_FINDER_INTRO_COPY).not.toMatch(/\bpayment\b/i)
  })
})
