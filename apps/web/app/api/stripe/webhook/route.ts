import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { Resend } from 'resend'
import { getStripe } from '@/lib/stripe'
import { redis } from '@/lib/redis'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'

// Raw body required for Stripe signature verification — do not parse as JSON
export const dynamic = 'force-dynamic'
type KeywordIdRecord = { id: string }

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency: skip events already processed (Stripe retries on 5xx)
  const idempotencyKey = `lp:stripe:event:${event.id}`
  const alreadyProcessed = await redis.set(idempotencyKey, '1', 'EX', 86400, 'NX')
  if (alreadyProcessed === null) {
    return NextResponse.json({ received: true })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as PlanKey | undefined
      const customerId = session.customer as string | null

      if (userId && plan && plan in PLAN_LIMITS && customerId) {
        await db.user.update({
          where: { id: userId },
          data: { plan, stripeCustomerId: customerId },
        })
        console.log(`[webhook] upgraded user ${userId} to ${plan}`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true, email: true },
      })

      if (!user) break

      await db.user.update({
        where: { id: user.id },
        data: { plan: 'FREE' },
      })

      // Disable keywords beyond FREE limit — oldest N are kept active
      const freeLimit = PLAN_LIMITS.FREE.keywords
      const keywords: KeywordIdRecord[] = await db.keyword.findMany({
        where: { userId: user.id, enabled: true },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      })

      if (keywords.length > freeLimit) {
        const toDisable = keywords.slice(freeLimit).map((k: KeywordIdRecord) => k.id)
        await db.keyword.updateMany({
          where: { id: { in: toDisable } },
          data: { enabled: false },
        })
        console.log(`[webhook] disabled ${toDisable.length} keywords for ${user.id} after downgrade`)
      }

      console.log(`[webhook] downgraded customer ${customerId} to FREE`)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { email: true },
      })

      if (user?.email && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'alerts@radarscout.io',
          to: user.email,
          subject: '[RadarScout] Payment failed — action required',
          text: 'Your most recent RadarScout payment failed. Please update your billing details to keep your subscription active.',
        })
      }
      console.log(`[webhook] payment_failed for customer ${customerId}`)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
