import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

function requireAuth() {
  const session = getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const authError = requireAuth()
  if (authError) return authError

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const authError = requireAuth()
  if (authError) return authError

  const body = await request.json()
  const { customer_name, customer_phone, customer_city, product_name, status, notes } = body

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .insert([{ customer_name, customer_phone, customer_city, product_name, status: status || 'Pending', notes }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
