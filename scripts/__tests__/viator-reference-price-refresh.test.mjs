import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  extractSafeReferencePrice,
  refreshViatorReferencePrices,
  renderReferencePriceModule,
} from '../viator-reference-price-refresh.mjs'

test('extractSafeReferencePrice keeps only the consumer from-price fields', () => {
  assert.deepEqual(
    extractSafeReferencePrice({
      currency: 'THB',
      summary: {
        fromPrice: 1536.37,
        partnerNetFromPrice: 1200,
      },
      bookableItems: [{ partnerNetPrice: 1200 }],
    }, '191442P6', '2026-07-23T08:52:26.057Z'),
    {
      productCode: '191442P6',
      retailFromPrice: 1536.37,
      currency: 'THB',
      priceFetchedAt: '2026-07-23T08:52:26.057Z',
    },
  )
})

test('rendered module contains no upstream commercial or raw fields', () => {
  const moduleSource = renderReferencePriceModule([{
    productCode: '191442P6',
    retailFromPrice: 1536.37,
    currency: 'THB',
    priceFetchedAt: '2026-07-23T08:52:26.057Z',
  }])

  assert.doesNotMatch(moduleSource, /partnerNet|commission|markup|rawResponse|bookableItems/)
})

test('refresh fails without replacing the snapshot when any approved product fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'radarscout-viator-price-'))
  const outputPath = join(directory, 'records.ts')

  const result = await refreshViatorReferencePrices({
    apiKey: 'test-key',
    outputPath,
    fetchFn: async () => new Response('{}', { status: 503 }),
  })

  assert.deepEqual(result, {
    ok: false,
    reason: 'upstream_error',
    productCode: '6467BKKNIGHT',
    status: 503,
  })
  await assert.rejects(readFile(outputPath), /ENOENT/)
})
