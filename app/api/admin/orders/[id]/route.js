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
  const {
    customer_name,
    customer_phone,
    customer_city,
    product_name,
    status,
    notes,
    cod_amount,
    courier_name,
    tracking_number,
    shipment_status,
  } = body
  const amount = parseAmount(cod_amount)

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .update({
      customer_name,
      customer_phone,
      customer_city,
      product_name,
      status,
      notes,
      cod_amount: amount,
      courier_name: courier_name || null,
      tracking_number: tracking_number || null,
      shipment_status: shipment_status || null,
    })
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
