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
    expect(markup).toContain('href="/affiliate-disclosure"')
    expect(markup).toContain('How we make money')
  })

  it('is rendered by every Viator or Agoda handoff button component', () => {
    for (const relativePath of handoffButtonComponents) {
      const source = readFileSync(join(webRoot, relativePath), 'utf8')
      expect(source, relativePath).toContain('<AffiliateNote />')
      expect(source, relativePath).toContain("from '@/components/AffiliateNote'")
    }
  })
})
