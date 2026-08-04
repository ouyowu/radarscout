import { NextRequest, NextResponse } from 'next/server'

import {
  getAiReadyProductById,
  validateAiReadyProduct,
} from '@/lib/aiProducts/aiReadyProductSchema'

const RESPONSE_HEADERS = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
  'X-Content-Type-Options': 'nosniff',
}

function notFound() {
  return NextResponse.json(
    {
      card: null,
      error: 'ACTIVITY_DECISION_CARD_NOT_FOUND',
    },
    { status: 404, headers: RESPONSE_HEADERS },
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const card = getAiReadyProductById(params.id)
  if (!card) return notFound()

  const validation = validateAiReadyProduct(card)
  if (!validation.ok) return notFound()

  return NextResponse.json(
    { card: validation.value },
    { headers: RESPONSE_HEADERS },
  )
}
