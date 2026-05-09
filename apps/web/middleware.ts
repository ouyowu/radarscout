import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthed = !!req.auth

  const isAuthRoute = pathname.startsWith('/auth')
  const isPublicApi =
    pathname.startsWith('/api/internal') || pathname === '/api/stripe/webhook'

  if (!isAuthed && !isAuthRoute && !isPublicApi) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthed && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/monitors', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
