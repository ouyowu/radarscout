import { expect, test } from '@playwright/test'

const cityHubs = [
  { slug: 'bangkok', name: 'Bangkok' },
  { slug: 'chiang-mai', name: 'Chiang Mai' },
  { slug: 'phuket', name: 'Phuket' },
] as const

for (const city of cityHubs) {
  test(`${city.name} SEO hub is indexable, useful, and linked to reviewed products`, async ({ page }) => {
    const response = await page.goto(`/thailand/${city.slug}`)

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(new RegExp(`${city.name} Day Trips`))
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: `${city.name} day trips, planned realistically`,
      }),
    ).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.radarscout.io/thailand/${city.slug}`,
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
    await expect(page.getByText('Reviewed by the RadarScout Editorial Team')).toBeVisible()
    expect(await page.locator('a[href^="/tours/"]').count()).toBeGreaterThan(0)
  })
}

test('Thailand city hubs do not overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const city of cityHubs) {
    await page.goto(`/thailand/${city.slug}`)
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  }
})
