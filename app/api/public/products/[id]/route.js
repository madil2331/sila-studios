import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveRouteParams } from '@/lib/route-params'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function GET(request, { params }) {
  const { id } = await resolveRouteParams(params)
  if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400, headers: NO_STORE })

  const db = getSupabaseAdmin()
  // Support both legacy id-based URLs and new handle-based URLs.
  let data = null
  let error = null

  const byHandle = await db
    .from('products')
    .select('id,handle,name,price,discount_price,compare_at_price,image_url,in_stock,category')
    .eq('handle', id)
    .single()
  if (!byHandle.error && byHandle.data) {
    data = byHandle.data
  } else {
    const byId = await db
      .from('products')
      .select('id,handle,name,price,discount_price,compare_at_price,image_url,in_stock,category')
      .eq('id', id)
      .single()
    data = byId.data
    error = byId.error
  }

  if (error || !data) return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: NO_STORE })
  return NextResponse.json(data, { headers: NO_STORE })
}

