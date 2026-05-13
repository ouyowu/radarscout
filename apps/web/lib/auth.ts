import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@reddit-monitor/db'
import { effectivePlan } from '@/lib/admin'

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null

        const valid = await compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, plan: effectivePlan(user.plan, user.email) }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.plan = effectivePlan((user as { plan: string }).plan, user.email)
      }
      token.plan = effectivePlan(token.plan as string | undefined, token.email)
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.plan = effectivePlan(token.plan as string | undefined, session.user.email)
      return session
    },
  },
})
