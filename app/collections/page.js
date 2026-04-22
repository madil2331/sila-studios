import Link from 'next/link'

// TODO: Replace with your actual WhatsApp number
const WHATSAPP_NUMBER = '+92-316-3973017'

export const metadata = {
  title: 'Collections — Sila Studios',
  description: 'Browse our curated ladies fashion collections. Formal wear, casual kurtas, embroidered suits. Order via WhatsApp with COD delivery across Pakistan.',
}

const products = [
  { id: 1, name: 'Embroidered Lawn Set', price: 'Rs. 3,500', tag: 'New', category: 'Formal' },
  { id: 2, name: 'Chiffon Evening Suit', price: 'Rs. 4,800', tag: 'Bestseller', category: 'Formal' },
  { id: 3, name: 'Cotton Casual Kurta', price: 'Rs. 2,200', tag: 'New', category: 'Casual' },
  { id: 4, name: 'Printed Pret Suit', price: 'Rs. 2,800', tag: null, category: 'Casual' },
  { id: 5, name: 'Party Wear Outfit', price: 'Rs. 5,500', tag: 'Premium', category: 'Formal' },
  { id: 6, name: 'Everyday Kurta Shalwar', price: 'Rs. 1,900', tag: null, category: 'Casual' },
]

function ProductCard({ product }) {
  const waMsg = encodeURIComponent(`Hi Sila Studios! I'm interested in the "${product.name}" (${product.price}). Is it available? 🌸`)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <div className="product-placeholder">
          <div className="product-placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20,stroke:'var(--gold)'}}>
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
            </svg>
          </div>
          <span className="product-placeholder-text">Photo coming soon</span>
        </div>
        {product.tag && (
          <span className={`product-badge ${product.tag === 'New' ? 'new' : ''}`}>{product.tag}</span>
        )}
        <a className="product-order-btn" href={waLink} target="_blank" rel="noopener noreferrer">
          Order via WhatsApp →
        </a>
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">
          <span className="current">{product.price}</span>
          &nbsp;·&nbsp;
          <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>{product.category}</span>
        </p>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <div className="container">
      <div className="page-hero">
        <p className="label">All Pieces</p>
        <div className="gold-divider" />
        <h1 className="display-lg" style={{ marginTop: 16 }}>Our Collections</h1>
        <p className="body-lg" style={{ marginTop: 16, maxWidth: 480, margin: '16px auto 0' }}>
          Curated pieces for the modern Pakistani woman. Each design stitched with care in Karachi.
        </p>
      </div>

      <div className="filter-bar">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Formal</button>
        <button className="filter-btn">Casual</button>
        <button className="filter-btn">New Arrivals</button>
      </div>

      <div className="products-grid" style={{ paddingBottom: 'var(--section-py)' }}>
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
