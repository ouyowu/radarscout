import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildViatorThailandBatch2TitleReview,
} from '../viator-thailand-batch-2-title-review.mjs'

const makeCandidate = (productCode, title = `${productCode} Thailand day trip`) => ({
  city: 'Bangkok',
  destinationId: '343',
  productCode,
  title,
  productUrl: `https://www.viator.com/tours/Bangkok/${productCode}?pid=P00309837`,
  imageUrl: `https://images.example.test/${productCode}.jpg`,
})

test('creates a complete private review manifest without approving products for public display', () => {
  const result = buildViatorThailandBatch2TitleReview({
    candidateCount: 4,
    candidates: [
      makeCandidate('5567417P3'),
      makeCandidate('90546P33'),
      makeCandidate('5553790P1'),
      makeCandidate('428697P14'),
    ],
  }, { reviewedAt: '2026-07-16T00:00:00.000Z' })

  assert.equal(result.ok, true)
  assert.equal(result.review.status, 'detail_review_required')
  assert.deepEqual(result.review.summary, {
    total: 4,
    alreadyPublic: 1,
    excluded: 2,
    requiresDetailReview: 1,
    approvedForPublicSeed: 0,
  })
  assert.deepEqual(
    result.review.candidates.map(({ productCode, disposition, reason }) => ({ productCode, disposition, reason })),
    [
      { productCode: '5567417P3', disposition: 'already_public', reason: 'already_in_reviewed_viator_seed' },
      { productCode: '90546P33', disposition: 'excluded', reason: 'airport_or_transfer_only' },
      { productCode: '5553790P1', disposition: 'requires_detail_review', reason: 'requires_product_detail_review' },
      { productCode: '428697P14', disposition: 'excluded', reason: 'seasonal_event' },
    ],
  )
})

test('fails closed when a candidate pool is incomplete or has duplicate product codes', () => {
  const incomplete = buildViatorThailandBatch2TitleReview({
    candidateCount: 2,
    candidates: [makeCandidate('5553790P1')],
  })
  const duplicate = buildViatorThailandBatch2TitleReview({
    candidateCount: 2,
    candidates: [makeCandidate('5553790P1'), makeCandidate('5553790P1')],
  })

  assert.deepEqual(incomplete, { ok: false, reason: 'invalid_candidate_pool' })
  assert.deepEqual(duplicate, { ok: false, reason: 'invalid_candidate_pool' })
})
