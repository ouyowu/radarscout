import { describe, expect, it, vi } from 'vitest'

const bokunMock = vi.hoisted(() => ({
  searchBokunActivities: vi.fn(),
}))

vi.mock('@/lib/bokun', () => bokunMock)

import { POST } from '../route'

describe('POST /api/bokun/search public boundary', () => {
  it('stays closed and never proxies anonymous requests to Bókun', async () => {
    const response = await POST()
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body).toEqual({ error: 'NOT_FOUND' })
    expect(bokunMock.searchBokunActivities).not.toHaveBeenCalled()
    expect(JSON.stringify(body)).not.toMatch(/commission|settlement|raw/i)
  })
})
