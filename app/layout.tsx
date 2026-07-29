import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ElectroCalc',
  description: 'Professional electronics calculator — Ohm\'s Law, Resistor Color Code, Unit Converter & Scientific Calculator',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#00C853',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="bg-background">
      <body className={`${inter.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
