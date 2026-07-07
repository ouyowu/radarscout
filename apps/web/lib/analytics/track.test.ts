import { afterEach, describe, expect, it, vi } from 'vitest'
import { track as trackVercelEvent } from '@vercel/analytics'
import { track } from './track'

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}))

describe('track', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.mocked(trackVercelEvent).mockClear()
  })

  it('is a server-side no-op', () => {
    expect(() => track('homepage_finder_entry_clicked', { source: 'hero' })).not.toThrow()
  })

  it('pushes browser events into dataLayer and the RadarScout queue', () => {
    const fakeWindow = {} as Window
    vi.stubGlobal('window', fakeWindow)

    track('finder_matching_experiences_clicked', { source: 'planner' })

    expect(fakeWindow.dataLayer).toEqual([
      {
        event: 'finder_matching_experiences_clicked',
        source: 'planner',
      },
    ])
    expect(fakeWindow.__radarscoutAnalyticsQueue).toEqual([
      {
        event: 'finder_matching_experiences_clicked',
        source: 'planner',
      },
    ])
    expect(trackVercelEvent).toHaveBeenCalledWith('finder_matching_experiences_clicked', {
      source: 'planner',
    })
  })

  it('caps the in-memory RadarScout queue at 50 events', () => {
    const fakeWindow = {} as Window
    vi.stubGlobal('window', fakeWindow)

    for (let index = 0; index < 55; index += 1) {
      track('booking_partner_handoff_clicked', { index })
    }

    expect(fakeWindow.__radarscoutAnalyticsQueue).toHaveLength(50)
    expect(fakeWindow.__radarscoutAnalyticsQueue?.[0]).toMatchObject({ index: 5 })
    expect(fakeWindow.__radarscoutAnalyticsQueue?.[49]).toMatchObject({ index: 54 })
  })

  it('never throws if analytics globals are not writable', () => {
    const fakeWindow = {} as Window
    Object.defineProperty(fakeWindow, 'dataLayer', {
      get() {
        throw new Error('blocked')
      },
    })
    vi.stubGlobal('window', fakeWindow)

    expect(() => track('finder_planner_viewed')).not.toThrow()
  })
})
