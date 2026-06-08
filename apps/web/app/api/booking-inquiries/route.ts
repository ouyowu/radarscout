import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

export const dynamic = 'force-dynamic'

function readString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key]

  return typeof value === 'string' ? value.trim() : ''
}

function readInteger(payload: Record<string, unknown>, key: string, fallback = 0): number {
  const value = payload[key]
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : fallback

  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}
  const bokunProductId = readString(payload, 'bokunProductId')
  const travelDateValue = readString(payload, 'travelDate')
  const pickupArea = readString(payload, 'pickupArea')
  const customerName = readString(payload, 'customerName')
  const customerEmail = readString(payload, 'customerEmail').toLowerCase()
  const whatsapp = readString(payload, 'whatsapp')
  const notes = readString(payload, 'notes')
  const adults = readInteger(payload, 'adults', 1)
  const children = readInteger(payload, 'children', 0)
  const travelDate = new Date(`${travelDateValue}T00:00:00.000Z`)

  if (!bokunProductId) {
    return NextResponse.json({ error: 'bokunProductId is required' }, { status: 400 })
  }

  if (!travelDateValue || Number.isNaN(travelDate.getTime())) {
    return NextResponse.json({ error: 'travelDate is required' }, { status: 400 })
  }

  if (adults < 1 || adults > 20) {
    return NextResponse.json({ error: 'adults must be between 1 and 20' }, { status: 400 })
  }

  if (children < 0 || children > 20) {
    return NextResponse.json({ error: 'children must be between 0 and 20' }, { status: 400 })
  }

  if (!pickupArea || pickupArea.length > 160) {
    return NextResponse.json({ error: 'pickupArea is required and must be 160 characters or less' }, { status: 400 })
  }

  if (!customerName || customerName.length > 120) {
    return NextResponse.json({ error: 'customerName is required and must be 120 characters or less' }, { status: 400 })
  }

  if (!customerEmail || !isValidEmail(customerEmail)) {
    return NextResponse.json({ error: 'valid customerEmail is required' }, { status: 400 })
  }

  const product = await db.bokunProduct.findUnique({
    where: { id: bokunProductId },
    select: { id: true, active: true },
  })

  if (!product || !product.active) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const inquiry = await db.bookingInquiry.create({
    data: {
      bokunProductId,
      travelDate,
      adults,
      children,
      pickupArea,
      customerName,
      customerEmail,
      whatsapp: whatsapp || null,
      notes: notes || null,
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ ok: true, inquiry }, { status: 201 })
}
