export const metadata = {
  title: 'Shipping Policy | Sila Studios',
  description:
    'Sila Studios shipping policy for processing, delivery timelines, and shipment support across Pakistan.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <p className="label" style={{ marginBottom: 10 }}>Policy</p>
      <h1 className="display-md" style={{ marginBottom: 16 }}>Shipping Policy</h1>
      <p className="body-lg" style={{ color: 'var(--muted)', maxWidth: 760, lineHeight: 1.8 }}>
        We ship across Pakistan and aim to deliver your order as quickly and safely as possible.
      </p>

      <div style={{ marginTop: 26, border: '1px solid var(--border)', borderRadius: 8, padding: 20, maxWidth: 860 }}>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', lineHeight: 1.9 }}>
          <li>Orders are confirmed and prepared after successful order placement.</li>
          <li>Dispatch timelines may vary based on stock availability and city.</li>
          <li>Estimated delivery usually ranges between 3–7 working days after dispatch.</li>
          <li>Delivery delays may occur during holidays, weather disruptions, or courier constraints.</li>
          <li>Please ensure your phone number and address are accurate to avoid failed delivery attempts.</li>
        </ul>
      </div>
    </div>
  )
}
