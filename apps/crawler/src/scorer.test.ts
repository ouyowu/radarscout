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

const NULL_RESULT = {
  score: null,
  summary: null,
  painPoints: null,
  opportunityType: null,
  competitors: [],
}

const FULL_RESPONSE = JSON.stringify({
  score: 9,
  summary: 'Seeking CRM for small team',
  painPoints: 'Team lacks a centralised tool to track deals and follow-ups.',
  opportunityType: 'buying_intent',
  competitors: ['HubSpot', 'Pipedrive'],
})

describe('scoreMatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = 'test-key'
  })

  it('returns full result for PRO user', async () => {
    const create = vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: FULL_RESPONSE }],
    })
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual({
      score: 9,
      summary: 'Seeking CRM for small team',
      painPoints: 'Team lacks a centralised tool to track deals and follow-ups.',
      opportunityType: 'buying_intent',
      competitors: ['HubSpot', 'Pipedrive'],
    })
    expect(create).toHaveBeenCalledOnce()
    expect(redis.set).toHaveBeenCalledOnce()
  })

  it('skips API call and returns null result for FREE user', async () => {
    const create = vi.fn()
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'FREE',
      redis: redis as never,
    })

    expect(result).toEqual(NULL_RESULT)
    expect(create).not.toHaveBeenCalled()
    expect(redis.get).not.toHaveBeenCalled()
  })

  it('returns null result gracefully when API throws', async () => {
    const create = vi.fn().mockRejectedValue(new Error('network timeout'))
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual(NULL_RESULT)
    expect(redis.set).not.toHaveBeenCalled()
  })

  it('returns cached result without calling API on second call', async () => {
    const create = vi.fn()
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const cached = JSON.stringify({
      score: 8,
      summary: 'Comparing solutions for team use',
      painPoints: 'Current tool is too slow.',
      opportunityType: 'alternative_seeking',
      competitors: [],
    })
    const redis = makeMockRedis(cached)

    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result.score).toBe(8)
    expect(result.opportunityType).toBe('alternative_seeking')
    expect(create).not.toHaveBeenCalled()
    expect(redis.set).not.toHaveBeenCalled()
  })

  it('returns null result when response is missing required fields', async () => {
    const create = vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: '{"score":7,"summary":"some summary"}' }],
    })
    vi.mocked(Anthropic).mockImplementation(() => ({ messages: { create } }) as never)

    const redis = makeMockRedis()
    const result = await scoreMatch('CRM software', POST, {
      ...BASE_OPTS,
      plan: 'PRO',
      redis: redis as never,
    })

    expect(result).toEqual(NULL_RESULT)
    expect(redis.set).not.toHaveBeenCalled()
  })
})
