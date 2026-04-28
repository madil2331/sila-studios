import { NextResponse } from 'next/server'
import { getPaymentProvider } from '@/lib/payments'

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' }

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const provider = getPaymentProvider()
  const result = await provider.createPaymentIntent(body)
  return NextResponse.json({ provider: provider.name, ...result }, { headers: NO_STORE })
}

