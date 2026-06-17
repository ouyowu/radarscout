import { NextResponse } from 'next/server'

const PROTECTED = ['/monitors', '/billing', '/dashboard']
const INTERNAL_PREFIX = '/internal/'

function checkInternalBasicAuth(
  req: { headers: { get: (name: string) => string | null } },
): boolean {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return false

  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Basic ')) return false

  let decoded: string
  try {
    decoded = atob(authHeader.slice(6))
  } catch {
    return false
  }

  // Format is "username:password" — only the password is validated
  const colonIndex = decoded.indexOf(':')
  if (colonIndex === -1) return false

  return decoded.slice(colonIndex + 1) === secret
}
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

  if (pathname.startsWith(INTERNAL_PREFIX)) {
    if (!checkInternalBasicAuth(req)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Internal Console"' },
      })
    }
    return NextResponse.next()
  }

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
