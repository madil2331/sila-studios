'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

const STATUSES = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled']

const EMPTY_FORM = {
  customer_name: '', customer_phone: '', customer_city: '',
  product_name: '', status: 'Pending', notes: '',
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])
  return <div className={`admin-toast admin-toast-${type}`}>{msg}</div>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filter, setFilter] = useState('All')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModal('add')
  }

  function openEdit(order) {
    setForm({
      customer_name: order.customer_name || '',
      customer_phone: order.customer_phone || '',
      customer_city: order.customer_city || '',
      product_name: order.product_name || '',
      status: order.status || 'Pending',
      notes: order.notes || '',
    })
    setEditId(order.id)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setForm(EMPTY_FORM)
    setEditId(null)
  }

  async function handleSave() {
    if (!form.customer_name || !form.product_name) return
    setSaving(true)
    try {
      const url = modal === 'edit' ? `/api/admin/orders/${editId}` : '/api/admin/orders'
      const method = modal === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ msg: modal === 'edit' ? 'Order updated.' : 'Order logged.', type: 'success' })
        closeModal()
        load()
      } else {
        const d = await res.json()
        setToast({ msg: d.error || 'Failed to save.', type: 'error' })
      }
    } catch {
      setToast({ msg: 'Network error.', type: 'error' })
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ msg: 'Order deleted.', type: 'success' })
      setDeleteConfirm(null)
      load()
    }
  }

  async function quickStatus(order, status) {
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...order, status }),
    })
    setToast({ msg: `Marked as ${status}.`, type: 'success' })
    load()
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-page-title">Orders</span>
          <button className="admin-btn admin-btn-gold" onClick={openAdd}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Log Order
          </button>
        </div>

        <div className="admin-content">
          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {['All', ...STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: 'Jost, sans-serif',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: filter === s ? '1px solid #C4A462' : '1px solid rgba(255,255,255,0.07)',
                  background: filter === s ? 'rgba(196,164,98,0.12)' : 'transparent',
                  color: filter === s ? '#C4A462' : '#6A6660',
                  transition: 'all 0.15s',
                }}
              >
                {s} {s !== 'All' && counts[s] > 0 && `(${counts[s]})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="admin-loading">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-table-wrap">
              <div className="admin-empty">
                <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                <p>{filter === 'All' ? 'No orders yet. Log your first WhatsApp order above.' : `No ${filter} orders.`}</p>
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id}>
                      <td className="name-cell">{order.customer_name || '—'}</td>
                      <td>
                        {order.customer_phone ? (
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#25D366', fontSize: 12 }}
                          >
                            {order.customer_phone}
                          </a>
                        ) : '—'}
                      </td>
                      <td>{order.customer_city || '—'}</td>
                      <td>{order.product_name || '—'}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={e => quickStatus(order, e.target.value)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: 11,
                            cursor: 'pointer',
                            outline: 'none',
                            color: order.status === 'Pending' ? '#EF9F27'
                              : order.status === 'Confirmed' ? '#97C459'
                              : order.status === 'Dispatched' ? '#85B7EB'
                              : order.status === 'Delivered' ? '#5DCAA5'
                              : '#F09595',
                          }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('en-PK')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(order)}>
                            Edit
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm(order.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-title">
              {modal === 'edit' ? 'Edit Order' : 'Log New Order'}
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Customer Name *</label>
                <input
                  className="admin-form-input"
                  value={form.customer_name}
                  onChange={e => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Ayesha Khan"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">WhatsApp Number</label>
                <input
                  className="admin-form-input"
                  value={form.customer_phone}
                  onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                  placeholder="923001234567"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">City</label>
                <input
                  className="admin-form-input"
                  value={form.customer_city}
                  onChange={e => setForm({ ...form, customer_city: e.target.value })}
                  placeholder="Karachi"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-form-select"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Ordered *</label>
              <input
                className="admin-form-input"
                value={form.product_name}
                onChange={e => setForm({ ...form, product_name: e.target.value })}
                placeholder="Embroidered Lawn Set"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Notes</label>
              <textarea
                className="admin-form-textarea"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Size, colour preference, special instructions..."
              />
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button
                className="admin-btn admin-btn-gold"
                onClick={handleSave}
                disabled={saving || !form.customer_name || !form.product_name}
              >
                {saving ? 'Saving...' : modal === 'edit' ? 'Update Order' : 'Log Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 360 }}>
            <div className="admin-modal-title">Delete Order?</div>
            <p style={{ fontSize: 13, color: '#8A8580', lineHeight: 1.6, marginBottom: 24 }}>
              This will permanently remove the order record.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
