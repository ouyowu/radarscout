import { expect, test } from '@playwright/test'

const publishedArticles = [
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
  {
    city: 'bangkok',
    href: '/guides/bangkok/ayutthaya-vs-floating-market-day-trip',
    heading: 'Ayutthaya vs Floating Market: Which Bangkok Day Trip Fits You?',
  },
  {
    city: 'chiang-mai',
    href: '/guides/chiang-mai/doi-inthanon-vs-chiang-rai-day-trip',
    heading: 'Doi Inthanon vs Chiang Rai: Which Day Trip from Chiang Mai Fits You?',
  },
  {
    city: 'phuket',
    href: '/guides/phuket/old-town-vs-island-day',
    heading: 'Phuket Old Town vs Island Day: Which Belongs in Your Itinerary?',
  },
  {
    city: 'bangkok',
    href: '/guides/bangkok/food-tour-vs-temple-day',
    heading: 'Bangkok Food Tour vs Temple Day: Which First Day Fits You?',
  },
  {
    city: 'chiang-mai',
    href: '/guides/chiang-mai/old-city-vs-nimman-where-to-stay',
    heading: 'Chiang Mai Old City vs Nimman: Which Area Fits Your Stay?',
  },
  {
    city: 'phuket',
    href: '/guides/phuket/private-vs-shared-island-tour',
    heading: 'Private vs Shared Phuket Island Tour: Which Fits Your Group?',
  },
] as const

test.describe('Thailand Travel Guides', () => {
  test('publishes a crawlable hub, city collections, and reviewed launch articles', async ({ page }) => {
    await page.goto('/guides')

    await expect(page).toHaveTitle('Thailand Travel Guides & Local Decision Help | RadarScout')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thailand travel guides for better decisions',
    )

    for (const article of publishedArticles) {
      await expect(page.getByRole('link', { name: article.heading })).toHaveAttribute('href', article.href)
      await page.goto(`/guides/${article.city}`)
      await expect(page.getByRole('link', { name: article.heading })).toHaveAttribute('href', article.href)
      await page.goto('/guides')
    }

    await page.goto(publishedArticles[7].href)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(publishedArticles[7].heading)
    await expect(page.getByText('Reviewed by RadarScout Thailand desk')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quick answer' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Editorial review and sources' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Plan a Chiang Mai stay' })).toHaveAttribute(
      'href',
      '/planner?idea=Chiang%20Mai%203%20days%20temples%20cafes%20nature',
    )
  })

  test('has no horizontal overflow on a mobile guide article', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(publishedArticles[5].href)

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
