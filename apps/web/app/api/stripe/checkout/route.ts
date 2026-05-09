import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const plan = body?.plan as string | undefined

  if (plan !== 'PRO' && plan !== 'TEAM') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = plan === 'PRO' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_TEAM_PRICE_ID
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
