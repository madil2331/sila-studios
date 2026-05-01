import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveRouteParams } from '@/lib/route-params'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

function parseAmount(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number.parseInt(String(value).replace(/,/g, ''), 10)
  return Number.isFinite(parsed) ? parsed : null
}

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
  const update = {}
  if ('customer_name' in body) update.customer_name = body.customer_name
  if ('customer_phone' in body) update.customer_phone = body.customer_phone
  if ('customer_city' in body) update.customer_city = body.customer_city
  if ('product_name' in body) update.product_name = body.product_name
  if ('status' in body) update.status = body.status
  if ('notes' in body) update.notes = body.notes
  if ('cod_amount' in body) update.cod_amount = parseAmount(body.cod_amount)
  if ('courier_name' in body) update.courier_name = body.courier_name || null
  if ('tracking_number' in body) update.tracking_number = body.tracking_number || null
  if ('shipment_status' in body) update.shipment_status = body.shipment_status || null

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400, headers: NO_STORE })
  }

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .update(update)
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
