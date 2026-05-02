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

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const authError = await requireAuth()
  if (authError) return authError

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
  } = body

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const basePayload = {
    name,
    handle: handle || null,
    price: parseInt(price),
    category,
    description,
    badge,
    in_stock: in_stock ?? true,
    image_url: image_url || null,
  }

  const richPayload = {
    ...basePayload,
    media_urls: Array.isArray(media_urls) ? media_urls : null,
    available_sizes: available_sizes || null,
    available_colors: available_colors || null,
    compare_at_price: compare_at_price ?? null,
    discount_price: discount_price ?? null,
  }

  let insert = await db.from('products').insert([richPayload]).select().single()
  if (insert.error) {
    // If schema doesn't have some columns yet (e.g. handle/media), retry smaller payloads.
    const withoutRich = await db.from('products').insert([basePayload]).select().single()
    if (!withoutRich.error) insert = withoutRich
    else {
      const minimal = {
        name,
        price: parseInt(price),
        in_stock: in_stock ?? true,
        image_url: image_url || null,
      }
      insert = await db.from('products').insert([minimal]).select().single()
    }
  }

  if (insert.error) return NextResponse.json({ error: insert.error.message }, { status: 500 })
  return NextResponse.json(insert.data, { status: 201, headers: NO_STORE })
}
