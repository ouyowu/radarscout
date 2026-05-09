'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center px-4">
          <p className="text-4xl font-bold text-gray-200 mb-4">500</p>
          <h1 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="text-sm text-orange-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
