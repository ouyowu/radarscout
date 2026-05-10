'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CheckoutButton({
  plan,
  billing,
  label,
  isLoggedIn,
  className,
}: {
  plan: 'STARTER' | 'PRO' | 'TEAM'
  billing: 'monthly' | 'annual'
  label: string
  isLoggedIn: boolean
  className?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className ?? 'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer bg-orange-500 hover:bg-orange-600 text-white'}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  )
}
