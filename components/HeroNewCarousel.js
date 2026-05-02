'use client'

import { useEffect, useMemo, useState } from 'react'

export default function HeroNewCarousel({ products = [] }) {
  const items = useMemo(() => (Array.isArray(products) ? products.filter(Boolean) : []), [products])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4500)
    return () => clearInterval(t)
  }, [items.length])

  const product = items[idx] || items[0]
  if (!product) return null

  const href = `/products/${encodeURIComponent(product.handle || product.id)}`

  return (
    <a className="hero-new-card" href={href} aria-label={`View ${product.name}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image_url || '/sila_banner.png'}
        alt={product.name || 'New arrival'}
      />
      <div className="hero-new-meta">
        <div className="hero-new-pill">NEW</div>
        <div className="hero-new-name">{product.name}</div>
      </div>
    </a>
  )
}

