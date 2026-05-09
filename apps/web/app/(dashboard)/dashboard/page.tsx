import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'
import { KeywordManager } from './KeywordManager'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const keywords = await db.keyword.findMany({
    where: { userId: session.user.id },
    select: { id: true, text: true, enabled: true, dailyHits: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <KeywordManager
      initialKeywords={keywords}
      plan={session.user.plan as 'FREE' | 'PRO' | 'TEAM'}
    />
  )
}
