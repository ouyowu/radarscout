'use client'
import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard-error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-3xl font-bold text-gray-200 mb-4">Oops</p>
      <h2 className="text-base font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">{error.message}</p>
      <button
        onClick={reset}
        className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
