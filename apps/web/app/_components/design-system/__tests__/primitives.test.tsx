import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
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

  it('renders reviewed partner media with an honest fallback for cards without images', () => {
    const imageUrl =
      'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450'
    const withImage = renderToStaticMarkup(
      ExperienceCard({
        title: 'Gentle Chiang Mai day',
        summary: 'A calm way to compare trusted local experiences.',
        imageUrl,
        imageAlt: 'Elephants at a reviewed Chiang Mai experience',
      }),
    )
    const withoutImage = renderToStaticMarkup(
      ExperienceCard({
        title: 'Future Thailand experience',
        summary: 'A planning-only card without reviewed media yet.',
      }),
    )

    expect(withImage).toContain('<img')
    expect(withImage).toContain('https://imgcdn.bokun.tools/example.jpeg')
    expect(withImage).toContain('alt="Elephants at a reviewed Chiang Mai experience"')
    expect(withImage).not.toContain('visual placeholder')
    expect(withoutImage).not.toContain('<img')
    expect(withoutImage).toContain('linear-gradient')
  })

  it('passes existing reviewed seed media into homepage experience cards', () => {
    const homepage = readFileSync('app/page.tsx', 'utf8')

    expect(homepage).toContain('imageUrl={product.imageUrl}')
    expect(homepage).toContain('imageAlt={product.imageAlt ?? product.title}')
    expect(homepage).not.toContain('imageAlt={`${product.title} visual placeholder`}')
  })
})
