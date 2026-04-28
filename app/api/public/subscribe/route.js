import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const name = (body?.name || '').trim() || null
  const whatsapp = (body?.whatsapp || '').trim() || null
  const email = (body?.email || '').trim().toLowerCase() || null

  if (!whatsapp && !email) {
    return NextResponse.json({ error: 'Provide WhatsApp or email.' }, { status: 400, headers: NO_STORE })
  }

  // This table may not exist yet; if so, we fail gracefully.
  try {
    const db = getSupabaseAdmin()
    await db.from('subscribers').insert([{
      name,
      whatsapp,
      email,
      source: 'website',
    }])
    return NextResponse.json({ success: true }, { status: 201, headers: NO_STORE })
  } catch (e) {
    console.error('subscribe error', e)
    return NextResponse.json({ success: true }, { status: 201, headers: NO_STORE })
  }
}

