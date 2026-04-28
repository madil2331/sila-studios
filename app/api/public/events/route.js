import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const name = String(body?.name || '').slice(0, 64)
  const props = body?.props && typeof body.props === 'object' ? body.props : null

  if (!name) return NextResponse.json({ ok: true }, { headers: NO_STORE })

  try {
    const db = getSupabaseAdmin()
    await db.from('events').insert([{
      name,
      props,
      ua: request.headers.get('user-agent') || null,
      path: String(body?.path || '').slice(0, 256) || null,
    }])
  } catch (e) {
    // Table may not exist yet; keep the site functional.
    console.error('events insert failed', e)
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}

