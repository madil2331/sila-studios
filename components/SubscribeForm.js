'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('Saving…')
    try {
      const res = await fetch('/api/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, whatsapp, email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('Saved. Thank you!')
        setName('')
        setWhatsapp('')
        setEmail('')
      } else {
        setStatus(data?.error || 'Could not save.')
      }
    } catch {
      setStatus('Network error.')
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
      <input className="admin-login-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
      <input className="admin-login-input" placeholder="WhatsApp (optional)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
      <input className="admin-login-input" style={{ gridColumn: '1 / -1' }} placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      <button className="btn-gold" type="submit" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>
        Subscribe
      </button>
      {status ? <p style={{ gridColumn: '1 / -1', margin: 0, color: 'var(--muted)', fontSize: 12 }}>{status}</p> : null}
      <style>{`
        @media (max-width: 640px) {
          form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}

