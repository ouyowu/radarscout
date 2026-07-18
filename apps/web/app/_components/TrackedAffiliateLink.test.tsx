import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { track } from '@/lib/analytics/track'
import { TrackedAffiliateLink } from './TrackedAffiliateLink'

vi.mock('@/lib/analytics/track', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics/track')>('@/lib/analytics/track')

  return {
    ...actual,
    track: vi.fn(),
  }
})

describe('TrackedAffiliateLink', () => {
  it('tracks provider and placement before preserving the safe external handoff', () => {
    const href = 'https://www.getyourguide.com/bangkok-l169/?partner_id=IMR8EUB&cmp=radarscout_city_guide_bangkok'
    const element = TrackedAffiliateLink({
      href,
      provider: 'getyourguide',
      placement: 'city_guide',
      destination: 'Bangkok',
      campaign: 'radarscout_city_guide_bangkok',
      children: 'Compare Bangkok activities',
    }) as ReactElement<{
      href: string
      target: string
      rel: string
      onClick: () => void
    }>

    element.props.onClick()

    expect(element.props.href).toBe(href)
    expect(element.props.target).toBe('_blank')
    expect(element.props.rel).toBe('nofollow sponsored noopener noreferrer')
    expect(track).toHaveBeenCalledWith('affiliate_partner_handoff_clicked', {
      provider: 'getyourguide',
      placement: 'city_guide',
      destination: 'Bangkok',
      campaign: 'radarscout_city_guide_bangkok',
    })
  })
})
