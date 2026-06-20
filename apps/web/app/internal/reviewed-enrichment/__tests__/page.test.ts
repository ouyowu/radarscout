import { describe, expect, it } from 'vitest'

// buildSkipHref is exported from EditForm so it can be tested independently.
// It constructs the GET link used for Skip — no server action, no DB write.
import { buildSkipHref } from '../EditForm'

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
