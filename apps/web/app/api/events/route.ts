import { parseSafeFunnelEventPayload } from '@/lib/analytics/funnelEventPayload'
import { db } from '@reddit-monitor/db'

function invalidEventResponse(): Response {
  return Response.json({ error: 'invalid_event' }, { status: 400 })
}

export async function POST(request: Request): Promise<Response> {
  let input: unknown

  try {
    input = await request.json()
  } catch {
    return invalidEventResponse()
  }

  const payload = parseSafeFunnelEventPayload(input)
  if (!payload) return invalidEventResponse()

  if (
    payload.event === 'booking_partner_handoff_clicked'
    || payload.event === 'affiliate_partner_handoff_clicked'
  ) {
    try {
      await db.partnerHandoffLog.create({
        data: {
          provider: payload.provider ?? 'unknown',
          placement: payload.placement,
          city: payload.city,
          productId: payload.productId,
          attributionSource: payload.attributionSource,
          targetHost: payload.targetHost,
          recommendationSource: payload.recommendationSource,
          reasonCode: payload.reasonCode,
          durationDays: payload.durationDays,
          pace: payload.pace,
          intent: {
            ...(payload.hasDates !== undefined ? { hasDates: payload.hasDates } : {}),
            ...(payload.hasGroupSize !== undefined ? { hasGroupSize: payload.hasGroupSize } : {}),
            ...(payload.hasOccupancy !== undefined ? { hasOccupancy: payload.hasOccupancy } : {}),
            ...(payload.travelerType ? { travelerType: payload.travelerType } : {}),
          },
        },
      })
    } catch {
      // Logging must never block an external partner handoff.
    }
  }

  console.log(JSON.stringify({ tag: 'funnel_event', ...payload }))

  return new Response(null, { status: 204 })
}
