import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { resolveRouteParams } from '@/lib/route-params'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function GET(request, { params }) {
  const { id } = await resolveRouteParams(params)
  if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400, headers: NO_STORE })

  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('orders')
    .select('id,status,created_at,courier_name,tracking_number,shipment_status')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: NO_STORE })
  return NextResponse.json(data, { headers: NO_STORE })
}

