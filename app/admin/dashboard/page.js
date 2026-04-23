'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

const STATUS_ORDER = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled']

function statusClass(status) {
  return 'status-' + status.toLowerCase()
}

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]).then(([p, o]) => {
      setProducts(Array.isArray(p) ? p : [])
      setOrders(Array.isArray(o) ? o : [])
      setLoading(false)
    })
  }, [])

  const totalProducts = products.length
  const inStock = products.filter(p => p.in_stock).length
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const recentOrders = orders.slice(0, 6)

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-page-title">Dashboard</span>
          <span style={{ fontSize: 11, color: '#3A3830' }}>
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="admin-stats">
                <div className="admin-stat">
                  <div className="admin-stat-label">Total Products</div>
                  <div className="admin-stat-value">{totalProducts}</div>
                  <div className="admin-stat-sub">{inStock} in stock</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-label">Total Orders</div>
                  <div className="admin-stat-value">{totalOrders}</div>
                  <div className="admin-stat-sub">all time</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-label">Pending</div>
                  <div className="admin-stat-value" style={{ color: '#EF9F27' }}>{pendingOrders}</div>
                  <div className="admin-stat-sub">needs attention</div>
                </div>
                <div className="admin-stat">
                  <div className="admin-stat-label">Delivered</div>
                  <div className="admin-stat-value" style={{ color: '#5DCAA5' }}>
                    {orders.filter(o => o.status === 'Delivered').length}
                  </div>
                  <div className="admin-stat-sub">completed</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div style={{ marginBottom: 32 }}>
                <div className="admin-section-header">
                  <span className="admin-section-title">Recent Orders</span>
                  <Link href="/admin/orders" className="admin-btn admin-btn-outline admin-btn-sm">
                    View All
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="admin-table-wrap">
                    <div className="admin-empty">
                      <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
                      <p>No orders yet — they'll appear here once you log them.</p>
                    </div>
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Product</th>
                          <th>City</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id}>
                            <td className="name-cell">{order.customer_name || '—'}</td>
                            <td>{order.product_name || '—'}</td>
                            <td>{order.customer_city || '—'}</td>
                            <td>
                              <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString('en-PK')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="admin-section-header">
                <span className="admin-section-title">Quick Actions</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Link href="/admin/products" style={{
                  background: '#1A1A17',
                  border: '1px solid rgba(196,164,98,0.1)',
                  borderRadius: 6,
                  padding: '20px 24px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C4A462', marginBottom: 6 }}>Manage</div>
                  <div style={{ fontSize: 15, color: '#C8C4BC' }}>Products & Inventory</div>
                  <div style={{ fontSize: 12, color: '#3A3830', marginTop: 4 }}>Add, edit, toggle stock</div>
                </Link>
                <Link href="/admin/orders" style={{
                  background: '#1A1A17',
                  border: '1px solid rgba(196,164,98,0.1)',
                  borderRadius: 6,
                  padding: '20px 24px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C4A462', marginBottom: 6 }}>Manage</div>
                  <div style={{ fontSize: 15, color: '#C8C4BC' }}>Orders</div>
                  <div style={{ fontSize: 12, color: '#3A3830', marginTop: 4 }}>Log and track orders</div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
