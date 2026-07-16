import assert from 'node:assert/strict'
import test from 'node:test'

import { buildViatorThailandBatch2FinalReview } from '../viator-thailand-batch-2-final-review.mjs'

const baseCandidate = (productCode, disposition, reason) => ({
  city: 'Bangkok',
  destinationId: '343',
  productCode,
  title: productCode,
  productUrl: `https://www.viator.com/tours/Bangkok/${productCode}?pid=P00309837`,
  imageUrl: `https://images.example.test/${productCode}.jpg`,
  disposition,
  reason,
})

test('records an explicit final decision for each title-screened candidate and approves no animal-care claims from API copy alone', () => {
  const titleReview = {
    status: 'detail_review_required',
    candidates: [
      baseCandidate('5567417P3', 'already_public', 'already_in_reviewed_viator_seed'),
      baseCandidate('90546P33', 'excluded', 'airport_or_transfer_only'),
      baseCandidate('157340P38', 'requires_detail_review', 'requires_product_detail_review'),
      baseCandidate('5553790P1', 'requires_detail_review', 'requires_product_detail_review'),
    ],
  }
  const detailReview = {
    status: 'pending_human_detail_review',
    candidates: [
      { ...baseCandidate('157340P38'), description: 'Elephant visit', inclusionHighlights: [], exclusionHighlights: [], durationMinutes: 120 },
      { ...baseCandidate('5553790P1'), description: 'Floating market', inclusionHighlights: [], exclusionHighlights: [], durationMinutes: 420 },
    ],
  }

  const result = buildViatorThailandBatch2FinalReview(titleReview, detailReview, {
    reviewedAt: '2026-07-16T00:00:00.000Z',
  })

  assert.equal(result.ok, true)
  assert.equal(result.review.status, 'approved_for_public_seed')
  assert.deepEqual(result.review.summary, {
    total: 4,
    alreadyPublic: 1,
    excluded: 2,
    approvedForPublicSeed: 1,
  })
  assert.deepEqual(
    result.review.candidates.map(({ productCode, disposition, reason }) => ({ productCode, disposition, reason })),
    [
      { productCode: '5567417P3', disposition: 'already_public', reason: 'already_in_reviewed_viator_seed' },
      { productCode: '90546P33', disposition: 'excluded', reason: 'airport_or_transfer_only' },
      { productCode: '157340P38', disposition: 'excluded', reason: 'animal_welfare_claim_requires_independent_evidence' },
      { productCode: '5553790P1', disposition: 'approved_for_public_seed', reason: 'reviewed_thailand_day_trip' },
    ],
  )
})

test('fails closed when an item awaiting detail review has no sanitized detail record', () => {
  const result = buildViatorThailandBatch2FinalReview({
    status: 'detail_review_required',
    candidates: [baseCandidate('5553790P1', 'requires_detail_review', 'requires_product_detail_review')],
  }, {
    status: 'pending_human_detail_review',
    candidates: [],
  })

  assert.deepEqual(result, { ok: false, reason: 'missing_detail_review', productCode: '5553790P1' })
})
