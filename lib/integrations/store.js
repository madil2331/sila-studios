import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { canEncrypt, decryptSecret, encryptSecret } from './crypto'

// Table expected: integrations(key text primary key, provider text, config jsonb, secret_enc text, updated_at timestamptz default now())

export async function getIntegration(key) {
  try {
    const db = getSupabaseAdmin()
    const { data, error } = await db.from('integrations').select('*').eq('key', key).single()
    if (error) throw error
    return data || null
  } catch {
    return null
  }
}

export async function upsertIntegration({ key, provider, config, secretPlain }) {
  const db = getSupabaseAdmin()
  const payload = {
    key,
    provider,
    config: config || {},
    updated_at: new Date().toISOString(),
  }

  if (secretPlain !== undefined) {
    if (secretPlain) {
      if (!canEncrypt()) throw new Error('Encryption key not configured')
      payload.secret_enc = encryptSecret(secretPlain)
    } else {
      payload.secret_enc = null
    }
  }

  const { data, error } = await db.from('integrations').upsert(payload).select('*').single()
  if (error) throw error
  return data
}

export function safeDecrypt(enc) {
  try {
    if (!enc) return null
    if (!canEncrypt()) return null
    return decryptSecret(enc)
  } catch {
    return null
  }
}

