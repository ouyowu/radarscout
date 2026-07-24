import { expect, test } from '@playwright/test'

test.describe('RadarScout contact paths', () => {
  test('shows working email links instead of an unhandled form', async ({ page }) => {
    await page.goto('/contact')

    await expect(page).toHaveTitle('Contact RadarScout | Travel Feedback and Partnerships')
    await expect(
      page.getByRole('heading', { name: 'Choose the right contact path.' }),
    ).toBeVisible()

    await expect(page.getByRole('link', { name: 'Send traveler feedback' })).toHaveAttribute(
      'href',
      /mailto:hello@radarscout\.io\?subject=RadarScout%20traveler%20feedback/,
    )
    await expect(page.getByRole('link', { name: 'Discuss a partnership' })).toHaveAttribute(
      'href',
      /mailto:hello@radarscout\.io\?subject=RadarScout%20partnership%20inquiry/,
    )
    await expect(page.locator('form')).toHaveCount(0)
  })

  test('does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/contact')

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(hasHorizontalOverflow).toBe(false)
  })
})
