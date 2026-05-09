import { RateLimiter } from './rate-limiter.js'

interface OAuthTokenResponse {
  access_token: string
  expires_in: number
}

export interface RedditPost {
  id: string
  title: string
  selftext: string
  permalink: string
  subreddit: string
}

export interface CrawledItem {
  postId: string
  title: string
  url: string
  snippet: string
  platform: 'REDDIT'
}

export class RedditClient {
  private token = ''
  private tokenExpiry = 0
  private readonly limiter = new RateLimiter(60, 60_000)

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly userAgent: string,
    private readonly username?: string,
    private readonly password?: string,
  ) {}

  private async refreshTokenIfNeeded(): Promise<void> {
    if (Date.now() < this.tokenExpiry) return

    const creds = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    const body =
      this.username && this.password
        ? `grant_type=password&username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
        : 'grant_type=client_credentials'

    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'User-Agent': this.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!res.ok) {
      throw new Error(`Reddit auth failed: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as OAuthTokenResponse
    this.token = data.access_token
    // Refresh 60 s before real expiry to avoid mid-request expiry
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  }

  /** Force a token refresh. Call once on startup or after credential rotation. */
  async authenticate(): Promise<void> {
    this.tokenExpiry = 0
    await this.refreshTokenIfNeeded()
  }

  async getNewPosts(subreddit: string, after?: string): Promise<RedditPost[]> {
    await this.limiter.throttle()
    await this.refreshTokenIfNeeded()

    const url = new URL(`https://oauth.reddit.com/r/${subreddit}/new.json`)
    url.searchParams.set('limit', '25')
    if (after) url.searchParams.set('after', after)

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'User-Agent': this.userAgent,
      },
    })

    if (!res.ok) {
      throw new Error(`Reddit API error: ${res.status} for r/${subreddit}`)
    }

    const data = (await res.json()) as {
      data: { children: Array<{ data: RedditPost }> }
    }
    return data.data.children.map(c => c.data)
  }

  async fetchNewPosts(after?: string): Promise<CrawledItem[]> {
    await this.limiter.throttle()
    await this.refreshTokenIfNeeded()

    const url = new URL('https://oauth.reddit.com/r/all/new.json')
    url.searchParams.set('limit', '25')
    if (after) url.searchParams.set('after', after)

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'User-Agent': this.userAgent,
      },
    })

    if (!res.ok) {
      throw new Error(`Reddit API error: ${res.status} fetching /r/all/new`)
    }

    const data = (await res.json()) as {
      data: {
        children: Array<{
          data: { id: string; title: string; selftext: string; permalink: string }
        }>
      }
    }

    return data.data.children.map(({ data: post }) => ({
      postId: post.id,
      title: post.title,
      url: `https://reddit.com${post.permalink}`,
      snippet: post.selftext.slice(0, 200),
      platform: 'REDDIT',
    }))
  }

  async fetchNewComments(after?: string): Promise<CrawledItem[]> {
    await this.limiter.throttle()
    await this.refreshTokenIfNeeded()

    const url = new URL('https://oauth.reddit.com/r/all/comments.json')
    url.searchParams.set('limit', '25')
    if (after) url.searchParams.set('after', after)

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'User-Agent': this.userAgent,
      },
    })

    if (!res.ok) {
      throw new Error(`Reddit API error: ${res.status} fetching /r/all/comments`)
    }

    const data = (await res.json()) as {
      data: {
        children: Array<{
          data: { id: string; link_title: string; body: string; permalink: string }
        }>
      }
    }

    return data.data.children.map(({ data: comment }) => ({
      postId: `c_${comment.id}`,
      title: comment.link_title,
      url: `https://reddit.com${comment.permalink}`,
      snippet: comment.body.slice(0, 200),
      platform: 'REDDIT',
    }))
  }
}
