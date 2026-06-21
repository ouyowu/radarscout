import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import type { AiProductCandidate } from './listAiEligibleThailandProducts'

export type AssertionViolation = {
  productId: string
  reasons: string[]
}

export class IneligibleProductInContextError extends Error {
  readonly violations: AssertionViolation[]

  constructor(violations: AssertionViolation[]) {
    const count = violations.length
    super(`[AI context guard] ${count} ineligible product(s) reached context construction before model invocation.`)
    this.name = 'IneligibleProductInContextError'
    this.violations = violations
  }
}

export function assertAllProductsThailandEligible(
  candidates: AiProductCandidate[],
): AiProductCandidate[] {
  const violations: AssertionViolation[] = []
  const eligible: AiProductCandidate[] = []

  for (const candidate of candidates) {
    const result = evaluateThailandProductEligibility({
      title: candidate.title,
      city: candidate.city,
      location: candidate.location,
    })

    if (!result.eligible) {
      violations.push({ productId: candidate.id, reasons: result.reasons })
    } else {
      eligible.push(candidate)
    }
  }

  if (violations.length === 0) return candidates

  const env = process.env.NODE_ENV
  if (env === 'development' || env === 'test') {
    throw new IneligibleProductInContextError(violations)
  }

  // Production: fail closed — remove ineligible candidates silently
  return eligible
}
