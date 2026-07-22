import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { searchTiqetsProducts } from '../tiqetsClient'

const sampleProduct = {
  id: '123456',
  title: 'Bangkok Grand Palace Entry Ticket',
  city_name: 'Bangkok',
  country_name: 'Thailand',
  tagline: 'Explore a landmark in central Bangkok.',
  product_url: 'https://www.tiqets.com/en/bangkok-attractions-c123/tickets-p123456?partner=radarscout',
  images: [
    {
      large: 'https://aws-tiqets-cdn.imgix.net/images/content/example.jpg?w=500',
      alt_text: 'Temple buildings in Bangkok',
      credit: 'Photo by Tiqets',
    },
  ],
  geolocation: { lat: 13.7500, lng: 100.4913 },
  price: 850,
  currency: 'THB',
  ratings: { average: 4.7, total: 321 },
  sale_status: 'available',
  supplier: { name: 'Do not expose' },
  distributor_commission_excl_vat: 123,
  raw: { private: true },
}

describe('searchTiqetsProducts', () => {
  it('fails closed without an API token and does not call Tiqets', async () => {
    const fetchFn = vi.fn()

    await expect(searchTiqetsProducts(
      { countryName: 'Thailand' },
      { apiToken: undefined, fetchFn },
    )).resolves.toEqual({ ok: false, reason: 'not_configured' })

    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('queries the fixed production endpoint and reduces the response to reviewed-candidate fields', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      pagination: { total: 1, page: 1, page_size: 20 },
      products: [sampleProduct],
    }), { status: 200 }))

    await expect(searchTiqetsProducts(
      { countryName: 'Thailand', pageSize: 20 },
      { apiToken: 'production-test-token', fetchFn },
    )).resolves.toEqual({
      ok: true,
      page: 1,
      pageSize: 20,
      total: 1,
      products: [
        {
          id: '123456',
          title: 'Bangkok Grand Palace Entry Ticket',
          cityName: 'Bangkok',
          countryName: 'Thailand',
          tagline: 'Explore a landmark in central Bangkok.',
          productUrl: 'https://www.tiqets.com/en/bangkok-attractions-c123/tickets-p123456?partner=radarscout',
          image: {
            url: 'https://aws-tiqets-cdn.imgix.net/images/content/example.jpg?w=500',
            altText: 'Temple buildings in Bangkok',
            credit: 'Photo by Tiqets',
          },
          coordinates: { latitude: 13.75, longitude: 100.4913 },
          fromPrice: 850,
          currency: 'THB',
          rating: { average: 4.7, total: 321 },
          saleStatus: 'available',
        },
      ],
    })

    expect(fetchFn).toHaveBeenCalledTimes(1)
    const [requestUrl, init] = fetchFn.mock.calls[0]
    const url = new URL(requestUrl)

    expect(url.origin).toBe('https://api.tiqets.com')
    expect(url.pathname).toBe('/v2/products')
    expect(url.searchParams.get('country_name')).toBe('Thailand')
    expect(url.searchParams.get('currency')).toBe('THB')
    expect(url.searchParams.get('lang')).toBe('en')
    expect(url.searchParams.get('page')).toBe('1')
    expect(url.searchParams.get('page_size')).toBe('20')
    expect(url.searchParams.get('sort')).toBe('popularity desc')
    expect(url.searchParams.get('exclude_packages')).toBe('true')
    expect(init).toEqual(expect.objectContaining({
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Token production-test-token',
        'User-Agent': 'RadarScout',
      },
    }))
  })

  it('rejects invalid input before making a network request', async () => {
    const fetchFn = vi.fn()

    await expect(searchTiqetsProducts(
      { countryName: 'Thailand', pageSize: 101 },
      { apiToken: 'production-test-token', fetchFn },
    )).resolves.toEqual({ ok: false, reason: 'invalid_request' })

    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('excludes products without a tracked Tiqets product URL', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      products: [{ ...sampleProduct, product_url: 'https://example.test/tickets' }],
    }), { status: 200 }))

    await expect(searchTiqetsProducts(
      { countryName: 'Thailand' },
      { apiToken: 'production-test-token', fetchFn },
    )).resolves.toMatchObject({ ok: true, products: [] })
  })

  it('returns an opaque upstream error without exposing the upstream body', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: 'partner details must remain private',
    }), { status: 401 }))

    await expect(searchTiqetsProducts(
      { countryName: 'Thailand' },
      { apiToken: 'production-test-token', fetchFn },
    )).resolves.toEqual({ ok: false, reason: 'upstream_error', status: 401 })
  })
})
