import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(join(process.cwd(), 'app', 'tours', '[id]', 'page.tsx'), 'utf8')

describe('tour detail handoff context', () => {
  it('accepts only a boolean date-presence marker from the internal planner link', () => {
    expect(source).toMatch(/hasDates\?: string/)
    expect(source).toMatch(/const hasDates = isFromAiTripPlanner && searchParams\?\.hasDates === '1'/)
    expect(source).toMatch(/city=\{location\}/)
    expect(source).toMatch(/hasDates=\{hasDates\}/)
    expect(source).not.toMatch(/searchParams\?\.(?:startDate|endDate)/)
  })
})
