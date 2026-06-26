import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const homepageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')

describe('homepage public copy safety', () => {
  it('does not use available-now wording in visible FAQ copy', () => {
    expect(homepageSource).not.toMatch(/available now/i)
    expect(homepageSource).toContain('Is RadarScout a marketplace with every country currently shown?')
  })
})
