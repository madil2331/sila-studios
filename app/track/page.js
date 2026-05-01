import { Suspense } from 'react'
import TrackClient from './TrackClient'

export const dynamic = 'force-dynamic'

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '88px 0', maxWidth: 720, textAlign: 'center' }}>
          <p className="label">Order Tracking</p>
          <div className="gold-divider" />
          <h1 className="display-lg" style={{ marginTop: 16 }}>Loading…</h1>
          <p className="body-lg" style={{ maxWidth: 520, margin: '16px auto 0', color: 'var(--muted)' }}>
            Preparing tracking.
          </p>
        </div>
      }
    >
      <TrackClient />
    </Suspense>
  )
}

