'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@reddit-monitor/db'

export async function createMonitor(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

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
  const dbUser = await db.user.findUnique({ where: { email: user.email } })
  if (!dbUser) redirect('/login')

  if (dbUser.plan === 'FREE') {
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
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

  const dbUser = await db.user.findUnique({ where: { email: user.email } })
  if (!dbUser) return

  // Only delete if owned by this user
  await db.keyword.deleteMany({
    where: { id: keywordId, userId: dbUser.id },
  })
}
