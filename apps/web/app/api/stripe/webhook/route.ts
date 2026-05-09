import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import { db } from '@reddit-monitor/db'

// Raw body required for Stripe signature verification — do not parse as JSON
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as 'PRO' | 'TEAM' | undefined
      const customerId = session.customer as string | null

      if (userId && plan && customerId) {
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

      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: 'FREE' },
      })
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
          from: process.env.RESEND_FROM_EMAIL ?? 'alerts@reddit-monitor.dev',
          to: user.email,
          subject: '[Reddit Monitor] Payment failed — action required',
          text: 'Your most recent Reddit Monitor payment failed. Please update your billing details to keep your subscription active.',
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
