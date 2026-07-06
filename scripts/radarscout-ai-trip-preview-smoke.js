#!/usr/bin/env node
/* eslint-disable no-console */

const { createRequire } = require('node:module')
const path = require('node:path')

function loadChromium() {
  try {
    return require('@playwright/test').chromium
  } catch {
    const webRequire = createRequire(path.join(__dirname, '..', 'apps', 'web', 'package.json'))
    return webRequire('@playwright/test').chromium
  }
}

const forbiddenCopy = [
  'ai booked this',
  'live availability',
  'available now',
  'guaranteed slot',
  'instant confirmation',
  'checkout',
  'payment',
  'reservation complete',
  'bókun backend',
  'bokun backend',
  'bókun database',
  'bokun database',
  'bókun-powered',
  'bokun-powered',
  'fake reviews',
  'fake ratings',
  'supplier net rate',
  'partner rate',
  'commission',
]

const okAiTripSearchResponse = {
  status: 'ok',
  intent: {
    destination: 'Chiang Mai',
    days: 3,
    interests: ['elephants', 'temples', 'food'],
  },
  products: [
    {
      id: 'prod_cm_1',
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A half-day ethical elephant experience in Mae Rim.',
      tags: ['Elephants', 'Nature'],
      detailHref: '/tours/prod_cm_1',
      retailPrice: '49.00',
      currency: 'USD',
    },
    {
      id: 'prod_cm_2',
      title: 'Old City Temple Walk',
      city: 'Chiang Mai',
      summary: 'A guided walk through historic temples of the old city.',
      tags: ['Temples', 'Culture'],
      detailHref: '/tours/prod_cm_2',
      retailPrice: '29.00',
      currency: 'USD',
    },
    {
      id: 'prod_cm_3',
      title: 'Night Bazaar Food Tour',
      city: 'Chiang Mai',
      summary: 'Street food sampling at the Chiang Mai Night Bazaar.',
      tags: ['Food', 'Local'],
      detailHref: '/tours/prod_cm_3',
      retailPrice: null,
      currency: null,
    },
  ],
  meta: {
    productRetrievalEnabled: true,
    itineraryGenerationEnabled: false,
    bookingEnabled: false,
    availabilityEnabled: false,
  },
}

function usage() {
  console.error(`Usage:
  pnpm smoke:ai-trip-preview <vercel-preview-ai-trip-planner-url>

Examples:
  pnpm smoke:ai-trip-preview https://example.vercel.app/ai-trip-planner
  pnpm smoke:ai-trip-preview 'https://example.vercel.app/ai-trip-planner?_vercel_share=...'

Notes:
  - This script is read-only.
  - It refuses RadarScout production domains.
  - It mocks /api/ai-trip/search to validate the deployed frontend shell without depending on preview DB seed state.
  - It does not print, store, or request secrets.`)
}

function parseUrl(rawUrl) {
  if (!rawUrl || rawUrl === '-h' || rawUrl === '--help') return null

  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`)
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Expected an https:// preview URL.')
  }

  if (parsed.hostname === 'radarscout.io' || parsed.hostname === 'www.radarscout.io') {
    throw new Error('Refusing to run against RadarScout production domains.')
  }

  if (!parsed.hostname.endsWith('.vercel.app')) {
    throw new Error(`Expected a Vercel preview hostname ending in .vercel.app, got: ${parsed.hostname}`)
  }

  if (parsed.pathname !== '/ai-trip-planner') {
    parsed.pathname = '/ai-trip-planner'
  }

  return parsed.toString()
}

async function runSmoke(targetUrl) {
  const chromium = loadChromium()
  const unsafeNetwork = []
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })

  await page.route('**/api/ai-trip/search', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(okAiTripSearchResponse),
  }))

  page.on('request', request => {
    const requestUrl = request.url().toLowerCase()
    if (
      requestUrl.includes('/api/bokun') ||
      requestUrl.includes('openai') ||
      requestUrl.includes('llm') ||
      requestUrl.includes('checkout') ||
      requestUrl.includes('payment') ||
      requestUrl.includes('booking-submission')
    ) {
      unsafeNetwork.push(request.url())
    }
  })

  try {
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle' })
    const status = response?.status() ?? null

    await page.locator('#trip-idea').waitFor({ timeout: 15_000 })
    await page.fill('#trip-idea', 'Chiang Mai 3 days elephants temples food')
    await page.click('button[type="submit"]')
    await page.getByRole('button', { name: /confirm trip intent/i }).click()
    await page.getByRole('button', { name: /search real thailand experiences/i }).click()
    await page.getByRole('status').filter({ hasText: /results ready/i }).waitFor({ timeout: 20_000 })

    const title = await page.title()
    const robots = await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null)
    const topMatchHref = await page.getByRole('link', { name: /open top match details/i }).getAttribute('href')
    const productCardCount = await page.getByRole('link', { name: /view details for/i }).count()
    const resultSummaryVisible = await page.getByLabel(/result fit summary/i).isVisible()
    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    const bodyText = (await page.locator('body').innerText()).toLowerCase()
    const forbiddenMatches = forbiddenCopy.filter(term => bodyText.includes(term))

    const result = {
      status,
      title,
      robots,
      topMatchHref,
      productCardCount,
      resultSummaryVisible,
      noHorizontalOverflow: viewport.scrollWidth <= viewport.clientWidth + 1,
      viewport,
      unsafeNetwork,
      forbiddenMatches,
    }

    const failedChecks = [
      result.status !== 200 ? 'status_not_200' : null,
      result.title !== 'Thailand AI Trip Planner | RadarScout' ? 'unexpected_title' : null,
      result.robots !== 'noindex, nofollow' ? 'unexpected_robots' : null,
      !result.topMatchHref?.includes('source=ai-trip-planner') ? 'missing_source_param' : null,
      result.productCardCount !== 3 ? 'unexpected_product_card_count' : null,
      !result.resultSummaryVisible ? 'missing_result_fit_summary' : null,
      !result.noHorizontalOverflow ? 'horizontal_overflow' : null,
      result.unsafeNetwork.length > 0 ? 'unsafe_network' : null,
      result.forbiddenMatches.length > 0 ? 'forbidden_copy' : null,
    ].filter(Boolean)

    console.log(JSON.stringify({ ok: failedChecks.length === 0, failedChecks, ...result }, null, 2))

    if (failedChecks.length > 0) {
      process.exitCode = 1
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  const targetUrl = parseUrl(process.argv[2])
  if (!targetUrl) {
    usage()
    process.exit(process.argv[2] ? 0 : 2)
  }

  await runSmoke(targetUrl)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
