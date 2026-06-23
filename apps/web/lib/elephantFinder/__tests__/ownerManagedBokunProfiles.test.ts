import { describe, expect, it } from 'vitest'
import { ownerManagedBokunProfiles } from '../ownerManagedBokunProfiles'

describe('ownerManagedBokunProfiles', () => {
  const requiredBokunIds = [
    '1232729',
    '1232731',
    '1232733',
    '1232736',
    '1232798',
    '1232799',
    '1236811',
    '1236820',
    '1236830',
  ]

  it('loads the 9 owner-managed Bókun profiles from validated CSV data', () => {
    expect(ownerManagedBokunProfiles).toHaveLength(9)
    expect(ownerManagedBokunProfiles.map(profile => profile.bokunId).sort()).toEqual(
      [...requiredBokunIds].sort(),
    )
    expect(new Set(ownerManagedBokunProfiles.map(profile => profile.bokunId)).size).toBe(9)
  })

  it('does not ship placeholder profile copy or fake product IDs', () => {
    const serialized = JSON.stringify(ownerManagedBokunProfiles)

    expect(serialized).not.toContain('NEEDS_REAL_PRODUCT_ID')
    expect(serialized).not.toContain('Real product IDs needed')
    expect(serialized).not.toMatch(/placeholder/i)
    expect(serialized).not.toContain('fake')
    expect(serialized).not.toContain('test_')
  })

  it('only includes profiles with a safe internal or external handoff link', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.source).toBe('bokun_owner_managed')
      expect(profile.bokunId).toMatch(/^\d+$/)
      expect(profile.bookingHandoffUrl).toMatch(/^https?:\/\//)
      expect(profile.internalProductId).not.toBe('NEEDS_REAL_PRODUCT_ID')
    }
  })

  it('does not use Bókun IDs as RadarScout tour IDs', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.internalProductId).not.toBe(profile.bokunId)
    }
  })

  it('does not include unsafe booking handoff URLs', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.bookingHandoffUrl).toBeDefined()
      expect(profile.bookingHandoffUrl).not.toMatch(
        /bokunSessionId|session|token|apiKey|secret|password|admin|extranet|overview|edit/i,
      )
    }
  })

  it('does not generate /tours/{bokunId} for owner-managed external profiles', () => {
    for (const profile of ownerManagedBokunProfiles) {
      expect(profile.internalProductId).toBeUndefined()
      expect(profile.bookingHandoffUrl).not.toBe(`/tours/${profile.bokunId}`)
    }
  })

  it('keeps the Bangkok and Pattaya product flagged outside normal Chiang Mai scope', () => {
    const nonChiangMaiProfile = ownerManagedBokunProfiles.find(
      profile => profile.bokunId === '1232799',
    )

    expect(nonChiangMaiProfile).toBeDefined()
    expect(nonChiangMaiProfile?.city).toBe('Bangkok & Pattaya')
    expect(nonChiangMaiProfile?.notIdealFor.join(' ')).toMatch(/not a chiang mai/i)
  })
})
