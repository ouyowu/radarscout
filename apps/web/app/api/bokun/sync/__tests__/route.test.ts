import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const bokunSyncMock = vi.hoisted(() => ({
  isBokunCatalogConfigured: vi.fn(),
  syncBokunCatalog: vi.fn(),
}))

vi.mock('@/lib/bokunSync', () => bokunSyncMock)

import { POST } from '../route'

const mockIsBokunCatalogConfigured =
  bokunSyncMock.isBokunCatalogConfigured as unknown as ReturnType<typeof vi.fn>
const mockSyncBokunCatalog =
  bokunSyncMock.syncBokunCatalog as unknown as ReturnType<typeof vi.fn>

function makeRequest(body: unknown = {}, secret?: string) {
  return new NextRequest('http://localhost/api/bokun/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-bokun-sync-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/bokun/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.BOKUN_ACCESS_KEY
    delete process.env.BOKUN_SECRET_KEY
    delete process.env.BOKUN_API_BASE_URL
    process.env.BOKUN_SYNC_SECRET = 'sync-secret'
    mockIsBokunCatalogConfigured.mockReturnValue(true)
  })

  it('returns 401 when x-bokun-sync-secret is missing', async () => {
    const response = await POST(makeRequest())

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockSyncBokunCatalog).not.toHaveBeenCalled()
  })

  it('returns 401 when x-bokun-sync-secret is invalid', async () => {
    const response = await POST(makeRequest({}, 'wrong-secret'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'unauthorized',
    })
    expect(mockSyncBokunCatalog).not.toHaveBeenCalled()
  })

  it('returns a safe configuration error when BOKUN_SYNC_SECRET is missing', async () => {
    delete process.env.BOKUN_SYNC_SECRET

    const response = await POST(makeRequest())

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'sync_not_configured',
    })
    expect(mockSyncBokunCatalog).not.toHaveBeenCalled()
  })

  it('returns bokun_not_configured when Bókun credentials are missing', async () => {
    mockIsBokunCatalogConfigured.mockReturnValue(false)

    const response = await POST(makeRequest({}, 'sync-secret'))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'bokun_not_configured',
    })
    expect(mockSyncBokunCatalog).not.toHaveBeenCalled()
  })

  it('returns only safe sync statistics on success', async () => {
    mockSyncBokunCatalog.mockResolvedValue({
      queries: ['bangkok'],
      maxPages: 1,
      fetchedUniqueProducts: 12,
      suppliersUpserted: 3,
      productsUpserted: 12,
      skippedProducts: 0,
      failures: [{ query: 'bangkok', status: 503 }],
      startedAt: '2026-06-15T11:00:00.000Z',
      syncedAt: '2026-06-15T11:00:05.000Z',
      finishedAt: '2026-06-15T11:00:06.000Z',
      rawJson: { forbidden: true },
      secret: 'forbidden',
    })

    const response = await POST(
      makeRequest({ queries: ['bangkok'], maxPages: 1 }, 'sync-secret'),
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({
      ok: true,
      syncedProducts: 12,
      syncedSuppliers: 3,
      skippedProducts: 0,
      errors: 1,
      startedAt: '2026-06-15T11:00:00.000Z',
      finishedAt: '2026-06-15T11:00:06.000Z',
    })
    expect(body).not.toHaveProperty('rawJson')
    expect(body).not.toHaveProperty('secret')
    expect(JSON.stringify(body)).not.toContain('sync-secret')
  })
})
