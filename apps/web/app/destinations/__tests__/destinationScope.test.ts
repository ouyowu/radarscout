import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { globalDestinations } from '@/lib/global-destinations'
import { metadata } from '../page'

const destinationsPageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const destinationDetailSource = readFileSync(new URL('../[slug]/page.tsx', import.meta.url), 'utf8')

describe('destination scope positioning', () => {
  it('keeps Thailand as the only focused destination with product coverage', () => {
    const focused = globalDestinations.filter(destination => destination.hasLiveInventory)
    const planningOnly = globalDestinations.filter(destination => !destination.hasLiveInventory)

    expect(focused.map(destination => destination.slug)).toEqual(['thailand'])
    expect(planningOnly.length).toBeGreaterThan(0)
    expect(planningOnly.every(destination => destination.comingSoon)).toBe(true)
  })

  it('positions the destination portal as Thailand-first', () => {
    expect(metadata.description).toContain('Thailand-first AI trip planning')
    expect(metadata.description).toContain('other routes remain planning-only')
    expect(destinationsPageSource).toContain('Thailand-first destination planning, with other routes planning-only.')
    expect(destinationsPageSource).toContain('Thailand-first coverage')
    expect(destinationsPageSource).toContain('Planning guides for future partner coverage.')
    expect(destinationsPageSource).toContain('remain planning-only until local supplier coverage')

    expect(destinationsPageSource).not.toContain('selected top travel destinations')
    expect(destinationsPageSource).not.toContain('high-demand travel countries')
    expect(destinationsPageSource).not.toContain('Selected travel countries')
  })

  it('keeps non-Thailand destination detail pages clearly planning-only', () => {
    expect(destinationDetailSource).toContain('Travel Planning Guide | Planning-Only')
    expect(destinationDetailSource).toContain('planning-only destination while RadarScout onboards trusted local suppliers')
    expect(destinationDetailSource).toContain('planning-only route guide')
    expect(destinationDetailSource).toContain('product recommendations stay off until trusted local supplier coverage is reviewed')
    expect(destinationDetailSource).toContain('Planning only — partner tours are coming soon')
    expect(destinationDetailSource).toContain('It does not display fake products, affiliate products, or unsupported availability claims')
  })
})
