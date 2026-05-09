import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

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
const USE_DB_RATE_LIMIT = process.env.ENABLE_DB_RATE_LIMIT !== 'false'

async function checkRateLimitDb(ip) {
  const db = getSupabaseAdmin()
  const now = Date.now()

  const { data: row, error: readError } = await db
    .from('admin_login_rate_limits')
    .select('ip, count, first_attempt_at, locked_until')
    .eq('ip', ip)
    .maybeSingle()

  if (readError) throw readError

  if (!row) {
    const { error: insertError } = await db
      .from('admin_login_rate_limits')
      .upsert({ ip, count: 1, first_attempt_at: new Date(now).toISOString(), locked_until: null })
    if (insertError) throw insertError
    return { allowed: true }
  }

  const lockedUntilMs = row.locked_until ? Date.parse(row.locked_until) : 0
  if (lockedUntilMs > now) {
    const remaining = Math.ceil((lockedUntilMs - now) / 60000)
    return { allowed: false, message: `Too many attempts. Try again in ${remaining} minute(s).` }
  }

  const firstAttemptMs = row.first_attempt_at ? Date.parse(row.first_attempt_at) : now
  if (now - firstAttemptMs > LOCKOUT_MS) {
    const { error: resetError } = await db
      .from('admin_login_rate_limits')
      .update({ count: 1, first_attempt_at: new Date(now).toISOString(), locked_until: null })
      .eq('ip', ip)
    if (resetError) throw resetError
    return { allowed: true }
  }

  const count = Number(row.count || 0)
  if (count >= MAX_ATTEMPTS) {
    const lockedUntil = new Date(now + LOCKOUT_MS).toISOString()
    const { error: lockError } = await db
      .from('admin_login_rate_limits')
      .update({ locked_until: lockedUntil })
      .eq('ip', ip)
    if (lockError) throw lockError
    return { allowed: false, message: 'Too many failed attempts. Locked for 15 minutes.' }
  }

  const { error: incrementError } = await db
    .from('admin_login_rate_limits')
    .update({ count: count + 1 })
    .eq('ip', ip)
  if (incrementError) throw incrementError

  return { allowed: true }
}

function checkRateLimitMemory(ip) {
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

export async function checkRateLimit(ip) {
  if (!USE_DB_RATE_LIMIT) return checkRateLimitMemory(ip)

  try {
    return await checkRateLimitDb(ip)
  } catch {
    return checkRateLimitMemory(ip)
  }
}

export async function clearRateLimit(ip) {
  attempts.delete(ip)
  if (!USE_DB_RATE_LIMIT) return
  try {
    const db = getSupabaseAdmin()
    await db.from('admin_login_rate_limits').delete().eq('ip', ip)
  } catch {}
}

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
