import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import { getWhatsAppLink } from '@/lib/whatsapp'
import HeroNewCarousel from '@/components/HeroNewCarousel'

/** Featured strip must reflect latest Supabase rows after admin changes. */
export const dynamic = 'force-dynamic'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '03163973017'

const PRICE_LOCALE = 'en-US'

async function getFeaturedProducts() {
  noStore()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(3)
    return data || []
  } catch {
    return []
  }
}

async function getNewProducts() {
  noStore()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .eq('badge', 'New')
      .order('created_at', { ascending: false })
      .limit(8)
    return data || []
  } catch {
    return []
  }
}
const WHATSAPP_MSG = "Hi Sila Studios! I'd like to place an order. 🌸"



function NeedleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2L4 22M9.5 2L20 8M9.5 2C9.5 2 11 5 14.5 8"/>
    </svg>
  )
}

function ProductCard({ product }) {
  const basePrice = Number(product.price || 0)
  const discounted = product.discount_price != null ? Number(product.discount_price) : null
  const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null
  const showPrice = discounted != null && Number.isFinite(discounted) ? discounted : basePrice
  const strikePrice = compareAt != null && Number.isFinite(compareAt) ? compareAt : (discounted != null ? basePrice : null)
  const priceLabel = `Rs. ${showPrice.toLocaleString(PRICE_LOCALE)}`
  const waLink = `/order?product=${encodeURIComponent(product.id)}`
  const productPath = `/products/${encodeURIComponent(product.handle || product.id)}`
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <a href={productPath} style={{ display: 'block', position: 'absolute', inset: 0 }} aria-label={`View ${product.name}`} />
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-placeholder">
            <div className="product-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
              </svg>
            </div>
            <span className="product-placeholder-text">Photo coming soon</span>
          </div>
        )}
        {product.badge ? (
          <span className={`product-badge ${product.badge === 'New' ? 'new' : ''}`}>{product.badge}</span>
        ) : null}
        <a className="product-order-btn" href={waLink} style={{ position: 'relative', zIndex: 2 }}>
          Order via WhatsApp →
        </a>
      </div>
      <div className="product-info">
        <p className="product-name">
          <a href={productPath} style={{ color: 'inherit', textDecoration: 'none' }}>
            {product.name}
          </a>
        </p>
        <p className="product-price">
          <span className="current">{priceLabel}</span>
          {strikePrice != null && strikePrice > showPrice ? (
            <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>
              Rs. {strikePrice.toLocaleString(PRICE_LOCALE)}
            </span>
          ) : null}
          {product.category ? (
            <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}> · {product.category}</span>
          ) : null}
        </p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const products = await getFeaturedProducts()
  const newProducts = await getNewProducts()
  const waLink = getWhatsAppLink(WHATSAPP_MSG, WHATSAPP_NUMBER)
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="label">New Spring Collection 2026</span>
            </div>
            <h1 className="hero-heading">
              <span className="line-1">New Spring</span>
              <span className="line-2">Collection</span>
              <span className="line-3">2026</span>
            </h1>
            <p className="hero-sub">Lawn suits crafted in Karachi</p>
            <div className="hero-actions">
              <Link href="/collections" className="btn-gold">
                Browse New Arrivals →
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-wa-outline">
                Order via WhatsApp
              </a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-note">Free delivery on orders above Rs. 6,000.</span>
              <div className="hero-trust-badges">
                <span className="hero-trust-badge">Premium Fabrics Only</span>
              </div>
            </div>
          </div>

          <div className="hero-right" aria-label="New arrivals">
            <HeroNewCarousel products={newProducts?.length ? newProducts : products} />
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="brand-story">
        <div className="brand-story-inner">
          <div>
            <blockquote className="brand-story-quote">
              "Every stitch is a promise of elegance."
            </blockquote>
          </div>
          <div className="brand-story-text">
            <p className="label" style={{ marginBottom: 16 }}>Our Story</p>
            <p>
              Sila Studios was born in Karachi from a deep love for refined fashion and the
              belief that every woman deserves clothing that truly fits — not just in size,
              but in spirit and grace.
            </p>
            <p>
              Each piece is carefully crafted, with precision stitching and fabrics chosen
              for their quality and feel. From elegant formal wear to relaxed everyday
              silhouettes, we design for the modern Pakistani woman.
            </p>
            <Link href="/about" className="btn-outline">
              Read Our Story
            </Link>
            <div className="brand-detail" style={{ marginTop: 32 }}>
              <div className="brand-detail-item">
                <span className="brand-detail-num">100%</span>
                <span className="brand-detail-label">Custom Stitched</span>
              </div>
              <div className="brand-detail-item">
                <span className="brand-detail-num">KHI</span>
                <span className="brand-detail-label">Karachi Made</span>
              </div>
              <div className="brand-detail-item">
                <span className="brand-detail-num">COD</span>
                <span className="brand-detail-label">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLECTION ── */}
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <p className="label">Latest Pieces</p>
            <div className="gold-divider" />
            <h2 className="display-md" style={{ marginTop: 16 }}>Featured Collection</h2>
          </div>
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/collections" className="btn-outline">View All Collections</Link>
          </div>
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className="how-to-order">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 56 }}>
            <p className="label" style={{ color: 'var(--gold-light)' }}>Simple Process</p>
            <div className="gold-divider" />
            <h2 className="display-md" style={{ color: 'var(--cream)', marginTop: 16 }}>How to Order</h2>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M1 6s4-2 11-2 11 2 11 2"/>
                  <path d="M3 6l2 11h14L21 6"/>
                  <path d="M10 11h4"/>
                </svg>
              </div>
              <h3 className="step-title">Browse & Choose</h3>
              <p className="step-desc">
                Explore our collection on this website or Instagram. Find the pieces that speak to you.
              </p>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
                </svg>
              </div>
              <h3 className="step-title">WhatsApp Us</h3>
              <p className="step-desc">
                Send us your size, colour preference, and delivery address. We confirm availability and details.
              </p>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </div>
              <h3 className="step-title">Receive & Pay</h3>
              <p className="step-desc">
                We deliver to your doorstep across Pakistan. Pay cash on delivery — no advance required.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Start an Order →
            </a>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section className="social-cta">
        <div className="social-cta-inner">
          <p className="label">Follow Our Journey</p>
          <div className="gold-divider" />
          <p className="instagram-handle">@silastudios.store</p>
          <p className="social-cta-desc">
            Stay updated with our latest collections, behind-the-scenes moments,
            and styling inspiration. Follow us on Instagram and TikTok.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://instagram.com/silastudios.store"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@silastudios.store"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
