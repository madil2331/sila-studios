import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { canEncrypt } from '@/lib/integrations/crypto'
import { getIntegration, upsertIntegration } from '@/lib/integrations/store'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

async function requireAuth() {
  const session = await getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET(request) {
  const authError = await requireAuth()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key') || ''
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: NO_STORE })

  const integration = await getIntegration(key)
  return NextResponse.json({
    key,
    provider: integration?.provider || null,
    config: integration?.config || {},
    hasSecret: Boolean(integration?.secret_enc),
    canEncrypt: canEncrypt(),
  }, { headers: NO_STORE })
}

export async function PUT(request) {
  const authError = await requireAuth()
  if (authError) return authError

  const body = await request.json().catch(() => ({}))
  const key = String(body?.key || '')
  const provider = String(body?.provider || '')
  const config = body?.config && typeof body.config === 'object' ? body.config : {}
  const secret = body?.secret // may be undefined, null, or string

  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: NO_STORE })
  if (!provider) return NextResponse.json({ error: 'Missing provider' }, { status: 400, headers: NO_STORE })

  try {
    const saved = await upsertIntegration({
      key,
      provider,
      config,
      secretPlain: secret === undefined ? undefined : (secret ? String(secret) : ''),
    })
    return NextResponse.json({
      key: saved.key,
      provider: saved.provider,
      config: saved.config || {},
      hasSecret: Boolean(saved.secret_enc),
      canEncrypt: canEncrypt(),
    }, { headers: NO_STORE })
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || 'Failed to save') }, { status: 400, headers: NO_STORE })
  }
}

