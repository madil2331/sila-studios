import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
const SESSION_COOKIE = 'sila_admin_session'
const SESSION_DURATION = '12h'

// In-memory rate limiter (resets on server restart — fine for this use case)
const attempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(ip) {
  const now = Date.now()
  const record = attempts.get(ip) || { count: 0, firstAttempt: now, lockedUntil: 0 }

  // Still locked out
  if (record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000)
    return { allowed: false, message: `Too many attempts. Try again in ${remaining} minute(s).` }
  }

  // Reset window after 15 mins of no attempts
  if (now - record.firstAttempt > LOCKOUT_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now, lockedUntil: 0 })
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS
    attempts.set(ip, record)
    return { allowed: false, message: 'Too many failed attempts. Locked for 15 minutes.' }
  }

  record.count += 1
  attempts.set(ip, record)
  return { allowed: true }
}

export function clearRateLimit(ip) {
  attempts.delete(ip)
}

export function createSession() {
  return jwt.sign({ role: 'admin', iat: Date.now() }, JWT_SECRET, { expiresIn: SESSION_DURATION })
}

export function verifySession(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload.role === 'admin' ? payload : null
  } catch {
    return null
  }
}

export function getSessionFromCookies() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null
    return verifySession(token)
  } catch {
    return null
  }
}

export { SESSION_COOKIE }
