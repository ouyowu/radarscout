import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'

export function isThailandCompatibleDestination(destination: string | null | undefined): boolean {
  const trimmed = destination?.trim()
  if (!trimmed) return false

  const result = evaluateThailandProductEligibility({
    title: trimmed,
    city: null,
    location: null,
  })

  return result.eligible
}
