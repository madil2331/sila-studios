import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveRouteParams } from '@/lib/route-params'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

function parsePrice(price) {
  const n = Number.parseInt(String(price).replace(/,/g, ''), 10)
  return Number.isFinite(n) ? n : NaN
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
  if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })

  const body = await request.json()
  const { name, price, category, description, badge, in_stock, image_url } = body

  const parsedPrice = parsePrice(price)
  if (!Number.isFinite(parsedPrice)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }

  const payload = {
    name,
    price: parsedPrice,
    category,
    description,
    badge,
    in_stock,
  }
  if (image_url !== undefined) payload.image_url = image_url || null

  const db = getSupabaseAdmin()
  const { data, error } = await db.from('products').update(payload)
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
  if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { error } = await db.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { headers: NO_STORE })
}
