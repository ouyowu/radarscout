import { expect, test } from '@playwright/test'

const forbiddenVisibleCopy = [
  'AI booked this',
  'live availability',
  'available now',
  'guaranteed slot',
  'instant confirmation',
  'checkout',
  'payment',
  'reservation complete',
  'booking complete',
  'Bókun backend',
  'Bókun database',
  'Bókun-powered',
  'partner rate',
  'supplier net rate',
  'commission',
  'fake reviews',
  'fake ratings',
]

const homepagePromptSearchResponse = {
  status: 'ok',
  intent: { destination: 'Chiang Mai', days: null, interests: ['elephants'] },
  products: [
    {
      id: 'prod_cm_1',
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A gentle elephant care comparison option for Chiang Mai.',
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

test.describe('Homepage Trip Planner entry', () => {
  test('shows safe personalized planning copy and routes users to planner pages', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('RadarScout | Personalized Thailand Experience Planner')
    await expect(page.getByRole('heading', {
      name: 'Tell us your ideal Thailand day. We match it to real, reviewed experiences.',
    })).toBeVisible()
    await expect(page.getByText('Thailand day trips, thoughtfully planned')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Plan my trip' })).toBeVisible()
    const planDayLinks = page.getByRole('link', { name: 'Plan a day' })
    expect(await planDayLinks.count()).toBeGreaterThan(0)
    for (let index = 0; index < await planDayLinks.count(); index += 1) {
      await expect(planDayLinks.nth(index)).toHaveAttribute('href', '/planner')
    }
    await expect(page.getByRole('link', { name: 'Plan with RadarScout' }).first()).toHaveAttribute(
      'href',
      '/chiang-mai/elephant-camp-finder#plan-with-radarscout',
    )

    const promptChips = [
      'Gentle elephant day in Chiang Mai',
      'Family-friendly elephant sanctuary in Chiang Mai',
      'Chiang Mai cooking and local food day',
      'Chiang Mai nature and elephant day trip',
    ]

    for (const chip of promptChips) {
      await expect(page.getByRole('button', { name: chip })).toBeVisible()
    }

    const pageText = await page.locator('body').innerText()
    for (const term of forbiddenVisibleCopy) {
      expect(pageText.toLowerCase(), `Found forbidden homepage term: "${term}"`).not.toContain(term.toLowerCase())
    }
  })

  test('keeps the homepage planner entry mobile-safe without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByRole('textbox', { name: 'Describe your ideal Thailand trip' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Gentle elephant day in Chiang Mai' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Chiang Mai nature and elephant day trip' })).toBeVisible()

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('homepage prompt chip opens Planner Studio with safe prefill and no search request', async ({
    page,
  }) => {
    let searchRequestCount = 0
    const prompt = 'Gentle elephant day in Chiang Mai'

    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'no_match', products: [] }),
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: prompt }).click()

    await expect(page).toHaveURL(`/planner?idea=${encodeURIComponent(prompt)}`)
    await expect(page.locator('#planner-studio-input')).toHaveValue(prompt)
    await expect(page.getByRole('heading', {
      name: 'Talk through a Thailand trip, get a reviewed route.',
    })).toBeVisible()
    expect(searchRequestCount).toBe(0)
  })

  test('homepage prompt chip can send and search the reviewed Planner Studio route safely', async ({
    page,
  }) => {
    let searchRequestCount = 0
    const prompt = 'Gentle elephant day in Chiang Mai'

    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(homepagePromptSearchResponse),
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: prompt }).click()

    await expect(page).toHaveURL(`/planner?idea=${encodeURIComponent(prompt)}`)
    await expect(page.locator('#planner-studio-input')).toHaveValue(prompt)
    expect(searchRequestCount).toBe(0)

    await page.getByRole('button', { name: 'Send' }).click()
    await page.getByRole('button', { name: '1 day' }).click()
    await expect(page.getByText(/Found 3 reviewed Thailand experiences/)).toBeVisible()
    expect(searchRequestCount).toBe(1)

    const pageText = await page.locator('body').innerText()
    for (const term of forbiddenVisibleCopy) {
      expect(pageText.toLowerCase(), `Found forbidden homepage results term: "${term}"`).not.toContain(term.toLowerCase())
    }
  })

  test('Plan my trip opens Planner Studio without automatic product search', async ({ page }) => {
    let searchRequestCount = 0

    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'no_match', products: [] }),
      })
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Plan my trip' }).click()

    await expect(page).toHaveURL('/planner')
    await expect(page.locator('#planner-studio-input')).toBeVisible()
    await expect(page.locator('#planner-studio-input')).toHaveValue('')
    expect(searchRequestCount).toBe(0)
  })

  test('homepage hero prompt input opens Planner Studio with the typed idea', async ({ page }) => {
    let searchRequestCount = 0
    const prompt = 'Bangkok food and temple day'

    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'no_match', products: [] }),
      })
    })

    await page.goto('/')
    await page.getByRole('textbox', { name: 'Describe your ideal Thailand trip' }).fill(prompt)
    await page.getByRole('button', { name: 'Plan my trip' }).click()

    await expect(page).toHaveURL(`/planner?idea=${encodeURIComponent(prompt)}`)
    await expect(page.locator('#planner-studio-input')).toHaveValue(prompt)
    expect(searchRequestCount).toBe(0)
  })

  test('Chiang Mai planner CTA opens the deterministic planner section without Bókun API calls', async ({
    page,
  }) => {
    let bokunRequestCount = 0

    await page.route(/\/api\/bokun/, async route => {
      bokunRequestCount += 1
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Bókun API should not be called from homepage planner CTA smoke' }),
      })
    })

    await page.goto('/')
    await page.getByRole('link', { name: 'Plan with RadarScout' }).first().click()

    await expect(page).toHaveURL('/chiang-mai/elephant-camp-finder#plan-with-radarscout')
    await expect(page.locator('#plan-with-radarscout')).toBeVisible()
    await expect(page.getByText('Plan with RadarScout')).toBeVisible()
    await expect(page.getByText('Your planner picks')).toBeVisible()
    await expect(page.getByRole('button', { name: 'See matching experiences' }).first()).toBeVisible()

    const pageText = await page.locator('body').innerText()
    for (const term of forbiddenVisibleCopy) {
      expect(pageText.toLowerCase(), `Found forbidden Chiang Mai CTA term: "${term}"`).not.toContain(term.toLowerCase())
    }

    expect(bokunRequestCount).toBe(0)
  })
})
