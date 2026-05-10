import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AhoCorasick } from '@reddit-monitor/matcher'
import { pollOnce } from './engine.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
  process.env.INTERNAL_API_URL = 'http://localhost:3000'
  process.env.INTERNAL_API_SECRET = 'test-secret'
})

afterEach(() => {
  delete process.env.INTERNAL_API_URL
  delete process.env.INTERNAL_API_SECRET
})

function buildAC(patterns: Array<[id: string, text: string]>): AhoCorasick {
  const ac = new AhoCorasick()
  for (const [id, text] of patterns) ac.addPattern(id, text)
  ac.build()
  return ac
}

const rustPost = {
  postId: 'post-1',
  title: 'Rust programming tutorial',
  url: 'https://reddit.com/r/rust/post-1',
  snippet: '',
  platform: 'REDDIT' as const,
}

describe('pollOnce()', () => {
  it('calls submitMatch when a keyword is found in a post title', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'match-1' }) })

    const client = {
      fetchNewPosts: vi.fn().mockResolvedValue([rustPost]),
      fetchNewComments: vi.fn().mockResolvedValue([]),
    }
    const ac = buildAC([['kw-rust', 'rust']])

    await pollOnce(client, ac, new Set())

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/internal/matches',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"keywordId":"kw-rust"'),
      }),
    )
  })

  it('does not call submitMatch when no keyword matches', async () => {
    const client = {
      fetchNewPosts: vi.fn().mockResolvedValue([rustPost]),
      fetchNewComments: vi.fn().mockResolvedValue([]),
    }
    const ac = buildAC([['kw-python', 'python']])

    await pollOnce(client, ac, new Set())

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('skips posts whose IDs are already in seenIds', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 'match-1' }) })

    const client = {
      fetchNewPosts: vi.fn().mockResolvedValue([rustPost]),
      fetchNewComments: vi.fn().mockResolvedValue([]),
    }
    const ac = buildAC([['kw-rust', 'rust']])
    const seenIds = new Set(['post-1'])

    await pollOnce(client, ac, seenIds)

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
