import { describe, expect, it } from 'vitest'
import { evaluateThailandProductEligibility } from '../thailandEligibility'

describe('evaluateThailandProductEligibility', () => {
  // Test 1: Phuket city + Phuket tour → eligible
  it('returns eligible for Phuket city and Phuket tour title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'Half-day Phuket island tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.foreignSignals).toHaveLength(0)
    expect(result.reasons).toHaveLength(0)
  })

  // Test 2: Bangkok + Bangkok temple tour → eligible
  it('returns eligible for Bangkok city and Bangkok temple tour title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Bangkok',
      title: 'Bangkok temple and river tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.foreignSignals).toHaveLength(0)
  })

  // Test 3: Chiang Mai + elephant sanctuary → eligible (city provides Thailand signal)
  it('returns eligible for Chiang Mai city with generic title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Chiang Mai',
      title: 'Elephant sanctuary half-day tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Chiang Mai')
  })

  // Test 4: Phuket + Singapore tour → blocked
  it('blocks Phuket city with Singapore tour title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: '6-Hours Private Singapore Customized Tour With Driver',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
    expect(result.hasDestinationMismatch).toBe(true)
    expect(result.reasons[0]).toContain('Phuket')
    expect(result.reasons[0]).toContain('Singapore')
  })

  // Test 5: Bangkok + Kuala Lumpur tour → blocked
  it('blocks Bangkok city with Kuala Lumpur tour title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Bangkok',
      title: 'Best Kuala Lumpur city highlights tour',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Kuala Lumpur')
    expect(result.hasDestinationMismatch).toBe(true)
  })

  // Test 6: Chiang Mai + Bali tour → blocked
  it('blocks Chiang Mai city with Bali tour title', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Chiang Mai',
      title: 'Private Bali cultural experience',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Bali')
  })

  // Test 7: Thailand city + Japan/Tokyo/Osaka title → blocked
  it('blocks Thailand city with Japan in title', () => {
    const japanTitles = ['Tokyo highlights tour', 'Osaka food tour', 'Best of Japan']
    for (const title of japanTitles) {
      const result = evaluateThailandProductEligibility({ city: 'Bangkok', title })
      expect(result.eligible).toBe(false)
    }
  })

  // Test 8: Thailand city + Dubai/Maldives title → blocked
  it('blocks Thailand city with Dubai or Maldives in title', () => {
    const result1 = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'Dubai luxury desert safari',
    })
    expect(result1.eligible).toBe(false)
    expect(result1.foreignSignals).toContain('Dubai')

    const result2 = evaluateThailandProductEligibility({
      city: 'Krabi',
      title: 'Maldives overwater bungalow experience',
    })
    expect(result2.eligible).toBe(false)
    expect(result2.foreignSignals).toContain('Maldives')
  })

  // Test 9: Empty city + explicit Thailand title → eligible if no foreign signals
  it('returns eligible when city is empty but title mentions Thailand', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Bangkok street food night tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Bangkok')
  })

  // Test 10: Empty city + explicit foreign title → blocked
  it('blocks when city is empty and title mentions a foreign destination', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Singapore Gardens by the Bay experience',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
  })

  // Test 11: Thailand city + both Thailand and foreign signals → blocked
  it('blocks when both Thailand and foreign signals are present', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'Phuket and Singapore combined tour',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
    expect(result.thailandSignals).toContain('Phuket')
  })

  // Test 12: Matching is case-insensitive
  it('detects foreign destination in all-caps title (case-insensitive)', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'PRIVATE TOUR IN SINGAPORE',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
  })

  it('detects Thailand destination in lowercase city (case-insensitive)', () => {
    const result = evaluateThailandProductEligibility({
      city: 'phuket',
      title: 'beach tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Phuket')
  })

  // Test 13: Partial words must not create obvious false positives
  it('does not false-positive on unrelated words that partially match short terms', () => {
    // "Trat" is a Thai city. Should not match "abstract" or "extract"
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'A tour with abstract art',
    })
    // "abstract" does not contain "trat" as a standalone word, but as a substring:
    // "abstract".includes("trat") === false → "absTRACT" → "abstract".toLowerCase() = "abstract"
    // "trat" vs "abstract": a-b-s-t-r-a-c-t does not contain t-r-a-t in sequence
    // Actually let's verify: "abstract" → indices: a(0)b(1)s(2)t(3)r(4)a(5)c(6)t(7)
    // "trat" = t-r-a-t. Looking for "trat" in "abstract": t at 3, r at 4, a at 5, c at 6 ≠ t. No match.
    expect(result.eligible).toBe(false) // no Thailand signals found either, so blocked
    expect(result.reasons[0]).toContain('does not clearly identify a Thailand destination')
    expect(result.foreignSignals).toHaveLength(0) // no false positive
  })

  it('does not false-positive on "Malaysian" matching "Malaysia" (boundary-aware)', () => {
    // With boundary-aware matching, "Malaysian" is a different token from "Malaysia".
    // The product is eligible because city=Phuket is a Thailand signal.
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'A tour by Malaysian visitors',
    })
    expect(result.eligible).toBe(true)
    expect(result.foreignSignals).toHaveLength(0)
    expect(result.thailandSignals).toContain('Phuket')
  })

  // Reasons are safe and do not include raw source payloads
  it('reasons do not include rawJson or secrets', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'Singapore tour',
    })
    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('secret')
    expect(serialized).not.toContain('aiRaw')
  })

  // Additional: Thailand signal from location field
  it('detects Thailand signal from location field when city and title are absent', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: null,
      location: 'Northern Thailand near Chiang Rai',
    })
    expect(result.eligible).toBe(true)
  })

  // Additional: foreign signal from location field blocks even if city is Thai
  it('blocks when location field mentions a foreign destination', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Bangkok',
      title: 'City tour',
      location: 'Seoul, South Korea',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Seoul')
  })

  // All three inputs null → blocked
  it('blocks when all inputs are null', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: null,
      location: null,
    })
    expect(result.eligible).toBe(false)
    expect(result.reasons[0]).toContain('does not clearly identify a Thailand destination')
  })
})

// ── Boundary-aware matching — false-positive prevention ───────────────────────

describe('evaluateThailandProductEligibility — boundary-aware matching', () => {
  it('"Chrome browser tour tools" does not trigger Rome', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Chrome browser tour tools',
    })
    expect(result.foreignSignals).not.toContain('Rome')
  })

  it('"strategy workshop" does not trigger Trat', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'strategy workshop',
    })
    expect(result.thailandSignals).not.toContain('Trat')
  })

  it('"Bali tour" triggers Bali as a foreign signal', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Bali tour',
    })
    expect(result.foreignSignals).toContain('Bali')
    expect(result.eligible).toBe(false)
  })

  it('"Rome city tour" triggers Rome as a foreign signal', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Rome city tour',
    })
    expect(result.foreignSignals).toContain('Rome')
    expect(result.eligible).toBe(false)
  })

  it('"Thai cooking class in Bangkok" is Thailand eligible', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Thai cooking class in Bangkok',
    })
    expect(result.eligible).toBe(true)
    expect(result.foreignSignals).toHaveLength(0)
    expect(result.thailandSignals.some(s => s === 'Thai' || s === 'Bangkok')).toBe(true)
  })

  it('"Thailand private tour" is Thailand eligible', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Thailand private tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Thailand')
  })

  it('"PHUKET ISLAND TOUR" is Thailand eligible (case-insensitive)', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'PHUKET ISLAND TOUR',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Phuket')
  })

  it('punctuation "Singapore—private tour" still triggers Singapore', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Singapore—private tour',
    })
    expect(result.foreignSignals).toContain('Singapore')
    expect(result.eligible).toBe(false)
  })

  it('"Koh-Samui island tour" is recognized after normalization', () => {
    const result = evaluateThailandProductEligibility({
      city: null,
      title: 'Koh-Samui island tour',
    })
    expect(result.eligible).toBe(true)
    expect(result.thailandSignals).toContain('Koh Samui')
  })

  it('mixed Thailand and foreign signals remain blocked', () => {
    const result = evaluateThailandProductEligibility({
      city: 'Phuket',
      title: 'Phuket and Singapore combined tour',
    })
    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
    expect(result.thailandSignals).toContain('Phuket')
  })
})
