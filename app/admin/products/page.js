'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

const CATEGORIES = ['Formal', 'Casual', 'Bridal', 'Pret', 'Summer', 'Winter', 'Other']
const BADGES = ['', 'New', 'Bestseller', 'Premium', 'Sale']

const EMPTY_FORM = {
  name: '', price: '', category: '', description: '', badge: '', in_stock: true,
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])
  return <div className={`admin-toast admin-toast-${type}`}>{msg}</div>
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModal('add')
  }

  function openEdit(product) {
    setForm({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
      description: product.description || '',
      badge: product.badge || '',
      in_stock: product.in_stock ?? true,
    })
    setEditId(product.id)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setForm(EMPTY_FORM)
    setEditId(null)
  }

  async function handleSave() {
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const url = modal === 'edit' ? `/api/admin/products/${editId}` : '/api/admin/products'
      const method = modal === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ msg: modal === 'edit' ? 'Product updated.' : 'Product added.', type: 'success' })
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
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ msg: 'Product deleted.', type: 'success' })
      setDeleteConfirm(null)
      load()
    }
  }

  async function toggleStock(product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, in_stock: !product.in_stock }),
    })
    load()
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-page-title">Products</span>
          <button className="admin-btn admin-btn-gold" onClick={openAdd}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="admin-table-wrap">
              <div className="admin-empty">
                <svg viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
                <p>No products yet. Click "Add Product" to get started.</p>
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Badge</th>
                    <th>Stock</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="name-cell">{p.name}</td>
                      <td className="price-cell">Rs. {p.price?.toLocaleString()}</td>
                      <td>{p.category || '—'}</td>
                      <td>
                        {p.badge
                          ? <span className="status-badge status-confirmed">{p.badge}</span>
                          : <span style={{ color: '#2E2C28' }}>—</span>}
                      </td>
                      <td>
                        <label className="admin-toggle">
                          <input
                            type="checkbox"
                            checked={p.in_stock}
                            onChange={() => toggleStock(p)}
                          />
                          <span className="admin-toggle-track" />
                          <span className={p.in_stock ? 'stock-in' : 'stock-out'}>
                            {p.in_stock ? 'In Stock' : 'Out'}
                          </span>
                        </label>
                      </td>
                      <td>{new Date(p.created_at).toLocaleDateString('en-PK')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(p)}>
                            Edit
                          </button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm(p.id)}>
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
              {modal === 'edit' ? 'Edit Product' : 'Add New Product'}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Name *</label>
              <input
                className="admin-form-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Embroidered Lawn Set"
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Price (Rs.) *</label>
                <input
                  className="admin-form-input"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="3500"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  className="admin-form-select"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Badge</label>
                <select
                  className="admin-form-select"
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                >
                  {BADGES.map(b => <option key={b} value={b}>{b || 'No badge'}</option>)}
                </select>
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={e => setForm({ ...form, in_stock: e.target.checked })}
                  />
                  <span className="admin-toggle-track" />
                  <span className="admin-toggle-label">In Stock</span>
                </label>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-form-textarea"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the piece..."
              />
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button
                className="admin-btn admin-btn-gold"
                onClick={handleSave}
                disabled={saving || !form.name || !form.price}
              >
                {saving ? 'Saving...' : modal === 'edit' ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 360 }}>
            <div className="admin-modal-title">Delete Product?</div>
            <p style={{ fontSize: 13, color: '#8A8580', lineHeight: 1.6, marginBottom: 24 }}>
              This action cannot be undone. The product will be permanently removed.
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
