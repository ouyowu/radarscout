import { describe, expect, it } from 'vitest'

import {
  ownerManagedProductHandoffMappings,
  resolveReviewedProductHandoff,
} from '../ownerManagedProductHandoffMappings'

describe('ownerManagedProductHandoffMappings', () => {
  it('starts with no reviewed product mappings', () => {
    expect(ownerManagedProductHandoffMappings).toEqual([])
  })

  it('does not return handoff for an owner-managed activity id without a reviewed public product mapping', () => {
    const result = resolveReviewedProductHandoff({
      publicProductId: 'prod_abc',
      bokunActivityId: '1232729',
    })

    expect(result).toBeNull()
  })

  it('does not return handoff for empty product or activity ids', () => {
    expect(resolveReviewedProductHandoff({
      publicProductId: '',
      bokunActivityId: '1232729',
    })).toBeNull()
    expect(resolveReviewedProductHandoff({
      publicProductId: 'prod_abc',
      bokunActivityId: '',
    })).toBeNull()
  })
})
