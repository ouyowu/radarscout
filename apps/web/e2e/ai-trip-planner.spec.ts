import { test, expect } from '@playwright/test'
import type { AiTripSearchResponse } from '../app/api/ai-trip/search/route'

// ── Shared mock responses ─────────────────────────────────────────────────────

const OK_RESPONSE: AiTripSearchResponse = {
  status: 'ok',
  intent: { destination: 'Chiang Mai', days: 3, interests: ['elephants', 'temples', 'food'] },
  tripSpec: {
    destination: 'Chiang Mai',
    durationDays: 3,
    interests: ['elephants', 'temples', 'food'],
    pace: 'moderate',
    travelerType: 'couple',
    groupSize: 2,
    contentScope: 'day_tours_only',
  },
  itinerary: {
    version: 1,
    tripSpec: {
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'temples', 'food'],
      pace: 'moderate',
      travelerType: 'couple',
      groupSize: 2,
      contentScope: 'day_tours_only',
    },
    days: [
      {
        dayNumber: 1,
        experience: {
          productId: 'prod_cm_1',
          title: 'Chiang Mai Elephant Sanctuary',
          city: 'Chiang Mai',
          summary: 'A half-day ethical elephant experience in Mae Rim.',
          imageUrl: null,
          imageAlt: null,
          tags: ['Elephants', 'Nature'],
          detailHref: '/tours/prod_cm_1',
          handoff: {
            label: 'Check availability',
            href: 'https://widgets.bokun.io/online-sales/public-channel/experience/prod_cm_1',
            rel: 'nofollow sponsored noopener noreferrer',
          },
        },
      },
      {
        dayNumber: 2,
        experience: {
          productId: 'prod_cm_2',
          title: 'Old City Temple Walk',
          city: 'Chiang Mai',
          summary: 'A guided walk through historic temples of the old city.',
          imageUrl: null,
          imageAlt: null,
          tags: ['Temples', 'Culture'],
          detailHref: '/tours/prod_cm_2',
          handoff: {
            label: 'Check availability',
            href: 'https://widgets.bokun.io/online-sales/public-channel/experience/prod_cm_2',
            rel: 'nofollow sponsored noopener noreferrer',
          },
        },
      },
    ],
    unfilledDayCount: 1,
    safety: {
      availabilityChecked: false,
      bookingCompleted: false,
      paymentHandled: false,
    },
  },
  products: [
    {
      id: 'prod_cm_1',
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A half-day ethical elephant experience in Mae Rim.',
      tags: ['Elephants', 'Nature'],
      detailHref: '/tours/prod_cm_1',
      retailPrice: '49.00',
      currency: 'USD',
    },
    {
      id: 'prod_cm_2',
      title: 'Old City Temple Walk',
      city: 'Chiang Mai',
      summary: 'A guided walk through historic temples of the old city.',
      tags: ['Temples', 'Culture'],
      detailHref: '/tours/prod_cm_2',
      retailPrice: '29.00',
      currency: 'USD',
    },
    {
      id: 'prod_cm_3',
      title: 'Night Bazaar Food Tour',
      city: 'Chiang Mai',
      summary: 'Street food sampling at the Chiang Mai Night Bazaar.',
      tags: ['Food', 'Local'],
      detailHref: '/tours/prod_cm_3',
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

const COMPACT_CHIANG_MAI_RESPONSE: AiTripSearchResponse = {
  ...OK_RESPONSE,
  intent: { destination: 'Chiang Mai', days: null, interests: ['elephants'] },
  products: OK_RESPONSE.products.slice(0, 1),
}

const THAILAND_ROUTE_RESPONSE: AiTripSearchResponse = {
  ...OK_RESPONSE,
  intent: { destination: 'Thailand', days: 7, interests: ['food', 'temples', 'beaches'] },
  products: [
    {
      ...OK_RESPONSE.products[0],
      id: 'prod_bkk_1',
      title: 'Bangkok Temple and Local Food Walk',
      city: 'Bangkok',
      summary: 'Compare temples, markets, and local food for a Bangkok route start.',
      tags: ['Temples', 'Local food'],
      detailHref: '/tours/prod_bkk_1',
    },
    {
      ...OK_RESPONSE.products[1],
      id: 'prod_hkt_1',
      title: 'Phuket Beach and Island Day',
      city: 'Phuket',
      summary: 'A beach and island comparison option for a Thailand route.',
      tags: ['Beaches', 'Island'],
      detailHref: '/tours/prod_hkt_1',
    },
    {
      ...OK_RESPONSE.products[2],
      id: 'prod_cm_1',
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A gentle elephant care comparison option for the northern route stop.',
      tags: ['Elephants', 'Nature'],
      detailHref: '/tours/prod_cm_1',
    },
  ],
}

const UNSUPPORTED_DESTINATION_RESPONSE: AiTripSearchResponse = {
  status: 'unsupported_destination',
  intent: { destination: 'Singapore', days: 3, interests: ['food'] },
  products: [],
  message: 'RadarScout currently searches Thailand experiences only.',
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: true,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

const NO_MATCH_RESPONSE: AiTripSearchResponse = {
  status: 'no_match',
  intent: { destination: 'Pattaya', days: 2, interests: ['beach', 'food', 'elephants'] },
  products: [],
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: true,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

const MIXED_DESTINATION_RESPONSE: AiTripSearchResponse = {
  status: 'unsupported_destination',
  intent: { destination: 'Thailand and Singapore', days: 7, interests: [] },
  products: [],
  message: 'RadarScout currently searches Thailand experiences only.',
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: true,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Page = import('@playwright/test').Page

async function confirmChiangMaiIntent(page: Page) {
  await page.goto('/ai-trip-planner')
  await page.fill('#trip-idea', 'Chiang Mai 3 days elephants temples food')
  await page.click('button[type="submit"]')
  const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
  await expect(confirmBtn).toBeEnabled()
  await confirmBtn.click()
}

// Product cards are uniquely identified by the "View details" CTA link.
const productCards = (page: Page) => page.getByRole('link', { name: /view details/i })

// Planner safety status row — finds the div that has a DIRECT child span with the
// exact label text, then returns that div so we can check the value span.
const capabilityRow = (page: Page, label: string) =>
  page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Planner safety status' }) })
    .locator(`div:has(> span:text-is("${label}"))`)

// ── Valid Chiang Mai flow ─────────────────────────────────────────────────────

test.describe('Valid Chiang Mai flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })
  })

  test('page loads and shows trip idea textarea', async ({ page }) => {
    await page.goto('/ai-trip-planner')
    await expect(page.locator('#trip-idea')).toBeVisible()
  })

  test('URL idea parameter prefills the trip idea without searching automatically', async ({ page }) => {
    let searchRequestCount = 0

    await page.unroute('/api/ai-trip/search')
    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner?idea=Pattaya%202%20days%20beaches%20food%20elephant%20day%20trip%2C%20easy%20pace')

    await expect(page.locator('#trip-idea')).toHaveValue('Pattaya 2 days beaches food elephant day trip, easy pace')
    await expect(page.getByTestId('ai-trip-intent-summary')).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^Pattaya$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()
    await expect(productCards(page)).toHaveCount(0)
    expect(searchRequestCount).toBe(0)
  })

  test('AI planner results hash has a stable safe return target before search', async ({ page }) => {
    await page.goto('/ai-trip-planner#ai-trip-results')

    const resultsAnchor = page.locator('#ai-trip-results')

    await expect(resultsAnchor).toBeVisible()
    await expect(resultsAnchor).toContainText('Matching experiences appear here after you confirm a trip intent')
    await expect(resultsAnchor).not.toContainText(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)
  })

  test('trip idea input shows a 600 character limit and prevents overlong prompts', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    const tripIdea = page.locator('#trip-idea')
    await expect(tripIdea).toHaveAttribute('maxlength', '600')
    await expect(page.getByText(/characters used/i)).toBeVisible()

    await tripIdea.fill('Chiang Mai '.repeat(80))

    await expect(tripIdea).toHaveValue(/^[\s\S]{600}$/)
    await expect(page.getByText('600 / 600 characters used')).toBeVisible()
  })

  test('editing the trip idea requires parsing again before confirmation', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
    await expect(confirmBtn).toBeEnabled()

    await page.locator('#trip-idea').fill('Bangkok 3 days food canals relaxed pace')

    await expect(page.getByText('Trip idea changed. Parse trip intent again before confirming.')).toBeVisible()
    await expect(confirmBtn).toBeDisabled()

    await page.click('button[type="submit"]')

    await expect(page.getByText('Trip idea changed. Parse trip intent again before confirming.')).toHaveCount(0)
    await expect(confirmBtn).toBeEnabled()
  })

  test('empty trip idea disables parsing until the user enters text', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    await page.getByRole('button', { name: /clear trip idea/i }).click()

    const parseBtn = page.getByRole('button', { name: /parse trip intent/i })
    await expect(parseBtn).toBeDisabled()
    await expect(page.getByText('Add a trip idea before parsing.')).toBeVisible()

    await page.locator('#trip-idea').fill('Chiang Mai 2 days elephants food')

    await expect(parseBtn).toBeEnabled()
    await expect(page.getByText('Add a trip idea before parsing.')).toHaveCount(0)
  })

  test('parsing trims outer whitespace before confirmation and product search', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.locator('#trip-idea').fill('  Chiang Mai 3 days elephants temples food  ')
    await page.getByRole('button', { name: /parse trip intent/i }).click()

    await expect(page.locator('#trip-idea')).toHaveValue('Chiang Mai 3 days elephants temples food')

    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    expect(receivedPrompt).toBe('Chiang Mai 3 days elephants temples food')
    await expect(productCards(page)).toHaveCount(3)
  })

  test('destination starter fills the planner prompt and local summary', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    await page.getByRole('button', { name: /use bangkok route idea/i }).click()

    await expect(page.getByTestId('ai-trip-intent-summary')).toHaveClass(/gap-2/)
    await expect(page.getByTestId('ai-trip-intent-summary')).toHaveClass(/sm:gap-3/)
    await expect(page.locator('#trip-idea')).toHaveValue('Bangkok 3 days canals temples street food, relaxed pace')
    await expect(page.locator('dd').filter({ hasText: /^Bangkok$/ })).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^food, temples$/ })).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^local food$/ })).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^relaxed$/ })).toBeVisible()
  })

  test('Thailand route starter fills and searches a multi-city planner prompt safely', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.unroute('/api/ai-trip/search')
    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(THAILAND_ROUTE_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use thailand route idea/i }).click()

    await expect(page.locator('#trip-idea')).toHaveValue(
      'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace',
    )
    await expect(
      page.getByText('Thailand route idea loaded. Review the summary, then confirm trip intent to search real Thailand experiences.'),
    ).toBeVisible()

    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    expect(receivedPrompt).toBe('Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace')
    await expect(page.getByText('Suggested Thailand multi-city route outline')).toBeVisible()
    await expect(page.getByLabel(/suggested planning outline/i)).toHaveClass(/p-4/)
    await expect(page.getByLabel(/suggested planning outline/i).locator('article').first()).toHaveClass(/p-3/)
    await expect(page.getByText(/7-day Thailand route/i)).toBeVisible()
    await expect(page.getByText('Compare Chiang Mai, Phuket, or nearby Thailand stops')).toBeVisible()
    await expect(page.getByText('How these experiences support your Thailand route')).toBeVisible()
    await expect(page.getByText('Result cities: Bangkok, Chiang Mai, Phuket')).toBeVisible()
    await expect(page.getByLabel(/route stop overview/i)).toBeVisible()
    await expect(page.getByLabel(/route stop overview/i)).toHaveClass(/scroll-mt-6/)
    await expect(page.getByText(/choose a city chip to jump to that result group/i)).toBeVisible()
    await expect(page.getByText('Bangkok: 1 comparison match')).toBeVisible()
    await expect(page.getByText('Phuket: 1 comparison match')).toBeVisible()
    await expect(page.getByText('Chiang Mai: 1 comparison match')).toBeVisible()
    const routeStopLinks = page.getByLabel(/route stop overview/i).getByRole('link')
    await expect(routeStopLinks.nth(0)).toHaveText('Bangkok: 1 comparison match')
    await expect(routeStopLinks.nth(0)).toHaveClass(/max-w-full/)
    await expect(routeStopLinks.nth(0)).toHaveClass(/leading-5/)
    await expect(routeStopLinks.nth(1)).toHaveText('Chiang Mai: 1 comparison match')
    await expect(routeStopLinks.nth(2)).toHaveText('Phuket: 1 comparison match')
    await expect(page.getByRole('link', { name: 'Bangkok: 1 comparison match' })).toHaveAttribute(
      'href',
      '#ai-trip-result-group-bangkok',
    )
    await expect(page.getByRole('link', { name: 'Phuket: 1 comparison match' })).toHaveAttribute(
      'href',
      '#ai-trip-result-group-phuket',
    )
    await page.getByRole('link', { name: 'Phuket: 1 comparison match' }).click()
    await expect(page).toHaveURL(/#ai-trip-result-group-phuket$/)
    await expect(page.getByLabel(/Phuket result group/i)).toHaveClass(/scroll-mt-6/)
    await expect(page.getByLabel(/Phuket result group/i).getByRole('link', { name: /back to route overview from phuket results/i })).toHaveAttribute(
      'href',
      '#ai-trip-route-stop-overview',
    )
    await page.getByLabel(/Phuket result group/i).getByRole('link', { name: /back to route overview from phuket results/i }).click()
    await expect(page).toHaveURL(/#ai-trip-route-stop-overview$/)
    await expect(page.getByLabel(/Bangkok result group/i)).toContainText('Bangkok Temple and Local Food Walk')
    await expect(page.getByLabel(/Phuket result group/i)).toContainText('Phuket Beach and Island Day')
    await expect(page.getByLabel(/Chiang Mai result group/i)).toContainText('Chiang Mai Elephant Sanctuary')
    await expect(page.getByLabel(/Bangkok result group/i).getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/tours/prod_bkk_1?source=ai-trip-planner',
    )
    await expect(page.getByLabel(/Phuket result group/i).getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/tours/prod_hkt_1?source=ai-trip-planner',
    )
    await expect(page.getByLabel(/Chiang Mai result group/i).getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/tours/prod_cm_1?source=ai-trip-planner',
    )
    await expect(page.getByText(/possible route stops for the confirmed trip idea/i)).toBeVisible()
    await expect(page.getByText(/comparison-only route results/i)).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('mobile Thailand route results keep city groups visible without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await page.unroute('/api/ai-trip/search')
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(THAILAND_ROUTE_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use thailand route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    await expect(page.getByLabel(/route stop overview/i)).toBeVisible()
    const bangkokOverviewLinkBox = await page.getByRole('link', { name: 'Bangkok: 1 comparison match' }).boundingBox()
    expect(bangkokOverviewLinkBox).not.toBeNull()
    expect(bangkokOverviewLinkBox?.height ?? 0).toBeGreaterThanOrEqual(44)
    await expect(page.getByLabel(/Bangkok result group/i)).toContainText('Bangkok Temple and Local Food Walk')
    await expect(page.getByLabel(/Phuket result group/i)).toContainText('Phuket Beach and Island Day')
    const phuketBackLinkBox = await page
      .getByLabel(/Phuket result group/i)
      .getByRole('link', { name: /back to route overview/i })
      .boundingBox()
    expect(phuketBackLinkBox).not.toBeNull()
    expect(phuketBackLinkBox?.height ?? 0).toBeGreaterThanOrEqual(44)
    await expect(page.getByLabel(/Chiang Mai result group/i)).toContainText('Chiang Mai Elephant Sanctuary')
    await expect(productCards(page)).toHaveCount(3)

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('destination starters fit as one desktop row without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/ai-trip-planner')

    const starterButtons = page.getByRole('button', { name: /use .* route idea/i })

    await expect(starterButtons).toHaveCount(5)

    const firstBox = await starterButtons.first().boundingBox()
    expect(firstBox).not.toBeNull()

    for (let index = 1; index < 5; index += 1) {
      const box = await starterButtons.nth(index).boundingBox()
      expect(box).not.toBeNull()
      expect(Math.abs((box?.y ?? 0) - (firstBox?.y ?? 0))).toBeLessThanOrEqual(2)
    }

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('destination starter focuses the trip idea field for immediate editing', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    await page.getByRole('button', { name: /use chiang mai route idea/i }).click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Chiang Mai 3 days elephants cooking temples, family friendly')
  })

  test('example prompt chip focuses the trip idea field for immediate editing', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    const examplePrompt = page.getByRole('button', { name: 'Bangkok 3 days canals temples street food, relaxed pace', exact: true })
    await expect(examplePrompt).toHaveClass(/min-h-\[44px\]/)
    await expect(page.getByRole('button', { name: /clear trip idea/i })).toHaveClass(/min-h-\[44px\]/)

    await examplePrompt.click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Bangkok 3 days canals temples street food, relaxed pace')
  })

  test('Thailand example prompt chip can confirm and search safely', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page
      .getByRole('button', { name: 'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace', exact: true })
      .click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace')

    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await expect(page.getByText('Suggested Thailand multi-city route outline')).toBeVisible()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    expect(receivedPrompt).toBe('Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches, relaxed pace')
    await expect(page.getByRole('status')).toContainText('Results ready')
    await expect(page.getByRole('status')).toContainText('Compare the cards below')
    await expect(page.getByText('Reviewed matches can continue with a booking partner; planning remains read-only on RadarScout.')).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByText(/start with chiang mai elephant sanctuary, then compare the remaining cards below/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /open top match details for chiang mai elephant sanctuary/i })).toHaveAttribute(
      'href',
      '/tours/prod_cm_1?source=ai-trip-planner',
    )
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('compact example prompt chip can confirm and search safely', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(COMPACT_CHIANG_MAI_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: 'Chiang Mai elephants', exact: true }).click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Chiang Mai elephants')
    await expect(page.locator('dd').filter({ hasText: /^Chiang Mai$/ })).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^elephants$/ })).toBeVisible()

    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    expect(receivedPrompt).toBe('Chiang Mai elephants')
    await expect(page.getByRole('status')).toContainText('Results ready')
    await expect(productCards(page)).toHaveCount(1)
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('clear trip idea resets planner state and focuses the input', async ({ page }) => {
    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()

    await expect(page.getByText('Trip intent confirmed locally')).toBeVisible()

    await page.getByRole('button', { name: /clear trip idea/i }).click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('')
    await expect(page.getByText('Trip intent confirmed locally')).toHaveCount(0)
    await expect(page.getByText('Bangkok route idea loaded')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeDisabled()
  })

  test('destination starter shows a safe next-step helper after prefill', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    await page.getByRole('button', { name: /use bangkok route idea/i }).click()

    await expect(page.getByText('Bangkok route idea loaded. Review the summary, then confirm trip intent to search real Thailand experiences.')).toBeVisible()
  })

  test('destination starter helper can confirm the loaded trip intent', async ({ page }) => {
    await page.goto('/ai-trip-planner')

    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()

    await expect(page.getByText('Trip intent confirmed locally')).toBeVisible()
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()
  })

  test('destination starter helper can search the loaded trip idea after confirmation', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    expect(receivedPrompt).toBe('Bangkok 3 days canals temples street food, relaxed pace')
    await expect(productCards(page)).toHaveCount(3)
  })

  test('destination starter helper shows result feedback after helper search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    await expect(page.getByText('3 matching Thailand experiences found below.')).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
  })

  test('destination starter helper can jump to matching experiences after helper search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    await page.getByRole('link', { name: /view matching experiences/i }).click()

    await expect(page).toHaveURL(/#ai-trip-results$/)
    await expect(page.getByRole('heading', { name: /search real thailand experiences/i })).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
  })

  test('destination starter helper can jump directly to comparison cards after helper search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()

    const starterFeedback = page.locator('[aria-label="Loaded trip result feedback"]')
    const comparisonCardsLink = starterFeedback.getByRole('link', { name: /review comparison cards/i })

    await expect(starterFeedback).toBeVisible()
    await expect(comparisonCardsLink).toBeVisible()
    await expect(comparisonCardsLink).toHaveAttribute('href', '#ai-trip-comparison-results')

    await comparisonCardsLink.click()

    await expect(page).toHaveURL(/#ai-trip-comparison-results$/)
    await expect(page.locator('#ai-trip-comparison-results')).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByText(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('search results can jump back to refine the trip idea', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.getByRole('button', { name: /use bangkok route idea/i }).click()
    await page.getByRole('button', { name: /confirm loaded trip intent/i }).click()
    await page.getByRole('button', { name: /search loaded trip idea/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    await page.getByRole('link', { name: /refine trip idea from search results/i }).click()

    await expect(page).toHaveURL(/#trip-idea$/)
    await expect(page.locator('#trip-idea')).toBeVisible()
    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Bangkok 3 days canals temples street food, relaxed pace')
  })

  test('search CTA appears after confirming intent', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()
  })

  test('entering Chiang Mai prompt, parsing, confirming, and searching shows product cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByRole('status')).toContainText('Results ready')
    await expect(page.getByRole('status')).toContainText('booking partner handoff')
    await expect(page.getByTestId('ai-trip-result-action-panel')).toHaveClass(/sm:flex-wrap/)
    const topMatchLink = page.getByRole('link', { name: /open top match details for chiang mai elephant sanctuary/i })
    await expect(topMatchLink).toBeVisible()
    await expect(topMatchLink).toHaveAttribute('href', /\/tours\/.*source=ai-trip-planner/)
    await expect(topMatchLink).toHaveClass(/w-full/)
    await expect(topMatchLink).toHaveClass(/sm:w-auto/)

    const resultSummary = page.getByLabel(/result fit summary/i)
    await expect(resultSummary).toBeVisible()
    await expect(resultSummary.getByText(/why these experiences match/i)).toBeVisible()
    await expect(resultSummary.getByText(/Matched interests: .*(elephants|temples|food)/i)).toBeVisible()
    await expect(resultSummary.getByText(/comparison-only product results/i)).toBeVisible()

    // Product cards are identified by their unique "View details" CTA
    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByText(/why this fits/i)).toHaveCount(3)
  })

  test('successful search renders the structured day-tour itinerary without inventing missing days', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    const itinerary = page.getByRole('region', { name: /suggested thailand day trips/i })
    await expect(itinerary).toBeVisible()
    await expect(itinerary.getByRole('heading', { name: 'Your suggested Thailand day trips' })).toBeVisible()
    await expect(itinerary.getByText('Day 1', { exact: true })).toBeVisible()
    await expect(itinerary.getByText('Day 2', { exact: true })).toBeVisible()
    await expect(itinerary.getByText('Chiang Mai Elephant Sanctuary')).toBeVisible()
    await expect(itinerary.getByText('Old City Temple Walk')).toBeVisible()
    await expect(itinerary.getByText(/1 day remains open/i)).toBeVisible()
    const overview = itinerary.getByLabel('Trip plan overview')
    await expect(overview).toContainText('Chiang Mai')
    await expect(overview).toContainText('3 day trips')
    await expect(overview).toContainText('Moderate pace')
    await expect(overview).toContainText('Couple')
    await expect(overview).toContainText('Group of 2')
    await expect(itinerary.getByRole('link', { name: 'Review product details' }).first()).toHaveAttribute('href', /source=ai-trip-planner/)
    const mapLink = itinerary.getByRole('link', { name: 'Open Chiang Mai area map' })
    await expect(mapLink).toBeVisible()
    await expect(mapLink).toHaveAttribute('href', 'https://www.openstreetmap.org/search?query=Chiang%20Mai%2C%20Thailand')
    await expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(itinerary.getByText(/hotel|flight|price|available now|instant confirmation|checkout|payment/i)).toHaveCount(0)
  })

  test('successful search can jump directly to comparison cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    const comparisonCardsLink = page.getByRole('link', { name: /review comparison cards/i })

    await expect(comparisonCardsLink).toBeVisible()
    await expect(comparisonCardsLink).toHaveAttribute('href', '#ai-trip-comparison-results')

    await comparisonCardsLink.click()

    await expect(page).toHaveURL(/#ai-trip-comparison-results$/)
    await expect(page.locator('#ai-trip-comparison-results')).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByText(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('compact Chiang Mai interest prompt searches without combining destination and interest', async ({ page }) => {
    let receivedPrompt: string | null = null

    await page.route('/api/ai-trip/search', async route => {
      receivedPrompt = route.request().postDataJSON().prompt
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(COMPACT_CHIANG_MAI_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.locator('#trip-idea').fill('Chiang Mai elephants')
    await page.getByRole('button', { name: /parse trip intent/i }).click()

    await expect(page.locator('dd').filter({ hasText: /^Chiang Mai$/ })).toBeVisible()
    await expect(page.locator('dd').filter({ hasText: /^elephants$/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()

    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    expect(receivedPrompt).toBe('Chiang Mai elephants')
    await expect(page.getByRole('status')).toContainText('Results ready')
    await expect(page.getByRole('status')).toContainText('booking partner handoff')
    await expect(productCards(page)).toHaveCount(1)
    await expect(page.getByLabel(/result fit summary/i)).toContainText(/Matched interests: elephants/i)
    await expect(page.getByText(/Chiang Mai Elephants/)).toHaveCount(0)
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('each product card has a public /tours/ detail link', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const links = productCards(page)
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href')
      expect(href).toMatch(/^\/tours\//)
      expect(href).toContain('source=ai-trip-planner')
    }
  })

  test('product detail links replace non-planner source parameters with Trip Planner source', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...OK_RESPONSE,
          products: [
            {
              ...OK_RESPONSE.products[0],
              detailHref: '/tours/prod_cm_1?source=homepage&ref=card',
            },
          ],
        }),
      })
    })

    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(1)

    await expect(productCards(page).first()).toHaveAttribute(
      'href',
      '/tours/prod_cm_1?source=ai-trip-planner&ref=card',
    )
  })

  test('opening a product detail keeps the Trip Planner return path safe', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    await productCards(page).first().click()

    await expect(page).toHaveURL(/\/tours\/prod_cm_1\?source=ai-trip-planner/)
    await expect(page.getByRole('link', { name: /back to trip planner/i })).toHaveAttribute(
      'href',
      '/ai-trip-planner#ai-trip-results',
    )
    await expect(page.getByText('Experience detail')).toBeVisible()
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('mobile results flow keeps result actions visible without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByLabel(/trip planner result actions/i)).toBeVisible()
    await expect(page.getByRole('status')).toContainText('Results ready')
    await expect(page.getByRole('link', { name: /open top match details for chiang mai elephant sanctuary/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /open top match details for chiang mai elephant sanctuary/i })).toHaveAttribute(
      'href',
      /\/tours\/.*source=ai-trip-planner/,
    )
    await expect(page.getByLabel(/result fit summary/i)).toHaveClass(/p-3/)
    await expect(productCards(page).first()).toBeVisible()
    await expect(productCards(page)).toHaveCount(3)

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('search button is disabled while search is pending and shows Searching text', async ({ page }) => {
    // Override with a slow-resolving mock to catch the disabled state
    await page.route('/api/ai-trip/search', async route => {
      await page.waitForTimeout(150)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    // While the delayed mock resolves, button should be disabled and show "Searching…"
    await expect(page.getByRole('button', { name: /searching/i })).toBeDisabled()
    await expect(page.getByRole('status')).toContainText(
      'Searching read-only Thailand experience records',
    )
    await expect(page.getByRole('status')).toContainText('no partner action is running')

    // After mock resolves, product cards appear
    await expect(productCards(page)).toHaveCount(3)
  })
})

// ── Unsupported destination: Singapore ───────────────────────────────────────

test.describe('Unsupported destination flow (Singapore)', () => {
  test('Singapore prompt — parse → confirm → search → Thailand-only message, zero product cards', async ({ page }) => {
    let apiCallCount = 0

    await page.route('/api/ai-trip/search', async route => {
      apiCallCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(UNSUPPORTED_DESTINATION_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Singapore 3 days food')
    await page.click('button[type="submit"]')

    // Confirm button must be enabled (parser extracted destination + duration from Singapore prompt)
    const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
    await expect(confirmBtn).toBeEnabled()
    await confirmBtn.click()

    // Search CTA must appear and be enabled
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()

    // Capture the API request to verify prompt body and method
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/ai-trip/search') && req.method() === 'POST',
    )
    await searchBtn.click()
    const apiRequest = await requestPromise

    // Verify exact prompt body and request method
    expect(apiRequest.method()).toBe('POST')
    const requestBody = JSON.parse(apiRequest.postData() ?? '{}')
    expect(requestBody.prompt).toBe('Singapore 3 days food')

    // Thailand-only message must be visible after response
    await expect(page.getByText('Thailand-only search')).toBeVisible()

    // Verify exactly one API call was made (not zero, not two)
    expect(apiCallCount).toBe(1)

    // No product cards must be rendered
    await expect(productCards(page)).toHaveCount(0)

    // No real Thailand product titles must appear anywhere on the page
    const pageText = (await page.locator('body').innerText()).toLowerCase()
    expect(pageText).not.toContain('chiang mai elephant sanctuary')
    expect(pageText).not.toContain('old city temple walk')
  })

  test('unsupported destination result can jump back to refine the trip idea', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(UNSUPPORTED_DESTINATION_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Singapore 3 days food')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByText('Thailand-only search')).toBeVisible()
    await page.getByRole('link', { name: /refine trip idea after thailand-only search/i }).click()

    await expect(page).toHaveURL(/#trip-idea$/)
    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Singapore 3 days food')
  })

  test('unsupported destination result offers safe Thailand search ideas', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(UNSUPPORTED_DESTINATION_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Singapore 3 days food')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByText('Thailand-only search')).toBeVisible()
    await expect(page.getByText(/Try one of these Thailand trip ideas/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Gentle elephant day in Chiang Mai/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Family-friendly Chiang Mai elephant day/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Chiang Mai cooking and local food/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Chiang Mai nature and elephants/i })).toBeVisible()

    await page.getByRole('button', { name: /Chiang Mai cooking and local food/i }).click()

    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Chiang Mai cooking and local food day')
    await expect(page.getByText('Thailand-only search')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()

    const pageText = await page.locator('body').innerText()
    expect(pageText).not.toMatch(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)
  })
})

// ── No match guidance ─────────────────────────────────────────────────────────

test.describe('No match guidance', () => {
  test('no-match result gives safe actionable prompt guidance and zero product cards', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(NO_MATCH_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Pattaya 2 days beach food elephant day trip')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByText('No reviewed booking partner match yet')).toBeVisible()
    await expect(page.getByText(/Try one of these reviewed Chiang Mai searches/i)).toBeVisible()
    await expect(page.getByText(/Gentle elephant day in Chiang Mai/i)).toBeVisible()
    await expect(page.getByText(/Family-friendly Chiang Mai elephant day/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Chiang Mai cooking and local food', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Chiang Mai nature and elephants', exact: true })).toBeVisible()
    await expect(page.getByText(/No product cards are shown until a reviewed handoff-ready product matches/i)).toBeVisible()
    await expect(productCards(page)).toHaveCount(0)

    await page.getByRole('button', { name: /Gentle elephant day in Chiang Mai/i }).click()
    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Gentle elephant day in Chiang Mai')
    await expect(page.getByText('No reviewed booking partner match yet')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()

    const pageText = await page.locator('body').innerText()
    expect(pageText).not.toMatch(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)
  })

  test('no-match result can jump back to refine the trip idea', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(NO_MATCH_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Pattaya 2 days beach food elephant day trip')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(page.getByText('No reviewed booking partner match yet')).toBeVisible()
    await page.getByRole('link', { name: /refine trip idea after no reviewed booking partner match/i }).click()

    await expect(page).toHaveURL(/#trip-idea$/)
    await expect(page.locator('#trip-idea')).toBeFocused()
    await expect(page.locator('#trip-idea')).toHaveValue('Pattaya 2 days beach food elephant day trip')
  })
})

// ── Mixed flow: Thailand and Singapore ───────────────────────────────────────

test.describe('Mixed flow (Thailand and Singapore)', () => {
  test('mixed Thailand and Singapore prompt — parse → confirm → search → Thailand-only message, zero product cards', async ({ page }) => {
    let apiCallCount = 0

    await page.route('/api/ai-trip/search', async route => {
      apiCallCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MIXED_DESTINATION_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Thailand and Singapore 7 days')
    await page.click('button[type="submit"]')

    // Confirm button must be enabled (parser extracted destination + duration)
    const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
    await expect(confirmBtn).toBeEnabled()
    await confirmBtn.click()

    // Search CTA must appear and be enabled
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()

    // Capture the API request to verify prompt body and method
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/ai-trip/search') && req.method() === 'POST',
    )
    await searchBtn.click()
    const apiRequest = await requestPromise

    // Verify exact prompt body and request method
    expect(apiRequest.method()).toBe('POST')
    const requestBody = JSON.parse(apiRequest.postData() ?? '{}')
    expect(requestBody.prompt).toBe('Thailand and Singapore 7 days')

    // Thailand-only message must be visible after response
    await expect(page.getByText('Thailand-only search')).toBeVisible()

    // Verify exactly one API call was made (not zero, not two)
    expect(apiCallCount).toBe(1)

    // No product cards must be rendered
    await expect(productCards(page)).toHaveCount(0)

    // No real Thailand fallback product titles must appear
    const pageText = (await page.locator('body').innerText()).toLowerCase()
    expect(pageText).not.toContain('chiang mai elephant sanctuary')
    expect(pageText).not.toContain('old city temple walk')
    expect(pageText).not.toContain('night bazaar food tour')
  })
})

// ── Capability state ──────────────────────────────────────────────────────────

test.describe('Capability state', () => {
  test('product comparison results are disabled before search, enabled after successful search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Chiang Mai 3 days elephants')
    await page.click('button[type="submit"]')

    const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
    await expect(confirmBtn).toBeEnabled()

    // Before search: product comparison results are not shown yet.
    const prRow = capabilityRow(page, 'Product comparison results')
    await expect(prRow.locator('span').last()).toHaveText('Not shown yet')

    await confirmBtn.click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // After successful search: product comparison results are shown.
    await expect(prRow.locator('span').last()).toHaveText('Shown')
  })

  test('booking partner action remains disabled after successful search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const beRow = capabilityRow(page, 'Booking partner handoff')
    await expect(beRow.locator('span').last()).toHaveText('Product page only')
  })

  test('current product details remain on product pages after successful search', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })

    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const aeRow = capabilityRow(page, 'Current product details')
    await expect(aeRow.locator('span').last()).toHaveText('Product page only')
  })

  test('suggested planning outline appears without an itinerary generation CTA', async ({ page }) => {
    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Chiang Mai 3 days elephants')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()

    await expect(page.getByText(/suggested planning outline/i)).toBeVisible()
    await expect(page.getByText(/suggested chiang mai planning outline/i)).toBeVisible()
    await expect(page.getByText(/this outline is a rule-based planning guide/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /continue to experience search/i })).toHaveAttribute(
      'href',
      '#ai-trip-results',
    )
    await expect(page.getByRole('button', { name: /generate itinerary/i })).toHaveCount(0)
  })

  test('suggested planning outline can jump to the experience search section', async ({ page }) => {
    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Chiang Mai 3 days elephants')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()

    await page.getByRole('link', { name: /continue to experience search/i }).click()

    await expect(page).toHaveURL(/#ai-trip-results$/)
    await expect(page.getByRole('heading', { name: /search real thailand experiences/i })).toBeVisible()
    await expect(page.getByText(/live availability|available now|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })
})

// ── Product-card safety ───────────────────────────────────────────────────────

test.describe('Product card safety', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })
  })

  test('product cards contain no forbidden commerce, availability, or booking content', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // Collect text from all product card articles (identified by containing "View details")
    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })
    const allText = (await cards.allInnerTexts()).join(' ').toLowerCase()

    const forbidden = [
      'live partner catalog',
      'partner rate',
      'contact for rate',
      'available now',
      'book now',
      'add to cart',
      'select date',
      'date selector',
      'bestseller',
    ]

    for (const term of forbidden) {
      expect(allText, `Found forbidden term: "${term}"`).not.toContain(term)
    }

    const resultSummary = await page.getByLabel(/result fit summary/i).innerText()
    expect(resultSummary.toLowerCase()).not.toContain('available now')
    expect(resultSummary.toLowerCase()).not.toContain('instant confirmation')
    expect(resultSummary.toLowerCase()).not.toContain('checkout')
    expect(resultSummary.toLowerCase()).not.toContain('payment')
  })

  test('product cards do not render prices from the search response', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    await expect(page.getByText('From USD 49.00', { exact: true })).toHaveCount(0)
    await expect(page.getByText('From USD 29.00', { exact: true })).toHaveCount(0)
  })

  test('product cards identify results as read-only comparison matches', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })
    await expect(cards).toHaveCount(3)

    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).getByText(/comparison match/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/read-only product result/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/why this fits/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/fit checklist/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/destination fit/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/interest fit/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/comparison only/i)).toBeVisible()
    }
  })

  test('product cards label the matched route stop without availability claims', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })
    await expect(cards).toHaveCount(3)

    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).getByText(/matched route stop/i)).toBeVisible()
      await expect(cards.nth(i).getByText(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
    }
  })

  test('product cards explain the safe booking partner handoff step', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })

    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i).getByText(/this discovery-only product does not currently have a reviewed booking partner handoff/i)).toBeVisible()
    }
  })

  test('product detail CTAs include booking partner handoff context in their accessible name', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    await expect(
      page.getByRole('link', {
        name: /view details for chiang mai elephant sanctuary; no reviewed booking partner handoff is available/i,
      }),
    ).toHaveAttribute('href', /\/tours\/.*source=ai-trip-planner/)
    await expect(page.getByText(/available now|live availability|instant confirmation|checkout|payment|booking complete/i)).toHaveCount(0)
  })

  test('product cards do not render rating or star rating', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })
    const allText = (await cards.allInnerTexts()).join(' ').toLowerCase()

    expect(allText).not.toContain('review count')
    expect(allText).not.toContain('star rating')
    expect(allText).not.toMatch(/\d+(\.\d+)?\s*(out of|\/)\s*\d+/)
  })

  test('checkout, payment, and booking buttons are absent from product cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view details/i }),
    })
    await expect(cards.getByRole('button', { name: /book now/i })).toHaveCount(0)
    await expect(cards.getByRole('button', { name: /checkout/i })).toHaveCount(0)
    await expect(cards.getByRole('button', { name: /add to cart/i })).toHaveCount(0)
    await expect(cards.getByRole('link', { name: /book now/i })).toHaveCount(0)
  })
})

// ── Deterministic outline separation ───────────────────────────────────────────

test.describe('Deterministic outline separation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })
  })

  test('deterministic planning outline does not contain real product card CTAs', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const outlineSlots = page.locator('article').filter({ hasText: /anchor the day|compare nearby|shortlist real/i })
    const slotCount = await outlineSlots.count()
    expect(slotCount).toBeGreaterThan(0)

    // None of the outline slots should have a "View details" link.
    for (let i = 0; i < slotCount; i++) {
      await expect(outlineSlots.nth(i).getByRole('link', { name: /view details/i })).toHaveCount(0)
    }
  })

  test('deterministic planning outline does not contain product titles from the search', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const outlineSlots = page.locator('article').filter({ hasText: /anchor the day|compare nearby|shortlist real/i })
    const texts = (await outlineSlots.allInnerTexts()).join(' ').toLowerCase()

    // Product titles from the mock must not appear inside deterministic outline cards.
    expect(texts).not.toContain('elephant sanctuary')
    expect(texts).not.toContain('temple walk')
    expect(texts).not.toContain('night bazaar food tour')
  })

  test('real products are not inserted into deterministic outline cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const outlineSlots = page.locator('article').filter({ hasText: /anchor the day|compare nearby|shortlist real/i })
    const slotCount = await outlineSlots.count()
    expect(slotCount).toBeGreaterThan(0)

    // Each outline slot must NOT contain product-specific content.
    for (let i = 0; i < slotCount; i++) {
      const slotText = (await outlineSlots.nth(i).innerText()).toLowerCase()
      expect(slotText).not.toContain('from usd')
      expect(slotText).not.toContain('view details')
    }
  })

  test('itinerary generation remains disabled after search without rendering a generator button', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    await expect(productCards(page)).toHaveCount(3)
    await expect(page.getByRole('button', { name: /generate itinerary/i })).toHaveCount(0)
  })
})
