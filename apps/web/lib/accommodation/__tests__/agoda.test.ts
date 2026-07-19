import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  isAgodaAccommodationConfigured,
  searchAgodaHotels,
} from '../agoda'

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
  vi.restoreAllMocks()
})

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

const config = {
  siteId: '1234567',
  contentToken: 'test-content-token',
  searchApiKey: 'test-search-key',
  affiliateCid: 'test-cid',
  contentBaseUrl: 'https://content.example.test',
  searchApiUrl: 'https://search.example.test/availability',
  cityIds: { Bangkok: '9395' },
} as const

describe('Agoda accommodation provider', () => {
  it('stays disabled until every server-only setting is present', () => {
    delete process.env.AGODA_API_SITE_ID
    delete process.env.AGODA_CONTENT_API_TOKEN
    delete process.env.AGODA_SEARCH_API_KEY
    delete process.env.AGODA_AFFILIATE_CID
    delete process.env.AGODA_CONTENT_BASE_URL
    delete process.env.AGODA_SEARCH_API_URL
    delete process.env.AGODA_CONTENT_CITY_IDS

    expect(isAgodaAccommodationConfigured()).toBe(false)

    process.env.AGODA_API_SITE_ID = config.siteId
    process.env.AGODA_CONTENT_API_TOKEN = config.contentToken
    process.env.AGODA_SEARCH_API_KEY = config.searchApiKey
    process.env.AGODA_AFFILIATE_CID = config.affiliateCid
    process.env.AGODA_CONTENT_BASE_URL = config.contentBaseUrl
    process.env.AGODA_SEARCH_API_URL = config.searchApiUrl
    process.env.AGODA_CONTENT_CITY_IDS = JSON.stringify(config.cityIds)

    expect(isAgodaAccommodationConfigured()).toBe(true)
  })

  it('maps reviewed-safe content and live prices without exposing raw room data', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        hotelInformationFeed: {
          hotelInformations: {
            hotelInformation: [
              {
                hotelId: 123456,
                hotelName: 'Bangkok Riverside Test Hotel',
                starRating: 4.5,
                longitude: 100.5102,
                latitude: 13.7308,
                popularityScore: 900,
                numberOfReviews: 420,
                ratingAverage: 8.8,
              },
              {
                hotelId: 999999,
                hotelName: 'Invalid Coordinate Hotel',
                starRating: 5,
                longitude: 0,
                latitude: 0,
                popularityScore: 9999,
              },
            ],
          },
        },
      }))
      .mockResolvedValueOnce(jsonResponse({
        pictureFeed: {
          pictures: {
            picture: [
              {
                hotelId: 123456,
                URL: 'https://pix8.agoda.net/hotelImages/123456/main.jpg',
                pictureGroup: 'HOTEL',
              },
            ],
          },
        },
      }))
      .mockResolvedValueOnce(jsonResponse({
        properties: [
          {
            propertyId: 123456,
            rooms: [
              {
                blockId: 'must-never-leak',
                landingUrl: 'https://www.agoda.com/en-gb/test-hotel.html?cid=test-cid',
                totalPayment: { inclusive: 4500 },
                perRoomPerNightRate: { inclusive: 1500, currency: 'THB' },
              },
            ],
          },
        ],
      }))

    const result = await searchAgodaHotels({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-13',
      adults: 2,
      children: 0,
    }, { config, fetchImpl })

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      provider: 'agoda',
      hotelId: '123456',
      name: 'Bangkok Riverside Test Hotel',
      city: 'Bangkok',
      starRating: 4.5,
      reviewScore: 8.8,
      reviewCount: 420,
      latitude: 13.7308,
      longitude: 100.5102,
      imageUrl: 'https://pix8.agoda.net/hotelImages/123456/main.jpg',
      price: {
        currency: 'THB',
        total: 4500,
        perNight: 1500,
        nights: 3,
      },
      handoffUrl: 'https://www.agoda.com/en-gb/test-hotel.html?cid=test-cid',
      handoffRel: 'nofollow sponsored noopener noreferrer',
    })
    expect(result[0].handoffUrl).toContain('cid=test-cid')
    expect(result[0].handoffUrl).toContain('/test-hotel.html')
    expect(JSON.stringify(result)).not.toContain('blockId')
    expect(JSON.stringify(result)).not.toContain('must-never-leak')
    expect(JSON.stringify(result)).not.toContain('test-content-token')
    expect(JSON.stringify(result)).not.toContain('test-search-key')

    const contentUrl = String(fetchImpl.mock.calls[0]?.[0])
    expect(contentUrl).toContain('feed_id=5')
    expect(contentUrl).toContain('mcity_id=9395')

    const searchInit = fetchImpl.mock.calls[2]?.[1]
    expect(searchInit?.headers).toMatchObject({
      Authorization: '1234567:test-search-key',
      'Content-Type': 'application/json',
    })
    expect(JSON.parse(String(searchInit?.body))).toMatchObject({
      criteria: {
        propertyIds: [123456],
        checkIn: '2026-08-10',
        checkOut: '2026-08-13',
        adults: 2,
        children: 0,
      },
      features: { ratesPerProperty: 1, extra: ['content', 'metaSearch'] },
    })
  })

  it('omits a price instead of representing unavailable inventory as zero', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({
        hotelInformationFeed: {
          hotelInformations: {
            hotelInformation: [{
              hotelId: 123456,
              hotelName: 'No Quote Hotel',
              longitude: 100.5102,
              latitude: 13.7308,
            }],
          },
        },
      }))
      .mockResolvedValueOnce(jsonResponse({ pictureFeed: { pictures: { picture: [] } } }))
      .mockResolvedValueOnce(jsonResponse({
        properties: [{
          propertyId: 123456,
          rooms: [{
            landingUrl: 'https://example.com/not-an-agoda-handoff',
            totalPayment: { inclusive: 0 },
            perRoomPerNightRate: { inclusive: 0, currency: 'THB' },
          }],
        }],
      }))

    const result = await searchAgodaHotels({
      city: 'Bangkok',
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }, { config, fetchImpl })

    expect(result).toHaveLength(1)
    expect(result[0]).not.toHaveProperty('price')
    expect(result[0].handoffUrl).toMatch(/^https:\/\/www\.agoda\.com\/partners\/partnersearch\.aspx\?/)
    expect(JSON.stringify(result)).not.toMatch(/"total":0|"perNight":0/)
  })

  it('rejects unsupported cities before making a request', async () => {
    const fetchImpl = vi.fn<typeof fetch>()

    await expect(searchAgodaHotels({
      city: 'Tokyo' as never,
      checkIn: '2026-08-10',
      checkOut: '2026-08-12',
      adults: 2,
      children: 0,
    }, { config, fetchImpl })).rejects.toThrow('unsupported_city')

    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
