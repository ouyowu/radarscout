import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { plan?: string; billing?: string }
  const plan = body.plan as PlanKey | undefined
  const billing = body.billing === 'annual' ? 'annual' : 'monthly'

  if (!plan || !(plan in PLAN_LIMITS) || plan === 'FREE') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const monthlyPriceIds: Partial<Record<PlanKey, string | undefined>> = {
    STARTER: process.env.STRIPE_STARTER_PRICE_ID,
    PRO:     process.env.STRIPE_PRO_PRICE_ID,
    TEAM:    process.env.STRIPE_TEAM_PRICE_ID,
  }
  const annualPriceIds: Partial<Record<PlanKey, string | undefined>> = {
    STARTER: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
    PRO:     process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    TEAM:    process.env.STRIPE_TEAM_ANNUAL_PRICE_ID,
  }

  const priceMap = billing === 'annual' ? annualPriceIds : monthlyPriceIds
  const priceId = priceMap[plan] ?? monthlyPriceIds[plan]

  if (!priceId) {
    return NextResponse.json({ error: `Price ID for ${plan} not configured` }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: session.user.id, plan },
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
