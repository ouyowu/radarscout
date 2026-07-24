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

function hasValidConfirmedOccupancy(context: AffiliateTripContext): boolean {
  const { adultCount, childCount, groupSize } = context
  if (
    adultCount === null
    || childCount === null
    || !Number.isInteger(adultCount)
    || !Number.isInteger(childCount)
    || adultCount < 1
    || adultCount > 10
    || childCount < 0
    || childCount > 9
    || adultCount + childCount > 10
  ) {
    return false
  }

  return groupSize === null || groupSize === adultCount + childCount
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

  const hasConfirmedDates = isValidDateRange(context.startDate, context.endDate)
  const hasConfirmedOccupancy = hasValidConfirmedOccupancy(context)
  if (!hasConfirmedDates && !hasConfirmedOccupancy) return href

  if (hasConfirmedDates) {
    url.searchParams.set('checkin', context.startDate!)
    url.searchParams.set('checkout', context.endDate!)
  }
  if (hasConfirmedOccupancy) {
    url.searchParams.set('NumberofAdults', String(context.adultCount))
    url.searchParams.set('NumberofChildren', String(context.childCount))
    url.searchParams.set('Rooms', '1')
  }
  return url.toString()
}
