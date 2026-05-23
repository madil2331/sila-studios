'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const PRICE_LOCALE = 'en-US'

function parseOrderNumber(notes) {
  const m = String(notes || '').match(/Order No:\s*(ORD-\d{4})/i)
  return m?.[1] || ''
}

export default function OrderClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const productId = useMemo(() => searchParams.get('product') || '', [searchParams])

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null) // { order_id, order_number, waLink }

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    size: '',
    address: '',
  })

  useEffect(() => {
    if (!productId) {
      setError('Missing product.')
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/public/products/${encodeURIComponent(productId)}`, { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          setError(data?.error || 'Could not load product.')
          setLoading(false)
          return
        }
        setProduct(data)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('Network error. Please try again.')
          setLoading(false)
        }
      }
    })()

    return () => { cancelled = true }
  }, [productId])

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, ...form }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Could not place order.')
        setSubmitting(false)
        return
      }
      setSuccess({ order_id: data.order_id, order_number: data.order_number, waLink: data.waLink })
      if (data.waLink) window.open(data.waLink, '_blank', 'noopener,noreferrer')
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 16 }}>Order Now</p>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Loading…</h1>
        <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto', color: 'var(--muted)' }}>
          Preparing your order form.
        </p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 16 }}>Order Now</p>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Couldn’t load product</h1>
        <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto', color: 'var(--muted)' }}>
          {error || 'Please go back and try again.'}
        </p>
        <div style={{ marginTop: 28 }}>
          <button className="btn-outline" onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    )
  }

  const price = product.discount_price != null ? Number(product.discount_price) : Number(product.price || 0)
  const priceLabel = `Rs. ${Number.isFinite(price) ? price.toLocaleString(PRICE_LOCALE) : '0'}`

  if (success) {
    const ord = success.order_number || ''
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 16 }}>Order Placed</p>
        <h1 className="display-md" style={{ marginBottom: 12 }}>Thank you!</h1>
        <p className="body-lg" style={{ maxWidth: 640, margin: '0 auto', color: 'var(--muted)' }}>
          Your order has been placed successfully. A WhatsApp confirmation draft has been opened. Your order number is <strong style={{ color: 'var(--charcoal)' }}>{ord || parseOrderNumber('') || success.order_id}</strong>.
        </p>
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn-whatsapp" href={success.waLink} target="_blank" rel="noopener noreferrer">
            Open WhatsApp Again →
          </a>
          <button className="btn-outline" onClick={() => router.push(`/track?id=${encodeURIComponent(success.order_id)}`)}>
            Track Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <div style={{ marginBottom: 18 }}>
        <button className="btn-outline" style={{ padding: '10px 14px', fontSize: 12 }} onClick={() => router.back()}>
          ← Back
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 42, alignItems: 'start' }}>
        <div style={{ borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: 'var(--cream-dark)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url || '/sila_banner.png'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: 18 }}>
            <p className="label" style={{ marginBottom: 10 }}>{product.category || 'Sila Studios'}</p>
            <h2 className="display-md" style={{ marginBottom: 10 }}>{product.name}</h2>
            <p className="body-lg" style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--charcoal)', fontWeight: 500 }}>{priceLabel}</span> · COD Available
            </p>
          </div>
        </div>

        <div>
          <p className="label" style={{ marginBottom: 10 }}>Order Form</p>
          <h1 className="display-md" style={{ marginBottom: 10 }}>Order Now</h1>
          <p className="body-lg" style={{ color: 'var(--muted)', marginBottom: 18 }}>
            Fill your details to create an order instantly. Then confirm via WhatsApp.
          </p>

          <div className="contact-form-group">
            <label>Name *</label>
            <input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Ayesha Khan" />
          </div>
          <div className="contact-form-group">
            <label>Phone (WhatsApp) *</label>
            <input value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="923001234567" />
          </div>
          <div className="contact-form-group">
            <label>City *</label>
            <input value={form.customer_city} onChange={e => setForm({ ...form, customer_city: e.target.value })} placeholder="Karachi" />
          </div>
          <div className="contact-form-group">
            <label>Size</label>
            <input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="S / M / L" />
          </div>
          <div className="contact-form-group">
            <label>Address *</label>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House/Street, Area, Landmark" />
          </div>

          {error ? (
            <p style={{ marginTop: 12, color: '#B00020', fontSize: 13, lineHeight: 1.5 }}>{error}</p>
          ) : null}

          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn-gold"
              onClick={submit}
              disabled={
                submitting ||
                !form.customer_name.trim() ||
                !form.customer_phone.trim() ||
                !form.customer_city.trim() ||
                !form.address.trim()
              }
            >
              {submitting ? 'Placing Order…' : 'Place Order'}
            </button>
            <button className="btn-outline" onClick={() => router.back()} disabled={submitting}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

