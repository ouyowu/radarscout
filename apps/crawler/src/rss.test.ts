import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRedditRSS, fetchSubredditFeed, TARGET_SUBREDDITS } from './rss.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Minimal valid Atom feed with one entry
function atomFeed(postId: string, subreddit: string): string {
  return `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Post title ${postId}</title>
    <link href="https://www.reddit.com/r/${subreddit}/comments/${postId}/post_title/"/>
    <summary>Some snippet text here</summary>
  </entry>
</feed>`
}

function okXml(postId: string, sub: string) {
  return { ok: true, text: async () => atomFeed(postId, sub), status: 200 }
}

const mockRedis = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue('OK'),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockRedis.get.mockResolvedValue(null)
})

describe('TARGET_SUBREDDITS', () => {
  it('includes the six expected communities', () => {
    expect(TARGET_SUBREDDITS).toEqual(
      expect.arrayContaining(['SaaS', 'IndieHackers', 'Entrepreneur', 'SideProject', 'startups', 'marketing']),
    )
    expect(TARGET_SUBREDDITS).toHaveLength(6)
  })
})

describe('fetchSubredditFeed()', () => {
  it('fetches the correct subreddit URL', async () => {
    mockFetch.mockResolvedValueOnce(okXml('aaa111', 'SaaS'))

    await fetchSubredditFeed('SaaS', mockRedis as never)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.reddit.com/r/SaaS/new/.rss',
      expect.any(Object),
    )
  })

  it('caches results with 3-minute TTL', async () => {
    mockFetch.mockResolvedValueOnce(okXml('aaa111', 'SaaS'))

    await fetchSubredditFeed('SaaS', mockRedis as never)

    expect(mockRedis.set).toHaveBeenCalledWith(
      'rs:rss:sub:saas',
      expect.any(String),
      'EX',
      180,
    )
  })

  it('returns cached data without re-fetching', async () => {
    const cached = JSON.stringify([{ postId: 'cached1', title: 'c', url: 'u', snippet: 's', platform: 'REDDIT', subreddit: 'SaaS' }])
    mockRedis.get.mockResolvedValueOnce(cached)

    const result = await fetchSubredditFeed('SaaS', mockRedis as never)

    expect(mockFetch).not.toHaveBeenCalled()
    expect(result[0].postId).toBe('cached1')
  })

  it('falls through on corrupt cache and re-fetches', async () => {
    mockRedis.get.mockResolvedValueOnce('not valid json{{')
    mockFetch.mockResolvedValueOnce(okXml('bbb222', 'SaaS'))

    const result = await fetchSubredditFeed('SaaS', mockRedis as never)

    expect(mockFetch).toHaveBeenCalledOnce()
    expect(result[0].postId).toBe('bbb222')
  })
})

describe('fetchRedditRSS() — target subreddit integration', () => {
  it('fetches search.rss, r/all/new, and all 6 target subreddits', async () => {
    // search.rss + r/all/new + 6 target subreddits = 8 fetches
    mockFetch.mockResolvedValue(okXml('x001', 'SaaS'))

    await fetchRedditRSS('my keyword', mockRedis as never)

    const urls = mockFetch.mock.calls.map((args) => args[0] as string)
    expect(urls.some((u: string) => u.includes('search.rss'))).toBe(true)
    expect(urls.some((u: string) => u.includes('r/all/new'))).toBe(true)
    for (const sub of TARGET_SUBREDDITS) {
      expect(urls.some((u: string) => u.includes(`r/${sub}/new`))).toBe(true)
    }
  })

  it('includes items from target subreddits in the result', async () => {
    // Return empty for everything except r/IndieHackers
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('IndieHackers')) return Promise.resolve(okXml('ih001', 'IndieHackers'))
      return Promise.resolve({ ok: true, text: async () => '<feed/>', status: 200 })
    })

    const items = await fetchRedditRSS('my keyword', mockRedis as never)

    expect(items.some(i => i.postId === 'ih001')).toBe(true)
  })

  it('deduplicates posts that appear in both search results and a target subreddit', async () => {
    const dupId = 'dup001'
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('search.rss')) return Promise.resolve(okXml(dupId, 'SaaS'))
      if (url.includes('r/SaaS/new')) return Promise.resolve(okXml(dupId, 'SaaS'))
      return Promise.resolve({ ok: true, text: async () => '<feed/>', status: 200 })
    })

    const items = await fetchRedditRSS('my keyword', mockRedis as never)

    expect(items.filter(i => i.postId === dupId)).toHaveLength(1)
  })

  it('includes items from monitor-specific subreddit alongside target subreddits', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('r/customsub/new')) return Promise.resolve(okXml('cs001', 'customsub'))
      return Promise.resolve({ ok: true, text: async () => '<feed/>', status: 200 })
    })

    const items = await fetchRedditRSS('my keyword', mockRedis as never, 'customsub')

    expect(items.some(i => i.postId === 'cs001')).toBe(true)
  })

  it('does not abort all feeds when one target subreddit fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('r/SaaS/new')) return Promise.reject(new Error('timeout'))
      if (url.includes('r/startups/new')) return Promise.resolve(okXml('st001', 'startups'))
      return Promise.resolve({ ok: true, text: async () => '<feed/>', status: 200 })
    })

    const items = await fetchRedditRSS('my keyword', mockRedis as never)

    expect(items.some(i => i.postId === 'st001')).toBe(true)
  })

  it('target subreddit feeds are cached at the subreddit level, not per-keyword', async () => {
    mockFetch.mockResolvedValue(okXml('x001', 'SaaS'))

    // First keyword — populates subreddit caches
    await fetchRedditRSS('keyword one', mockRedis as never)

    const saasKey = 'rs:rss:sub:saas'
    const setCalls = mockRedis.set.mock.calls.map((args) => args[0] as string)
    expect(setCalls).toContain(saasKey)

    // Second keyword — subreddit cache returns data, no second HTTP fetch for SaaS
    const cachedSaas = JSON.stringify([{ postId: 'saas1', title: 't', url: 'u', snippet: 's', platform: 'REDDIT', subreddit: 'SaaS' }])
    mockRedis.get.mockImplementation((k: string) =>
      k === saasKey ? Promise.resolve(cachedSaas) : Promise.resolve(null),
    )
    vi.clearAllMocks()
    mockFetch.mockResolvedValue(okXml('x002', 'other'))

    await fetchRedditRSS('keyword two', mockRedis as never)

    const fetchedUrls = mockFetch.mock.calls.map((args) => args[0] as string)
    expect(fetchedUrls.every((u: string) => !u.includes('r/SaaS/new'))).toBe(true)
  })
})
