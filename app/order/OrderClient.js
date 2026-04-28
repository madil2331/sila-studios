'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function OrderClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState('')

  const productId = useMemo(() => searchParams.get('product') || '', [searchParams])

  useEffect(() => {
    if (!productId) {
      setError('Missing product.')
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch('/api/public/order-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId }),
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return

        if (!res.ok || !data?.waLink) {
          setError(data?.error || 'Could not start WhatsApp order.')
          return
        }

        window.location.assign(data.waLink)
      } catch {
        if (!cancelled) setError('Network error. Please try again.')
      }
    })()

    return () => { cancelled = true }
  }, [productId])

  return (
    <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
      <p className="label" style={{ marginBottom: 16 }}>WhatsApp Order</p>
      <h1 className="display-md" style={{ marginBottom: 16 }}>Redirecting…</h1>
      <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto', color: 'var(--muted)' }}>
        {error || 'Opening WhatsApp with your order details.'}
      </p>
      <div style={{ marginTop: 28 }}>
        <button className="btn-outline" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    </div>
  )
}

