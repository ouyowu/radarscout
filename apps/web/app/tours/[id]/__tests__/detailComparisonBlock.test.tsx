import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { loadActivityFeedV1 } from '@/lib/activityFeed/activityFeedV1'
import { selectDetailComparisonCandidates } from '@/lib/activityFeed/detailComparison'
import { DetailComparisonBlock } from '../DetailComparisonBlock'

describe('DetailComparisonBlock', () => {
  it('renders only reviewed comparison fields and a tracked comparison handoff', () => {
    const feed = loadActivityFeedV1()
    const primary = feed.find(item => selectDetailComparisonCandidates(item, feed).length > 0)
    expect(primary).toBeDefined()

    const candidates = selectDetailComparisonCandidates(primary!, feed)
    const markup = renderToStaticMarkup(createElement(DetailComparisonBlock, {
      primary: primary!,
      candidates,
    }))

    expect(markup).toContain('Compare reviewed experiences')
    expect(markup).toContain('Last verified')
    expect(markup).toContain('Check availability')
    expect(markup).not.toMatch(/price|rating|review count|child age|drive time/i)
  })

  it('is absent rather than inventing alternatives when no reviewed local theme match exists', () => {
    const feed = loadActivityFeedV1()
    const primary = feed.find(item => selectDetailComparisonCandidates(item, feed).length === 0)
    expect(primary).toBeDefined()

    const markup = renderToStaticMarkup(createElement(DetailComparisonBlock, {
      primary: primary!,
      candidates: [],
    }))

    expect(markup).toBe('')
  })
})
