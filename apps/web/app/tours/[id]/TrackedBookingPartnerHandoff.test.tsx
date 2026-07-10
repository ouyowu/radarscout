import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { track } from '@/lib/analytics/track'
import { TrackedBookingPartnerHandoff } from './TrackedBookingPartnerHandoff'

vi.mock('@/lib/analytics/track', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics/track')>('@/lib/analytics/track')

  return {
    ...actual,
    track: vi.fn(),
  }
})

describe('TrackedBookingPartnerHandoff', () => {
  it('tracks bounded metadata while preserving the public booking partner handoff', () => {
    const element = TrackedBookingPartnerHandoff({
      href: 'https://widgets.bokun.io/online-sales/public-channel/experience/1236811',
      rel: 'nofollow sponsored noopener noreferrer',
      productId: 'partner_cm_1236811',
      source: 'ai-trip-planner',
      children: 'Check availability',
    }) as ReactElement<{
      href: string
      target: string
      rel: string
      onClick: () => void
    }>

    element.props.onClick()

    expect(element.props.href).toBe('https://widgets.bokun.io/online-sales/public-channel/experience/1236811')
    expect(element.props.target).toBe('_blank')
    expect(element.props.rel).toBe('nofollow sponsored noopener noreferrer')
    expect(track).toHaveBeenCalledWith('booking_partner_handoff_clicked', {
      productId: 'partner_cm_1236811',
      source: 'ai-trip-planner',
    })
    expect(track).not.toHaveBeenCalledWith(
      'booking_partner_handoff_clicked',
      expect.objectContaining({ href: expect.any(String) }),
    )
  })
})
