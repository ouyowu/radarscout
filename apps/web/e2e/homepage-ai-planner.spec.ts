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

test.describe('Homepage AI planner entry', () => {
  test('shows safe AI-guided planning copy and routes users to planner pages', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('RadarScout | AI-guided Thailand Experience Planner')
    await expect(page.getByRole('heading', { name: 'AI-guided Thailand Experience Planner' })).toBeVisible()
    await expect(page.getByText('Tell RadarScout the kind of Thailand day you want.')).toBeVisible()

    await expect(page.getByRole('link', { name: 'Start planning' })).toHaveAttribute(
      'href',
      '/ai-trip-planner#intent-demo',
    )
    await expect(page.getByRole('link', { name: 'Plan a Chiang Mai elephant day' }).first()).toHaveAttribute(
      'href',
      '/chiang-mai/elephant-camp-finder#plan-with-radarscout',
    )

    await expect(page.getByText('Start with a travel idea')).toBeVisible()
    await expect(page.getByText('Use a prompt, then compare matching experiences.')).toBeVisible()

    const promptChips = [
      'Gentle elephant day in Chiang Mai',
      'Family-friendly Thailand experience',
      'Cooking and local food day',
      'Nature day trip from Chiang Mai',
      'Bangkok or Pattaya elephant day',
    ]

    for (const chip of promptChips) {
      await expect(page.getByRole('link', { name: chip })).toHaveAttribute(
        'href',
        `/ai-trip-planner?idea=${encodeURIComponent(chip)}#intent-demo`,
      )
    }

    const pageText = await page.locator('body').innerText()
    for (const term of forbiddenVisibleCopy) {
      expect(pageText.toLowerCase(), `Found forbidden homepage term: "${term}"`).not.toContain(term.toLowerCase())
    }
  })

  test('keeps the homepage planner entry mobile-safe without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.getByText('Start with a travel idea')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Gentle elephant day in Chiang Mai' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Bangkok or Pattaya elephant day' })).toBeVisible()

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('homepage prompt chip opens the AI Trip Planner form with safe prefill and no search request', async ({
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
    await page.getByRole('link', { name: prompt }).click()

    await expect(page).toHaveURL(`/ai-trip-planner?idea=${encodeURIComponent(prompt)}#intent-demo`)
    await expect(page.locator('#trip-idea')).toHaveValue(prompt)
    await expect(page.getByTestId('ai-trip-intent-summary')).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()
    expect(searchRequestCount).toBe(0)
  })

  test('Start planning opens the AI Trip Planner form without automatic product search', async ({ page }) => {
    let searchRequestCount = 0
    const defaultPrompt = 'Chiang Mai 3 days food temples elephants, less crowded'

    await page.route('/api/ai-trip/search', async route => {
      searchRequestCount += 1
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'no_match', products: [] }),
      })
    })

    await page.goto('/')
    await page.getByRole('link', { name: 'Start planning' }).click()

    await expect(page).toHaveURL('/ai-trip-planner#intent-demo')
    await expect(page.locator('#trip-idea')).toBeVisible()
    await expect(page.locator('#trip-idea')).toHaveValue(defaultPrompt)
    await expect(page.getByTestId('ai-trip-intent-summary')).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm trip intent/i })).toBeEnabled()
    expect(searchRequestCount).toBe(0)
  })
})
