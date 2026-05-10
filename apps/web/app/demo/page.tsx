import type { Metadata } from 'next'
import { DemoApp } from './DemoApp'

export const metadata: Metadata = {
  title: 'Live Demo — See RadarScout in action',
  description: 'Explore the RadarScout dashboard with realistic data. No signup required.',
  robots: { index: false, follow: false },
}

export default function DemoPage() {
  return <DemoApp />
}
