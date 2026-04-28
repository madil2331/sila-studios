import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

const PRICE_LOCALE = 'en-US'

async function getProduct(id) {
  noStore()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <p className="label" style={{ marginBottom: 16 }}>Not Found</p>
        <h1 className="display-md" style={{ marginBottom: 16 }}>Product not available</h1>
        <Link href="/collections" className="btn-outline">Back to Collections</Link>
      </div>
    )
  }

  const basePrice = Number(product.price || 0)
  const discounted = product.discount_price != null ? Number(product.discount_price) : null
  const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null
  const showPrice = discounted != null && Number.isFinite(discounted) ? discounted : basePrice
  const strikePrice = compareAt != null && Number.isFinite(compareAt) ? compareAt : (discounted != null ? basePrice : null)
  const priceLabel = `Rs. ${showPrice.toLocaleString(PRICE_LOCALE)}`
  const media = Array.isArray(product.media_urls) ? product.media_urls : []
  const images = [product.image_url, ...media].filter(Boolean)

  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <div style={{ marginBottom: 18 }}>
        <Link href="/collections" className="btn-outline" style={{ padding: '10px 14px', fontSize: 12 }}>
          ← Back to Collections
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 42, alignItems: 'start' }}>
        <div>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', background: '#0F0F0D', border: '1px solid rgba(255,255,255,0.06)' }}>
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                Photo coming soon
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {images.slice(0, 6).map((url, idx) => (
                <div key={url + idx} style={{ width: 76, height: 98, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: '#0F0F0D' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${product.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="label" style={{ marginBottom: 10 }}>{product.category || 'Sila Studios'}</p>
          <h1 className="display-md" style={{ marginBottom: 12 }}>{product.name}</h1>
          <p className="body-lg" style={{ color: 'var(--cream)', marginBottom: 18 }}>
            <span style={{ color: 'var(--gold)' }}>{priceLabel}</span>
            {strikePrice != null && strikePrice > showPrice ? (
              <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>
                Rs. {strikePrice.toLocaleString(PRICE_LOCALE)}
              </span>
            ) : null}
            {product.badge ? <span style={{ color: 'var(--muted)', fontSize: 12 }}> · {product.badge}</span> : null}
          </p>

          {product.description ? (
            <p className="body-lg" style={{ color: 'var(--muted)', lineHeight: 1.75 }}>
              {product.description}
            </p>
          ) : (
            <p className="body-lg" style={{ color: 'var(--muted)' }}>
              Details coming soon. For sizing and availability, message us on WhatsApp.
            </p>
          )}

          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/order?product=${encodeURIComponent(product.id)}`} className="btn-gold">
              Order via WhatsApp →
            </Link>
            <Link href="/track" className="btn-outline">
              Track an Order
            </Link>
          </div>

          <div style={{ marginTop: 34, padding: 18, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <p className="label" style={{ marginBottom: 10 }}>Size Guide</p>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>
              Share your size on WhatsApp (e.g. Small/Medium/Large) and any measurements you prefer. We’ll confirm fitting and availability before dispatch.
            </p>
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

