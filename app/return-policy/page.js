export const metadata = {
  title: 'Return Policy | Sila Studios',
  description:
    'Sila Studios return policy: no-questions-asked returns within 3 days of purchase. Return shipping charges apply.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="container" style={{ padding: '72px 0' }}>
      <p className="label" style={{ marginBottom: 10 }}>Policy</p>
      <h1 className="display-md" style={{ marginBottom: 16 }}>Return Policy</h1>
      <p className="body-lg" style={{ color: 'var(--muted)', maxWidth: 760, lineHeight: 1.8 }}>
        At Sila Studios, we offer a no-questions-asked return policy if a return is initiated within 3 days of purchase.
      </p>

      <div style={{ marginTop: 26, border: '1px solid var(--border)', borderRadius: 8, padding: 20, maxWidth: 840 }}>
        <h2 className="display-sm" style={{ marginBottom: 10 }}>How returns work</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', lineHeight: 1.9 }}>
          <li>Return request must be initiated within 3 calendar days of purchase.</li>
          <li>Return shipping charges apply and are paid by the customer.</li>
          <li>Item should be unused, unwashed, and in original condition with tags/packaging.</li>
          <li>After quality check, refund/store credit/exchange is processed as applicable.</li>
        </ul>
      </div>
    </div>
  )
}
