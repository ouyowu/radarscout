import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-sm text-orange-600 hover:underline font-medium"
        >
          Go home →
        </Link>
      </div>
    </div>
  )
}
