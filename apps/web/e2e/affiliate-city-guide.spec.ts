import { expect, test } from '@playwright/test'

test('Thailand city guide exposes only the reviewed GetYourGuide handoff', async ({ page }) => {
  await page.goto('/destinations/thailand')

  const section = page.getByRole('region', { name: 'Continue comparing on an activity partner.' })
  await expect(section).toBeVisible()

  const links = section.getByRole('link', { name: /Compare .* activities/ })
  await expect(links).toHaveCount(3)

  for (const city of ['Bangkok', 'Chiang Mai', 'Phuket']) {
    const link = section.getByRole('link', { name: `Compare ${city} activities` })
    await expect(link).toHaveAttribute('href', /https:\/\/www\.getyourguide\.com\/.+partner_id=IMR8EUB.+cmp=radarscout_city_guide_/)
    await expect(link).toHaveAttribute('rel', 'nofollow sponsored noopener noreferrer')
    await expect(link).toHaveAttribute('target', '_blank')
  }

  await expect(section).not.toContainText(/Agoda|Trip\.com|Expedia|Klook|12Go|Airalo|Yesim/i)
})
