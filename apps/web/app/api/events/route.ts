import { parseSafeFunnelEventPayload } from '@/lib/analytics/funnelEventPayload'

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

  console.log(JSON.stringify({ tag: 'funnel_event', ...payload }))

  return new Response(null, { status: 204 })
}
