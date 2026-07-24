import { expect, test } from '@playwright/test'

test.describe('Thailand destinations hub', () => {
  test('routes reviewed cities into the filtered experience catalogue', async ({ page }) => {
    await page.goto('/destinations')

    await expect(page).toHaveTitle('Thailand Destinations | RadarScout Day-Trip Planner')
    await expect(
      page.getByRole('heading', {
        name: 'Choose a Thailand city. Start with experiences already reviewed.',
      }),
    ).toBeVisible()

    await expect(page.getByText(/\d+ reviewed experiences/).first()).toBeVisible()
    await expect(page.getByText(/Browse \d+ reviewed Thailand cities\./).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Bangkok/ }).first()).toHaveAttribute(
      'href',
      '/tours?city=bangkok',
    )
    await expect(page.getByRole('link', { name: /Chiang Mai/ }).first()).toHaveAttribute(
      'href',
      '/tours?city=chiang-mai',
    )
    await expect(page.getByRole('link', { name: /Phuket/ }).first()).toHaveAttribute(
      'href',
      '/tours?city=phuket',
    )

    await expect(page.getByText('Planning guides for future partner coverage.')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Japan' })).toHaveCount(0)
  })

  test('keeps every reviewed city reachable without mobile overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/destinations')

    await expect(page.getByRole('link', { name: /Koh Samui/ }).first()).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )

    expect(hasHorizontalOverflow).toBe(false)
  })
})
