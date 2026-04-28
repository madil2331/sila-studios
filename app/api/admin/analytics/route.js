import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

async function requireAuth() {
  const session = await getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const db = getSupabaseAdmin()
    const { data, error } = await db
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return NextResponse.json(data || [], { headers: NO_STORE })
  } catch {
    return NextResponse.json([], { headers: NO_STORE })
  }
}

