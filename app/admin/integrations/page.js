'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { adminFetch } from '@/lib/admin-fetch'

function Section({ title, children, hint }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 18, background: '#0F0F0D' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C4A462' }}>{title}</div>
        {hint ? <div style={{ fontSize: 11, color: '#3A3830' }}>{hint}</div> : null}
      </div>
      <div style={{ marginTop: 14 }}>
        {children}
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true)
  const [canEncrypt, setCanEncrypt] = useState(false)

  const [courier, setCourier] = useState({ provider: 'manual', config: { baseUrl: '' }, secret: '' })
  const [payment, setPayment] = useState({ provider: 'disabled', config: { baseUrl: '' }, secret: '' })
  const [msg, setMsg] = useState('')

  async function load(key, setter, defaults) {
    const res = await adminFetch(`/api/admin/integrations?key=${encodeURIComponent(key)}`)
    const data = await res.json().catch(() => ({}))
    setter({
      provider: data?.provider || defaults.provider,
      config: data?.config || defaults.config,
      secret: '',
    })
    setCanEncrypt(Boolean(data?.canEncrypt))
  }

  useEffect(() => {
    Promise.all([
      load('courier', setCourier, { provider: 'manual', config: { baseUrl: '' } }),
      load('payment', setPayment, { provider: 'disabled', config: { baseUrl: '' } }),
    ]).finally(() => setLoading(false))
  }, [])

  async function save(key, payload) {
    setMsg('Saving…')
    const res = await adminFetch('/api/admin/integrations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, ...payload }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMsg(data?.error || 'Failed to save.')
      return
    }
    setMsg('Saved.')
    setTimeout(() => setMsg(''), 1500)
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-page-title">Integrations</span>
          <span style={{ fontSize: 11, color: '#3A3830' }}>
            {canEncrypt ? 'Secrets can be stored securely.' : 'To store API keys here, set INTEGRATIONS_ENCRYPTION_KEY in Vercel env.'}
          </span>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Loading…</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <Section title="Courier" hint="Used for booking + tracking (later)">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Provider</label>
                    <select className="admin-form-select" value={courier.provider} onChange={e => setCourier({ ...courier, provider: e.target.value })}>
                      <option value="manual">Manual (default)</option>
                      <option value="postex">PostEx (later)</option>
                      <option value="leopard">Leopard (later)</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Base URL (optional)</label>
                    <input className="admin-form-input" value={courier.config?.baseUrl || ''} onChange={e => setCourier({ ...courier, config: { ...courier.config, baseUrl: e.target.value } })} placeholder="https://api.example.com" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">API Key / Secret</label>
                  <input className="admin-form-input" value={courier.secret} onChange={e => setCourier({ ...courier, secret: e.target.value })} placeholder={canEncrypt ? 'Paste key here (saved encrypted)' : 'Set INTEGRATIONS_ENCRYPTION_KEY to enable saving'} disabled={!canEncrypt} />
                  <p style={{ margin: '10px 0 0', color: '#3A3830', fontSize: 12, lineHeight: 1.6 }}>
                    This will be used by courier plug-in once you finalize a courier.
                  </p>
                </div>
                <button className="admin-btn admin-btn-gold" onClick={() => save('courier', { provider: courier.provider, config: courier.config, secret: courier.secret })}>
                  Save Courier Settings
                </button>
              </Section>

              <Section title="Payments" hint="Online payments (later)">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Provider</label>
                    <select className="admin-form-select" value={payment.provider} onChange={e => setPayment({ ...payment, provider: e.target.value })}>
                      <option value="disabled">Disabled (COD)</option>
                      <option value="safepay">Safepay (later)</option>
                      <option value="postex">PostEx (later)</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Base URL (optional)</label>
                    <input className="admin-form-input" value={payment.config?.baseUrl || ''} onChange={e => setPayment({ ...payment, config: { ...payment.config, baseUrl: e.target.value } })} placeholder="https://api.example.com" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">API Key / Secret</label>
                  <input className="admin-form-input" value={payment.secret} onChange={e => setPayment({ ...payment, secret: e.target.value })} placeholder={canEncrypt ? 'Paste key here (saved encrypted)' : 'Set INTEGRATIONS_ENCRYPTION_KEY to enable saving'} disabled={!canEncrypt} />
                  <p style={{ margin: '10px 0 0', color: '#3A3830', fontSize: 12, lineHeight: 1.6 }}>
                    This will be used by payment plug-in once you finalize a gateway.
                  </p>
                </div>
                <button className="admin-btn admin-btn-gold" onClick={() => save('payment', { provider: payment.provider, config: payment.config, secret: payment.secret })}>
                  Save Payment Settings
                </button>
              </Section>

              {msg ? <div style={{ color: '#6A6660', fontSize: 12 }}>{msg}</div> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

