import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RedditClient } from './reddit.js'
import { RateLimiter } from './rate-limiter.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function tokenResponse() {
  return { ok: true, json: async () => ({ access_token: 'tok', expires_in: 3600 }) }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('RedditClient.authenticate()', () => {
  it('posts to Reddit OAuth endpoint with correct User-Agent header', async () => {
    mockFetch.mockResolvedValueOnce(tokenResponse())

    const client = new RedditClient('cid', 'csecret', 'TestAgent/1.0')
    await client.authenticate()

    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.reddit.com/api/v1/access_token',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'User-Agent': 'TestAgent/1.0' }),
      }),
    )
  })

  it('uses client_credentials grant when no username/password provided', async () => {
    mockFetch.mockResolvedValueOnce(tokenResponse())

    const client = new RedditClient('cid', 'csecret', 'TestAgent/1.0')
    await client.authenticate()

    const [, init] = mockFetch.mock.calls[0]
    expect(init.body).toBe('grant_type=client_credentials')
  })

  it('uses password grant when username and password are provided', async () => {
    mockFetch.mockResolvedValueOnce(tokenResponse())

    const client = new RedditClient('cid', 'csecret', 'TestAgent/1.0', 'user', 'pass')
    await client.authenticate()

    const [, init] = mockFetch.mock.calls[0]
    expect(init.body).toContain('grant_type=password')
    expect(init.body).toContain('username=user')
  })
})

describe('RedditClient.fetchNewPosts()', () => {
  it('calls /r/all/new.json and returns CrawledItem[]', async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            children: [
              {
                data: {
                  id: 'abc123',
                  title: 'Rust is great',
                  selftext: 'body text here',
                  permalink: '/r/programming/comments/abc123/rust_is_great/',
                },
              },
            ],
          },
        }),
      })

    const client = new RedditClient('cid', 'csecret', 'TestAgent/1.0')
    const posts = await client.fetchNewPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0]).toMatchObject({
      postId: 'abc123',
      title: 'Rust is great',
      snippet: 'body text here',
      platform: 'REDDIT',
    })
    expect(posts[0].url).toContain('reddit.com')

    const [[url]] = mockFetch.mock.calls.slice(-1)
    expect(url.toString()).toContain('/r/all/new.json')
  })
})

describe('RedditClient.fetchNewComments()', () => {
  it('calls /r/all/comments.json and returns CrawledItem[] with c_ prefix', async () => {
    mockFetch
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            children: [
              {
                data: {
                  id: 'xyz789',
                  link_title: 'Post about Rust',
                  body: 'Rust is amazing for systems programming',
                  permalink: '/r/programming/comments/abc/post/xyz789/',
                },
              },
            ],
          },
        }),
      })

    const client = new RedditClient('cid', 'csecret', 'TestAgent/1.0')
    const comments = await client.fetchNewComments()

    expect(comments).toHaveLength(1)
    expect(comments[0]).toMatchObject({
      postId: 'c_xyz789',
      title: 'Post about Rust',
      snippet: 'Rust is amazing for systems programming',
      platform: 'REDDIT',
    })

    const [[url]] = mockFetch.mock.calls.slice(-1)
    expect(url.toString()).toContain('/r/all/comments.json')
  })
})

describe('RateLimiter', () => {
  it('allows requests up to the limit without any timer delay', async () => {
    vi.useFakeTimers()
    const limiter = new RateLimiter(2, 1000)

    await limiter.throttle()
    await limiter.throttle()

    // No setTimeout should have been scheduled for the first two requests
    expect(vi.getTimerCount()).toBe(0)
    vi.useRealTimers()
  })

  it('delays the (limit+1)th request until the window passes', async () => {
    vi.useFakeTimers()
    const limiter = new RateLimiter(2, 1000)

    await limiter.throttle()
    await limiter.throttle()

    let resolved = false
    const pending = limiter.throttle().then(() => {
      resolved = true
    })

    expect(resolved).toBe(false)
    await vi.advanceTimersByTimeAsync(1001)
    await pending
    expect(resolved).toBe(true)

    vi.useRealTimers()
  })
})
