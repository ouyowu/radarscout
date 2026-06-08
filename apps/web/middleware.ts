import { NextResponse } from 'next/server'

const PROTECTED = ['/monitors', '/billing', '/dashboard']
const STALE_MARKETING_PATHS = new Set([
  '/demo',
  '/use-cases',
  '/pricing',
  '/f5bot-alternative',
  '/gummysearch-alternative',
  '/reddit-monitoring-tool',
  '/reddit-keyword-monitor',
  '/reddit-mention-alerts',
  '/reddit-lead-finder',
  '/social-listening-reddit',
  '/reddit-competitor-monitoring',
  '/reddit-customer-discovery',
])
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

export default function middleware(req: Request & { nextUrl: URL; cookies: { get: (name: string) => { value: string } | undefined } }) {
  const { pathname } = req.nextUrl
  const isAuthed = SESSION_COOKIE_NAMES.some((name) => Boolean(req.cookies.get(name)?.value))

  if (STALE_MARKETING_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL('/', req.url), 308)
  }

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (!isAuthed && isProtected) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthed && isAuthPage) {
    return NextResponse.redirect(new URL('/monitors', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
