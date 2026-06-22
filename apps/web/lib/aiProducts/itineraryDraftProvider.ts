import 'server-only'
import type { ItineraryDraftInput } from './itineraryDraftInputBuilder'

export interface ItineraryDraftProvider {
  generate(input: ItineraryDraftInput): Promise<unknown>
}

export class ItineraryProviderUnavailableError extends Error {
  constructor() {
    super('Itinerary draft provider is unavailable')
    this.name = 'ItineraryProviderUnavailableError'
  }
}

export class MockItineraryDraftProvider implements ItineraryDraftProvider {
  private readonly fixture: unknown
  private readonly useFixture: boolean

  constructor(opts?: { fixture?: unknown }) {
    this.useFixture = opts !== undefined && 'fixture' in opts
    this.fixture = opts?.fixture
  }

  generate(input: ItineraryDraftInput): Promise<unknown> {
    if (this.useFixture) {
      return Promise.resolve(this.fixture)
    }

    const { destination, durationDays, products } = input

    // Assign each product to exactly one day to avoid cross-day duplicates.
    const days = Array.from({ length: durationDays }, (_, i) => {
      const dayNumber = i + 1
      const product = products[i] ?? null

      const items = product
        ? [
            {
              type: 'experience' as const,
              productId: product.id,
              title: product.title,
              description: product.summary ?? `Visit ${product.title} in ${product.city ?? destination}.`,
              timeOfDay: 'morning' as const,
            },
          ]
        : [
            {
              type: 'free_time' as const,
              title: 'Free exploration',
              description: `Explore ${destination} at your own pace.`,
              timeOfDay: 'flexible' as const,
            },
          ]

      return {
        day: dayNumber,
        title: `Day ${dayNumber} in ${destination}`,
        theme: 'Exploration',
        items,
      }
    })

    return Promise.resolve({
      destination,
      durationDays,
      summary: `AI suggested ${durationDays}-day itinerary for ${destination} with matched real Thailand experiences.`,
      days,
      warnings: [],
    })
  }
}
