import type { PartnerProduct } from '../partnerProduct'
import { validatePartnerProductRecord } from '../partnerProduct'

// Source: operator-provided private-inputs/partner-products.csv, prepared from a
// read-only Bókun admin review on 2026-07-08. Raw operator input stays gitignored.

export type PartnerProductSeedRecord = {
  id: string
  slug: string
  destination: string
  title: string
  shortSummary: string
  tags: string[]
  partnerName: string
  bookingWidgetUrl: string
  reviewedBy: string
  reviewedAt: string
}

export const pilotPartnerProductSeedRecords = [
  {
    id: 'partner_cm_1232729',
    slug: 'half-day-morning-elephant-sanctuary-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Half-Day Morning Elephant Sanctuary Program in Chiang Mai',
    shortSummary:
      'A reviewed Chiang Mai elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Morning'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232729',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232731',
    slug: 'half-day-afternoon-elephant-sanctuary-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai',
    shortSummary:
      'A reviewed Chiang Mai elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Afternoon'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232731',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232733',
    slug: 'full-day-elephant-sanctuary-pad-thai-cooking-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai',
    shortSummary:
      'A reviewed Chiang Mai elephant and cooking experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Cooking', 'Full Day', 'Food'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232733',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232736',
    slug: 'thai-cooking-class-ethical-elephant-sanctuary-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai',
    shortSummary:
      'A reviewed Chiang Mai cooking and elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Cooking', 'Food'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232736',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232798',
    slug: 'inthanon-heaven-trail-living-green-elephant-sanctuary',
    destination: 'Chiang Mai',
    title: 'Inthanon Heaven Trail (Living Green Elephant Sanctuary)',
    shortSummary:
      'A reviewed Chiang Mai nature and elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Nature', 'Trail'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232798',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236811',
    slug: 'day-for-elephant-half-day-morning-bigboy',
    destination: 'Chiang Mai',
    title: 'Day for Elephant Half-Day Morning-Bigboy',
    shortSummary:
      'A reviewed Chiang Mai elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Morning'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236811',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236820',
    slug: 'day-for-elephant-half-day-afternoon',
    destination: 'Chiang Mai',
    title: 'Day for Elephant Half-Day Afternoon',
    shortSummary:
      'A reviewed Chiang Mai elephant experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Afternoon'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236820',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236830',
    slug: 'day-for-elephant-bamboo-rafting-adventure-natural-beauty',
    destination: 'Chiang Mai',
    title: 'Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty',
    shortSummary:
      'A reviewed Chiang Mai elephant and bamboo rafting experience with a safe booking partner handoff.',
    tags: ['Elephants', 'Chiang Mai', 'Rafting', 'Nature'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236830',
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
] as const satisfies readonly PartnerProductSeedRecord[]

export function loadPilotPartnerProducts(
  records: readonly PartnerProductSeedRecord[] = pilotPartnerProductSeedRecords,
): PartnerProduct[] {
  return records.map((record) => {
    const result = validatePartnerProductRecord(record)

    if (!result.ok) {
      throw new Error(`Invalid partner product seed ${record.id}: ${result.error}`)
    }

    return result.data
  })
}

export const pilotPartnerProducts = loadPilotPartnerProducts()
