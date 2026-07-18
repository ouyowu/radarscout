import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from './page'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

describe('affiliate disclosure', () => {
  it('stays out of search while explaining the partner boundary and evaluation metrics', () => {
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(source).toContain('revenue per 100 eligible page visits')
    expect(source).toContain('earnings per click')
    expect(source).toContain('conversion rate')
    expect(source).toContain('cancellation rate')
    expect(source).toContain('The partner website handles')
  })
})
