export const RADARSCOUT_BASE_URL = 'https://www.radarscout.io'
export const RADARSCOUT_ORGANIZATION_ID = `${RADARSCOUT_BASE_URL}/#organization`
export const RADARSCOUT_BRAND_DESCRIPTION =
  'RadarScout is a Thailand activity comparison and decision-support service.'

export function buildRadarScoutOrganization() {
  return {
    '@type': 'Organization',
    '@id': RADARSCOUT_ORGANIZATION_ID,
    name: 'RadarScout',
    url: RADARSCOUT_BASE_URL,
    description: RADARSCOUT_BRAND_DESCRIPTION,
  }
}
