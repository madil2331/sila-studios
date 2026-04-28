import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveRouteParams } from '@/lib/route-params'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

async function requireAuth() {
  const session = await getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function PUT(request, { params }) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await resolveRouteParams(params)
  if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400 })

  const body = await request.json()
  const { customer_name, customer_phone, customer_city, product_name, status, notes } = body

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .update({ customer_name, customer_phone, customer_city, product_name, status, notes })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { headers: NO_STORE })
}

export async function DELETE(request, { params }) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await resolveRouteParams(params)
  if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { error } = await db.from('orders').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { headers: NO_STORE })
}
