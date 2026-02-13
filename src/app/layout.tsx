import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Embroidery Gallery | Handcrafted Designs',
  description: 'Browse and order beautiful handcrafted embroidery designs for your merchandise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
