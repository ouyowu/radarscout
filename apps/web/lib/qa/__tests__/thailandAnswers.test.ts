import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { thailandGuideArticles } from '@/lib/guides/thailandGuides'
import {
  buildFaqPageSchema,
  buildThailandAnswers,
  groupAnswersByCity,
  latestAnswerReviewDate,
  thailandAnswers,
} from '../thailandAnswers'

const pageSource = readFileSync(join(process.cwd(), 'app/answers/page.tsx'), 'utf8')
const sitemapSource = readFileSync(join(process.cwd(), 'app/sitemap.ts'), 'utf8')

describe('thailand answers', () => {
  it('derives every answer from a reviewed guide rather than new copy', () => {
    expect(thailandAnswers.length).toBeGreaterThan(0)

    for (const answer of thailandAnswers) {
      const guide = thailandGuideArticles.find(article => article.href === answer.id)
      expect(guide).toBeDefined()
      // The published text must be the guide's own, character for character.
      expect(answer.question).toBe(guide!.title)
      expect(answer.answer).toBe(guide!.quickAnswer)
      expect(answer.reviewedBy).toBe(guide!.reviewedBy)
      expect(answer.sourceHref).toBe(guide!.href)
      expect(answer.id).toBe(guide!.href)
    }
  })

  it('skips a guide that carries no reviewer or no short answer', () => {
    const [sample] = thailandGuideArticles
    expect(sample).toBeDefined()

    expect(buildThailandAnswers([{ ...sample, reviewedBy: '  ' }])).toHaveLength(0)
    expect(buildThailandAnswers([{ ...sample, quickAnswer: '' }])).toHaveLength(0)
    expect(buildThailandAnswers([sample])).toHaveLength(1)
  })

  it('publishes the same text to readers and to answer engines', () => {
    const schema = buildFaqPageSchema()
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(thailandAnswers.length)

    for (const [index, entity] of schema.mainEntity.entries()) {
      const answer = thailandAnswers[index]
      expect(entity['@type']).toBe('Question')
      expect(entity.name).toBe(answer.question)
      expect(entity.acceptedAnswer.text).toBe(answer.answer)
      expect(entity.acceptedAnswer.url).toBe(`https://www.radarscout.io${answer.sourceHref}`)
    }
  })

  it('groups answers by city without losing or duplicating any', () => {
    const grouped = groupAnswersByCity()
    const flattened = grouped.flatMap(group => group.answers)
    expect(flattened).toHaveLength(thailandAnswers.length)
    expect(new Set(flattened.map(a => a.id)).size).toBe(thailandAnswers.length)

    for (const group of grouped) {
      for (const answer of group.answers) {
        expect(answer.cityName).toBe(group.cityName)
      }
    }
  })

  it('keeps answer ids unique even where guide slugs repeat across cities', () => {
    const slugs = thailandGuideArticles.map(article => article.slug)
    // Several cities publish a `where-to-stay` guide, so slug is not identity.
    expect(new Set(slugs).size).toBeLessThan(slugs.length)
    expect(new Set(thailandAnswers.map(a => a.id)).size).toBe(thailandAnswers.length)
  })

  it('reports the most recent review date', () => {
    const latest = latestAnswerReviewDate()
    expect(latest).not.toBeNull()
    for (const answer of thailandAnswers) {
      expect(answer.updatedAt <= latest!).toBe(true)
    }
    expect(latestAnswerReviewDate([])).toBeNull()
  })

  it('renders the FAQ schema and links each answer back to its guide', () => {
    expect(pageSource).toContain('buildFaqPageSchema()')
    expect(pageSource).toContain('<JsonLd data={buildFaqPageSchema()} />')
    expect(pageSource).toContain('answer.sourceHref')
    expect(pageSource).toContain('Reviewed by {answer.reviewedBy}')
  })

  it('lists the hub in the sitemap', () => {
    expect(sitemapSource).toContain("['/answers', 'weekly', 0.8]")
  })
})
