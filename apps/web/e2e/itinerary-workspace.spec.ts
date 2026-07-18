import { expect, test } from '@playwright/test'

test.describe('Thailand itinerary workspace', () => {
  test('keeps the day, pace, map and reviewed Viator handoff in one deterministic flow', async ({ page }) => {
    const applicationRequests: string[] = []
    page.on('request', request => {
      if (new URL(request.url()).pathname.startsWith('/api/')) applicationRequests.push(request.url())
    })

    await page.goto('/itineraries/thailand/bangkok/3-days')

    await expect(page).toHaveTitle('Bangkok 3-Day Itinerary | RadarScout')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i)
    await expect(page.getByRole('heading', { name: 'Bangkok in 3 days, built to stay realistic.' })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Day / })).toHaveCount(3)

    await page.getByRole('button', { name: 'Day 2' }).click()
    await page.getByRole('button', { name: 'Packed' }).click()

    await expect(page.getByRole('heading', { name: 'Arts and central Bangkok' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Day-by-day itinerary' }).locator('ol > li')).toHaveCount(4)
    await expect(page.getByRole('complementary', { name: 'Selected day map' })).toBeVisible()
    expect(applicationRequests).toEqual([])

    const handoff = page.getByRole('link', { name: 'Check availability' }).first()
    await expect(handoff).toHaveAttribute('href', /^https:\/\/(www\.)?viator\.com\/.+\?.*pid=/)
    await expect(handoff).toHaveAttribute('rel', 'nofollow sponsored noopener noreferrer')
  })

  test('has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/itineraries/thailand/bangkok/3-days')

    const sizes = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }))

    expect(sizes.document).toBeLessThanOrEqual(sizes.viewport)
  })
})
