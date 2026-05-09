import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reddit Monitor',
  description: 'Monitor Reddit for keyword mentions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
