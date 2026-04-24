import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923XXXXXXXXXX'

async function getFeaturedProducts() {
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
const WHATSAPP_MSG = encodeURIComponent("Hi Sila Studios! I'd like to place an order. 🌸")



function NeedleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2L4 22M9.5 2L20 8M9.5 2C9.5 2 11 5 14.5 8"/>
    </svg>
  )
}

function ProductCard({ product }) {
  const waMsg = encodeURIComponent(`Hi Sila Studios! I'm interested in the "${product.name}" (${product.price}). Is it available? 🌸`)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <div className="product-placeholder">
          <div className="product-placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
            </svg>
          </div>
          <span className="product-placeholder-text">Photo coming soon</span>
        </div>
        <span className={`product-badge ${product.tag === 'New' ? 'new' : ''}`}>{product.tag}</span>
        <a className="product-order-btn" href={waLink} target="_blank" rel="noopener noreferrer">
          Order via WhatsApp →
        </a>
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price"><span className="current">{product.price}</span></p>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const products = await getFeaturedProducts()
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/sila_banner.png"
            alt="Sila Studios — Where Elegance Fits"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="label">New Collection — 2025</span>
            </div>
            <h1 className="hero-heading">
              <span className="line-1">Where</span>
              <span className="line-2">Elegance</span>
              <span className="line-3">Fits.</span>
            </h1>
            <p className="hero-sub">Ladies fashion · Crafted in Karachi · سِلا</p>
            <div className="hero-actions">
              <Link href="/collections" className="btn-primary">
                Explore Collection
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM11.99 2C6.476 2 2 6.477 2 11.99c0 1.872.522 3.62 1.432 5.113L2.046 22l5.02-1.365A9.945 9.945 0 0 0 11.99 22C17.522 22 22 17.523 22 12.01 22 6.477 17.522 2 11.99 2zm0 18.17a8.165 8.165 0 0 1-4.158-1.141l-.298-.178-3.09.84.838-3.01-.195-.31A8.172 8.172 0 0 1 3.83 12.01C3.83 7.484 7.485 3.83 12.01 3.83c4.504 0 8.16 3.654 8.16 8.18 0 4.505-3.656 8.16-8.18 8.16z"/>
                </svg>
                Order Now
              </a>
            </div>
          </div>

          <div className="hero-logo-wrap">
            <Image
              src="/logo_social.png"
              alt="Sila Studios"
              width={380}
              height={380}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
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
