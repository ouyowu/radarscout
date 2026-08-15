import assert from 'node:assert/strict'
import test from 'node:test'

import { buildViatorThailandSafeScreen } from '../viator-thailand-safe-screen.mjs'

const candidate = (overrides = {}) => ({
  city: 'Koh Samui',
  destinationId: '999',
  productCode: 'TEST-1',
  title: 'Koh Samui day tour',
  productUrl: 'https://www.viator.com/tours/Koh-Samui/TEST-1?pid=P00309837',
  imageUrl: 'https://images.example.test/TEST-1.jpg',
  durationMinutes: 300,
  pickup: { optionType: 'PICKUP_EVERYONE' },
  schedule: { startTimes: [], endTimes: [] },
  pendingHumanReviewFields: ['childPolicy'],
  ...overrides,
})

test('keeps viable day tours pending human approval instead of approving a public seed', () => {
  const result = buildViatorThailandSafeScreen({
    status: 'pending_human_detail_review',
    candidates: [candidate()],
  }, { screenedAt: '2026-08-15T00:00:00.000Z' })

  assert.deepEqual(result, {
    ok: true,
    review: {
      schemaVersion: 1,
      status: 'pending_human_final_review',
      screenedAt: '2026-08-15T00:00:00.000Z',
      source: 'Deterministic Viator Thailand day-tour safety screen; not a human approval or public seed',
      summary: { total: 1, pendingHumanApproval: 1, heldMissingDuration: 0, heldNonDayTour: 0 },
      candidates: [{ ...candidate(), screeningDisposition: 'pending_human_approval', screeningReason: 'meets_basic_day_tour_screen' }],
    },
  })
})

test('holds candidates with missing duration or a duration beyond one day', () => {
  const result = buildViatorThailandSafeScreen({
    status: 'pending_human_detail_review',
    candidates: [candidate({ productCode: 'MISSING', durationMinutes: null }), candidate({ productCode: 'LONG', durationMinutes: 721 })],
  })

  assert.equal(result.ok, true)
  assert.deepEqual(result.review.summary, { total: 2, pendingHumanApproval: 0, heldMissingDuration: 1, heldNonDayTour: 1 })
  assert.deepEqual(result.review.candidates.map(({ productCode, screeningDisposition, screeningReason }) => ({ productCode, screeningDisposition, screeningReason })), [
    { productCode: 'MISSING', screeningDisposition: 'hold_missing_duration', screeningReason: 'official_duration_not_available' },
    { productCode: 'LONG', screeningDisposition: 'hold_non_day_tour', screeningReason: 'duration_exceeds_day_trip_policy' },
  ])
})

test('fails closed for any input that is not awaiting human detail review', () => {
  assert.deepEqual(buildViatorThailandSafeScreen({ status: 'approved_for_public_seed', candidates: [] }), {
    ok: false,
    reason: 'invalid_review_input',
  })
})
