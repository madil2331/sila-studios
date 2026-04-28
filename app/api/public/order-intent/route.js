import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getWhatsAppLink } from '@/lib/whatsapp'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const productId = body?.product_id
    if (!productId) return NextResponse.json({ error: 'Missing product_id' }, { status: 400 })

    const db = getSupabaseAdmin()

    const { data: product, error: pErr } = await db
      .from('products')
      .select('id,name,price')
      .eq('id', productId)
      .single()
    if (pErr || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    // Create a lightweight order record (intent). Customer details can be filled in by admin later.
    const { data: order, error: oErr } = await db
      .from('orders')
      .insert([{
        customer_name: null,
        customer_phone: null,
        customer_city: null,
        product_name: product.name,
        status: 'Pending',
        notes: 'Web order intent (WhatsApp click)',
        cod_amount: product.price ?? null,
        courier_name: null,
        tracking_number: null,
        shipment_status: null,
      }])
      .select('id')
      .single()
    if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 })

    const priceLabel = `Rs. ${Number(product.price || 0).toLocaleString('en-US')}`
    const msg = `Hi Sila Studios! I want to order: "${product.name}" (${priceLabel}).\n\nOrder ID: ${order.id}\nCity: \nSize: \nAddress: `
    const waLink = getWhatsAppLink(msg)

    return NextResponse.json({ order_id: order.id, waLink }, { status: 201, headers: NO_STORE })
  } catch (e) {
    console.error('order-intent error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: NO_STORE })
  }
}

