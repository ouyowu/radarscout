import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  buildAiProductContext,
  type AiProductContextItem,
  type ModelFn,
} from '../buildAiProductContext'
import { IneligibleProductInContextError } from '../assertAllProductsThailandEligible'
import type { AiProductCandidate } from '../listAiEligibleThailandProducts'

function makeEligibleCandidate(overrides: Partial<AiProductCandidate> = {}): AiProductCandidate {
  return {
    id: 'prod_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    cleanedTitle: null,
    city: 'Chiang Mai',
    location: 'Mae Rim',
    summary: 'Half-day ethical elephant visit.',
    suggestedTags: ['Elephants', 'Nature'],
    detailHref: '/tours/prod_abc',
    retailPrice: '49.00',
    currency: 'USD',
    ...overrides,
  }
}

function makeIneligibleCandidate(overrides: Partial<AiProductCandidate> = {}): AiProductCandidate {
  return {
    id: 'foreign_prod',
    title: 'Singapore City Tour',
    cleanedTitle: null,
    city: 'Singapore',
    location: null,
    summary: null,
    suggestedTags: [],
    detailHref: '/tours/foreign_prod',
    retailPrice: null,
    currency: null,
    ...overrides,
  }
}

describe('buildAiProductContext — model context (tests 15–21)', () => {
  let modelSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    modelSpy = vi.fn().mockResolvedValue(undefined)
  })

  // Test 15: Context builder serializes eligible products only
  it('serializes eligible products into context items', async () => {
    const candidates = [
      makeEligibleCandidate({ id: 'p1', title: 'Bangkok Tour', city: 'Bangkok', cleanedTitle: 'Grand Bangkok Tour' }),
      makeEligibleCandidate({ id: 'p2', title: 'Phuket Tour', city: 'Phuket', cleanedTitle: null }),
    ]

    const result = await buildAiProductContext(candidates)

    expect(result.status).toBe('ok')
    if (result.status === 'ok') {
      expect(result.items).toHaveLength(2)
      // cleanedTitle takes precedence over raw title
      expect(result.items[0].title).toBe('Grand Bangkok Tour')
      // falls back to raw title when cleanedTitle is null
      expect(result.items[1].title).toBe('Phuket Tour')
    }
  })

  // Test 16: Ineligible product injected directly into context builder is rejected before model call
  it('throws IneligibleProductInContextError (dev/test) when ineligible product is injected directly', async () => {
    const ineligible = makeIneligibleCandidate()
    const modelFn: ModelFn = modelSpy

    await expect(
      buildAiProductContext([ineligible], { modelFn }),
    ).rejects.toThrow(IneligibleProductInContextError)

    expect(modelSpy).not.toHaveBeenCalled()
  })

  // Test 17: Model client is not called when all candidates are ineligible (after list filtering → empty array)
  it('returns no_match and does not invoke modelFn when candidate list is empty', async () => {
    const modelFn: ModelFn = modelSpy

    const result = await buildAiProductContext([], { modelFn })

    expect(result.status).toBe('no_match')
    expect(modelSpy).not.toHaveBeenCalled()
  })

  // Test 18: Model client is not called for non-Thailand destination intent
  it('returns no_match without calling modelFn for non-Thailand destination (Singapore)', async () => {
    const modelFn: ModelFn = modelSpy
    const candidates = [makeEligibleCandidate()]

    const result = await buildAiProductContext(candidates, {
      destination: 'Singapore',
      modelFn,
    })

    expect(result.status).toBe('no_match')
    expect(modelSpy).not.toHaveBeenCalled()
  })

  it('returns no_match without calling modelFn for non-Thailand destination (Tokyo)', async () => {
    const modelFn: ModelFn = modelSpy
    const candidates = [makeEligibleCandidate()]

    const result = await buildAiProductContext(candidates, {
      destination: 'Tokyo',
      modelFn,
    })

    expect(result.status).toBe('no_match')
    expect(modelSpy).not.toHaveBeenCalled()
  })

  it('calls modelFn for Thailand-compatible destination (Bangkok)', async () => {
    const modelFn: ModelFn = modelSpy
    const candidates = [makeEligibleCandidate({ city: 'Bangkok', title: 'Bangkok Tour' })]

    const result = await buildAiProductContext(candidates, {
      destination: 'Bangkok',
      modelFn,
    })

    expect(result.status).toBe('ok')
    expect(modelSpy).toHaveBeenCalledOnce()
  })

  // Test 19: Model client receives no rawJson, eligibility reasons, prompts, secrets, commission, payment terms, or contract terms
  it('context items contain no rawJson, eligibility internals, secrets, commission, or contract fields', async () => {
    const candidates = [makeEligibleCandidate()]
    let capturedItems: AiProductContextItem[] = []
    const capturingModelFn: ModelFn = async (items) => {
      capturedItems = items
    }

    await buildAiProductContext(candidates, { modelFn: capturingModelFn })

    expect(capturedItems).toHaveLength(1)
    const item = capturedItems[0]

    expect(item).not.toHaveProperty('rawJson')
    expect(item).not.toHaveProperty('eligible')
    expect(item).not.toHaveProperty('reasons')
    expect(item).not.toHaveProperty('foreignSignals')
    expect(item).not.toHaveProperty('thailandSignals')
    expect(item).not.toHaveProperty('supplierId')
    expect(item).not.toHaveProperty('supplierName')
    expect(item).not.toHaveProperty('commission')
    expect(item).not.toHaveProperty('commissionPercent')
    expect(item).not.toHaveProperty('netSettlementPrice')
    expect(item).not.toHaveProperty('systemPrompt')
    expect(item).not.toHaveProperty('prompt')
    expect(item).not.toHaveProperty('contractTerms')
    expect(item).not.toHaveProperty('paymentTerms')

    expect(Object.keys(item).sort()).toEqual([
      'city',
      'currency',
      'detailHref',
      'id',
      'retailPrice',
      'summary',
      'tags',
      'title',
    ])
  })

  // Test 20: Empty eligible result returns safe no-match behavior
  it('returns no_match when no eligible candidates remain', async () => {
    const result = await buildAiProductContext([])

    expect(result.status).toBe('no_match')
    expect(result).not.toHaveProperty('items')
  })

  // Test 21: No fake fallback product is created
  it('no_match result does not include fabricated fallback products', async () => {
    const result = await buildAiProductContext([])

    expect(result.status).toBe('no_match')
    // The result must not have items at all — no fallback invented
    if (result.status === 'no_match') {
      const serialized = JSON.stringify(result)
      expect(serialized).not.toContain('"price"')
      expect(serialized).not.toContain('"supplier"')
      expect(serialized).not.toContain('"availability"')
      expect(serialized).not.toContain('"rating"')
      expect(serialized).not.toContain('"booking"')
    }
  })
})
