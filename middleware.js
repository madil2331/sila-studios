import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'sila_admin_session'

export const runtime = 'nodejs'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but not /admin itself — that's the login page)
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value

    // Middleware uses a lightweight cookie-presence gate.
    // Actual session signature/role verification is enforced in admin APIs via lib/auth.
    if (!token) {
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
