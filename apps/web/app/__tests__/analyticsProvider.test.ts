import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const layoutSource = readFileSync(new URL('../layout.tsx', import.meta.url), 'utf8')
const analyticsSource = readFileSync(new URL('../../lib/analytics/track.ts', import.meta.url), 'utf8')

describe('Vercel analytics provider', () => {
  it('loads Vercel Web Analytics from the root layout', () => {
    expect(layoutSource).toContain("import { Analytics } from '@vercel/analytics/next'")
    expect(layoutSource).toContain('<Analytics />')
  })

  it('flushes approved funnel events through the Vercel analytics provider without secrets', () => {
    expect(analyticsSource).toContain("import { track as trackVercelEvent } from '@vercel/analytics'")
    expect(analyticsSource).toContain('trackVercelEvent(event, props)')
    expect(analyticsSource).toContain('homepage_finder_entry_clicked')
    expect(analyticsSource).toContain('finder_planner_choice_selected')
    expect(analyticsSource).toContain('finder_matching_experiences_clicked')
    expect(analyticsSource).toContain('booking_partner_handoff_clicked')
    expect(analyticsSource).not.toMatch(/NEXT_PUBLIC_ANALYTICS|PLAUSIBLE|GOOGLE_ANALYTICS|GA_MEASUREMENT/i)
  })
})
