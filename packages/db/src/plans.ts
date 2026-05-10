export const PLAN_LIMITS = {
  FREE:    { keywords: 3,        aiScoring: false, aiReply: false, hitsPerDay: 50,       price: 0  },
  STARTER: { keywords: 3,        aiScoring: false, aiReply: false, hitsPerDay: 200,      price: 15 },
  PRO:     { keywords: 10,       aiScoring: true,  aiReply: true,  hitsPerDay: Infinity, price: 29 },
  TEAM:    { keywords: Infinity, aiScoring: true,  aiReply: true,  hitsPerDay: Infinity, price: 79 },
} as const

export type PlanKey = keyof typeof PLAN_LIMITS
