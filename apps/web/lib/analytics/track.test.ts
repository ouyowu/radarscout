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

  it('sends only approved dimensions through the server event beacon', async () => {
    const fakeWindow = {} as Window
    const sendBeacon = vi.fn(() => true)
    vi.stubGlobal('window', fakeWindow)
    vi.stubGlobal('navigator', { sendBeacon })

    track('booking_partner_handoff_clicked', {
      provider: 'viator',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      productId: 'viator_6467bkknight',
      hasDates: true,
      prompt: 'private trip prompt',
      email: 'traveler@example.com',
      price: 99,
      destination: 'Chiang Mai',
      source: 'tour-detail',
      recommendationSource: 'tour-detail',
      reasonCode: 'destination_match',
      durationDays: 3,
      pace: 'moderate',
    })

    expect(sendBeacon).toHaveBeenCalledTimes(1)
    const [path, body] = sendBeacon.mock.calls[0] as unknown as [string, Blob]
    expect(path).toBe('/api/events')
    expect(body).toBeInstanceOf(Blob)
    expect(JSON.parse(await body.text())).toEqual({
      event: 'booking_partner_handoff_clicked',
      provider: 'viator',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      productId: 'viator_6467bkknight',
      hasDates: true,
      recommendationSource: 'tour-detail',
      reasonCode: 'destination_match',
      durationDays: 3,
      pace: 'moderate',
    })
  })

  it('keeps analytics and handoff callers safe when the event beacon fails', () => {
    const fakeWindow = {} as Window
    const sendBeacon = vi.fn(() => {
      throw new Error('beacon blocked')
    })
    vi.stubGlobal('window', fakeWindow)
    vi.stubGlobal('navigator', { sendBeacon })

    expect(() =>
      track('booking_partner_handoff_clicked', {
        provider: 'viator',
        placement: 'tour_detail_primary',
      }),
    ).not.toThrow()
    expect(sendBeacon).toHaveBeenCalledTimes(1)
    expect(fakeWindow.dataLayer).toHaveLength(1)
    expect(trackVercelEvent).toHaveBeenCalledTimes(1)
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
