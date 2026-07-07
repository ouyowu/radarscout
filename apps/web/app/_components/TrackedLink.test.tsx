import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { track } from '@/lib/analytics/track'
import { TrackedLink } from './TrackedLink'

vi.mock('@/lib/analytics/track', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics/track')>('@/lib/analytics/track')

  return {
    ...actual,
    track: vi.fn(),
  }
})

describe('TrackedLink', () => {
  it('tracks the configured funnel event before preserving the link href', () => {
    const element = TrackedLink({
      href: '/chiang-mai/elephant-camp-finder#plan-with-radarscout',
      event: 'homepage_finder_entry_click',
      eventProps: { source: 'hero' },
      children: 'Plan a Chiang Mai elephant day',
    }) as ReactElement<{
      href: string
      onClick: () => void
    }>

    element.props.onClick()

    expect(element.props.href).toBe('/chiang-mai/elephant-camp-finder#plan-with-radarscout')
    expect(track).toHaveBeenCalledWith('homepage_finder_entry_click', { source: 'hero' })
  })
})
