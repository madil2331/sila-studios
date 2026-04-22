import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import AnnouncementBar from '@/components/AnnouncementBar'

export const metadata = {
  title: 'Sila Studios — Where Elegance Fits',
  description:
    'Premium ladies fashion crafted in Karachi. Refined silhouettes, elegant fabrics, curated for the modern Pakistani woman. Order via WhatsApp.',
  keywords: 'ladies fashion karachi, women clothing pakistan, sila studios, elegant fashion karachi, stitched suits',
  openGraph: {
    title: 'Sila Studios — Where Elegance Fits',
    description: 'Premium ladies fashion crafted in Karachi.',
    url: 'https://silastudios.store',
    siteName: 'Sila Studios',
    images: [{ url: '/sila_banner.png', width: 1200, height: 630, alt: 'Sila Studios' }],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sila Studios — Where Elegance Fits',
    images: ['/sila_banner.png'],
  },
  icons: {
    icon: '/logo_social.png',
    shortcut: '/logo_social.png',
    apple: '/logo_social.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
