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
  const {
    name,
    handle,
    price,
    category,
    description,
    badge,
    in_stock,
    image_url,
    media_urls,
    available_sizes,
    available_colors,
    compare_at_price,
    discount_price,
    product_note,
  } = body

  const parsedPrice = parsePrice(price)
  if (!Number.isFinite(parsedPrice)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }

  const basePayload = {
    name,
    handle: handle === undefined ? undefined : (handle || null),
    price: parsedPrice,
    category,
    description,
    badge,
    in_stock,
  }
  if (image_url !== undefined) basePayload.image_url = image_url || null

  const richPayload = {
    ...basePayload,
    media_urls: Array.isArray(media_urls) ? media_urls : media_urls === null ? null : undefined,
    available_sizes: available_sizes === undefined ? undefined : (available_sizes || null),
    available_colors: available_colors === undefined ? undefined : (available_colors || null),
    compare_at_price: compare_at_price === undefined ? undefined : (compare_at_price ?? null),
    discount_price: discount_price === undefined ? undefined : (discount_price ?? null),
    product_note: product_note === undefined ? undefined : (product_note || null),
  }

  const db = getSupabaseAdmin()
  let update = await db.from('products').update(richPayload).eq('id', id).select().single()
  if (update.error) {
    update = await db.from('products').update(basePayload).eq('id', id).select().single()
  }

  if (update.error) return NextResponse.json({ error: update.error.message }, { status: 500 })
  return NextResponse.json(update.data, { headers: NO_STORE })
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
