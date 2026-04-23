'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">Sila Studios</div>
        <div className="admin-login-sub">Admin Panel</div>

        <form onSubmit={handleLogin}>
          {error && <div className="admin-login-error">{error}</div>}
          <label className="admin-login-label">Password</label>
          <input
            type="password"
            className="admin-login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
          />
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#2E2C28' }}>
          silastudios.store — Restricted Access
        </p>
      </div>
    </div>
  )
}
