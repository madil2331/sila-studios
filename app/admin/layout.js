import '../../app/globals.css'
import PublicLayout from '@/components/PublicLayout'
import './admin.css'

export const metadata = {
  title: 'Sila Studios — Admin',
  robots: { index: false, follow: false }, // Never index admin pages
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
     <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  )
}
