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

export const primaryPreDepartureProvider: 'airalo' | 'yesim' | null = null

const providerConfig: Record<AffiliateProvider, AffiliateProviderConfig> = {
  agoda: { status: 'awaiting_domain_approval', placements: ['hotel_results'] },
  trip_com: { status: 'awaiting_tracking_link', placements: ['hotel_results'] },
  expedia: { status: 'awaiting_tracking_link', placements: ['hotel_results'] },
  getyourguide: { status: 'active', placements: ['city_guide'] },
  klook: { status: 'awaiting_tracking_link', placements: ['city_guide'] },
  '12go': { status: 'awaiting_tracking_link', placements: ['multi_city_transport'] },
  airalo: { status: 'awaiting_provider_decision', placements: ['pre_departure'] },
  yesim: { status: 'awaiting_provider_decision', placements: ['pre_departure'] },
}

const GETYOURGUIDE_PARTNER_ID = 'IMR8EUB'

const getYourGuideCities = {
  bangkok: { name: 'Bangkok', path: '/bangkok-l169/' },
  'chiang-mai': { name: 'Chiang Mai', path: '/chiang-mai-l271/' },
  phuket: { name: 'Phuket', path: '/phuket-l32123/' },
} as const

export type GetYourGuideCitySlug = keyof typeof getYourGuideCities

export function getActiveAffiliateProviders(placement: AffiliatePlacement): AffiliateProvider[] {
  return affiliatePlacementPolicy[placement].filter(provider => {
    if (placement === 'pre_departure' && provider !== primaryPreDepartureProvider) return false

    const config = providerConfig[provider]
    return config.status === 'active' && config.placements.includes(placement)
  })
}

export function validateAffiliateHref(provider: AffiliateProvider, href: string): boolean {
  if (providerConfig[provider].status !== 'active') return false

  try {
    const url = new URL(href)
    if (url.protocol !== 'https:') return false

    if (provider === 'getyourguide') {
      return url.hostname === 'www.getyourguide.com'
        && url.searchParams.get('partner_id') === GETYOURGUIDE_PARTNER_ID
    }

    return false
  } catch {
    return false
  }
}

export function buildGetYourGuideCityGuideOffer(citySlug: string): AffiliateOffer | null {
  if (!getActiveAffiliateProviders('city_guide').includes('getyourguide')) return null
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
