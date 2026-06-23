import { describe, expect, it } from 'vitest'
import { ownerManagedBokunProfiles } from '../ownerManagedBokunProfiles'

describe('ownerManagedBokunProfiles', () => {
  it('does not ship placeholder profile copy or fake product IDs', () => {
    const serialized = JSON.stringify(ownerManagedBokunProfiles)

    expect(serialized).not.toContain('NEEDS_REAL_PRODUCT_ID')
    expect(serialized).not.toContain('Real product IDs needed')
    expect(serialized).not.toMatch(/placeholder/i)
  })

  it('only includes profiles with a safe internal or external handoff link', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.source).toBe('bokun_owner_managed')
      expect(profile.bokunId).toMatch(/^\d+$/)
      expect(Boolean(profile.internalProductId || profile.bookingHandoffUrl)).toBe(true)
      expect(profile.internalProductId).not.toBe('NEEDS_REAL_PRODUCT_ID')
    }
  })

  it('does not use Bókun IDs as RadarScout tour IDs', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.internalProductId).not.toBe(profile.bokunId)
    }
  })
})
