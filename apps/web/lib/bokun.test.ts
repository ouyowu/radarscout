import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchActiveBokunActivities } from './bokun'

describe('fetchActiveBokunActivities', () => {
  beforeEach(() => {
    process.env.BOKUN_ACCESS_KEY = 'test-access-key'
    process.env.BOKUN_SECRET_KEY = 'test-secret-key'
    process.env.BOKUN_API_BASE_URL = 'https://api.example.test'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.BOKUN_ACCESS_KEY
    delete process.env.BOKUN_SECRET_KEY
    delete process.env.BOKUN_API_BASE_URL
  })

  it('sends the search phrase using the Bókun ActivityQuery textFilter', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchActiveBokunActivities({
      query: 'bangkok day tour',
      currency: 'USD',
      lang: 'EN',
      page: 2,
      pageSize: 50,
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(String(init.body))).toEqual({
      textFilter: {
        text: 'bangkok day tour',
        searchFullText: true,
        searchKeywords: true,
        searchTitle: true,
      },
      page: 2,
      pageSize: 50,
      flags: ['ACTIVE'],
    })
  })
})
