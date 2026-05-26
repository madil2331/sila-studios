export const metadata = {
  title: 'Privacy Policy | Sila Studios',
  description:
    'Learn how Sila Studios collects, uses, and protects customer information for orders, support, and service improvement.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <p className="label" style={{ marginBottom: 10 }}>Policy</p>
      <h1 className="display-md" style={{ marginBottom: 16 }}>Privacy Policy</h1>
      <p className="body-lg" style={{ color: 'var(--muted)', maxWidth: 760, lineHeight: 1.8 }}>
        We value your trust. This policy explains what data we collect, why we collect it, and how we keep it safe.
      </p>

      <div style={{ marginTop: 26, display: 'grid', gap: 14, maxWidth: 900 }}>
        <section style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 18 }}>
          <h2 className="display-sm" style={{ marginBottom: 8 }}>Information we collect</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
            When you place an order or contact us, we may collect your name, phone number, delivery address, city, and
            order details. If you subscribe, we may collect your email or WhatsApp contact.
          </p>
        </section>

        <section style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 18 }}>
          <h2 className="display-sm" style={{ marginBottom: 8 }}>How we use your information</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
            We use your data to process and deliver orders, provide support, share order updates, prevent misuse, and improve
            our services.
          </p>
        </section>

        <section style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 18 }}>
          <h2 className="display-sm" style={{ marginBottom: 8 }}>Data sharing</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
            We only share necessary information with trusted service providers (such as delivery/courier partners and
            infrastructure providers) to complete your order and run the website.
          </p>
        </section>

        <section style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 18 }}>
          <h2 className="display-sm" style={{ marginBottom: 8 }}>Your rights</h2>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.8 }}>
            You can request correction or deletion of your personal information by contacting us through our contact page or
            WhatsApp.
          </p>
        </section>
      </div>
    </div>
  )
}
