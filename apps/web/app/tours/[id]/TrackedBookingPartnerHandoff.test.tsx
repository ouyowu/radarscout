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
    const href = 'https://www.viator.com/tours/Chiang-Mai/Reviewed-Day-Trip/d5267-12345P1?pid=P00309837&mcid=42383&medium=link'
    const element = TrackedBookingPartnerHandoff({
      href,
      rel: 'nofollow sponsored noopener noreferrer',
      productId: 'viator_12345p1',
      source: 'ai-trip-planner',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
      children: 'Check availability',
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
    expect(track).toHaveBeenCalledWith('booking_partner_handoff_clicked', {
      provider: 'viator',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      destination: 'Chiang Mai',
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
      productId: 'viator_12345p1',
      source: 'ai-trip-planner',
    })
    expect(track).not.toHaveBeenCalledWith(
      'booking_partner_handoff_clicked',
      expect.objectContaining({ href: expect.any(String) }),
    )
  })
})
