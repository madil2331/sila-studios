'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TrackClient() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = searchParams.get('id')
    if (id && !orderId) setOrderId(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!orderId.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/public/orders/${encodeURIComponent(orderId.trim())}`, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Order not found.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '88px 0', maxWidth: 720 }}>
      <div className="page-hero" style={{ paddingBottom: 24 }}>
        <p className="label">Order Tracking</p>
        <div className="gold-divider" />
        <h1 className="display-lg" style={{ marginTop: 16 }}>Track your order</h1>
        <p className="body-lg" style={{ maxWidth: 520, margin: '16px auto 0', color: 'var(--muted)' }}>
          Paste your Order ID (you’ll see it in your WhatsApp message).
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          className="admin-login-input"
          style={{ maxWidth: 360, background: '#0F0F0D', borderColor: 'rgba(255,255,255,0.08)', color: 'var(--cream)' }}
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="e.g. 123"
        />
        <button className="btn-gold" type="submit" disabled={loading || !orderId.trim()}>
          {loading ? 'Checking…' : 'Check Status'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 22, textAlign: 'center', color: '#F09595' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 28, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: 22 }}>
          <p className="label" style={{ marginBottom: 10 }}>Status</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 22, color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif' }}>
              {result.status}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>
              Order #{result.id} · {new Date(result.created_at).toLocaleDateString('en-PK')}
            </div>
          </div>

          <div style={{ marginTop: 16, color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>
            {result.tracking_number ? <div><strong style={{ color: 'var(--cream)' }}>Tracking:</strong> {result.tracking_number}</div> : null}
            {result.courier_name ? <div><strong style={{ color: 'var(--cream)' }}>Courier:</strong> {result.courier_name}</div> : null}
            {result.shipment_status ? <div><strong style={{ color: 'var(--cream)' }}>Shipment:</strong> {result.shipment_status}</div> : null}
          </div>
        </div>
      )}
    </div>
  )
}

