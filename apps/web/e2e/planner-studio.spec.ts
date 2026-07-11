import { expect, test } from '@playwright/test'
import type { AiTripSearchResponse } from '../app/api/ai-trip/search/route'

const REVIEWED_ROUTE_RESPONSE: AiTripSearchResponse = {
  status: 'ok',
  intent: { destination: 'Chiang Mai', days: 3, interests: ['elephants', 'food', 'temples'] },
  tripSpec: {
    destination: 'Chiang Mai',
    durationDays: 3,
    interests: ['elephants', 'food', 'temples'],
    pace: 'unspecified',
    travelerType: 'unspecified',
    groupSize: null,
    contentScope: 'day_tours_only',
  },
  itinerary: {
    version: 1,
    tripSpec: {
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'food', 'temples'],
      pace: 'unspecified',
      travelerType: 'unspecified',
      groupSize: null,
      contentScope: 'day_tours_only',
    },
    days: [
      {
        dayNumber: 1,
        experience: {
          productId: 'prod_cm_1',
          title: 'Reviewed Chiang Mai Day',
          city: 'Chiang Mai',
          summary: 'A reviewed day-trip comparison.',
          imageUrl: null,
          imageAlt: null,
          tags: ['Elephants', 'Food'],
          detailHref: '/tours/prod_cm_1',
          handoff: {
            label: 'Check availability',
            href: 'https://widgets.bokun.io/online-sales/public-channel/experience/prod_cm_1',
            rel: 'nofollow sponsored noopener noreferrer',
          },
        },
      },
    ],
    unfilledDayCount: 2,
    safety: {
      availabilityChecked: false,
      bookingCompleted: false,
      paymentHandled: false,
    },
  },
  products: [
    {
      id: 'prod_cm_1',
      title: 'Reviewed Chiang Mai Day',
      city: 'Chiang Mai',
      summary: 'A reviewed day-trip comparison.',
      tags: ['Elephants', 'Food'],
      detailHref: '/tours/prod_cm_1',
      retailPrice: null,
      currency: null,
    },
  ],
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: true,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

test('guided studio builds a mobile-safe reviewed route without bypassing product details', async ({ page }) => {
  let searchRequests = 0
  await page.route('/api/ai-trip/search', async route => {
    searchRequests += 1
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(REVIEWED_ROUTE_RESPONSE),
    })
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/planner')

  await expect(page).toHaveTitle('Thailand Planner Studio | RadarScout')
  await expect(page.getByRole('heading', {
    name: 'Talk through a Thailand trip, get a reviewed route.',
  })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.getByRole('button', { name: 'Chiang Mai 3 days elephants food temples' }).click()

  await expect(page.getByRole('heading', { name: 'Chiang Mai · 3 days' })).toBeVisible()
  await expect(page.getByRole('img', { name: /schematic map of thailand/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open Chiang Mai area map' })).toHaveAttribute(
    'href',
    'https://www.openstreetmap.org/search?query=Chiang%20Mai%2C%20Thailand',
  )
  await expect(page.getByRole('link', { name: 'Review product details' })).toHaveAttribute(
    'href',
    '/tours/prod_cm_1?source=ai-trip-planner',
  )
  await expect(page.getByRole('link', { name: 'Check availability' })).toHaveCount(0)
  expect(searchRequests).toBe(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
