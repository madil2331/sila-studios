import Image from 'next/image'
import Link from 'next/link'

const WHATSAPP_NUMBER = '+92-316-3973017'
const WHATSAPP_MSG = encodeURIComponent("Hi Sila Studios! I'd like to know more. 🌸")

export default function Footer() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-brand">
          <Image src="/logo.png" alt="Sila Studios" width={160} height={60}
            style={{ height: '52px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
          />
          <p className="footer-tagline">Where Elegance Fits</p>
          <p className="footer-about">
            Ladies fashion crafted in Karachi with care and precision.
            Every piece tells a story of elegance and grace.
          </p>
          <div className="footer-social">
            {/* Instagram */}
            <a href="https://instagram.com/silastudios.store" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@silastudios.store" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/collections#new-arrivals">New Arrivals</Link></li>
            <li><Link href="/collections#formal">Formal Wear</Link></li>
            <li><Link href="/collections#casual">Casual</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><a href={waLink} target="_blank" rel="noopener noreferrer">Order via WhatsApp</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Get in Touch</h4>
          <ul>
            <li>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                WhatsApp Orders
              </a>
            </li>
            <li>
              <a href="https://instagram.com/silastudios.store" target="_blank" rel="noopener noreferrer">
                @silastudios.store
              </a>
            </li>
            <li style={{ color: 'var(--muted-light)', fontSize: 13, fontWeight: 300, lineHeight: 1.6, cursor: 'default' }}>
              Karachi, Pakistan
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p className="footer-copy">
          © {year} <span>Sila Studios</span>. All rights reserved. Crafted in Karachi with ♥
        </p>
        <p className="footer-copy" style={{ direction: 'rtl' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: 'var(--gold)' }}>سِلا</span>
          &nbsp;— حیثیت سے پوشاک
        </p>
      </div>
    </footer>
  )
}
