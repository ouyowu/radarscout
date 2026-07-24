import { expect, test } from '@playwright/test'

test.describe('About RadarScout', () => {
  test('explains the Thailand recommendation and affiliate handoff model', async ({ page }) => {
    await page.goto('/about-us')

    await expect(page).toHaveTitle('About RadarScout | Thailand Day-Trip Decision Support')
    await expect(
      page.getByRole('heading', {
        name: 'Thailand trip decisions should feel clearer—not more crowded.',
      }),
    ).toBeVisible()
    await expect(page.getByText('Why we recommend it', { exact: true })).toBeVisible()
    await expect(page.getByText('Who it suits', { exact: true })).toBeVisible()
    await expect(page.getByText('What to check before choosing', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Plan a Thailand day' })).toHaveAttribute(
      'href',
      '/planner',
    )
    await expect(page.getByText(/Reddit monitoring/i)).toHaveCount(0)
  })

  test('does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/about-us')

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(hasHorizontalOverflow).toBe(false)
  })
})
