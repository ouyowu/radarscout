import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function login(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/monitors')
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <>
      <h1 className="text-xl font-semibold mb-6">Sign in</h1>

      {searchParams.message && (
        <p className="mb-4 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
          {searchParams.message}
        </p>
      )}
      {searchParams.error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {searchParams.error}
        </p>
      )}

      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500">
        No account?{' '}
        <a href="/signup" className="text-orange-600 hover:underline font-medium">
          Sign up
        </a>
      </p>
    </>
  )
}
