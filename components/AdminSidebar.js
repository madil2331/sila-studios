'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const links = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      ),
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: (
        <svg viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
      ),
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
      ),
    },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-logo">Sila Studios</span>
        <span className="admin-sidebar-tag">Admin Panel</span>
      </div>

      <span className="admin-nav-section">Menu</span>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
