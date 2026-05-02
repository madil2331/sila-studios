'use client'

import { useState } from 'react'
import { PRODUCT_CATEGORIES } from '@/lib/product-categories'
import { getWhatsAppLink } from '@/lib/whatsapp'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '03163973017'
/** Fixed locale avoids server/client hydration mismatches from default toLocaleString(). */
const PRICE_LOCALE = 'en-US'

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
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-placeholder">
            <div className="product-placeholder-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, stroke: 'var(--gold)' }}>
                <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <span className="product-placeholder-text">Photo coming soon</span>
          </div>
        )}
        {product.badge && (
          <span className={`product-badge ${product.badge === 'New' ? 'new' : ''}`}>{product.badge}</span>
        )}
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
          {product.category && (
            <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}> · {product.category}</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function CollectionsClient({ products }) {
  const [filter, setFilter] = useState('All')

  const filters = ['All', ...PRODUCT_CATEGORIES]
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter)

  return (
    <div className="container">
      <div className="page-hero">
        <p className="label">All Pieces</p>
        <div className="gold-divider" />
        <h1 className="display-lg" style={{ marginTop: 16 }}>Our Collections</h1>
        <p className="body-lg" style={{ maxWidth: 480, margin: '16px auto 0' }}>
          Curated pieces for the modern Pakistani woman. Each design stitched with care in Karachi.
        </p>
      </div>

      {/* Filter bar — same labels as admin; empty categories show “No products” message */}
      {products.length > 0 && (
        <div className="filter-bar">
          {filters.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '96px 0', color: 'var(--muted)' }}>
          <p className="label" style={{ marginBottom: 16 }}>Coming Soon</p>
          <p className="display-md" style={{ marginBottom: 24 }}>New collection dropping soon</p>
          <p className="body-lg">Follow us on Instagram for the latest updates.</p>
        </div>
      ) : (
        <div className="products-grid" style={{ paddingBottom: 'var(--section-py)' }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {filtered.length === 0 && products.length > 0 && (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
          <p>No products in this category yet.</p>
        </div>
      )}
    </div>
  )
}
