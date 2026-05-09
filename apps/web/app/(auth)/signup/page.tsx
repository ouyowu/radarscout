import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function signup(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  redirect('/login?message=Check+your+email+to+confirm+your+account')
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <>
      <h1 className="text-xl font-semibold mb-6">Create account</h1>

      {searchParams.error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {searchParams.error}
        </p>
      )}

      <form action={signup} className="space-y-4">
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
            minLength={8}
            autoComplete="new-password"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters</p>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="text-orange-600 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </>
  )
}
