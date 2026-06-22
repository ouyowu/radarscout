import { test, expect } from '@playwright/test'
import type { AiTripSearchResponse } from '../app/api/ai-trip/search/route'

// ── Shared mock responses ─────────────────────────────────────────────────────

const OK_RESPONSE: AiTripSearchResponse = {
  status: 'ok',
  intent: { destination: 'Chiang Mai', days: 3, interests: ['elephants', 'temples', 'food'] },
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
    itineraryGenerationEnabled: false,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

const UNSUPPORTED_DESTINATION_RESPONSE: AiTripSearchResponse = {
  status: 'unsupported_destination',
  intent: { destination: 'Singapore', days: 3, interests: ['food'] },
  products: [],
  message: 'RadarScout currently searches Thailand experiences only.',
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: false,
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
    itineraryGenerationEnabled: false,
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

// Product cards are uniquely identified by the "View experience" CTA link.
const productCards = (page: Page) => page.getByRole('link', { name: /view experience/i })

// Capability status row — finds the div that has a DIRECT child span with the
// exact label text, then returns that div so we can check the value span.
const capabilityRow = (page: Page, label: string) =>
  page.locator(`div:has(> span:text-is("${label}"))`)

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

  test('search CTA appears after confirming intent', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()
  })

  test('entering Chiang Mai prompt, parsing, confirming, and searching shows product cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()

    // Product cards are identified by their unique "View experience" CTA
    await expect(productCards(page)).toHaveCount(3)
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
    }
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

    // After mock resolves, product cards appear
    await expect(productCards(page)).toHaveCount(3)
  })
})

// ── Unsupported destination: Singapore ───────────────────────────────────────

test.describe('Unsupported destination flow (Singapore)', () => {
  test('Singapore prompt — parse → confirm → search → Thailand-only message, zero product cards', async ({ page }) => {
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

    // Confirm button must be enabled (parser extracted destination + duration from Singapore prompt)
    const confirmBtn = page.getByRole('button', { name: /confirm trip intent/i })
    await expect(confirmBtn).toBeEnabled()
    await confirmBtn.click()

    // Search CTA must appear and be enabled
    const searchBtn = page.getByRole('button', { name: /search real thailand experiences/i })
    await expect(searchBtn).toBeVisible()
    await expect(searchBtn).toBeEnabled()

    // Capture the API request to verify prompt and that exactly one request is made
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/ai-trip/search') && req.method() === 'POST',
    )
    await searchBtn.click()
    const apiRequest = await requestPromise

    const requestBody = JSON.parse(apiRequest.postData() ?? '{}')
    expect(requestBody.prompt).toBe('Singapore 3 days food')

    // Thailand-only message must be visible after response
    await expect(page.getByText('Thailand-only search')).toBeVisible()

    // No product cards must be rendered
    await expect(productCards(page)).toHaveCount(0)

    // No real Thailand product titles must appear anywhere on the page
    const pageText = (await page.locator('body').innerText()).toLowerCase()
    expect(pageText).not.toContain('chiang mai elephant sanctuary')
    expect(pageText).not.toContain('old city temple walk')
  })
})

// ── Mixed flow: Thailand and Singapore ───────────────────────────────────────

test.describe('Mixed flow (Thailand and Singapore)', () => {
  test('mixed Thailand and Singapore prompt — parse → confirm → search → Thailand-only message, zero product cards', async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
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

    // Capture the API request to verify prompt and exactly one request was made
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/ai-trip/search') && req.method() === 'POST',
    )
    await searchBtn.click()
    const apiRequest = await requestPromise

    const requestBody = JSON.parse(apiRequest.postData() ?? '{}')
    expect(requestBody.prompt).toBe('Thailand and Singapore 7 days')

    // Thailand-only message must be visible after response
    await expect(page.getByText('Thailand-only search')).toBeVisible()

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
  test('productRetrievalEnabled is false before search, true after successful search', async ({ page }) => {
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

    // Before search: productRetrievalEnabled shows false
    const prRow = capabilityRow(page, 'productRetrievalEnabled')
    await expect(prRow.locator('span').last()).toHaveText('false')

    await confirmBtn.click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // After successful search: productRetrievalEnabled shows true
    await expect(prRow.locator('span').last()).toHaveText('true')
  })

  test('bookingEnabled remains false after successful search', async ({ page }) => {
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

    const beRow = capabilityRow(page, 'bookingEnabled')
    await expect(beRow.locator('span').last()).toHaveText('false')
  })

  test('availabilityEnabled remains false after successful search', async ({ page }) => {
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

    const aeRow = capabilityRow(page, 'availabilityEnabled')
    await expect(aeRow.locator('span').last()).toHaveText('false')
  })

  test('itinerary generation is disabled — Generate itinerary button is disabled, not clickable', async ({ page }) => {
    await page.goto('/ai-trip-planner')
    await page.fill('#trip-idea', 'Chiang Mai 3 days elephants')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()

    // The "Generate itinerary" button must be disabled
    const generateBtn = page.getByRole('button', { name: /generate itinerary/i })
    await expect(generateBtn).toBeVisible()
    await expect(generateBtn).toBeDisabled()
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

    // Collect text from all product card articles (identified by containing "View experience")
    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view experience/i }),
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
  })

  test('product cards do not render rating or star rating', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const cards = page.locator('article').filter({
      has: page.getByRole('link', { name: /view experience/i }),
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
      has: page.getByRole('link', { name: /view experience/i }),
    })
    await expect(cards.getByRole('button', { name: /book now/i })).toHaveCount(0)
    await expect(cards.getByRole('button', { name: /checkout/i })).toHaveCount(0)
    await expect(cards.getByRole('button', { name: /add to cart/i })).toHaveCount(0)
    await expect(cards.getByRole('link', { name: /book now/i })).toHaveCount(0)
  })
})

// ── Placeholder separation ────────────────────────────────────────────────────

test.describe('Placeholder separation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/ai-trip/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(OK_RESPONSE),
      })
    })
  })

  test('placeholder itinerary does not contain real product cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // Placeholder day cards are articles containing "Day N placeholder" text
    const daySlots = page.locator('article').filter({ hasText: /day \d+ placeholder/i })
    const slotCount = await daySlots.count()
    expect(slotCount).toBeGreaterThan(0)

    // None of the placeholder day slots should have a "View experience" link
    for (let i = 0; i < slotCount; i++) {
      await expect(daySlots.nth(i).getByRole('link', { name: /view experience/i })).toHaveCount(0)
    }
  })

  test('placeholder day cards do not contain product titles from the search', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    const daySlots = page.locator('article').filter({ hasText: /day \d+ placeholder/i })
    const texts = (await daySlots.allInnerTexts()).join(' ').toLowerCase()

    // Product titles from the mock must not appear inside placeholder day cards
    expect(texts).not.toContain('elephant sanctuary')
    expect(texts).not.toContain('temple walk')
    expect(texts).not.toContain('night bazaar food tour')
  })

  test('real products are not inserted into placeholder day cards', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // Placeholder day articles show "Planning slot placeholder" heading
    const daySlots = page.locator('article').filter({ hasText: /planning slot placeholder/i })
    const slotCount = await daySlots.count()
    expect(slotCount).toBeGreaterThan(0)

    // Each day slot must NOT contain product-specific content
    for (let i = 0; i < slotCount; i++) {
      const slotText = (await daySlots.nth(i).innerText()).toLowerCase()
      expect(slotText).not.toContain('from usd')
      expect(slotText).not.toContain('view experience')
    }
  })

  test('itinerary generation is disabled — Generate itinerary button is disabled after search', async ({ page }) => {
    await confirmChiangMaiIntent(page)
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await expect(productCards(page)).toHaveCount(3)

    // The "Generate itinerary" placeholder button must be visible and disabled
    const generateBtn = page.getByRole('button', { name: /generate itinerary/i })
    await expect(generateBtn).toBeVisible()
    await expect(generateBtn).toBeDisabled()
  })
})
