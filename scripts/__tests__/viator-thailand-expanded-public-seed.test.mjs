import assert from 'node:assert/strict'
import test from 'node:test'

import {
  approvedExpandedProductMetadata,
  buildViatorThailandExpandedPublicSeed,
} from '../viator-thailand-expanded-public-seed.mjs'

const detailCandidate = {
  city: 'Bangkok',
  destinationId: '343',
  primaryDestinationId: '343',
  productCode: '5596319P4',
  title: "Thai Cooking Class in Bangkok's Old Town with Market Tour",
  productUrl: 'https://www.viator.com/tours/Bangkok/example/d343-5596319P4?pid=P00309837',
  imageUrl: 'https://media.example.test/product.jpg',
  description: 'Private review source only.',
  inclusionHighlights: [],
  exclusionHighlights: [],
  durationMinutes: 210,
}

test('builds only manually selected records and keeps private detail fields out of the public seed', () => {
  const metadata = new Map([['5596319P4', {
    city: 'Bangkok',
    destinationId: '343',
    shortSummary: 'A hands-on Bangkok cooking class with an Old Town market visit.',
    tags: ['food', 'cooking', 'market'],
  }]])

  const result = buildViatorThailandExpandedPublicSeed({
    status: 'pending_human_detail_review',
    candidates: [detailCandidate],
  }, {
    metadataByProductCode: metadata,
    reviewedAt: '2026-07-17T00:00:00.000Z',
  })

  assert.equal(result.ok, true)
  assert.deepEqual(Object.keys(result.records[0]).sort(), [
    'city',
    'destinationId',
    'id',
    'imageUrl',
    'productCode',
    'productUrl',
    'reviewedAt',
    'shortSummary',
    'tags',
    'title',
  ])
  assert.equal(result.records[0].description, undefined)
  assert.equal(result.records[0].durationMinutes, undefined)
})

test('fails closed when the reviewed primary destination does not match manual metadata', () => {
  const result = buildViatorThailandExpandedPublicSeed({
    status: 'pending_human_detail_review',
    candidates: [{ ...detailCandidate, primaryDestinationId: '349' }],
  }, {
    metadataByProductCode: new Map([['5596319P4', {
      city: 'Bangkok',
      destinationId: '343',
      shortSummary: 'A hands-on Bangkok cooking class with an Old Town market visit.',
      tags: ['food', 'cooking', 'market'],
    }]]),
  })

  assert.deepEqual(result, {
    ok: false,
    reason: 'primary_destination_mismatch',
    productCode: '5596319P4',
  })
})

test('contains exactly 34 manually authored expanded-catalog decisions', () => {
  assert.equal(approvedExpandedProductMetadata.size, 34)
})
