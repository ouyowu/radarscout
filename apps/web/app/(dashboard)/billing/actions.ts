'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@reddit-monitor/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function createCheckoutSession() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

  const dbUser = await db.user.findUnique({ where: { email: user.email } })
  if (!dbUser) redirect('/login')

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${SITE_URL}/billing?success=true`,
    cancel_url: `${SITE_URL}/billing`,
    metadata: { userId: dbUser.id },
    subscription_data: { metadata: { userId: dbUser.id } },
  })

  redirect(session.url!)
}

export async function openCustomerPortal() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) redirect('/login')

  const dbUser = await db.user.findUnique({ where: { email: user.email } })
  if (!dbUser?.stripeCustomerId) redirect('/billing')

  const portal = await getStripe().billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${SITE_URL}/billing`,
  })

  redirect(portal.url)
}
