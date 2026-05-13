'use server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'
import { effectivePlan } from '@/lib/admin'

export async function createMonitor(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const subreddit = (formData.get('subreddit') as string)
    .trim()
    .replace(/^r\//, '')
    .toLowerCase()

  const keywords = (formData.get('keywords') as string)
    .split('\n')
    .map(k => k.trim())
    .filter(Boolean)

  if (!subreddit || keywords.length === 0) {
    redirect('/monitors/new?error=Subreddit+and+at+least+one+keyword+are+required')
  }

  const FREE_LIMIT = 3
  const dbUser = await db.user.findUnique({ where: { id: session.user.id } })
  if (!dbUser) redirect('/login')

  const plan = effectivePlan(dbUser.plan, dbUser.email)
  if (plan === 'FREE') {
    const existing = await db.keyword.count({ where: { userId: dbUser.id, enabled: true } })
    if (existing + keywords.length > FREE_LIMIT) {
      redirect(
        `/monitors/new?error=Free+plan+allows+${FREE_LIMIT}+keywords.+You+have+${existing}+active.+Upgrade+to+Pro+for+unlimited.`,
      )
    }
  }

  await db.keyword.createMany({
    data: keywords.map(text => ({
      userId: dbUser.id,
      text,
      flags: { subreddit },
    })),
  })

  redirect('/monitors')
}

export async function deleteKeyword(keywordId: string) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const dbUser = await db.user.findUnique({ where: { id: session.user.id } })
  if (!dbUser) return

  // Only delete if owned by this user
  await db.keyword.deleteMany({
    where: { id: keywordId, userId: dbUser.id },
  })
}
