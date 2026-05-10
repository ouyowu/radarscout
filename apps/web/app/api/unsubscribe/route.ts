import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

export async function GET(request: NextRequest) {
  return handleUnsubscribe(request)
}

// Gmail one-click unsubscribe sends POST per RFC 8058
export async function POST(request: NextRequest) {
  return handleUnsubscribe(request)
}

async function handleUnsubscribe(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return new NextResponse('Missing token', { status: 400 })
  }

  let userId: string
  try {
    userId = Buffer.from(token, 'base64url').toString('utf8')
  } catch {
    return new NextResponse('Invalid token', { status: 400 })
  }

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) {
    return new NextResponse('Not found', { status: 404 })
  }

  await db.user.update({
    where: { id: userId },
    data: { emailEnabled: false },
  })

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Unsubscribed — RadarScout</title></head>
<body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#374151;">
  <h1 style="font-size:24px;margin-bottom:12px;">You've been unsubscribed</h1>
  <p style="color:#6b7280;">You'll no longer receive keyword match emails from RadarScout.</p>
  <p style="margin-top:24px;">
    <a href="/" style="color:#ea580c;font-weight:600;">Go to dashboard</a>
  </p>
</body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } },
  )
}
