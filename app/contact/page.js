export const metadata = {
  title: 'Contact — Sila Studios',
  description: 'Get in touch with Sila Studios. Order via WhatsApp, follow us on Instagram, or send us a message.',
}

// TODO: Replace with your actual WhatsApp number
const WHATSAPP_NUMBER = '+92-316-3973017'
const WHATSAPP_MSG = encodeURIComponent("Hi Sila Studios! I'd like to get in touch. 🌸")

export default function ContactPage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`

  return (
    <div className="container">
      <div className="page-hero">
        <p className="label">Reach Out</p>
        <div className="gold-divider" />
        <h1 className="display-lg" style={{ marginTop: 16 }}>Get in Touch</h1>
        <p className="body-lg" style={{ maxWidth: 480, margin: '16px auto 0' }}>
          Questions about sizing? Want to place a custom order? We love hearing from you.
        </p>
      </div>

      <div className="contact-grid">
        {/* Left: Info */}
        <div>
          <p className="label" style={{ marginBottom: 32 }}>Contact Information</p>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
              </svg>
            </div>
            <div>
              <p className="contact-info-label">WhatsApp (Fastest)</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="contact-info-value" style={{ color: '#25D366' }}>
                +92 3XX XXX XXXX
              </a>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <div>
              <p className="contact-info-label">Instagram</p>
              <a
                href="https://instagram.com/silastudios.store"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-value"
              >
                @silastudios.store
              </a>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="contact-info-label">Based In</p>
              <p className="contact-info-value">Karachi, Pakistan</p>
            </div>
          </div>

          <div style={{ marginTop: 40, padding: 24, background: 'var(--cream-dark)', borderRadius: 4, borderLeft: '2px solid var(--gold)' }}>
            <p className="label" style={{ marginBottom: 8 }}>Ordering via WhatsApp?</p>
            <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: 'var(--charcoal-mid)' }}>
              Please mention the item name, your size, and delivery city.
              We'll confirm availability and provide a delivery estimate.
              Payment is cash on delivery — no advance needed.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM11.99 2C6.476 2 2 6.477 2 11.99c0 1.872.522 3.62 1.432 5.113L2.046 22l5.02-1.365A9.945 9.945 0 0 0 11.99 22C17.522 22 22 17.523 22 12.01 22 6.477 17.522 2 11.99 2zm0 18.17a8.165 8.165 0 0 1-4.158-1.141l-.298-.178-3.09.84.838-3.01-.195-.31A8.172 8.172 0 0 1 3.83 12.01C3.83 7.484 7.485 3.83 12.01 3.83c4.504 0 8.16 3.654 8.16 8.18 0 4.505-3.656 8.16-8.18 8.16z"/>
              </svg>
              Open WhatsApp
            </a>
          </div>
        </div>

        {/* Right: Inquiry form */}
        <div>
          <p className="label" style={{ marginBottom: 32 }}>Send an Inquiry</p>
          <form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="contact-form-group">
                <label>First Name</label>
                <input type="text" placeholder="Ayesha" />
              </div>
              <div className="contact-form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Khan" />
              </div>
            </div>
            <div className="contact-form-group">
              <label>WhatsApp Number</label>
              <input type="tel" placeholder="+92 3XX XXXXXXX" />
            </div>
            <div className="contact-form-group">
              <label>Inquiry Type</label>
              <select>
                <option value="">Select one</option>
                <option value="order">Place an Order</option>
                <option value="custom">Custom Stitching</option>
                <option value="sizing">Sizing Help</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="contact-form-group">
              <label>Message</label>
              <textarea placeholder="Tell us what you're looking for — piece name, size, occasion, etc." />
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, fontWeight: 300, lineHeight: 1.6 }}>
              Note: This form is for inquiries. For fastest response, please use WhatsApp directly.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Send via WhatsApp →
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}
