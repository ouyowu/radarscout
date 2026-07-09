import { describe, expect, it } from 'vitest'

import { validatePartnerProductRecord } from './partnerProduct'

const validRecord = {
  id: 'partner_cm_elephant_1',
  slug: 'chiang-mai-gentle-elephant-care',
  destination: 'Chiang Mai',
  title: 'Chiang Mai Gentle Elephant Care',
  shortSummary: 'A reviewed Thailand elephant care experience with a safe partner handoff.',
  tags: ['Elephants', 'Nature', 'Family'],
  partnerName: 'Reviewed Chiang Mai Operator',
  bookingWidgetUrl: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
  imageUrl: 'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
  imageAlt: 'Chiang Mai elephant care experience',
  sourceImageUrls: [
    'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    'https://imgcdn.bokun.tools/example-detail.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
  ],
  reviewedBy: 'RadarScout Ops',
  reviewedAt: '2026-07-07T10:00:00.000Z',
}

describe('validatePartnerProductRecord', () => {
  it('accepts a reviewed Thailand partner product without commerce internals', () => {
    const result = validatePartnerProductRecord(validRecord)

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data).toMatchObject({
      id: 'partner_cm_elephant_1',
      slug: 'chiang-mai-gentle-elephant-care',
      destination: 'Chiang Mai',
      title: 'Chiang Mai Gentle Elephant Care',
      shortSummary: 'A reviewed Thailand elephant care experience with a safe partner handoff.',
      tags: ['Elephants', 'Nature', 'Family'],
      partnerName: 'Reviewed Chiang Mai Operator',
      bookingWidgetUrl: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      imageUrl: 'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      imageAlt: 'Chiang Mai elephant care experience',
      sourceImageUrls: [
        'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
        'https://imgcdn.bokun.tools/example-detail.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      ],
      reviewedBy: 'RadarScout Ops',
    })
    expect(result.data.reviewedAt).toBeInstanceOf(Date)
    expect(JSON.stringify(result.data)).not.toContain('rawJson')
    expect(JSON.stringify(result.data)).not.toContain('availability')
    expect(JSON.stringify(result.data)).not.toContain('rating')
  })

  it('trims strings and deduplicates tags without adding unsupported fields', () => {
    const result = validatePartnerProductRecord({
      ...validRecord,
      id: '  partner_cm_elephant_1  ',
      title: '  Chiang Mai   Gentle Elephant Care  ',
      tags: ['Elephants', ' elephants ', 'Nature'],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data.id).toBe('partner_cm_elephant_1')
    expect(result.data.title).toBe('Chiang Mai Gentle Elephant Care')
    expect(result.data.tags).toEqual(['Elephants', 'Nature'])
  })

  it('rejects non-object input', () => {
    expect(validatePartnerProductRecord(null)).toEqual({ ok: false, error: 'not_object' })
    expect(validatePartnerProductRecord([])).toEqual({ ok: false, error: 'not_object' })
  })

  it('rejects unknown fields', () => {
    expect(
      validatePartnerProductRecord({
        ...validRecord,
        marketingBlurb: 'unsupported',
      }),
    ).toEqual({ ok: false, error: 'unknown_fields', fields: ['marketingBlurb'] })
  })

  it('rejects forbidden product, price, availability, and booking internals', () => {
    const result = validatePartnerProductRecord({
      ...validRecord,
      rawJson: {},
      price: '49.00',
      availability: 'available now',
      rating: 5,
      reviewCount: 120,
      bookingStatus: 'instant confirmation',
      checkout: true,
      payment: 'card',
    })

    expect(result).toEqual({
      ok: false,
      error: 'forbidden_fields',
      fields: [
        'availability',
        'bookingStatus',
        'checkout',
        'payment',
        'price',
        'rating',
        'rawJson',
        'reviewCount',
      ],
    })
  })

  it('rejects non-Thailand destinations', () => {
    expect(
      validatePartnerProductRecord({
        ...validRecord,
        destination: 'Singapore',
        title: 'Singapore City Food Walk',
        shortSummary: 'A city food route outside Thailand.',
      }),
    ).toEqual({ ok: false, error: 'non_thailand_destination' })
  })

  it('rejects unclear destinations without Thailand signals', () => {
    expect(
      validatePartnerProductRecord({
        ...validRecord,
        destination: 'Island route',
        title: 'Gentle island experience',
        shortSummary: 'A reviewed experience without a clear Thailand destination.',
      }),
    ).toEqual({ ok: false, error: 'non_thailand_destination' })
  })

  it('rejects unsafe booking widget URLs', () => {
    const unsafeUrls = [
      '/tours/1232729',
      'http://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      'https://localhost/booking',
      'https://api.bokun.io/admin/experience/1232729',
      'https://widgets.bokun.io/online-sales/public-channel/experience/1232729?token=secret',
    ]

    for (const bookingWidgetUrl of unsafeUrls) {
      expect(
        validatePartnerProductRecord({
          ...validRecord,
          bookingWidgetUrl,
        }),
      ).toEqual({ ok: false, error: 'invalid_booking_widget_url' })
    }
  })

  it('rejects unsafe public image URLs', () => {
    const unsafeImageUrls = [
      'http://imgcdn.bokun.tools/example.jpeg',
      'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      'https://api.bokun.io/admin/image/example.jpeg',
      'https://example.com/example.jpeg',
      'not-a-url',
    ]

    for (const imageUrl of unsafeImageUrls) {
      expect(
        validatePartnerProductRecord({
          ...validRecord,
          imageUrl,
        }),
      ).toEqual({ ok: false, error: 'invalid_image_url' })
    }
  })

  it('rejects invalid slugs, tags, reviewer, and reviewedAt values', () => {
    expect(validatePartnerProductRecord({ ...validRecord, slug: 'Bad Slug' }))
      .toEqual({ ok: false, error: 'invalid_slug' })
    expect(validatePartnerProductRecord({ ...validRecord, tags: ['Nature', 123] }))
      .toEqual({ ok: false, error: 'invalid_tags' })
    expect(validatePartnerProductRecord({ ...validRecord, reviewedBy: '' }))
      .toEqual({ ok: false, error: 'invalid_reviewer' })
    expect(validatePartnerProductRecord({ ...validRecord, reviewedAt: 'not-a-date' }))
      .toEqual({ ok: false, error: 'invalid_reviewed_at' })
  })
})
