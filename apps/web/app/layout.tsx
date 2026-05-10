import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadPulse.ai',
  description: 'Turn Reddit conversations into qualified leads',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
