import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Our Story — Sila Studios',
  description: 'The story behind Sila Studios — a ladies fashion brand born in Karachi from a love of elegance and precision craftsmanship.',
}

const values = [
  {
    title: 'Precision Crafting',
    desc: 'Every seam is measured. Every stitch is deliberate. We believe quality is in the details you feel, not just see.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    title: 'Karachi Soul',
    desc: 'We design for the modern Pakistani woman — her style, her rhythm, and her story. Rooted in Karachi, made for everywhere.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: 'Elegant Simplicity',
    desc: 'We avoid noise. Sila pieces are designed to be effortlessly graceful — for the woman who knows that less is more.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="container">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-image-wrap">
          <Image
            src="/logo_social.png"
            alt="Sila Studios"
            width={520}
            height={520}
            style={{ borderRadius: 8, width: '100%', height: 'auto' }}
          />
          <div className="about-image-badge">
            <span>KHI</span>
            <span>Karachi Made</span>
          </div>
        </div>
        <div>
          <p className="label">Our Story</p>
          <div className="gold-divider left" style={{ marginTop: 16, marginBottom: 24 }} />
          <h1 className="display-lg" style={{ marginBottom: 28 }}>
            Where Elegance Fits
          </h1>
          <p className="body-lg" style={{ marginBottom: 20 }}>
            Sila Studios was born in Karachi from a deep belief that fashion should feel as
            beautiful as it looks. We are a ladies fashion brand dedicated to refined
            silhouettes, quality fabrics, and the kind of precision stitching that makes
            every woman feel effortlessly elegant.
          </p>
          <p className="body-lg" style={{ marginBottom: 20 }}>
            Our name — <em style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1em', color: 'var(--gold)' }}>سِلا</em> — means
            "stitched" in Urdu. It speaks to both our craft and our philosophy: that
            every beautiful thing is woven together with intention.
          </p>
          <p className="body-lg" style={{ marginBottom: 32 }}>
            Behind Sila Studios is a husband-and-wife team — a designer's eye and a
            builder's mind — creating something honest and lasting in the heart of Karachi.
          </p>
          <Link href="/collections" className="btn-primary">
            Explore the Collection
          </Link>
        </div>
      </div>

      {/* Values */}
      <div className="about-values">
        {values.map((v, i) => (
          <div className="value-card" key={i}>
            <div className="value-icon">{v.icon}</div>
            <h3 className="value-title">{v.title}</h3>
            <p className="value-desc">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Quote section */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--section-py) 0',
        borderTop: '1px solid var(--border)',
        maxWidth: 640,
        margin: '0 auto',
      }}>
        <div className="gold-divider" style={{ marginBottom: 32 }} />
        <blockquote style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 300,
          fontStyle: 'italic',
          lineHeight: 1.3,
          color: 'var(--charcoal)',
          marginBottom: 24,
        }}>
          "Elegance is not about being noticed — it's about being remembered."
        </blockquote>
        <p className="label" style={{ marginBottom: 32 }}>The Sila Studios philosophy</p>
        <Link href="/contact" className="btn-outline">Get in Touch</Link>
      </div>
    </div>
  )
}
