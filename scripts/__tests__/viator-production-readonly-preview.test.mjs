import assert from 'node:assert/strict'
import test from 'node:test'

import {
  fetchViatorProductionPreview,
  parsePreviewArgs,
  VIATOR_PRODUCTION_PRODUCT_SEARCH_URL,
} from '../viator-production-readonly-preview.mjs'

const upstreamProduct = {
  productCode: '1234P1',
  title: 'Phuket island day trip',
  productUrl: 'https://www.viator.com/tours/Phuket/Island-Day-Trip/d349-1234P1?pid=P00309837',
  images: [
    {
      isCover: true,
      variants: [
        { width: 320, height: 180, url: 'https://images.example.test/small.jpg' },
        { width: 1280, height: 720, url: 'https://images.example.test/large.jpg' },
      ],
    },
  ],
  supplier: { name: 'Must not be retained' },
  pricing: { retailPrice: 99 },
  availability: { status: 'Must not be retained' },
  viatorUniqueContent: { description: 'Must not be retained' },
}

test('fails closed without a production API key and does not call Viator', async () => {
  const fetchFn = async () => {
    throw new Error('should not be called')
  }

  const result = await fetchViatorProductionPreview(
    { cityKey: 'phuket', count: 5 },
    { apiKey: undefined, fetchFn },
  )

  assert.deepEqual(result, { ok: false, reason: 'not_configured' })
})

test('requests one bounded city page and retains only review-safe candidate fields', async () => {
  let requestedUrl
  let requestedOptions
  const fetchFn = async (url, options) => {
    requestedUrl = url
    requestedOptions = options
    return new Response(JSON.stringify({
      products: [upstreamProduct],
      totalCount: 1,
    }), { status: 200 })
  }

  const result = await fetchViatorProductionPreview(
    { cityKey: 'phuket', count: 5 },
    { apiKey: 'production-test-key', fetchFn },
  )

  assert.equal(requestedUrl, VIATOR_PRODUCTION_PRODUCT_SEARCH_URL)
  assert.deepEqual(requestedOptions, {
    method: 'POST',
    headers: {
      Accept: 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
      'exp-api-key': 'production-test-key',
    },
    body: JSON.stringify({
      filtering: { destination: '349' },
      pagination: { start: 1, count: 5 },
      currency: 'THB',
    }),
  })
  assert.deepEqual(result, {
    ok: true,
    city: 'Phuket',
    destinationId: '349',
    acceptedCandidateCount: 1,
    excludedProductCount: 0,
    candidates: [
      {
        city: 'Phuket',
        destinationId: '349',
        productCode: '1234P1',
        title: 'Phuket island day trip',
        productUrl: 'https://www.viator.com/tours/Phuket/Island-Day-Trip/d349-1234P1?pid=P00309837',
        imageUrl: 'https://images.example.test/large.jpg',
      },
    ],
  })
})

test('requests an explicitly bounded later page for a private review batch', async () => {
  let requestedOptions
  const fetchFn = async (_url, options) => {
    requestedOptions = options
    return new Response(JSON.stringify({ products: [] }), { status: 200 })
  }

  const result = await fetchViatorProductionPreview(
    { cityKey: 'phuket', count: 20, start: 21 },
    { apiKey: 'production-test-key', fetchFn },
  )

  assert.equal(result.ok, true)
  assert.deepEqual(JSON.parse(requestedOptions.body), {
    filtering: { destination: '349' },
    pagination: { start: 21, count: 20 },
    currency: 'THB',
  })
})

test('excludes candidates without an affiliate URL with pid or an HTTPS image', async () => {
  const fetchFn = async () => new Response(JSON.stringify({
    products: [
      { ...upstreamProduct, productUrl: 'https://www.viator.com/tours/Phuket/Island-Day-Trip/d349-1234P1' },
      { ...upstreamProduct, images: [{ variants: [{ width: 100, height: 100, url: 'http://images.example.test/nope.jpg' }] }] },
    ],
  }), { status: 200 })

  const result = await fetchViatorProductionPreview(
    { cityKey: 'phuket', count: 2 },
    { apiKey: 'production-test-key', fetchFn },
  )

  assert.deepEqual(result, {
    ok: true,
    city: 'Phuket',
    destinationId: '349',
    acceptedCandidateCount: 0,
    excludedProductCount: 2,
    candidates: [],
  })
})

test('returns an opaque upstream error without retaining the response body', async () => {
  const fetchFn = async () => new Response(JSON.stringify({
    message: 'Do not expose this upstream error body',
    supplier: 'Do not expose this supplier',
  }), { status: 401 })

  const result = await fetchViatorProductionPreview(
    { cityKey: 'phuket', count: 1 },
    { apiKey: 'production-test-key', fetchFn },
  )

  assert.deepEqual(result, { ok: false, reason: 'upstream_error', status: 401 })
})

test('parses only an approved Thailand city and bounded private-review page', () => {
  assert.deepEqual(parsePreviewArgs(['--city', 'Phuket', '--count', '5', '--start', '21']), {
    ok: true,
    input: { cityKey: 'phuket', count: 5, start: 21 },
  })
  assert.deepEqual(parsePreviewArgs(['--city', 'Singapore']), { ok: false, reason: 'invalid_city' })
  assert.deepEqual(parsePreviewArgs(['--city', 'Chiang Rai', '--count', '5']), {
    ok: true,
    input: { cityKey: 'chiang-rai', count: 5, start: 1 },
  })
  assert.deepEqual(parsePreviewArgs(['--city', 'Hua Hin', '--count', '5']), {
    ok: true,
    input: { cityKey: 'hua-hin', count: 5, start: 1 },
  })
  assert.deepEqual(parsePreviewArgs(['--city', 'Phuket', '--count', '21']), { ok: false, reason: 'invalid_count' })
  assert.deepEqual(parsePreviewArgs(['--city', 'Phuket', '--start', '101']), { ok: false, reason: 'invalid_start' })
  assert.deepEqual(parsePreviewArgs(['--count', '5']), { ok: false, reason: 'invalid_city' })
})
