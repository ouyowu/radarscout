import type { PlanKey } from '@reddit-monitor/db'

const DEFAULT_ADMIN_EMAILS = ['ouyowu@gmail.com']

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const configured = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const admins = configured && configured.length > 0 ? configured : DEFAULT_ADMIN_EMAILS
  return admins.includes(email.toLowerCase())
}

export function effectivePlan(plan: string | null | undefined, email?: string | null): PlanKey {
  if (isAdminEmail(email)) return 'TEAM'
  return ((plan as PlanKey | undefined) ?? 'FREE')
}
