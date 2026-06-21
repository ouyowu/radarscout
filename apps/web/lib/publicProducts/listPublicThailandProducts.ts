import 'server-only'
import { db } from '@reddit-monitor/db'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'

const SCAN_BATCH_SIZE = 50
const SCAN_LIMIT = 500

export type PublicThailandProductSummary = {
  id: string
  title: string
  city: string | null
  lastSyncedAt: Date | null
}

export async function listPublicThailandProducts(take = SCAN_LIMIT): Promise<PublicThailandProductSummary[]> {
  const effectiveTake = Math.min(take, SCAN_LIMIT)
  const collected: PublicThailandProductSummary[] = []
  let skip = 0

  try {
    while (collected.length < effectiveTake && skip < SCAN_LIMIT) {
      const batch = await db.bokunProduct.findMany({
        where: {
          active: true,
          supplierId: { not: null },
        },
        orderBy: [{ city: 'asc' }, { title: 'asc' }, { id: 'asc' }],
        take: SCAN_BATCH_SIZE,
        skip,
        select: {
          id: true,
          title: true,
          city: true,
          location: true,
          lastSyncedAt: true,
        },
      })

      if (batch.length === 0) break

      for (const product of batch) {
        if (collected.length >= effectiveTake) break

        const eligibility = evaluateThailandProductEligibility({
          title: product.title,
          city: product.city,
          location: product.location,
        })

        if (!eligibility.eligible) continue

        collected.push({
          id: product.id,
          title: product.title,
          city: product.city,
          lastSyncedAt: product.lastSyncedAt,
        })
      }

      skip += batch.length
      if (batch.length < SCAN_BATCH_SIZE) break
    }
  } catch {
    return []
  }

  return collected
}
