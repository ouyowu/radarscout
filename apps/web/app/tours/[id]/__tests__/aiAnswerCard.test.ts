import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { loadActivityFeedV1 } from '@/lib/activityFeed/activityFeedV1'
import { AiAnswerCard } from '../AiAnswerCard'

const pageSource = readFileSync(join(process.cwd(), 'app', 'tours', '[id]', 'page.tsx'), 'utf8')
const cardSource = readFileSync(join(process.cwd(), 'app', 'tours', '[id]', 'AiAnswerCard.tsx'), 'utf8')

describe('tour detail AI Answer Card', () => {
  it('embeds the reviewed machine-readable card and keeps unknown facts explicit', () => {
    expect(pageSource).toContain('loadActivityFeedV1().find(item => item.id === product.id)')
    expect(pageSource).toContain('<AiAnswerCard card={aiAnswerCard} />')

    const card = loadActivityFeedV1()[0]
    const markup = renderToStaticMarkup(createElement(AiAnswerCard, { card }))

    expect(markup).toContain('type="application/json"')
    expect(markup).toContain('data-radarscout-ai-answer-card="true"')
    expect(markup).toContain('radarscout.activity-feed.v1')
    expect(markup).toContain('"status":"not_reviewed"')
    expect(markup).toContain('Last reviewed')
    expect(cardSource).toContain("replace(/</g, '\\\\u003c')")
    expect(cardSource).toContain('Not independently reviewed')
  })

  it('shows decision support and partner boundaries without commerce claims', () => {
    expect(cardSource).toContain('Why recommended')
    expect(cardSource).toContain('Best for')
    expect(cardSource).toContain('Not suitable for')
    expect(cardSource).toContain('Check before choosing')
    expect(cardSource).toContain('Experience features')
    expect(cardSource).toContain('Current partner')
    expect(cardSource).toContain('Last reviewed')

    expect(cardSource).not.toMatch(/available now|live availability|instant confirmation|buy now|checkout|payment/i)
  })

  it('keeps product trust metadata visible without exposing reviewer identifiers', () => {
    expect(pageSource).toContain('productTrustItems(product)')
    expect(pageSource).toContain("{ label: 'Last verified', value: formatReviewedDate(reviewedAt) }")
    expect(pageSource).toContain("{ label: 'Editorial review', value: 'RadarScout Editorial Team' }")
    expect(pageSource).not.toContain('product.reviewedEnrichment?.reviewedBy}</')
  })
})
