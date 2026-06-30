import { describe, expect, it } from 'vitest'

import { metadata } from '../page'

describe('AI trip planner metadata', () => {
  it('keeps the preview planner closed to indexing while product matching is still guarded', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it('keeps the canonical URL on the AI trip planner route', () => {
    expect(metadata.alternates).toMatchObject({
      canonical: 'https://www.radarscout.io/ai-trip-planner',
    })
  })
})
