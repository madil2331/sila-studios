import crypto from 'crypto'

function getKey() {
  const raw = process.env.INTEGRATIONS_ENCRYPTION_KEY || ''
  // Expect 32 bytes key as hex (64 chars) or base64.
  if (!raw) return null
  try {
    if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, 'hex')
    return Buffer.from(raw, 'base64')
  } catch {
    return null
  }
}

export function canEncrypt() {
  const key = getKey()
  return Boolean(key && key.length === 32)
}

export function encryptSecret(plain) {
  if (!plain) return null
  const key = getKey()
  if (!key || key.length !== 32) throw new Error('INTEGRATIONS_ENCRYPTION_KEY not set/invalid')

  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, tag, ciphertext]).toString('base64')
}

export function decryptSecret(enc) {
  if (!enc) return null
  const key = getKey()
  if (!key || key.length !== 32) throw new Error('INTEGRATIONS_ENCRYPTION_KEY not set/invalid')

  const buf = Buffer.from(enc, 'base64')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plain.toString('utf8')
}

