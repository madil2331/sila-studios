import { Suspense } from 'react'
import OrderClient from './OrderClient'

export const dynamic = 'force-dynamic'

export default function OrderRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
          <p className="label" style={{ marginBottom: 16 }}>WhatsApp Order</p>
          <h1 className="display-md" style={{ marginBottom: 16 }}>Redirecting…</h1>
          <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto', color: 'var(--muted)' }}>
            Preparing your WhatsApp order.
          </p>
        </div>
      }
    >
      <OrderClient />
    </Suspense>
  )
}

