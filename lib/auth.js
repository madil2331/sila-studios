import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'sila_admin_session'
const SESSION_DURATION = '12h'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

const attempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

export function checkRateLimit(ip) {
  const now = Date.now()
  const record = attempts.get(ip) || { count: 0, firstAttempt: now, lockedUntil: 0 }
  if (record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 60000)
    return { allowed: false, message: `Too many attempts. Try again in ${remaining} minute(s).` }
  }
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

export function clearRateLimit(ip) { attempts.delete(ip) }

export async function createSession() {
  const secret = getSecret()
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secret)
}

export async function verifySession(token) {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload.role === 'admin' ? payload : null
  } catch {
    return null
  }
}

export async function getSessionFromCookies() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null
    return await verifySession(token)
  } catch {
    return null
  }
}

export { SESSION_COOKIE }
