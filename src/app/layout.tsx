import './globals.css'
import { Inter } from 'next/font/google'
import FacebookPixel from '@/app/components/FacebookPixel'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sinko - Desarrollo de Software en Colombia | Apps Móviles y Páginas Web',
  description: 'Sinko es una startup de desarrollo de software en Colombia. Creamos aplicaciones móviles, páginas web y plataformas digitales con Next.js, Flutter, Firebase. +40 proyectos exitosos. Cotiza gratis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager (GTM) */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5JG9WCDM');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5JG9WCDM"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}>
          </iframe>
        </noscript>

        {/* Facebook Pixel */}
        <FacebookPixel />

        {children}
      </body>
    </html>
  )
}
