import { describe, expect, it } from 'vitest'

import { metadata } from '../page'

describe('/demo metadata', () => {
  it('keeps the legacy demo page closed to search indexing', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})
