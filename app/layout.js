import './globals.css'
import PublicLayout from '@/components/PublicLayout'
import Script from 'next/script'
import { OrganizationJsonLd } from '@/components/json-ld'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

export const metadata = {
  metadataBase: new URL('https://silastudios.store'),
  title: {
    template: '%s | Sila Studios',
    default: 'Sila Studios – Handcrafted Designs & Goods',
  },
  description: 'Sila Studios offers unique, artisan-crafted products for the modern home. Discover our latest collection.',
  keywords: 'ladies fashion karachi, women clothing pakistan, sila studios, elegant fashion karachi, stitched suits',
  openGraph: {
    title: {
    template: '%s | Sila Studios',
    default: 'Sila Studios – Handcrafted Designs & Goods',
  },
    description: 'Premium ladies fashion crafted in Karachi.',
    url: 'https://silastudios.store',
    siteName: 'Sila Studios',
    images: [{ url: '/sila_banner.png', width: 1200, height: 630, alt: 'Sila Studios' }],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
    template: '%s | Sila Studios',
    default: 'Sila Studios – Handcrafted Designs & Goods',
  },
    images: ['/sila_banner.png'],
  },
  verification: {
    google: '7e2fQBln2H9bWUl83TyOLhl_6EY--VQ-_q9XYppbjjU',
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
        <meta name="msvalidate.01" content="179069A5CE6A2EF50EA24C0460203231" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}

        {TIKTOK_PIXEL_ID ? (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;
                var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
                ttq._o=ttq._o||{};ttq._o[e]=n||{};
                n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;
                e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('${TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        ) : null}
        <OrganizationJsonLd />
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  )
}
