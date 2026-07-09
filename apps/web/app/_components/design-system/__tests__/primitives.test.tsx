import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { Button, ExperienceCard, Nav, Section } from '../index'

const unsafeCopyPattern =
  /live availability|available now|instant confirmation|checkout|payment|booking complete|Bókun backend|Bókun database|Bókun-powered|partner rate|supplier net rate|commission/i

describe('RadarScout design system primitives', () => {
  it('exposes additive design tokens without external font or asset imports', () => {
    const globals = readFileSync('app/globals.css', 'utf8')
    const tailwind = readFileSync('tailwind.config.ts', 'utf8')

    expect(globals).toContain('--rs-forest-900: #0f241c')
    expect(globals).toContain('--rs-terracotta: #d57c48')
    expect(globals).toContain('--rs-radius-lg: 1.75rem')
    expect(globals).toContain('--rs-font-display')
    expect(tailwind).toContain("'rs-display'")
    expect(tailwind).toContain("'rs-soft'")
    expect(`${globals}\n${tailwind}`).not.toMatch(/fonts\.googleapis|cdn\./i)
  })

  it('renders a primary button primitive with the expedition CTA treatment', () => {
    const element = Button({ href: '/ai-trip-planner', children: 'Plan with RadarScout' })

    expect(element.props.href).toBe('/ai-trip-planner')
    expect(element.props.className).toContain('rounded-rs-pill')
    expect(element.props.className).toContain('bg-rs-terracotta')
    expect(element.props.className).toContain('min-h-[52px]')
  })

  it('keeps card, nav, and section primitives free of forbidden booking claims', () => {
    const card = ExperienceCard({
      title: 'Gentle Chiang Mai day',
      summary: 'A calm way to compare trusted local experiences.',
      eyebrow: 'Chiang Mai',
      tags: ['Nature', 'Family'],
    })
    const nav = Nav({
      logo: 'RadarScout',
      links: [{ href: '/ai-trip-planner', label: 'Trip planner' }],
      cta: { href: '/ai-trip-planner', label: 'Plan a trip' },
    })
    const section = Section({
      eyebrow: 'Thailand',
      title: 'Thoughtfully planned experiences',
      lead: 'Compare guided ideas before continuing with a booking partner.',
      children: null,
    })

    expect(card.type).toBeDefined()
    expect(nav.type).toBe('header')
    expect(section.type).toBe('section')

    const source = [
      readFileSync('app/_components/design-system/Button.tsx', 'utf8'),
      readFileSync('app/_components/design-system/Card.tsx', 'utf8'),
      readFileSync('app/_components/design-system/Nav.tsx', 'utf8'),
      readFileSync('app/_components/design-system/Section.tsx', 'utf8'),
    ].join('\n')

    expect(source).not.toMatch(unsafeCopyPattern)
  })
})
