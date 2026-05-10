import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { processKeyword } from './engine.js'
import { fetchRedditRSS } from './rss.js'
import { searchRedditViaGoogle } from './google.js'
import { submitMatch } from './submitter.js'
import type { RssItem } from './rss.js'
import type { Keyword } from './engine.js'

vi.mock('./rss.js', () => ({ fetchRedditRSS: vi.fn() }))
vi.mock('./google.js', () => ({ searchRedditViaGoogle: vi.fn() }))
vi.mock('./submitter.js', () => ({ submitMatch: vi.fn(), patchMatchScore: vi.fn() }))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const mockRedis = { get: vi.fn().mockResolvedValue(null), set: vi.fn() } as never

const kw: Keyword = { id: 'kw-1', text: 'crm software', userPlan: 'FREE' }
const kwPro: Keyword = { id: 'kw-pro', text: 'crm software', userPlan: 'PRO' }

const sampleItem: RssItem = {
  postId: 'abc123',
  title: 'Best CRM software for small teams?',
  url: 'https://reddit.com/r/entrepreneur/comments/abc123/best_crm',
  snippet: 'Looking for a good CRM recommendation',
  platform: 'REDDIT',
  subreddit: 'entrepreneur',
}

const opts = { apiUrl: 'http://localhost:3000', apiSecret: 'test-secret' }

beforeEach(() => {
  vi.clearAllMocks()
  process.env.INTERNAL_API_URL = 'http://localhost:3000'
  process.env.INTERNAL_API_SECRET = 'test-secret'
  vi.mocked(fetchRedditRSS).mockResolvedValue([])
  vi.mocked(searchRedditViaGoogle).mockResolvedValue([])
  vi.mocked(submitMatch).mockResolvedValue(null)
})

afterEach(() => {
  delete process.env.INTERNAL_API_URL
  delete process.env.INTERNAL_API_SECRET
})

describe('processKeyword()', () => {
  it('submits a match when RSS returns an item', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])

    await processKeyword(kw, mockRedis, new Set(), opts)

    expect(submitMatch).toHaveBeenCalledWith(
      expect.objectContaining({ postId: 'abc123', keywordId: 'kw-1' }),
    )
  })

  it('skips items whose compound seenId is already in the set', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])
    const seenIds = new Set(['abc123:kw-1'])

    await processKeyword(kw, mockRedis, seenIds, opts)

    expect(submitMatch).not.toHaveBeenCalled()
  })

  it('deduplicates when the same post appears in both RSS and Google', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])
    vi.mocked(searchRedditViaGoogle).mockResolvedValue([sampleItem])

    await processKeyword(kw, mockRedis, new Set(), opts)

    expect(submitMatch).toHaveBeenCalledTimes(1)
  })

  it('submits Google result when RSS returns nothing', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([])
    vi.mocked(searchRedditViaGoogle).mockResolvedValue([sampleItem])

    await processKeyword(kw, mockRedis, new Set(), opts)

    expect(submitMatch).toHaveBeenCalledTimes(1)
  })

  it('still processes Google results when RSS throws', async () => {
    vi.mocked(fetchRedditRSS).mockRejectedValue(new Error('network error'))
    vi.mocked(searchRedditViaGoogle).mockResolvedValue([sampleItem])

    await processKeyword(kw, mockRedis, new Set(), opts)

    expect(submitMatch).toHaveBeenCalledTimes(1)
  })

  it('does not trigger score for FREE plan matches', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])
    vi.mocked(submitMatch).mockResolvedValue('match-1')

    await processKeyword(kw, mockRedis, new Set(), opts)

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('passes subreddit to fetchRedditRSS when keyword has one', async () => {
    const kwWithSub: Keyword = { id: 'kw-2', text: 'saas tool', userPlan: 'FREE', subreddit: 'SaaS' }
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])

    await processKeyword(kwWithSub, mockRedis, new Set(), opts)

    expect(fetchRedditRSS).toHaveBeenCalledWith('saas tool', mockRedis, 'SaaS')
  })

  it('triggers score for PRO plan matches', async () => {
    vi.mocked(fetchRedditRSS).mockResolvedValue([sampleItem])
    vi.mocked(submitMatch).mockResolvedValue('match-1')
    mockFetch.mockResolvedValue({ ok: true })

    await processKeyword(kwPro, mockRedis, new Set(), opts)

    // Allow the fire-and-forget microtask to run
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/internal/matches/match-1/score',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
