import '../../app/globals.css'
import './admin.css'

export const metadata = {
  title: 'Sila Studios — Admin',
  robots: { index: false, follow: false }, // Never index admin pages
}

export default function AdminLayout({ children }) {
  return (
    <div className="admin-body">{children}</div>
  )
}
