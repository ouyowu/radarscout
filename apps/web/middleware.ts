import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PROTECTED = ['/monitors', '/billing', '/dashboard']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthed = !!req.auth?.user

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (!isAuthed && isProtected) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (isAuthed && isAuthPage) {
    return NextResponse.redirect(new URL('/monitors', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
