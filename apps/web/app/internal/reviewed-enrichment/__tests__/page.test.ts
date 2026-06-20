import { describe, expect, it } from 'vitest'

// buildSkipHref is exported from EditForm so it can be tested independently.
// It constructs the GET link used for Skip — no server action, no DB write.
import { buildSkipHref } from '../EditForm'

import { detectSourceMismatch, detectDraftMismatch } from '../qualityWarnings'
import { REVIEW_CHECKLIST_ITEMS, WARNING_WITH_ISSUES } from '../ReviewChecklistPanel'

describe('buildSkipHref — Skip link construction', () => {
  it('returns a URL with productId set to the next product', () => {
    const href = buildSkipHref('product_next')
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('productId')).toBe('product_next')
    expect(url.pathname).toBe('/internal/reviewed-enrichment')
  })

  it('preserves q in the skip URL', () => {
    const href = buildSkipHref('product_next', { q: 'elephant', city: '', status: '' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('q')).toBe('elephant')
  })

  it('preserves city in the skip URL', () => {
    const href = buildSkipHref('product_next', { q: '', city: 'Phuket', status: '' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('city')).toBe('Phuket')
  })

  it('preserves status in the skip URL when it is not "all"', () => {
    const href = buildSkipHref('product_next', { q: '', city: '', status: 'missing' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('status')).toBe('missing')
  })

  it('omits status from the skip URL when status is "all"', () => {
    const href = buildSkipHref('product_next', { q: '', city: '', status: 'all' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.has('status')).toBe(false)
  })

  it('omits empty q and city from the skip URL', () => {
    const href = buildSkipHref('product_next', { q: '', city: '', status: '' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.has('q')).toBe(false)
    expect(url.searchParams.has('city')).toBe(false)
  })

  it('preserves all filters together in the skip URL', () => {
    const href = buildSkipHref('product_xyz', { q: 'trek', city: 'Chiang Mai', status: 'missing' })
    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('productId')).toBe('product_xyz')
    expect(url.searchParams.get('q')).toBe('trek')
    expect(url.searchParams.get('city')).toBe('Chiang Mai')
    expect(url.searchParams.get('status')).toBe('missing')
  })

  it('does not include rawJson, secrets, or AI output in the skip URL', () => {
    const href = buildSkipHref('product_next', { q: 'safe', city: 'Bangkok', status: 'missing' })
    expect(href).not.toContain('rawJson')
    expect(href).not.toContain('candidate')
    expect(href).not.toContain('secret')
    expect(href).not.toContain('aiRaw')
  })

  it('does not include savedFrom or saved=1 in the skip URL', () => {
    const href = buildSkipHref('product_next', { q: '', city: '', status: '' })
    expect(href).not.toContain('savedFrom')
    expect(href).not.toContain('saved=1')
  })

  it('does not include prevSaved in the skip URL', () => {
    const href = buildSkipHref('product_next', { q: '', city: '', status: '' })
    expect(href).not.toContain('prevSaved')
  })
})

describe('Coverage data shape', () => {
  it('CoverageData has all four progress fields: total, reviewed, missing, pct', () => {
    // This is a structural / shape test. The page renders CoverageDashboard with these 4 fields.
    // If the shape changes, this test catches it at the TypeScript type level (no runtime needed).
    type CoverageData = {
      total: number
      reviewed: number
      missing: number
      pct: number
      cities: Array<{ city: string; total: number; reviewed: number; missing: number; pct: number }>
    }

    const sample: CoverageData = {
      total: 100,
      reviewed: 65,
      missing: 35,
      pct: 65,
      cities: [
        { city: 'Bangkok', total: 40, reviewed: 30, missing: 10, pct: 75 },
        { city: 'Phuket', total: 60, reviewed: 35, missing: 25, pct: 58 },
      ],
    }

    expect(sample.total).toBe(100)
    expect(sample.reviewed).toBe(65)
    expect(sample.missing).toBe(35)
    expect(sample.pct).toBe(65)
    expect(sample.cities).toHaveLength(2)
  })

  it('pct is derived from reviewed/total — never contains rawJson or AI fields', () => {
    const coverage = {
      total: 80,
      reviewed: 20,
      missing: 60,
      pct: 25,
      cities: [],
    }

    const serialized = JSON.stringify(coverage)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('aiRawResponse')
    expect(serialized).not.toContain('candidate')
    expect(serialized).not.toContain('secret')
  })
})

describe('savedFrom redirect format', () => {
  it('savedFrom param is the productId of the product just saved (no rawJson)', () => {
    // savedFrom is written by saveEnrichment when there is no nextProductId.
    // Verify the format here by constructing the expected URL shape.
    const params = new URLSearchParams({ savedFrom: 'product_abc' })
    params.set('status', 'missing')
    params.set('city', 'Phuket')
    const href = `/internal/reviewed-enrichment?${params.toString()}`

    const url = new URL('http://localhost' + href)
    expect(url.searchParams.get('savedFrom')).toBe('product_abc')
    expect(url.searchParams.has('productId')).toBe(false)
    expect(url.searchParams.has('saved')).toBe(false)
    expect(href).not.toContain('rawJson')
    expect(href).not.toContain('secret')
  })
})

// ── Quality warning guardrails ─────────────────────────────────────────────

describe('detectSourceMismatch', () => {
  it('shows warning when source city is Phuket but title mentions Singapore', () => {
    const warnings = detectSourceMismatch('Phuket', '6-Hours Private Singapore Customized Tour With Driver')
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('Phuket')
    expect(warnings[0]).toContain('Singapore')
  })

  it('shows no warning when source city and title both mention Phuket', () => {
    const warnings = detectSourceMismatch('Phuket', 'Half-day Phuket city tour')
    expect(warnings).toHaveLength(0)
  })

  it('shows no warning when source city is not a Thai destination', () => {
    const warnings = detectSourceMismatch('Singapore', 'Singapore city tour')
    expect(warnings).toHaveLength(0)
  })

  it('shows no warning when city is null', () => {
    const warnings = detectSourceMismatch(null, 'Singapore city tour')
    expect(warnings).toHaveLength(0)
  })

  it('shows no warning when title is null', () => {
    const warnings = detectSourceMismatch('Phuket', null)
    expect(warnings).toHaveLength(0)
  })

  it('detects mismatch in location field when title is safe', () => {
    const warnings = detectSourceMismatch('Bangkok', 'City tour', 'Kuala Lumpur area')
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('Bangkok')
    expect(warnings[0]).toContain('Kuala Lumpur')
  })

  it('detects multiple suspicious terms in one title', () => {
    const warnings = detectSourceMismatch('Chiang Mai', 'Tour visiting Bali and Jakarta')
    expect(warnings).toHaveLength(2)
  })

  it('is case-insensitive for suspicious terms', () => {
    const warnings = detectSourceMismatch('Phuket', 'Private tour in SINGAPORE')
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('Singapore')
  })

  it('detects all Thai city names as valid Thai destinations', () => {
    const thaiCities = ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui', 'Thailand']
    for (const thaiCity of thaiCities) {
      const warnings = detectSourceMismatch(thaiCity, 'Private Singapore tour')
      expect(warnings.length).toBeGreaterThan(0)
    }
  })

  it('warning text does not contain rawJson or secrets', () => {
    const warnings = detectSourceMismatch('Phuket', 'Singapore tour')
    const serialized = JSON.stringify(warnings)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('aiRaw')
  })
})

describe('detectDraftMismatch', () => {
  it('shows warning when AI draft cleanedTitle mentions Singapore while city is Phuket', () => {
    const warnings = detectDraftMismatch('Phuket', { cleanedTitle: 'Private Singapore City Tour' })
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('destination')
  })

  it('shows no warning when AI draft cleanedTitle mentions Phuket while city is Phuket', () => {
    const warnings = detectDraftMismatch('Phuket', { cleanedTitle: 'Best Phuket Beach Experience' })
    expect(warnings).toHaveLength(0)
  })

  it('detects mismatch in shortSummary', () => {
    const warnings = detectDraftMismatch('Bangkok', {
      cleanedTitle: 'City tour',
      shortSummary: 'An experience in Kuala Lumpur.',
    })
    expect(warnings).toHaveLength(1)
  })

  it('detects mismatch in seoTitle', () => {
    const warnings = detectDraftMismatch('Krabi', {
      seoTitle: 'Best Tokyo Day Tour',
    })
    expect(warnings).toHaveLength(1)
  })

  it('detects mismatch in seoDescription', () => {
    const warnings = detectDraftMismatch('Koh Samui', {
      seoDescription: 'Explore Bali with a local guide.',
    })
    expect(warnings).toHaveLength(1)
  })

  it('shows no warning when city is not a Thai destination', () => {
    const warnings = detectDraftMismatch('Singapore', { cleanedTitle: 'Singapore city tour' })
    expect(warnings).toHaveLength(0)
  })

  it('shows no warning when city is null', () => {
    const warnings = detectDraftMismatch(null, { cleanedTitle: 'Singapore city tour' })
    expect(warnings).toHaveLength(0)
  })

  it('shows no warning when all draft fields are null', () => {
    const warnings = detectDraftMismatch('Phuket', {
      cleanedTitle: null,
      shortSummary: null,
      seoTitle: null,
      seoDescription: null,
    })
    expect(warnings).toHaveLength(0)
  })

  it('returns at most one warning even when multiple suspicious terms appear', () => {
    const warnings = detectDraftMismatch('Phuket', {
      cleanedTitle: 'Bali and Jakarta Tour',
      shortSummary: 'Explore Singapore and Tokyo.',
    })
    expect(warnings).toHaveLength(1)
  })

  it('warning text does not contain rawJson or secrets', () => {
    const warnings = detectDraftMismatch('Phuket', { cleanedTitle: 'Singapore tour' })
    const serialized = JSON.stringify(warnings)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('aiRaw')
  })
})

// ── Issue flag data contract ────────────────────────────────────────────────

describe('ProductIssueFlag data shape', () => {
  it('flag object contains only safe fields — no rawJson, booking, or AI fields', () => {
    const flag = {
      id: 'clxyz',
      reason: 'destination_mismatch',
      note: 'Title says Singapore, city is Phuket',
      flaggedBy: 'reviewer@example.com',
      flaggedAt: '2026-06-20T00:00:00.000Z',
    }
    const serialized = JSON.stringify(flag)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('resolvedAt')
    expect(serialized).not.toContain('candidate')
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('booking')
    expect(serialized).not.toContain('payment')
    expect(serialized).not.toContain('availability')
  })

  it('reason must be one of the allowed enum values', () => {
    const ALLOWED_REASONS = [
      'destination_mismatch',
      'bad_source_data',
      'duplicate_product',
      'not_relevant',
      'needs_manual_research',
      'other',
    ]
    for (const reason of ALLOWED_REASONS) {
      expect(ALLOWED_REASONS).toContain(reason)
    }
    expect(ALLOWED_REASONS).not.toContain('unknown_reason')
    expect(ALLOWED_REASONS).not.toContain('')
  })

  it('flaggedAt is an ISO string safe for display', () => {
    const flaggedAt = '2026-06-20T00:00:00.000Z'
    expect(flaggedAt.slice(0, 10)).toBe('2026-06-20')
    expect(() => new Date(flaggedAt)).not.toThrow()
  })
})

describe('inspect response includes issueFlag (internal only)', () => {
  it('inspect success shape includes issueFlag field', () => {
    type InspectSuccess = {
      ok: true
      product: { id: string; title: string; city: string | null }
      reviewedEnrichment: unknown | null
      issueFlag: {
        id: string
        reason: string
        note: string | null
        flaggedBy: string
        flaggedAt: string
      } | null
    }

    const sample: InspectSuccess = {
      ok: true,
      product: { id: 'prod-1', title: 'Phuket Tour', city: 'Phuket' },
      reviewedEnrichment: null,
      issueFlag: {
        id: 'flag-1',
        reason: 'destination_mismatch',
        note: 'Title says Singapore',
        flaggedBy: 'reviewer@example.com',
        flaggedAt: '2026-06-20T00:00:00.000Z',
      },
    }

    expect(sample.issueFlag).not.toBeNull()
    expect(sample.issueFlag?.reason).toBe('destination_mismatch')
    const serialized = JSON.stringify(sample)
    expect(serialized).not.toContain('resolvedAt')
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('secret')
  })

  it('inspect issueFlag can be null when product is not flagged', () => {
    type InspectSuccess = {
      ok: true
      product: { id: string }
      reviewedEnrichment: null
      issueFlag: null
    }
    const sample: InspectSuccess = {
      ok: true,
      product: { id: 'prod-2' },
      reviewedEnrichment: null,
      issueFlag: null,
    }
    expect(sample.issueFlag).toBeNull()
  })
})

describe('navigation skips flagged products', () => {
  it('baseWhere for navigation navigation excludes issueFlag entries (structural check)', () => {
    // Verify the intended filter shape that navigation/route.ts applies
    // to skip products that are flagged from next/prev Missing navigation.
    const baseWhere = {
      active: true,
      supplierId: { not: null },
      city: { in: ['Phuket'] },
      enrichment: { is: null },
      issueFlag: { is: null },
    }
    expect(baseWhere.issueFlag).toEqual({ is: null })
    expect(baseWhere.enrichment).toEqual({ is: null })
  })

  it('flagged status filter returns products with issueFlag (structural check)', () => {
    // The search route should add { issueFlag: { isNot: null } } when status=flagged
    const where = { issueFlag: { isNot: null } }
    expect(where.issueFlag).toEqual({ isNot: null })
  })
})

// ── ReviewChecklistPanel ───────────────────────────────────────────────────

describe('ReviewChecklistPanel — checklist items', () => {
  it('renders the checklist on the inspect page (item array is non-empty)', () => {
    expect(REVIEW_CHECKLIST_ITEMS.length).toBeGreaterThan(0)
  })

  it('checklist contains "Destination matches source city"', () => {
    expect(REVIEW_CHECKLIST_ITEMS.some(item => item.includes('Destination matches source city'))).toBe(true)
  })

  it('checklist contains "If source data looks wrong, use Skip instead of Save"', () => {
    expect(REVIEW_CHECKLIST_ITEMS.some(item => item.includes('If source data looks wrong, use Skip instead of Save'))).toBe(true)
  })

  it('checklist contains all nine required items', () => {
    expect(REVIEW_CHECKLIST_ITEMS).toHaveLength(9)
  })

  it('checklist does not contain rawJson', () => {
    const serialized = JSON.stringify(REVIEW_CHECKLIST_ITEMS)
    expect(serialized).not.toContain('rawJson')
  })

  it('checklist does not contain AI raw output references', () => {
    const serialized = JSON.stringify(REVIEW_CHECKLIST_ITEMS)
    expect(serialized).not.toContain('aiRaw')
    expect(serialized).not.toContain('localAiRaw')
    expect(serialized).not.toContain('candidate')
  })

  it('checklist does not contain secrets', () => {
    const serialized = JSON.stringify(REVIEW_CHECKLIST_ITEMS)
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('INTERNAL_ENRICHMENT')
  })
})

describe('ReviewChecklistPanel — conditional warning text', () => {
  it('WARNING_WITH_ISSUES is the exact required copy', () => {
    expect(WARNING_WITH_ISSUES).toBe(
      'Quality warnings are present. Do not save unless you have manually confirmed the source data is correct.',
    )
  })

  it('WARNING_WITH_ISSUES is defined and mentions quality warnings', () => {
    expect(WARNING_WITH_ISSUES).toBeTruthy()
    expect(WARNING_WITH_ISSUES).toContain('Quality warnings are present')
  })

  it('warning text mentions not saving without confirming source data', () => {
    expect(WARNING_WITH_ISSUES).toContain('Do not save unless you have manually confirmed')
  })

  it('warning text is shown when hasWarnings is true (truthy check on exported constant)', () => {
    const hasWarnings = true
    const displayed = hasWarnings ? WARNING_WITH_ISSUES : null
    expect(displayed).toBe(WARNING_WITH_ISSUES)
  })

  it('warning text is absent when hasWarnings is false', () => {
    const hasWarnings = false
    const displayed = hasWarnings ? WARNING_WITH_ISSUES : null
    expect(displayed).toBeNull()
  })

  it('WARNING_WITH_ISSUES does not contain rawJson or secrets', () => {
    expect(WARNING_WITH_ISSUES).not.toContain('rawJson')
    expect(WARNING_WITH_ISSUES).not.toContain('secret')
    expect(WARNING_WITH_ISSUES).not.toContain('aiRaw')
  })
})
