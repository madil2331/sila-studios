import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getCourierProvider } from '@/lib/couriers'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

async function requireAuth() {
  const session = await getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function POST(request) {
  const authError = await requireAuth()
  if (authError) return authError

  const body = await request.json().catch(() => ({}))
  const orderId = body?.order_id
  if (!orderId) return NextResponse.json({ error: 'Missing order_id' }, { status: 400, headers: NO_STORE })

  const db = getSupabaseAdmin()
  const { data: order, error } = await db.from('orders').select('*').eq('id', orderId).single()
  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: NO_STORE })

  const courier = getCourierProvider()
  const booking = await courier.bookShipment({ order })

  // If a provider returns a tracking number, store it.
  if (booking?.tracking_number) {
    await db.from('orders').update({
      courier_name: courier.name,
      tracking_number: booking.tracking_number,
      shipment_status: booking.status || 'Booked',
    }).eq('id', orderId)
  }

  return NextResponse.json({ provider: courier.name, booking }, { headers: NO_STORE })
}

