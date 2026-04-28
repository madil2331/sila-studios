import { NextResponse } from 'next/server'
import { verifySession, SESSION_COOKIE } from '@/lib/auth'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but not /admin itself — that's the login page)
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    // NOTE: verifySession is async; middleware must await it.
    return handleProtectedRoute(request, pathname, token)
  }

  return NextResponse.next()
}

async function handleProtectedRoute(request, pathname, token) {
  const session = token ? await verifySession(token) : null
  if (!session) {
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
