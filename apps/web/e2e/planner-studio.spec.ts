import { expect, test } from '@playwright/test'
import type { AiTripSearchResponse } from '../app/api/ai-trip/search/route'

type PublicSearchIntent = NonNullable<AiTripSearchResponse['intent']>

function makeSearchIntent(overrides: Partial<PublicSearchIntent> = {}): PublicSearchIntent {
  return {
    destination: 'Chiang Mai',
    days: 3,
    startDate: null,
    endDate: null,
    groupSize: null,
    travelerType: 'unspecified',
    interests: ['elephants', 'food', 'temples'],
    ...overrides,
  }
}

const REVIEWED_ROUTE_RESPONSE: AiTripSearchResponse = {
  status: 'ok',
  intent: makeSearchIntent(),
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
          decisionSignals: {
            whyRecommended: 'This reviewed Chiang Mai experience matches your interest in food.',
            bestFor: ['Families comparing this route', 'A relaxed itinerary'],
            watchOut: 'Review duration and meeting details on Viator before choosing.',
          },
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
      decisionSignals: {
        whyRecommended: 'This reviewed Chiang Mai experience matches your interest in food.',
        bestFor: ['Families comparing this route', 'A relaxed itinerary'],
        watchOut: 'Review duration and meeting details on Viator before choosing.',
      },
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
  await expect(page.getByText('Curated from reviewed Viator experiences')).toBeVisible()
  await expect(page.getByRole('heading', {
    name: 'Build your Thailand day-trip route',
  })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Planner progress' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Thailand eSIM plans' })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.getByRole('button', { name: 'Chiang Mai 3 days elephants food temples' }).click()

  await expect(page.getByRole('heading', { name: 'Chiang Mai · 3 days' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your trip brief' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chiang Mai day-tour route' })).toBeVisible()
  await expect(page.getByText('Why recommended').first()).toBeVisible()
  await expect(page.getByText('Best for').first()).toBeVisible()
  await expect(page.getByText('Watch out').first()).toBeVisible()
  await expect(page.getByText(/matches your interest in food/i).first()).toBeVisible()
  await expect(page.getByText('Families comparing this route').first()).toBeVisible()
  await expect(page.getByText(/review duration and meeting details on Viator/i).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Day 1' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Day 2' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Day 3' })).toBeVisible()
  await expect(page.getByLabel('Chiang Mai day 1 street map')).toBeVisible()
  await expect(page.getByText(/reviewed regional orientation for the selected experience/i)).toBeVisible()
  await expect(page.getByText(/not its exact route, pickup or meeting point/i)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Balanced' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Chill' }).click()
  await expect(page.getByRole('button', { name: 'Chill' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Food', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Food', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('1 shown · filters stay on this page')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Review product details' }).first()).toHaveAttribute(
    'href',
    '/tours/prod_cm_1?source=ai-trip-planner',
  )
  await expect(page.getByRole('heading', {
    name: 'Compare more Chiang Mai activities on GetYourGuide',
  })).toBeVisible()
  const cityActivityLink = page.getByRole('link', { name: 'Compare city activities' })
  await expect(cityActivityLink).toHaveAttribute(
    'href',
    'https://www.getyourguide.com/chiang-mai-l271/?partner_id=IMR8EUB&cmp=radarscout_city_guide_chiang_mai',
  )
  await expect(cityActivityLink).toHaveAttribute('rel', 'nofollow sponsored noopener noreferrer')
  await expect(page.getByRole('link', { name: 'Check availability' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Stay connected in Thailand' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Thailand eSIM plans' })).toHaveAttribute(
    'href',
    'https://yesim.app/country/thailand/?partner_id=5044&sid=597',
  )
  await expect(page.getByRole('link', { name: 'View Thailand eSIM plans' })).toHaveAttribute(
    'rel',
    'nofollow sponsored noopener noreferrer',
  )

  await page.getByRole('button', { name: 'Day 3' }).click()
  await expect(page.getByRole('heading', { name: 'Keep this day flexible' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Day 3' })).toHaveAttribute('aria-pressed', 'true')
  expect(searchRequests).toBe(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('guided studio remembers confirmed dates, group size, and traveler type', async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null
  await page.route('/api/ai-trip/search', async route => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...REVIEWED_ROUTE_RESPONSE,
        intent: makeSearchIntent({
          startDate: '2026-12-10',
          endDate: '2026-12-13',
          groupSize: 4,
          travelerType: 'family',
        }),
        tripSpec: {
          ...REVIEWED_ROUTE_RESPONSE.tripSpec!,
          groupSize: 4,
          travelerType: 'family',
        },
        itinerary: {
          ...REVIEWED_ROUTE_RESPONSE.itinerary!,
          tripSpec: {
            ...REVIEWED_ROUTE_RESPONSE.itinerary!.tripSpec,
            groupSize: 4,
            travelerType: 'family',
          },
        },
      }),
    })
  })

  await page.goto('/planner')
  await page.locator('#planner-start-date').fill('2026-12-10')
  await page.locator('#planner-group-size').selectOption('4')
  await page.locator('#planner-traveler-type').selectOption('family')
  await page.getByRole('button', { name: 'Chiang Mai 3 days elephants food temples' }).click()

  await expect(page.getByText('Ends Dec 13, 2026')).toBeVisible()
  await expect(page.getByLabel('Remembered trip details')).toContainText('Dec 10, 2026–Dec 13, 2026')
  await expect(page.getByLabel('Remembered trip details')).toContainText('4 travelers')
  await expect(page.getByLabel('Remembered trip details')).toContainText('Family')
  expect(requestBody).toMatchObject({
    prompt: 'Chiang Mai 3 days elephants food temples',
    tripContext: {
      startDate: '2026-12-10',
      groupSize: 4,
      travelerType: 'family',
    },
  })
})

test('guided studio shows a local route overview without calling paid narration', async ({ page }) => {
  let narrationRequests = 0
  await page.route('/api/ai-trip/search', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(REVIEWED_ROUTE_RESPONSE),
    })
  })
  await page.route('/api/ai-trip/narrate', async route => {
    narrationRequests += 1
    await route.abort()
  })

  await page.goto('/planner')
  await page.getByRole('button', { name: 'Chiang Mai 3 days elephants food temples' }).click()

  await expect(page.getByText('Route overview · built locally')).toBeVisible()
  await expect(page.getByText(/currently includes 1 reviewed day-tour match/i)).toBeVisible()
  await expect(page.getByText(/2 days remain unfilled because RadarScout only uses reviewed matches/i)).toBeVisible()
  await expect(page.getByText('Route story · AI-generated text')).toHaveCount(0)
  expect(narrationRequests).toBe(0)
})

test('guided studio accepts duration before destination without repeating the destination question', async ({ page }) => {
  await page.goto('/planner')

  const input = page.getByRole('textbox', { name: 'Trip idea message' })
  await input.fill('3 days')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/Where in Thailand are you thinking/)).toBeVisible()

  await input.fill('Bangkok')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByText(/Anything you want the days to focus on/)).toBeVisible()
  await expect(page.getByText(/Where in Thailand are you thinking/)).toHaveCount(1)
})

test('guided studio treats free-form interest text as an answer instead of asking again', async ({ page }) => {
  let searchRequests = 0
  await page.route('/api/ai-trip/search', async route => {
    searchRequests += 1
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(REVIEWED_ROUTE_RESPONSE),
    })
  })

  await page.goto('/planner')

  const input = page.getByRole('textbox', { name: 'Trip idea message' })
  await input.fill('Chiang Mai 3 days')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/Anything you want the days to focus on/)).toBeVisible()

  await input.fill('somewhere quiet')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByRole('heading', { name: 'Chiang Mai · 3 days' })).toBeVisible()
  await expect(page.getByText(/Anything you want the days to focus on/)).toHaveCount(1)
  expect(searchRequests).toBe(1)
})

test('guided studio replaces a completed Bangkok plan with a corrected Chiang Mai plan', async ({ page }) => {
  const searchPrompts: string[] = []
  const bangkokResponse: AiTripSearchResponse = {
    ...REVIEWED_ROUTE_RESPONSE,
    intent: makeSearchIntent({ destination: 'Bangkok', days: 2, interests: ['food'] }),
    tripSpec: {
      ...REVIEWED_ROUTE_RESPONSE.tripSpec!,
      destination: 'Bangkok',
      durationDays: 2,
      interests: ['food'],
    },
    itinerary: {
      ...REVIEWED_ROUTE_RESPONSE.itinerary!,
      tripSpec: {
        ...REVIEWED_ROUTE_RESPONSE.itinerary!.tripSpec,
        destination: 'Bangkok',
        durationDays: 2,
        interests: ['food'],
      },
      days: REVIEWED_ROUTE_RESPONSE.itinerary!.days.map(day => ({
        ...day,
        experience: { ...day.experience, city: 'Bangkok', title: 'Reviewed Bangkok Day' },
      })),
      unfilledDayCount: 1,
    },
    products: REVIEWED_ROUTE_RESPONSE.products.map(product => ({
      ...product,
      city: 'Bangkok',
      title: 'Reviewed Bangkok Day',
    })),
  }

  await page.route('/api/ai-trip/search', async route => {
    const request = route.request().postDataJSON() as { prompt: string }
    searchPrompts.push(request.prompt)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(request.prompt.includes('Bangkok') ? bangkokResponse : REVIEWED_ROUTE_RESPONSE),
    })
  })

  await page.goto('/planner')
  await page.getByRole('button', { name: 'Bangkok 2 days canals and street food' }).click()
  await expect(page.getByRole('heading', { name: 'Bangkok · 2 days' })).toBeVisible()

  const input = page.getByRole('textbox', { name: 'Trip idea message' })
  await input.fill('chaingmai 3 days')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByRole('heading', { name: 'Bangkok · 2 days' })).toHaveCount(0)
  await expect(page.getByText(/Anything you want the days to focus on/)).toBeVisible()

  await page.getByRole('button', { name: 'Nature', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Chiang Mai · 3 days' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chiang Mai day-tour route' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reviewed Chiang Mai Day' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reviewed Bangkok Day' })).toHaveCount(0)
  expect(searchPrompts).toEqual([
    'Bangkok 2 days canals and street food',
    'chaingmai 3 days, Nature',
  ])
})

test('guided studio keeps the live map inside a bounded desktop workspace', async ({ page }) => {
  const bangkokResponse: AiTripSearchResponse = {
    ...REVIEWED_ROUTE_RESPONSE,
    intent: makeSearchIntent({
      destination: 'Bangkok',
      days: 2,
      interests: REVIEWED_ROUTE_RESPONSE.intent?.interests ?? [],
    }),
    tripSpec: {
      ...REVIEWED_ROUTE_RESPONSE.tripSpec!,
      destination: 'Bangkok',
      durationDays: 2,
    },
    itinerary: {
      ...REVIEWED_ROUTE_RESPONSE.itinerary!,
      tripSpec: {
        ...REVIEWED_ROUTE_RESPONSE.itinerary!.tripSpec,
        destination: 'Bangkok',
        durationDays: 2,
      },
      days: REVIEWED_ROUTE_RESPONSE.itinerary!.days.map(day => ({
        ...day,
        experience: { ...day.experience, city: 'Bangkok' },
      })),
      unfilledDayCount: 1,
    },
  }

  await page.route('/api/ai-trip/search', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(bangkokResponse),
    })
  })

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/planner')
  await page.getByRole('button', { name: 'Bangkok 2 days canals and street food' }).click()

  const map = page.getByLabel('Bangkok day 1 street map')
  await expect(map).toBeVisible()
  const box = await map.boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(500)
  expect(box?.height).toBeLessThanOrEqual(760)
  expect(await page.evaluate(() => document.body.scrollHeight)).toBeLessThan(7000)
})
