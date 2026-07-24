import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from '../page'

const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')

describe('RadarScout about page', () => {
  it('describes the current Thailand decision-support product honestly', () => {
    expect(metadata.title).toBe('About RadarScout | Thailand Day-Trip Decision Support')
    expect(metadata.description).toContain('Thailand day trips')
    expect(source).toContain('Thailand trip decisions should feel clearer')
    expect(source).toContain('Why we recommend it')
    expect(source).toContain('Who it suits')
    expect(source).toContain('What to check before choosing')
  })

  it('keeps booking and product facts with the reviewed affiliate partners', () => {
    expect(source).toContain('Reviewed product records')
    expect(source).toContain('Viator')
    expect(source).toContain('Agoda')
    expect(source).toContain('RadarScout does not take payment')
    expect(source).toContain('Check availability')
  })

  it('removes the obsolete Reddit monitoring positioning', () => {
    expect(source).not.toMatch(/Reddit conversations/i)
    expect(source).not.toMatch(/competitor complaints/i)
    expect(source).not.toMatch(/founders, marketers, and sales teams/i)
  })
})
