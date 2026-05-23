import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import ProductGallery from '../../../components/ProductGallery'

export const dynamic = 'force-dynamic'

const PRICE_LOCALE = 'en-US'
const SIZE_CHART_IN = [
  { size: 'Small', chest: 19, waist: 20, hips: 23 },
  { size: 'Medium', chest: 20.5, waist: 22, hips: 24 },
  { size: 'Large', chest: 22, waist: 23, hips: 25 },
]

async function getProduct(id) {
  noStore()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  // Support both handle-based and legacy id-based URLs.
  const byHandle = await supabase
    .from('products')
    .select('*')
    .eq('handle', id)
    .single()
  if (!byHandle.error && byHandle.data) return byHandle.data

  const byId = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (byId.error) return null
  return byId.data
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
          <ProductGallery images={images} productName={product.name} />
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
              Order Now →
            </Link>
            <Link href="/track" className="btn-outline">
              Track an Order
            </Link>
          </div>

          <div style={{ marginTop: 34, padding: 18, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <p className="label" style={{ marginBottom: 10 }}>Size Guide</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Chest (in)</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Waist (in)</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART_IN.map((row) => (
                    <tr key={row.size}>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--gold)' }}>{row.size}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.chest}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.waist}</td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: 12, lineHeight: 1.7 }}>
              Measurements are in inches and may vary slightly by fabric/cut (about ±0.5 in). If you prefer exact fit guidance, message us on WhatsApp before ordering.
            </p>
          </div>

          {product.product_note ? (
            <div style={{ marginTop: 14, padding: 16, borderRadius: 10, border: '1px solid rgba(196,164,98,0.28)', background: 'rgba(196,164,98,0.08)' }}>
              <p className="label" style={{ marginBottom: 8, color: 'var(--gold)' }}>Important Notice</p>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {product.product_note}
              </p>
            </div>
          ) : null}
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
