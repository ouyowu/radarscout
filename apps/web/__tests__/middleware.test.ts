import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: (handler: Function) => handler,
}))

import middleware from '../middleware'

function makeReq(pathname: string, authValue: unknown = null) {
  const req = new NextRequest(`https://radarscout.io${pathname}`) as NextRequest & { auth: unknown }
  req.auth = authValue
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
  for (const path of ['/', '/pricing', '/demo', '/f5bot-alternative',
    '/reddit-keyword-monitor', '/reddit-mention-alerts',
    '/reddit-lead-finder', '/reddit-monitoring-tool', '/api/health']) {
    it(`allows unauthenticated user to access ${path}`, () => {
      expect(middleware(makeReq(path, null))).toBeUndefined()
    })
  }
})
