'use client'

import { useEffect, useState, useRef } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'

const CATEGORIES = ['Formal', 'Casual', 'Bridal', 'Pret', 'Summer', 'Winter', 'Other']
const BADGES = ['', 'New', 'Bestseller', 'Premium', 'Sale']
const EMPTY_FORM = { name: '', price: '', category: '', description: '', badge: '', in_stock: true, image_url: '' }

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return <div className={`admin-toast admin-toast-${type}`}>{msg}</div>
}

function ImageUploader({ value, onChange }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG or WebP allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB')
      return
    }

    setUploading(true)
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
        setPreview(data.url)
      } else {
        alert(data.error || 'Upload failed')
        setPreview(value || '')
      }
    } catch {
      alert('Upload failed — check your connection')
      setPreview(value || '')
    }
    setUploading(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function clearImage() {
    setPreview('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {preview ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 4, overflow: 'hidden', background: '#0F0F0D', border: '1px solid rgba(255,255,255,0.07)' }}>
          <img src={preview} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#C4A462', fontSize: 12, letterSpacing: '0.1em' }}>Uploading...</span>
            </div>
          )}
          {!uploading && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, display: 'flex', gap: 8 }}>
              <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => inputRef.current?.click()}>
                Change
              </button>
              <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={clearImage}>
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          style={{
            width: '100%',
            aspectRatio: '3/4',
            border: `1px dashed ${dragOver ? '#C4A462' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            background: dragOver ? 'rgba(196,164,98,0.04)' : '#0F0F0D',
            transition: 'all 0.2s',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#C4A462" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: 11, color: '#6A6660', letterSpacing: '0.08em', textAlign: 'center', padding: '0 12px' }}>
            {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
          </span>
          <span style={{ fontSize: 10, color: '#3A3830' }}>JPG, PNG, WebP · Max 5MB</span>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
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

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setModal('add') }
  function openEdit(p) {
    setForm({ name: p.name||'', price: p.price||'', category: p.category||'', description: p.description||'', badge: p.badge||'', in_stock: p.in_stock??true, image_url: p.image_url||'' })
    setEditId(p.id); setModal('edit')
  }
  function closeModal() { setModal(null); setForm(EMPTY_FORM); setEditId(null) }

  async function handleSave() {
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const url = modal === 'edit' ? `/api/admin/products/${editId}` : '/api/admin/products'
      const res = await fetch(url, {
        method: modal === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ msg: modal === 'edit' ? 'Product updated.' : 'Product added.', type: 'success' })
        closeModal(); load()
      } else {
        const d = await res.json()
        setToast({ msg: d.error || 'Failed to save.', type: 'error' })
      }
    } catch { setToast({ msg: 'Network error.', type: 'error' }) }
    setSaving(false)
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) { setToast({ msg: 'Product deleted.', type: 'success' }); setDeleteConfirm(null); load() }
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
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
                <p>No products yet. Click "Add Product" to get started.</p>
              </div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Badge</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.image_url ? (
                          <div style={{ width: 44, height: 58, borderRadius: 3, overflow: 'hidden', background: '#1A1A17' }}>
                            <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div style={{ width: 44, height: 58, borderRadius: 3, background: '#1A1A17', border: '1px dashed rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#3A3830" strokeWidth="1.5" style={{ width: 16, height: 16 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </td>
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
                          <input type="checkbox" checked={p.in_stock} onChange={() => toggleStock(p)} />
                          <span className="admin-toggle-track" />
                          <span className={p.in_stock ? 'stock-in' : 'stock-out'}>{p.in_stock ? 'In Stock' : 'Out'}</span>
                        </label>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm(p.id)}>Delete</button>
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
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-title">{modal === 'edit' ? 'Edit Product' : 'Add New Product'}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'start' }}>
              {/* Image upload */}
              <div>
                <label className="admin-form-label" style={{ marginBottom: 8, display: 'block' }}>Photo</label>
                <ImageUploader
                  value={form.image_url}
                  onChange={url => setForm({ ...form, image_url: url })}
                />
              </div>

              {/* Fields */}
              <div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product Name *</label>
                  <input className="admin-form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Embroidered Lawn Set" />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Price (Rs.) *</label>
                    <input className="admin-form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="3500" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select className="admin-form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Badge</label>
                    <select className="admin-form-select" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                      {BADGES.map(b => <option key={b} value={b}>{b || 'No badge'}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
                      <span className="admin-toggle-track" />
                      <span className="admin-toggle-label">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 16 }}>
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the piece..." />
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={closeModal}>Cancel</button>
              <button className="admin-btn admin-btn-gold" onClick={handleSave} disabled={saving || !form.name || !form.price}>
                {saving ? 'Saving...' : modal === 'edit' ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 360 }}>
            <div className="admin-modal-title">Delete Product?</div>
            <p style={{ fontSize: 13, color: '#8A8580', lineHeight: 1.6, marginBottom: 24 }}>This action cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
