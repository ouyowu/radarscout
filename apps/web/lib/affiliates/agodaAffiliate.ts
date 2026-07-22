import 'server-only'

import {
  getActiveAffiliateProviders,
  validateAffiliateHref,
  type AffiliateOffer,
} from './affiliatePartners'
import {
  AGODA_AREA_CITY_NAMES,
  AGODA_AREA_CITY_SLUGS,
  type AgodaAreaCitySlug,
} from './agodaAreaRecommendations'

const AGODA_AFFILIATE_PATH = '/partners/partnersearch.aspx'
const AGODA_PARTNER_SEARCH_CODE = '8'
const cidPattern = /^\d{1,20}$/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const supportedCitySlugs = new Set<string>(AGODA_AREA_CITY_SLUGS)

export type AgodaHotelResultsInput = {
  citySlug: string
  areaSlug: string
}

type AgodaAffiliateDependencies = {
  cid?: string
}

function normalizeCid(value: string | undefined): string | null {
  const cid = value?.trim()
  return cid && cidPattern.test(cid) ? cid : null
}

function normalizeSlug(value: string): string | null {
  const slug = value.trim().toLowerCase()
  return slug.length <= 80 && slugPattern.test(slug) ? slug : null
}

export function buildAgodaHotelResultsOffer(
  input: AgodaHotelResultsInput,
  dependencies: AgodaAffiliateDependencies = {},
): AffiliateOffer | null {
  if (!getActiveAffiliateProviders('hotel_results').includes('agoda')) return null

  const cid = normalizeCid(dependencies.cid ?? process.env.AGODA_AFFILIATE_CID)
  const citySlug = normalizeSlug(input.citySlug)
  const areaSlug = normalizeSlug(input.areaSlug)
  if (!cid || !citySlug || !areaSlug || !supportedCitySlugs.has(citySlug)) return null

  const supportedCitySlug = citySlug as AgodaAreaCitySlug
  const destination = AGODA_AREA_CITY_NAMES[supportedCitySlug]
  const campaign = `radarscout_stay_${citySlug.replaceAll('-', '_')}_${areaSlug.replaceAll('-', '_')}`
  const url = new URL(AGODA_AFFILIATE_PATH, 'https://www.agoda.com')
  url.searchParams.set('cid', cid)
  url.searchParams.set('pcs', AGODA_PARTNER_SEARCH_CODE)
  url.searchParams.set('tag', campaign)

  if (!validateAffiliateHref('agoda', url.toString(), {
    expectedAgodaCid: cid,
    expectedAgodaPath: AGODA_AFFILIATE_PATH,
  })) return null

  return {
    provider: 'agoda',
    placement: 'hotel_results',
    destination,
    campaign,
    href: url.toString(),
  }
}
