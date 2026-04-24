import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

async function requireAuth() {
  const session = getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function PUT(request, { params }) {
  const authError = requireAuth()
  if (authError) return authError

  const body = await request.json()
  const { customer_name, customer_phone, customer_city, product_name, status, notes } = body

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .update({ customer_name, customer_phone, customer_city, product_name, status, notes })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const authError = requireAuth()
  if (authError) return authError

  const db = getSupabaseAdmin()
  const { error } = await db.from('orders').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
