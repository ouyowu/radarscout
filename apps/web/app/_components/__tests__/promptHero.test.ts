import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { buildIdeaHref, exampleChips } from '../promptHero.helpers'
import { parseTripIntent } from '../../../lib/ai-trip/parse-intent'

const source = readFileSync(new URL('../PromptHero.tsx', import.meta.url), 'utf8')

describe('PromptHero idea href', () => {
  it('encodes the prompt and lands in Planner Studio', () => {
    expect(buildIdeaHref('Gentle elephant day in Chiang Mai')).toBe(
      '/planner?idea=Gentle%20elephant%20day%20in%20Chiang%20Mai',
    )
  })

  it('trims whitespace before encoding', () => {
    expect(buildIdeaHref('  Chiang Mai cooking and local food day  ')).toBe(
      '/planner?idea=Chiang%20Mai%20cooking%20and%20local%20food%20day',
    )
  })

  it('falls back to the bare Planner Studio when the prompt is empty or blank', () => {
    expect(buildIdeaHref('')).toBe('/planner')
    expect(buildIdeaHref('   ')).toBe('/planner')
  })
})

describe('PromptHero example chips', () => {
  it('offers at least three non-empty starter prompts', () => {
    expect(exampleChips.length).toBeGreaterThanOrEqual(3)
    exampleChips.forEach(chip => expect(chip.trim().length).toBeGreaterThan(0))
  })

  it('includes the Chiang Mai elephant starter used by homepage E2E', () => {
    expect(exampleChips).toContain('Gentle elephant day in Chiang Mai')
  })

  it('keeps every starter compatible with the deterministic Chiang Mai parser flow', () => {
    for (const chip of exampleChips) {
      const parsed = parseTripIntent(chip)

      expect(parsed.intent.destination, chip).toBe('Chiang Mai')
      expect(parsed.intent.interests.length, chip).toBeGreaterThan(0)
    }
  })
})

describe('PromptHero component source', () => {
  it('renders a labelled prompt input at the top of the hero', () => {
    expect(source).toContain('id="hero-trip-idea"')
    expect(source).toContain('Describe your ideal Thailand trip')
  })

  it('wires a submit action and the chips to the planner via buildIdeaHref', () => {
    expect(source).toContain('Plan my trip')
    expect(source).toContain('buildIdeaHref')
    expect(source).toContain('exampleChips')
    expect(source).toContain("router.push(buildIdeaHref(nextIdea))")
  })

  it('fires the homepage entry analytics event on submit and chip clicks', () => {
    expect(source).toContain("track('homepage_finder_entry_clicked'")
    expect(source).toContain("go(idea, 'hero_prompt')")
    expect(source).toContain("go(chip, 'hero_chip')")
  })

  it('keeps honest, safe hero copy — no AI/price/availability/cart claims', () => {
    expect(source).toContain('Curated Viator shortlist')
    expect(source).toContain('We narrow the options before you compare')
    expect(source).not.toMatch(/\bAI\b/)
    expect(source).not.toMatch(/\bprice\b/i)
    expect(source).not.toMatch(/\bavailability\b/i)
    expect(source).not.toMatch(/add to cart/i)
    expect(source).not.toMatch(/book now/i)
    expect(source).not.toMatch(/\bcheapest\b|lowest price|best[- ]selling|sales rank/i)
  })
})
