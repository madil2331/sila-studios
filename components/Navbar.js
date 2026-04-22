'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// TODO: Replace with your actual WhatsApp number (e.g. 923001234567)
const WHATSAPP_NUMBER = '+92-316-3973017'
const WHATSAPP_MSG = encodeURIComponent("Hi Sila Studios! I'd like to place an order. 🌸")

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left links */}
        <div className="nav-links">
          <Link href="/collections">Collections</Link>
          <Link href="/about">Our Story</Link>
        </div>

        {/* Center logo */}
        <div className="nav-logo">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Sila Studios"
              width={160}
              height={60}
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        {/* Right links */}
        <div className="nav-right">
          <Link href="/contact">Contact</Link>
          <a className="nav-wa-btn" href={waLink} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.99 2C6.476 2 2 6.477 2 11.99c0 1.872.522 3.62 1.432 5.113L2.046 22l5.02-1.365A9.945 9.945 0 0 0 11.99 22C17.522 22 22 17.523 22 12.01 22 6.477 17.522 2 11.99 2zm0 18.17a8.165 8.165 0 0 1-4.158-1.141l-.298-.178-3.09.84.838-3.01-.195-.31A8.172 8.172 0 0 1 3.83 12.01C3.83 7.484 7.485 3.83 12.01 3.83c4.504 0 8.16 3.654 8.16 8.18 0 4.505-3.656 8.16-8.18 8.16z"/>
            </svg>
            Order Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>Our Story</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
          style={{ color: '#25D366', borderBottomColor: 'rgba(37,211,102,0.2)' }}
        >
          Order via WhatsApp
        </a>
      </div>

      {/* Mobile hamburger (always visible via CSS on small screens) */}
      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
