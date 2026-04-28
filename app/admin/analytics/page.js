'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { adminFetch } from '@/lib/admin-fetch'

export default function AnalyticsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => {
        setEvents(Array.isArray(d) ? d : [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-page-title">Analytics</span>
          <span style={{ fontSize: 11, color: '#3A3830' }}>Basic page views</span>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Loading…</div>
          ) : events.length === 0 ? (
            <div className="admin-table-wrap">
              <div className="admin-empty">
                <svg viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M20 19V9"/><path d="M8 19v-6"/><path d="M16 19v-3"/></svg>
                <p>No analytics yet (or `events` table not created).</p>
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Path</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id}>
                      <td className="name-cell">{ev.name}</td>
                      <td style={{ fontSize: 12, color: '#8A8580' }}>{ev.path || '—'}</td>
                      <td>{new Date(ev.created_at).toLocaleString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

