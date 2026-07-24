import { afterEach, describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: (handler: Function) => handler,
}))

import _middleware from '../middleware'

// Cast away the next-auth NextMiddleware type (which requires a second `event`
// argument) since our vi.mock('auth') makes it a plain single-arg handler.
const middleware = _middleware as unknown as (req: NextRequest) => Response | undefined

function makeReq(pathname: string, authValue: unknown = null) {
  const req = new NextRequest(`https://radarscout.io${pathname}`)
  if ((authValue as { user?: unknown } | null)?.user) {
    req.cookies.set('authjs.session-token', 'test-session')
  }
  return req
}

const authed = { user: { email: 'u@example.com' } }

describe('auth pages — must be publicly accessible', () => {
  it('does not redirect unauthenticated user from /auth/login', () => {
    expect(middleware(makeReq('/auth/login', null))).toBeUndefined()
  })

  it('does not redirect unauthenticated user from /auth/register', () => {
    expect(middleware(makeReq('/auth/register', null))).toBeUndefined()
  })

  // Reproduces the production bug: next-auth v5 beta returns req.auth = {}
  // (truthy) for unauthenticated JWT requests. !!req.auth was true for everyone,
  // so the isAuthed && isAuthPage branch fired and redirected all visitors to /monitors.
  it('does not redirect when req.auth is {} (no user — the production bug)', () => {
    expect(middleware(makeReq('/auth/login', {}))).toBeUndefined()
  })

  it('redirects authenticated user from /auth/login to /monitors', () => {
    const res = middleware(makeReq('/auth/login', authed))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/monitors')
  })

  it('redirects authenticated user from /auth/register to /monitors', () => {
    const res = middleware(makeReq('/auth/register', authed))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/monitors')
  })
})

describe('protected routes — require auth', () => {
  it('redirects unauthenticated user from /monitors to /auth/login', () => {
    const res = middleware(makeReq('/monitors', null))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/auth/login')
  })

  it('redirects unauthenticated user from /monitors/123 to /auth/login', () => {
    const res = middleware(makeReq('/monitors/123', null))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/auth/login')
  })

  it('redirects unauthenticated user from /billing to /auth/login', () => {
    const res = middleware(makeReq('/billing', null))
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/auth/login')
  })

  it('allows authenticated user to access /monitors', () => {
    expect(middleware(makeReq('/monitors', authed))).toBeUndefined()
  })
})

describe('public routes — no auth required', () => {
  for (const path of ['/', '/api/health']) {
    it(`allows unauthenticated user to access ${path}`, () => {
      expect(middleware(makeReq(path, null))).toBeUndefined()
    })
  }
})

describe('legacy comparison routes — permanently gone', () => {
  for (const path of [
    '/comparisons',
    '/comparisons/apple-watch-vs-garmin-sleep',
    '/comparisons/legacy/nested-page',
  ]) {
    it(`returns 410 without redirecting ${path}`, () => {
      const res = middleware(makeReq(path, null))

      expect(res?.status).toBe(410)
      expect(res?.headers.get('location')).toBeNull()
    })
  }
})

describe('/internal/ routes — Basic Auth required', () => {
  const INTERNAL_SECRET = 'test-internal-secret'

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  function makeInternalReq(pathname: string, authHeader?: string) {
    return new NextRequest(`https://radarscout.io${pathname}`, {
      headers: authHeader ? { authorization: authHeader } : {},
    })
  }

  function basicAuthHeader(password: string, username = 'internal') {
    return `Basic ${btoa(`${username}:${password}`)}`
  }

  it('returns 401 when INTERNAL_ENRICHMENT_REVIEW_SECRET is not set', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', '')
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment'))
    expect(res?.status).toBe(401)
    expect(res?.headers.get('www-authenticate')).toBe('Basic realm="Internal Console"')
  })

  it('returns 401 when no Authorization header is provided', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment'))
    expect(res?.status).toBe(401)
    expect(res?.headers.get('www-authenticate')).toBe('Basic realm="Internal Console"')
  })

  it('returns 401 when the password is wrong', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment', basicAuthHeader('wrong-password')))
    expect(res?.status).toBe(401)
  })

  it('returns 401 when Authorization header is not Basic scheme', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment', 'Bearer some-token'))
    expect(res?.status).toBe(401)
  })

  it('passes through when correct password is provided (any username)', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment', basicAuthHeader(INTERNAL_SECRET)))
    expect(res?.status).not.toBe(401)
  })

  it('passes through for any username as long as password matches', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/internal/reviewed-enrichment', basicAuthHeader(INTERNAL_SECRET, 'anyone')))
    expect(res?.status).not.toBe(401)
  })

  it('does not apply Basic Auth to non-/internal/ paths', () => {
    vi.stubEnv('INTERNAL_ENRICHMENT_REVIEW_SECRET', INTERNAL_SECRET)
    const res = middleware(makeInternalReq('/tours'))
    expect(res?.status).not.toBe(401)
  })
})

describe('stale SaaS marketing routes — redirected to travel homepage', () => {
  for (const path of [
    '/pricing',
    '/demo',
    '/use-cases',
    '/f5bot-alternative',
    '/gummysearch-alternative',
    '/reddit-keyword-monitor',
    '/reddit-mention-alerts',
    '/reddit-lead-finder',
    '/reddit-monitoring-tool',
    '/social-listening-reddit',
    '/reddit-competitor-monitoring',
    '/reddit-customer-discovery',
  ]) {
    it(`redirects ${path} to /`, () => {
      const res = middleware(makeReq(path, null))
      expect(res?.status).toBe(308)
      expect(res?.headers.get('location')).toBe('https://radarscout.io/')
    })
  }
})
