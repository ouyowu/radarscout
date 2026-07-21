export type AffiliateProvider =
  | 'agoda'
  | 'trip_com'
  | 'expedia'
  | 'getyourguide'
  | 'klook'
  | '12go'
  | 'airalo'
  | 'yesim'

export type AffiliatePlacement =
  | 'hotel_results'
  | 'city_guide'
  | 'multi_city_transport'
  | 'pre_departure'

type AffiliateActivationStatus =
  | 'active'
  | 'awaiting_domain_approval'
  | 'awaiting_tracking_link'
  | 'awaiting_provider_decision'

type AffiliateProviderConfig = {
  status: AffiliateActivationStatus
  placements: AffiliatePlacement[]
}

export type AffiliateOffer = {
  provider: AffiliateProvider
  placement: AffiliatePlacement
  destination: string
  campaign: string
  href: string
}

export const affiliatePlacementPolicy: Record<AffiliatePlacement, AffiliateProvider[]> = {
  hotel_results: ['agoda', 'trip_com', 'expedia'],
  city_guide: ['getyourguide', 'klook'],
  multi_city_transport: ['12go'],
  pre_departure: ['airalo', 'yesim'],
}

export const primaryPreDepartureProvider: 'airalo' | 'yesim' | null = 'yesim'

const providerConfig: Record<AffiliateProvider, AffiliateProviderConfig> = {
  agoda: { status: 'active', placements: ['hotel_results'] },
  trip_com: { status: 'awaiting_tracking_link', placements: ['hotel_results'] },
  expedia: { status: 'awaiting_tracking_link', placements: ['hotel_results'] },
  getyourguide: { status: 'active', placements: ['city_guide'] },
  klook: { status: 'awaiting_tracking_link', placements: ['city_guide'] },
  '12go': { status: 'awaiting_tracking_link', placements: ['multi_city_transport'] },
  airalo: { status: 'awaiting_provider_decision', placements: ['pre_departure'] },
  yesim: { status: 'active', placements: ['pre_departure'] },
}

const GETYOURGUIDE_PARTNER_ID = 'IMR8EUB'
const YESIM_PARTNER_ID = '5044'
const YESIM_RADARSCOUT_SUB_ID = '597'
const YESIM_THAILAND_PATH = '/country/thailand/'

const getYourGuideCities = {
  bangkok: { name: 'Bangkok', path: '/bangkok-l169/' },
  'chiang-mai': { name: 'Chiang Mai', path: '/chiang-mai-l271/' },
  phuket: { name: 'Phuket', path: '/phuket-l32123/' },
} as const

export type GetYourGuideCitySlug = keyof typeof getYourGuideCities

function normalizeGetYourGuideCitySlug(destination: string): string {
  return destination.trim().toLowerCase().replaceAll(/\s+/g, '-')
}

export function getActiveAffiliateProviders(placement: AffiliatePlacement): AffiliateProvider[] {
  return affiliatePlacementPolicy[placement].filter(provider => {
    if (placement === 'pre_departure' && provider !== primaryPreDepartureProvider) return false

    const config = providerConfig[provider]
    return config.status === 'active' && config.placements.includes(placement)
  })
}

type AffiliateHrefValidationContext = {
  expectedAgodaCid?: string
}

export function validateAffiliateHref(
  provider: AffiliateProvider,
  href: string,
  context: AffiliateHrefValidationContext = {},
): boolean {
  if (providerConfig[provider].status !== 'active') return false

  try {
    const url = new URL(href)
    if (url.protocol !== 'https:') return false

    if (provider === 'getyourguide') {
      return url.hostname === 'www.getyourguide.com'
        && url.searchParams.get('partner_id') === GETYOURGUIDE_PARTNER_ID
    }

    if (provider === 'yesim') {
      return url.hostname === 'yesim.app'
        && url.pathname === YESIM_THAILAND_PATH
        && url.searchParams.get('partner_id') === YESIM_PARTNER_ID
        && url.searchParams.get('sid') === YESIM_RADARSCOUT_SUB_ID
    }

    if (provider === 'agoda') {
      const expectedCid = context.expectedAgodaCid?.trim()
      return url.hostname === 'www.agoda.com'
        && Boolean(expectedCid)
        && url.searchParams.get('cid') === expectedCid
    }

    return false
  } catch {
    return false
  }
}

export function buildYesimPreDepartureOffer(): AffiliateOffer | null {
  if (!getActiveAffiliateProviders('pre_departure').includes('yesim')) return null

  const url = new URL(YESIM_THAILAND_PATH, 'https://yesim.app')
  url.searchParams.set('partner_id', YESIM_PARTNER_ID)
  url.searchParams.set('sid', YESIM_RADARSCOUT_SUB_ID)

  if (!validateAffiliateHref('yesim', url.toString())) return null

  return {
    provider: 'yesim',
    placement: 'pre_departure',
    destination: 'Thailand',
    campaign: 'radarscout_thailand_esim',
    href: url.toString(),
  }
}

export function buildGetYourGuideCityGuideOffer(destination: string): AffiliateOffer | null {
  if (!getActiveAffiliateProviders('city_guide').includes('getyourguide')) return null
  const citySlug = normalizeGetYourGuideCitySlug(destination)
  if (!(citySlug in getYourGuideCities)) return null

  const city = getYourGuideCities[citySlug as GetYourGuideCitySlug]
  const campaign = `radarscout_city_guide_${citySlug.replaceAll('-', '_')}`
  const url = new URL(city.path, 'https://www.getyourguide.com')
  url.searchParams.set('partner_id', GETYOURGUIDE_PARTNER_ID)
  url.searchParams.set('cmp', campaign)

  if (!validateAffiliateHref('getyourguide', url.toString())) return null

  return {
    provider: 'getyourguide',
    placement: 'city_guide',
    destination: city.name,
    campaign,
    href: url.toString(),
  }
}
