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
      city: 'Bangkok',
      destination: 'Bangkok',
      hasDates: false,
      campaign: 'radarscout_city_guide_bangkok',
    })
  })

  it('records only date presence without changing the provider URL', () => {
    const href = 'https://www.getyourguide.com/chiang-mai-l271/?partner_id=IMR8EUB&cmp=radarscout_city_guide_chiang_mai'
    const element = TrackedAffiliateLink({
      href,
      provider: 'getyourguide',
      placement: 'city_guide',
      destination: 'Chiang Mai',
      campaign: 'radarscout_city_guide_chiang_mai',
      hasDates: true,
      children: 'Compare Chiang Mai activities',
    }) as ReactElement<{ href: string; onClick: () => void }>

    element.props.onClick()

    expect(element.props.href).toBe(href)
    expect(track).toHaveBeenCalledWith('affiliate_partner_handoff_clicked', expect.objectContaining({
      city: 'Chiang Mai',
      hasDates: true,
    }))
    expect(track).not.toHaveBeenCalledWith(
      'affiliate_partner_handoff_clicked',
      expect.objectContaining({ startDate: expect.any(String) }),
    )
  })
})
