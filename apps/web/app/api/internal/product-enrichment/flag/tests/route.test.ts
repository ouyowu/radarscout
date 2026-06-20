import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  productIssueFlag: {
    upsert: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

const featureFlagsMock = vi.hoisted(() => ({
  isIssueFlagsEnabled: vi.fn(),
}))

vi.mock('@/lib/featureFlags', () => featureFlagsMock)

import { POST, DELETE } from '../route'

const VALID_SECRET = 'test-enrichment-secret'
const VALID_PRODUCT_ID = 'product-abc-123'

function makePostRequest(body: unknown, secret?: string) {
  return new NextRequest('http://localhost/api/internal/product-enrichment/flag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-internal-enrichment-review-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })
}

function makeDeleteRequest(body: unknown, secret?: string) {
  return new NextRequest('http://localhost/api/internal/product-enrichment/flag', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-internal-enrichment-review-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/internal/product-enrichment/flag — disabled mode (default)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(false)
  })

  it('returns 503 with issue_flags_disabled when PRODUCT_ISSUE_FLAGS_ENABLED is not set', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.ok).toBe(false)
    expect(data.error).toBe('issue_flags_disabled')
  })

  it('does not call db.productIssueFlag when disabled', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(dbMock.productIssueFlag.upsert).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/internal/product-enrichment/flag — disabled mode (default)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(false)
  })

  it('returns 503 with issue_flags_disabled when PRODUCT_ISSUE_FLAGS_ENABLED is not set', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }, VALID_SECRET))
    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.ok).toBe(false)
    expect(data.error).toBe('issue_flags_disabled')
  })

  it('does not call db.productIssueFlag when disabled', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }, VALID_SECRET))
    expect(dbMock.productIssueFlag.delete).not.toHaveBeenCalled()
  })
})

describe('POST /api/internal/product-enrichment/flag — enabled mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(true)
    dbMock.productIssueFlag.upsert.mockResolvedValue({ id: 'flag-1', productId: VALID_PRODUCT_ID })
  })

  it('returns 503 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(response.status).toBe(503)
    const data = await response.json()
    expect(data.ok).toBe(false)
  })

  it('returns 401 when secret header is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }))
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.ok).toBe(false)
  })

  it('returns 401 when secret header is wrong', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }, 'wrong-secret'))
    expect(response.status).toBe(401)
  })

  it('returns 400 when productId is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('invalid_product_id')
  })

  it('returns 400 when productId contains invalid characters', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: 'bad id!', reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('invalid_product_id')
  })

  it('returns 400 when reason is invalid', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'invalid_reason', flaggedBy: 'test@test.com' }, VALID_SECRET))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('invalid_reason')
  })

  it('returns 400 when flaggedBy is empty', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: '' }, VALID_SECRET))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('invalid_flagged_by')
  })

  it('accepts all valid reason values', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const validReasons = ['destination_mismatch', 'bad_source_data', 'duplicate_product', 'not_relevant', 'needs_manual_research', 'other']
    for (const reason of validReasons) {
      dbMock.productIssueFlag.upsert.mockResolvedValueOnce({ id: 'flag-1' })
      const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason, flaggedBy: 'test@test.com' }, VALID_SECRET))
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.ok).toBe(true)
    }
  })

  it('creates flag with valid inputs and returns ok:true', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({
      productId: VALID_PRODUCT_ID,
      reason: 'destination_mismatch',
      note: 'Title mentions Singapore but city is Phuket',
      flaggedBy: 'reviewer@example.com',
    }, VALID_SECRET))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(dbMock.productIssueFlag.upsert).toHaveBeenCalledOnce()
  })

  it('sanitizes note to max 500 chars', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const longNote = 'a'.repeat(600)
    await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', note: longNote, flaggedBy: 'test@test.com' }, VALID_SECRET))
    const upsertCall = dbMock.productIssueFlag.upsert.mock.calls[0][0]
    expect(upsertCall.create.note.length).toBe(500)
  })

  it('sets null note when note is empty string', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', note: '', flaggedBy: 'test@test.com' }, VALID_SECRET))
    const upsertCall = dbMock.productIssueFlag.upsert.mock.calls[0][0]
    expect(upsertCall.create.note).toBeNull()
  })

  it('response does not include rawJson, secrets, or AI fields', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await POST(makePostRequest({ productId: VALID_PRODUCT_ID, reason: 'other', flaggedBy: 'test@test.com' }, VALID_SECRET))
    const text = await response.text()
    expect(text).not.toContain('rawJson')
    expect(text).not.toContain('INTERNAL_ENRICHMENT_REVIEW_SECRET')
    expect(text).not.toContain('aiRaw')
    expect(text).not.toContain('candidate')
  })
})

describe('DELETE /api/internal/product-enrichment/flag — enabled mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    featureFlagsMock.isIssueFlagsEnabled.mockReturnValue(true)
    dbMock.productIssueFlag.delete.mockResolvedValue({ id: 'flag-1' })
  })

  it('returns 503 when secret is not configured', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const response = await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }))
    expect(response.status).toBe(503)
  })

  it('returns 401 when secret header is missing', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }))
    expect(response.status).toBe(401)
  })

  it('returns 400 when productId is invalid', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await DELETE(makeDeleteRequest({ productId: 'bad id!' }, VALID_SECRET))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('invalid_product_id')
  })

  it('clears flag and returns ok:true', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    const response = await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }, VALID_SECRET))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(dbMock.productIssueFlag.delete).toHaveBeenCalledWith({ where: { productId: VALID_PRODUCT_ID } })
  })

  it('returns 404 when flag does not exist', async () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', VALID_SECRET)
    dbMock.productIssueFlag.delete.mockRejectedValue(new Error('Record not found'))
    const response = await DELETE(makeDeleteRequest({ productId: VALID_PRODUCT_ID }, VALID_SECRET))
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('flag_not_found')
  })
})
