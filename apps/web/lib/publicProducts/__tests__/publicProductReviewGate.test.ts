import { describe, expect, it } from 'vitest'
import { isDatabaseProductPublishReady } from '../publicProductReviewGate'

const enrichment = {
  cleanedTitle: 'Reviewed Thailand experience',
  shortSummary: 'A human-reviewed public summary.',
  suggestedTags: ['Nature'],
  seoTitle: null,
  seoDescription: null,
  reviewedBy: 'operator@radarscout.io',
  reviewedAt: '2026-07-11T00:00:00.000Z',
}

const handoff = {
  href: 'https://widgets.bokun.io/online-sales/channel/experience/123',
  label: 'Check availability' as const,
  rel: 'nofollow sponsored noopener noreferrer' as const,
  source: 'booking_partner_verified_public_widget' as const,
  verifiedBy: 'operator_manual_review' as const,
}

describe('isDatabaseProductPublishReady', () => {
  it('requires complete human review and a verified public handoff', () => {
    expect(isDatabaseProductPublishReady({ enrichment, handoff })).toBe(true)
    expect(isDatabaseProductPublishReady({ enrichment: null, handoff })).toBe(false)
    expect(isDatabaseProductPublishReady({ enrichment, handoff: null })).toBe(false)
  })

  it.each([
    ['cleanedTitle', ''],
    ['shortSummary', ''],
    ['suggestedTags', []],
    ['reviewedBy', ''],
    ['reviewedAt', ''],
  ] as const)('rejects incomplete reviewed field %s', (field, value) => {
    expect(isDatabaseProductPublishReady({
      enrichment: { ...enrichment, [field]: value },
      handoff,
    })).toBe(false)
  })
})
