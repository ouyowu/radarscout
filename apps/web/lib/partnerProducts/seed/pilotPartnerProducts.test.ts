import { describe, expect, it } from 'vitest'

import { validatePartnerProductRecord } from '../partnerProduct'
import {
  loadPilotPartnerProducts,
  pilotPartnerProducts,
  pilotPartnerProductSeedRecords,
} from './pilotPartnerProducts'

const FORBIDDEN_SEED_FIELDS = [
  'rawJson',
  'price',
  'retailPrice',
  'availability',
  'availabilityEnabled',
  'supplier',
  'supplierName',
  'rating',
  'reviewCount',
  'bookingUrl',
  'bookingStatus',
  'openingHours',
  'checkout',
  'payment',
  'cart',
  'inventory',
  'confirmation',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
]

describe('pilot partner product seed', () => {
  it('keeps the first pilot intentionally small', () => {
    expect(pilotPartnerProductSeedRecords.length).toBeGreaterThanOrEqual(3)
    expect(pilotPartnerProductSeedRecords.length).toBeLessThanOrEqual(10)
  })

  it('validates every raw seed record through the partner product validator', () => {
    for (const record of pilotPartnerProductSeedRecords) {
      expect(validatePartnerProductRecord(record)).toMatchObject({ ok: true })
    }
  })

  it('loads validated partner products with parsed review dates', () => {
    const products = loadPilotPartnerProducts()

    expect(products).toHaveLength(pilotPartnerProductSeedRecords.length)
    expect(products[0].reviewedAt).toBeInstanceOf(Date)
  })

  it('contains only reviewed Thailand products with public Bókun widget handoff URLs', () => {
    for (const product of pilotPartnerProducts) {
      const url = new URL(product.bookingWidgetUrl)

      expect(product.destination).toContain('Chiang Mai')
      expect(url.protocol).toBe('https:')
      expect(url.hostname).toBe('widgets.bokun.io')
      expect(url.pathname).toMatch(
        /^\/online-sales\/3f335ed3-148b-4690-b13f-c76a637227db\/experience\/\d+$/,
      )
      expect([...url.searchParams.keys()]).toEqual([])
    }
  })

  it('includes display-safe public Bókun image CDN URLs for every pilot product', () => {
    for (const product of pilotPartnerProducts) {
      expect(product.imageUrl).toMatch(/^https:\/\/imgcdn\.bokun\.tools\//)
      expect(product.imageAlt).toBeTruthy()
      expect(product.sourceImageUrls?.length).toBeGreaterThanOrEqual(1)

      for (const imageUrl of product.sourceImageUrls ?? []) {
        const url = new URL(imageUrl)
        expect(url.protocol).toBe('https:')
        expect(url.hostname).toBe('imgcdn.bokun.tools')
      }
    }
  })

  it('does not include forbidden booking, price, inventory, rating, or raw upstream fields', () => {
    for (const record of pilotPartnerProductSeedRecords) {
      for (const field of FORBIDDEN_SEED_FIELDS) {
        expect(record).not.toHaveProperty(field)
      }
    }
  })

  it('fails closed if a seed record becomes invalid', () => {
    expect(() =>
      loadPilotPartnerProducts([
        {
          ...pilotPartnerProductSeedRecords[0],
          bookingWidgetUrl: 'http://widgets.bokun.io/online-sales/example/experience/1232729',
        },
      ]),
    ).toThrow('Invalid partner product seed partner_cm_1232729: invalid_booking_widget_url')
  })
})
