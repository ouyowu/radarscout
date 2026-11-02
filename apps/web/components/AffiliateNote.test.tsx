import React from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AffiliateNote } from './AffiliateNote'

const webRoot = process.cwd()

const handoffButtonComponents = [
  'app/tours/[id]/page.tsx',
  'app/tours/[id]/DetailComparisonBlock.tsx',
  'app/ai-trip-planner/AiSearchProductCard.tsx',
  'app/ai-trip-planner/IntentParserDemo.tsx',
  'app/itineraries/thailand/[city]/[duration]/ItineraryWorkspace.tsx',
  'app/phuket/island-day-selector/PhuketIslandDaySelectorClient.tsx',
  'app/planner/AgodaStayAreaPanel.tsx',
  'app/planner/PlannerItineraryWorkspace.tsx',
  'app/chiang-mai/elephant-camp-finder/ElephantCampFinderClient.tsx',
] as const

describe('AffiliateNote', () => {
  it('states the commission and links to the disclosure page', () => {
    const markup = renderToStaticMarkup(<AffiliateNote />)

    expect(markup).toContain('We may earn a commission if you book through this link, at no extra cost to you.')
    expect(markup).toContain('text-gray-500')
    expect(markup).toContain('href="/affiliate-disclosure"')
    expect(markup).toContain('How we make money')
  })

  it('uses one linked line in the compact sticky note and light text when asked', () => {
    const compact = renderToStaticMarkup(<AffiliateNote compact />)
    const light = renderToStaticMarkup(<AffiliateNote className="text-white/70" />)

    expect(compact).toContain('>We may earn a commission. How we make money</a>')
    expect(compact).toContain('href="/affiliate-disclosure"')
    expect(compact).toContain('text-gray-500')
    expect(compact).not.toContain('at no extra cost to you')
    expect(light).toContain('text-white/70')
    expect(light).not.toContain('text-gray-500')
    expect(light).toContain('at no extra cost to you')
  })

  it('is rendered by every Viator or Agoda handoff button component', () => {
    for (const relativePath of handoffButtonComponents) {
      const source = readFileSync(join(webRoot, relativePath), 'utf8')
      expect(source, relativePath).toMatch(/<AffiliateNote(?:\s[^>]*?)?\s*\/>/)
      expect(source, relativePath).toContain("from '@/components/AffiliateNote'")
    }

    const tourDetail = readFileSync(join(webRoot, 'app/tours/[id]/page.tsx'), 'utf8')
    expect(tourDetail).toContain('<AffiliateNote className="text-white/70" />')
    expect(tourDetail).toContain('<AffiliateNote compact />')
    expect(tourDetail).toContain('pb-28 md:pb-0')
  })
})
