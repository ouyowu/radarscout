import { describe, expect, it } from 'vitest'

import {
  PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
  resolveOwnerManagedProfileHandoff,
  validatePublicBookingPartnerHandoff,
} from '../bookingPartnerHandoff'

describe('validatePublicBookingPartnerHandoff', () => {
  it('accepts an explicit public https booking partner URL', () => {
    const handoff = validatePublicBookingPartnerHandoff({
      href: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      source: 'owner_managed_profile',
      verifiedBy: 'owner_managed_catalog',
    })

    expect(handoff).toEqual({
      href: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      label: 'Check availability',
      rel: PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
      source: 'owner_managed_profile',
      verifiedBy: 'owner_managed_catalog',
    })
  })

  it('accepts a reviewed public Viator product whose title slug contains private', () => {
    const handoff = validatePublicBookingPartnerHandoff({
      href: 'https://www.viator.com/tours/Chiang-Mai/Private-Chiang-Rai-Temples-Tour/d5267-26152P7?pid=P00309837',
      source: 'operator_verified_public_link',
      verifiedBy: 'operator_manual_review',
    })

    expect(handoff?.href).toContain('/Private-Chiang-Rai-Temples-Tour/')
  })

  it('rejects internal RadarScout tour links', () => {
    expect(
      validatePublicBookingPartnerHandoff({
        href: '/tours/1232729',
        source: 'owner_managed_profile',
        verifiedBy: 'owner_managed_catalog',
      }),
    ).toBeNull()
  })

  it('rejects non-https, local, private, and unsafe admin URLs', () => {
    const unsafeUrls = [
      'http://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      'https://localhost/booking',
      'https://127.0.0.1/booking',
      'https://10.0.0.2/booking',
      'https://api.bokun.io/admin/experience/1232729',
      'https://widgets.bokun.io/private/experience/1232729',
      'https://preview.widgets.bokun.io/experience/1232729',
      'https://widgets.bokun.io/online-sales/public-channel/experience/1232729?token=secret',
    ]

    for (const href of unsafeUrls) {
      expect(
        validatePublicBookingPartnerHandoff({
          href,
          source: 'owner_managed_profile',
          verifiedBy: 'owner_managed_catalog',
        }),
      ).toBeNull()
    }
  })
})

describe('resolveOwnerManagedProfileHandoff', () => {
  it('matches a product bokunActivityId to the existing owner-managed profile handoff', () => {
    const handoff = resolveOwnerManagedProfileHandoff('1232729')

    expect(handoff).toMatchObject({
      href: expect.stringMatching(
        /^https:\/\/widgets\.bokun\.io\/online-sales\/.+\/experience\/1232729$/,
      ),
      label: 'Check availability',
      rel: PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
      source: 'owner_managed_profile',
      verifiedBy: 'owner_managed_catalog',
    })
    expect(handoff?.href).not.toBe('/tours/1232729')
  })

  it('does not generate handoff URLs for unmatched product ids', () => {
    expect(resolveOwnerManagedProfileHandoff('999999999')).toBeNull()
    expect(resolveOwnerManagedProfileHandoff('/tours/1232729')).toBeNull()
    expect(resolveOwnerManagedProfileHandoff('')).toBeNull()
  })
})
