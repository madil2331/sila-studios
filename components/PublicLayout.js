'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import AnnouncementBar from './AnnouncementBar'
import AnalyticsPing from './AnalyticsPing'

export default function PublicLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <AnnouncementBar />
      <AnalyticsPing />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}