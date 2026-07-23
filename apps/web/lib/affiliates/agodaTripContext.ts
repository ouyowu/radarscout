import type { AffiliateTripContext } from './affiliateTripContext'

const AGODA_ORIGIN = 'https://www.agoda.com'
const AGODA_AFFILIATE_PATH = '/partners/partnersearch.aspx'
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

function parseIsoDate(value: string): number | null {
  if (!isoDatePattern.test(value)) return null

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? date.getTime()
    : null
}

function isValidDateRange(startDate: string | null, endDate: string | null): boolean {
  if (!startDate || !endDate) return false

  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)
  return start !== null && end !== null && end > start
}

export function addAgodaTripContextToHref(
  href: string,
  context: AffiliateTripContext,
): string {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return href
  }

  if (url.origin !== AGODA_ORIGIN || url.pathname !== AGODA_AFFILIATE_PATH) return href
  if (!isValidDateRange(context.startDate, context.endDate)) return href

  url.searchParams.set('checkin', context.startDate!)
  url.searchParams.set('checkout', context.endDate!)
  return url.toString()
}
