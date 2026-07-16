import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildViatorThailandBatch2ReviewPool,
  viatorThailandBatch2Plan,
  writeViatorThailandBatch2ReviewPool,
} from '../viator-thailand-batch-2-candidates.mjs'

const makeCandidate = (cityKey, index) => ({
  city: cityKey,
  destinationId: String(index),
  productCode: `${cityKey.replaceAll('-', '')}${index}`,
  title: `${cityKey} day trip ${index}`,
  productUrl: `https://www.viator.com/tours/${cityKey}/day-trip/d${index}-${cityKey.replaceAll('-', '')}${index}?pid=P00309837`,
  imageUrl: `https://images.example.test/${cityKey}-${index}.jpg`,
})

test('builds exactly 100 private Thailand review candidates from the bounded city plan', async () => {
  const result = await buildViatorThailandBatch2ReviewPool({
    apiKey: 'production-test-key',
    importedAt: '2026-07-16T00:00:00.000Z',
    fetchCity: async ({ cityKey, count }) => ({
      ok: true,
      candidates: Array.from({ length: count }, (_, index) => makeCandidate(cityKey, index + 1)),
    }),
  })

  assert.equal(viatorThailandBatch2Plan.reduce((total, city) => total + city.count, 0), 100)
  assert.deepEqual(result.ok, true)
  assert.equal(result.pool.candidateCount, 100)
  assert.equal(result.pool.status, 'pending_human_review')
  assert.deepEqual(Object.keys(result.pool.candidates[0]).sort(), [
    'city',
    'destinationId',
    'imageUrl',
    'productCode',
    'productUrl',
    'title',
  ])
})

test('fails closed and produces no review pool when one city has fewer safe candidates than requested', async () => {
  const result = await buildViatorThailandBatch2ReviewPool({
    apiKey: 'production-test-key',
    fetchCity: async ({ cityKey, count }) => ({
      ok: true,
      candidates: cityKey === 'phuket'
        ? Array.from({ length: count - 1 }, (_, index) => makeCandidate(cityKey, index + 1))
        : Array.from({ length: count }, (_, index) => makeCandidate(cityKey, index + 1)),
    }),
  })

  assert.deepEqual(result, {
    ok: false,
    reason: 'insufficient_candidates',
    cityKey: 'phuket',
    expectedCount: 20,
    acceptedCandidateCount: 19,
  })
})

test('writes only a successful private review pool', async () => {
  const writes = []
  const pool = {
    schemaVersion: 1,
    status: 'pending_human_review',
    importedAt: '2026-07-16T00:00:00.000Z',
    source: 'Viator Affiliate API production /products/search',
    candidateCount: 1,
    candidates: [makeCandidate('bangkok', 1)],
  }

  await writeViatorThailandBatch2ReviewPool(pool, {
    outputPath: '/private-inputs/viator-thailand-batch-2-candidates.json',
    mkdir: async () => {},
    writeFile: async (...args) => writes.push(args),
  })

  assert.equal(writes.length, 1)
  assert.equal(writes[0][0], '/private-inputs/viator-thailand-batch-2-candidates.json')
  assert.equal(writes[0][2], 'utf8')
  assert.deepEqual(JSON.parse(writes[0][1]), pool)
})
