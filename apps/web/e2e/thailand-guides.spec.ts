import { expect, test } from '@playwright/test'

const launchArticles = [
  {
    city: 'bangkok',
    href: '/guides/bangkok/best-areas-to-stay-first-time-visitors',
    heading: 'Best Bangkok Areas to Stay for First-Time Visitors',
  },
  {
    city: 'chiang-mai',
    href: '/guides/chiang-mai/how-to-choose-an-elephant-sanctuary',
    heading: 'How to Choose an Elephant Sanctuary in Chiang Mai',
  },
  {
    city: 'phuket',
    href: '/guides/phuket/phi-phi-vs-james-bond-island',
    heading: 'Phi Phi vs James Bond Island: Which Phuket Day Trip Fits You?',
  },
] as const

test.describe('Thailand Travel Guides', () => {
  test('publishes a crawlable hub, city collections, and reviewed launch articles', async ({ page }) => {
    await page.goto('/guides')

    await expect(page).toHaveTitle('Thailand Travel Guides & Local Decision Help | RadarScout')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thailand travel guides for better decisions',
    )

    for (const article of launchArticles) {
      await expect(page.getByRole('link', { name: article.heading })).toHaveAttribute('href', article.href)
      await page.goto(`/guides/${article.city}`)
      await expect(page.getByRole('link', { name: article.heading })).toHaveAttribute('href', article.href)
      await page.goto('/guides')
    }

    await page.goto(launchArticles[1].href)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(launchArticles[1].heading)
    await expect(page.getByText('Reviewed by RadarScout Thailand desk')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quick answer' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Editorial review and sources' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Compare Chiang Mai elephant experiences' })).toHaveAttribute(
      'href',
      '/chiang-mai/elephant-camp-finder',
    )
  })

  test('has no horizontal overflow on a mobile guide article', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(launchArticles[2].href)

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
