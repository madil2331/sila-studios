import { NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but not /admin itself — that's the login page)
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value

    if (!token || !verifySession(token)) {
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
