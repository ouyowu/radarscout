import { describe, it, expect, vi, beforeEach } from 'vitest'
import Anthropic from '@anthropic-ai/sdk'
import { scoreMatch } from './scorer.js'

vi.mock('@anthropic-ai/sdk', () => ({ default: vi.fn() }))

function makeMockRedis(cached: string | null = null) {
  return {
    get: vi.fn().mockResolvedValue(cached),
    set: vi.fn().mockResolvedValue('OK'),
  }
}

const POST = { title: 'Best CRM for small teams?', snippet: 'Looking for recommendations' }
const BASE_OPTS = { keywordId: 'kw1', postId: 'post1' }

describe('scoreMatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = 'test-key'
  })

  it('returns score and summary for PRO user', async () => {
    const create = vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: '{"score":9,"summary":"Seeking CRM for small team"}' }],
    })
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual({ score: 9, summary: 'Seeking CRM for small team' })
    expect(create).toHaveBeenCalledOnce()
    expect(redis.set).toHaveBeenCalledOnce()
  })

  it('skips API call and returns null for FREE user', async () => {
    const create = vi.fn()
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'FREE',
      redis: redis as never,
    })

    expect(result).toEqual({ score: null, summary: null })
    expect(create).not.toHaveBeenCalled()
    expect(redis.get).not.toHaveBeenCalled()
  })

  it('returns null gracefully when API throws', async () => {
    const create = vi.fn().mockRejectedValue(new Error('network timeout'))
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual({ score: null, summary: null })
    expect(redis.set).not.toHaveBeenCalled()
  })

  it('returns cached result without calling API on second call', async () => {
    const create = vi.fn()
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const cached = JSON.stringify({ score: 8, summary: 'Comparing solutions for team use' })
    const redis = makeMockRedis(cached)

    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual({ score: 8, summary: 'Comparing solutions for team use' })
    expect(create).not.toHaveBeenCalled()
    expect(redis.set).not.toHaveBeenCalled()
  })
})
