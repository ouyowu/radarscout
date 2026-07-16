import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildViatorThailandBatch2PublicSeed,
  formatReviewedViatorBatch2ProductsModule,
} from '../viator-thailand-batch-2-public-seed.mjs'

const candidate = {
  city: 'Bangkok',
  destinationId: '343',
  productCode: '5553790P1',
  title: 'Bangkok: Floating Market and Train Market Experience',
  productUrl: 'https://www.viator.com/tours/Bangkok/floating-market/d343-5553790P1?pid=P00309837',
  imageUrl: 'https://images.example.test/floating-market.jpg',
  description: 'Private source material must never enter the public seed.',
  inclusionHighlights: ['Lunch'],
  exclusionHighlights: ['Personal expenses'],
  durationMinutes: 420,
  disposition: 'approved_for_public_seed',
  reason: 'reviewed_thailand_day_trip',
}

test('turns only manually approved records into safe static public seed entries', () => {
  const result = buildViatorThailandBatch2PublicSeed({
    status: 'approved_for_public_seed',
    reviewedAt: '2026-07-16T00:00:00.000Z',
    candidates: [candidate, { ...candidate, productCode: '90546P33', disposition: 'excluded' }],
  }, {
    metadataByProductCode: new Map([['5553790P1', {
      shortSummary: 'A Bangkok day trip combining the railway market, canal time and a floating market visit.',
      tags: ['markets', 'culture', 'day-trip'],
    }]]),
  })

  assert.deepEqual(result, {
    ok: true,
    records: [{
      id: 'viator_5553790p1',
      city: 'Bangkok',
      destinationId: '343',
      productCode: '5553790P1',
      title: 'Bangkok: Floating Market and Train Market Experience',
      shortSummary: 'A Bangkok day trip combining the railway market, canal time and a floating market visit.',
      tags: ['markets', 'culture', 'day-trip'],
      productUrl: 'https://www.viator.com/tours/Bangkok/floating-market/d343-5553790P1?pid=P00309837',
      imageUrl: 'https://images.example.test/floating-market.jpg',
      reviewedAt: '2026-07-16T00:00:00.000Z',
    }],
  })

  const module = formatReviewedViatorBatch2ProductsModule(result.records)
  assert.match(module, /reviewedViatorBatch2ProductSeedRecords/)
  assert.doesNotMatch(module, /Private source material|inclusionHighlights|durationMinutes/)
})

test('fails closed when an approved product lacks manual public metadata', () => {
  const result = buildViatorThailandBatch2PublicSeed({
    status: 'approved_for_public_seed',
    reviewedAt: '2026-07-16T00:00:00.000Z',
    candidates: [{ ...candidate, productCode: 'UNKNOWN' }],
  }, { metadataByProductCode: new Map() })

  assert.deepEqual(result, { ok: false, reason: 'missing_public_metadata', productCode: 'UNKNOWN' })
})
