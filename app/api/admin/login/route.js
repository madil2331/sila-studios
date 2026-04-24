import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { checkRateLimit, clearRateLimit, createSession, SESSION_COOKIE } from '@/lib/auth'

export async function POST(request) {
  try {
    // Get real IP (Vercel sets x-forwarded-for)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Check rate limit
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 })
    }

    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Sanitize input — strip anything over 200 chars (kills injection payloads)
    const sanitized = password.slice(0, 200)

    // Compare against bcrypt hash stored in env
    const hash = process.env.ADMIN_PASSWORD_HASH
    if (!hash) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    }

    const valid = await bcrypt.compare(sanitized, hash)

    if (!valid) {
      // Add artificial delay to slow brute force even further
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    // Success — clear rate limit, issue JWT session cookie
    clearRateLimit(ip)
    const token = await createSession()

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,       // JS can't read it — kills XSS cookie theft
      secure: true,         // HTTPS only
      sameSite: 'strict',   // No CSRF
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
