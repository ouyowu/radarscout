import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Public Bókun search is intentionally disabled. Reviewed products reach public
// surfaces only through the database review gate and verified widget handoff.
export async function POST() {
  return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
}
