'use client'

import { useMemo, useState } from 'react'

export default function ProductGallery({ images, productName }) {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

  const hasImages = safeImages.length > 0
  const activeImage = hasImages ? safeImages[activeIndex] : null

  const goPrev = () => {
    if (!hasImages) return
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }

  const goNext = () => {
    if (!hasImages) return
    setActiveIndex((prev) => (prev + 1) % safeImages.length)
  }

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  return (
    <div>
      <div
        onMouseMove={onMove}
        onMouseEnter={() => setZoom((prev) => ({ ...prev, active: true }))}
        onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
        style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', background: '#0F0F0D', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={productName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: zoom.active ? 'scale(1.9)' : 'scale(1)',
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transition: zoom.active ? 'transform 0.08s linear' : 'transform 0.2s ease',
              cursor: zoom.active ? 'zoom-out' : 'zoom-in',
            }}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            Photo coming soon
          </div>
        )}

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer' }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer' }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {safeImages.map((url, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                style={{ width: 76, height: 98, borderRadius: 8, overflow: 'hidden', border: isActive ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.06)', background: '#0F0F0D', padding: 0, cursor: 'pointer' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${productName} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isActive ? 1 : 0.85 }} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
