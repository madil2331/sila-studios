import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import ProductGallery from '../../../components/ProductGallery'
import { unpackDescriptionAndNote } from '@/lib/product-note'
import RichTextBlock from '@/components/RichTextBlock'
import { BreadcrumbJsonLd, FaqJsonLd, ProductJsonLd } from '@/components/json-ld'

export const dynamic = 'force-dynamic'

const PRICE_LOCALE = 'en-US'
const SIZE_CHART_IN = [
  { size: 'Small', chest: 19, waist: 20, hips: 23 },
  { size: 'Medium', chest: 20.5, waist: 22, hips: 24 },
  { size: 'Large', chest: 22, waist: 23, hips: 25 },
]

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
}

async function getProduct(id) {
  noStore()
  const supabase = getSupabase()
  const byHandle = await supabase.from('products').select('*').eq('handle', id).single()
  if (!byHandle.error && byHandle.data) return byHandle.data
  const byId = await supabase.from('products').select('*').eq('id', id).single()
  if (byId.error) return null
  return byId.data
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  if (!product) return { title: 'Product not found', description: 'This product is not available.' }
  const title = product.seo_title || product.meta_title || product.title || product.name
  const description = product.seo_description || product.meta_description || product.description || `Shop ${product.name} at Sila Studios.`
  return {
    title,
    description,
    alternates: { canonical: `/products/${params.id}` },
  }
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

  const normalizedContent = unpackDescriptionAndNote(product.long_description || product.description, product.product_note)
  const topDescription = product.short_description || normalizedContent.description
  const basePrice = Number(product.price || 0)
  const discounted = product.discount_price != null ? Number(product.discount_price) : null
  const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null
  const showPrice = discounted != null && Number.isFinite(discounted) ? discounted : basePrice
  const strikePrice = compareAt != null && Number.isFinite(compareAt) ? compareAt : (discounted != null ? basePrice : null)
  const priceLabel = `Rs. ${showPrice.toLocaleString(PRICE_LOCALE)}`
  const media = Array.isArray(product.media_urls) ? product.media_urls : []
  const images = [product.image_url, ...media].filter(Boolean)
  const absoluteUrl = `https://www.silastudios.store/products/${encodeURIComponent(product.handle || product.id)}`
  const faqItems = Array.isArray(product.faqs) ? product.faqs.filter((f) => f?.question && f?.answer) : []

  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <ProductJsonLd
        name={product.name}
        description={normalizedContent.description || `Shop ${product.name} at Sila Studios`}
        image={images[0] || 'https://www.silastudios.store/sila_banner.png'}
        sku={product.sku || product.id}
        brand={{ '@type': 'Brand', name: 'Sila Studios' }}
        offers={{
          price: String(showPrice || 0),
          priceCurrency: 'USD',
          availability: product.in_stock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          url: absoluteUrl,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { position: 1, name: 'Home', item: 'https://www.silastudios.store/' },
          { position: 2, name: product.category || 'Products', item: 'https://www.silastudios.store/collections' },
          { position: 3, name: product.name, item: absoluteUrl },
        ]}
      />
      {faqItems.length ? <FaqJsonLd items={faqItems} /> : null}

      <div style={{ marginBottom: 18 }}>
        <Link href="/collections" className="btn-outline" style={{ padding: '10px 14px', fontSize: 12 }}>
          ← Back to Collections
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 42, alignItems: 'start' }}>
        <div><ProductGallery images={images} productName={product.name} /></div>
        <div>
          <p className="label" style={{ marginBottom: 10 }}>{product.category || 'Sila Studios'}</p>
          <h1 className="display-md" style={{ marginBottom: 12 }}>{product.name}</h1>
          <p className="body-lg" style={{ color: 'var(--cream)', marginBottom: 18 }}><span style={{ color: 'var(--gold)' }}>{priceLabel}</span>{strikePrice != null && strikePrice > showPrice ? (<span style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>Rs. {strikePrice.toLocaleString(PRICE_LOCALE)}</span>) : null}{product.badge ? <span style={{ color: 'var(--muted)', fontSize: 12 }}> · {product.badge}</span> : null}</p>
          {normalizedContent.description ? <RichTextBlock className="body-lg" style={{ color: 'var(--muted)', lineHeight: 1.75 }} value={normalizedContent.description} /> : <p className="body-lg" style={{ color: 'var(--muted)' }}>Details coming soon. For sizing and availability, message us on WhatsApp.</p>}
          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}><Link href={`/order?product=${encodeURIComponent(product.id)}`} className="btn-gold">Order Now →</Link><Link href="/track" className="btn-outline">Track an Order</Link></div>
          {product.long_description ? <div style={{ marginTop: 18 }}><p className="label" style={{ marginBottom: 8 }}>Details</p><RichTextBlock className="body-lg" style={{ color: 'var(--muted)', lineHeight: 1.75 }} value={product.long_description} /></div> : null}
          <div style={{ marginTop: 34, padding: 18, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}><p className="label" style={{ marginBottom: 10 }}>Size Guide</p><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 360 }}><thead><tr><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Size</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Chest (in)</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Waist (in)</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>Hips (in)</th></tr></thead><tbody>{SIZE_CHART_IN.map((row) => (<tr key={row.size}><td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--gold)' }}>{row.size}</td><td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.chest}</td><td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.waist}</td><td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>{row.hips}</td></tr>))}</tbody></table></div><p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: 12, lineHeight: 1.7 }}>Measurements are in inches and may vary slightly by fabric/cut (about ±0.5 in). If you prefer exact fit guidance, message us on WhatsApp before ordering.</p></div>
          {normalizedContent.product_note ? (<div style={{ marginTop: 14, padding: 16, borderRadius: 10, border: '1px solid rgba(196,164,98,0.28)', background: 'rgba(196,164,98,0.08)' }}><p className="label" style={{ marginBottom: 8, color: 'var(--gold)' }}>Important Notice</p><RichTextBlock style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }} value={normalizedContent.product_note} /></div>) : null}
        </div>
      </div>
      <style>{`@media (max-width: 900px) {.container > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }}`}</style>
    </div>
  )
}
