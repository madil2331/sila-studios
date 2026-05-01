import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getWhatsAppLink } from '@/lib/whatsapp'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

function orderNumber() {
  // Keep it short + human-friendly (requested format), while id remains the true unique key.
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`
}

function formatPrice(value) {
  const n = Number(value || 0)
  return `Rs. ${Number.isFinite(n) ? n.toLocaleString('en-US') : '0'}`
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const productId = body?.product_id
    const customer_name = String(body?.customer_name || '').trim()
    const customer_phone = String(body?.customer_phone || '').trim()
    const customer_city = String(body?.customer_city || '').trim()
    const size = String(body?.size || '').trim()
    const address = String(body?.address || '').trim()

    if (!productId) return NextResponse.json({ error: 'Missing product_id' }, { status: 400, headers: NO_STORE })
    if (!customer_name) return NextResponse.json({ error: 'Missing name' }, { status: 400, headers: NO_STORE })
    if (!customer_phone) return NextResponse.json({ error: 'Missing phone' }, { status: 400, headers: NO_STORE })
    if (!customer_city) return NextResponse.json({ error: 'Missing city' }, { status: 400, headers: NO_STORE })
    if (!address) return NextResponse.json({ error: 'Missing address' }, { status: 400, headers: NO_STORE })

    const db = getSupabaseAdmin()
    const { data: product, error: pErr } = await db
      .from('products')
      .select('id,name,price,discount_price')
      .eq('id', productId)
      .single()

    if (pErr || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: NO_STORE })

    const price = product.discount_price != null ? Number(product.discount_price) : Number(product.price || 0)
    const ord = orderNumber()

    const notes = [
      'Web order (hybrid)',
      `Order No: ${ord}`,
      size ? `Size: ${size}` : null,
      `Address: ${address}`,
    ].filter(Boolean).join('\n')

    const insertFull = {
      customer_name,
      customer_phone,
      customer_city,
      product_name: product.name,
      status: 'Pending',
      notes,
      cod_amount: Number.isFinite(price) ? Math.trunc(price) : null,
      courier_name: null,
      tracking_number: null,
      shipment_status: null,
      order_number: ord,
    }

    // Your Supabase schema may not have all columns yet (e.g. order_number).
    let order = null
    let oErr = null
    ;({ data: order, error: oErr } = await db.from('orders').insert([insertFull]).select('id').single())

    if (oErr) {
      const msg = String(oErr.message || '')
      const looksLikeMissingColumn = msg.includes('schema cache') || msg.includes('Could not find the') || msg.includes('column')
      if (!looksLikeMissingColumn) return NextResponse.json({ error: oErr.message }, { status: 500, headers: NO_STORE })

      const minimal = {
        customer_name,
        customer_phone,
        customer_city,
        product_name: product.name,
        status: 'Pending',
        notes,
        cod_amount: Number.isFinite(price) ? Math.trunc(price) : null,
      }
      const retry = await db.from('orders').insert([minimal]).select('id').single()
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500, headers: NO_STORE })
      order = retry.data
    }

    const msg = `Assalam-o-Alaikum! ✨\n\nI've placed Order #${ord} on Sila Studios:\n\n📦 Product: ${product.name}\n💰 Price: ${formatPrice(price)}\n📏 Size: ${size || '—'}\n📍 City: ${customer_city}\n\nPlease confirm availability and estimated delivery time.\n\nJazakAllah! 🌸`
    const waLink = getWhatsAppLink(msg)

    return NextResponse.json({ order_id: order.id, order_number: ord, waLink }, { status: 201, headers: NO_STORE })
  } catch (e) {
    console.error('public orders POST error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: NO_STORE })
  }
}

