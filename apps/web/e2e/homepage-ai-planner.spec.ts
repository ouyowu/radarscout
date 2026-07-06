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

    await expect(page.getByRole('link', { name: 'Start planning' })).toHaveAttribute('href', '/ai-trip-planner')
    await expect(page.getByRole('link', { name: 'Plan a Chiang Mai elephant day' }).first()).toHaveAttribute(
      'href',
      '/chiang-mai/elephant-camp-finder',
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
        new RegExp('^/ai-trip-planner\\?idea='),
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
})
