import React from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { guideCitySlugs, thailandGuideArticles } from '@/lib/guides/thailandGuides'
import { groupAnswersByCity, thailandAnswers } from '@/lib/qa/thailandAnswers'
import ThailandAnswersPage from '../page'

const cityHubSource = readFileSync(
  join(process.cwd(), 'app/thailand/[city]/page.tsx'),
  'utf8',
)

describe('answers city anchors', () => {
  beforeEach(() => {
    vi.stubGlobal('React', React)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses a known city slug for every group and skips empty groups', () => {
    const grouped = groupAnswersByCity()

    expect(grouped.length).toBeGreaterThan(0)
    for (const group of grouped) {
      expect(guideCitySlugs).toContain(group.citySlug)
      expect(group.answers.length).toBeGreaterThan(0)
    }

    const withoutPhuket = thailandAnswers.filter(answer => answer.citySlug !== 'phuket')
    const remaining = groupAnswersByCity(withoutPhuket)
    expect(remaining.map(group => group.citySlug)).not.toContain('phuket')
    expect(remaining.every(group => group.answers.length > 0)).toBe(true)
  })

  it('keeps each answer identical to its guide and links the reviewed source', () => {
    for (const answer of thailandAnswers) {
      const guide = thailandGuideArticles.find(article => article.slug === answer.slug)
      expect(guide).toBeDefined()
      expect(answer.answer).toBe(guide!.quickAnswer)
      expect(answer.reviewedBy).toBe(guide!.reviewedBy)
      expect(answer.reviewedBy.trim().length).toBeGreaterThan(0)
      expect(answer.sourceHref).toBe(`/guides/${answer.citySlug}/${answer.slug}`)
    }
  })

  it('renders a jump link and a section for each city that has answers', () => {
    const markup = renderToStaticMarkup(<ThailandAnswersPage />)

    for (const citySlug of ['bangkok', 'chiang-mai', 'phuket'] as const) {
      expect(markup).toContain(`id="${citySlug}"`)
      expect(markup).toContain(`href="#${citySlug}"`)
      expect(markup).toContain(`id="${citySlug}-heading"`)
    }
  })

  it('deep-links each city hub to its answers group', () => {
    expect(cityHubSource).toContain('hasCityAnswers ? `/answers#${params.city}` : \'/answers\'')
    expect(cityHubSource).toContain('Quick answers for {city.name}')
  })
})
