import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { packDescriptionAndNote, unpackDescriptionAndNote } from '@/lib/product-note'

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
  const normalized = (data || []).map((item) => ({ ...item, ...unpackDescriptionAndNote(item.description, item.product_note) }))
  return NextResponse.json(normalized)
}

export async function POST(request) {
  const authError = await requireAuth()
  if (authError) return authError

  const body = await request.json()
  const {
    name, handle, price, category, description, badge, in_stock, image_url,
    media_urls, available_sizes, available_colors, compare_at_price, discount_price,
    product_note, short_description, long_description, sku, status, tags,
    meta_title, meta_description, inventory_count,
  } = body

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  const db = getSupabaseAdmin()
  const packedDescription = packDescriptionAndNote(description || short_description || long_description, product_note)

  const legacyBase = {
    name,
    handle: handle || null,
    price: parseInt(price),
    category,
    description: packedDescription,
    badge,
    in_stock: in_stock ?? true,
    image_url: image_url || null,
  }

  const legacyRich = {
    ...legacyBase,
    media_urls: Array.isArray(media_urls) ? media_urls : null,
    available_sizes: available_sizes || null,
    available_colors: available_colors || null,
    compare_at_price: compare_at_price ?? null,
    discount_price: discount_price ?? null,
  }

  const richPayload = {
    ...legacyRich,
    product_note: product_note || null,
    short_description: short_description || null,
    long_description: long_description || null,
    sku: sku || null,
    status: status || 'published',
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : null),
    meta_title: meta_title || null,
    meta_description: meta_description || null,
    inventory_count: inventory_count ?? null,
  }

  const withoutNote = { ...richPayload }
  delete withoutNote.product_note

  const payloads = [richPayload, withoutNote, legacyRich, legacyBase, { name, price: parseInt(price), in_stock: in_stock ?? true, image_url: image_url || null, description: packedDescription }]

  let insert = null
  for (const payload of payloads) {
    // eslint-disable-next-line no-await-in-loop
    insert = await db.from('products').insert([payload]).select().single()
    if (!insert.error) break
  }

  if (insert?.error) return NextResponse.json({ error: insert.error.message }, { status: 500 })
  return NextResponse.json(insert.data, { status: 201, headers: NO_STORE })
}
