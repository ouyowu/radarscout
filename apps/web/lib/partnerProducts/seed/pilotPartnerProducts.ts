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
  imageUrl?: string
  imageAlt?: string
  sourceImageUrls?: string[]
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
      'A morning Chiang Mai elephant sanctuary experience for travelers comparing a gentle half-day plan.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Morning'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232729',
    imageUrl:
      'https://imgcdn.bokun.tools/768dfe3e-be4b-4d37-9c0c-40b9e5c83902.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Elephants at a Chiang Mai sanctuary morning program',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/768dfe3e-be4b-4d37-9c0c-40b9e5c83902.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/7b8db0a7-7708-4050-b66a-ac480c7a965a.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/9db18a11-a0e1-49aa-807e-53b3dfcc1b46.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/7343ef86-2198-4444-97f9-abf3481adc40.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/f1d9bed8-7534-4ca0-b4dd-681905a0be2a.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232731',
    slug: 'half-day-afternoon-elephant-sanctuary-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai',
    shortSummary:
      'A reviewed half-day afternoon elephant sanctuary in Chiang Mai for travelers who want a shorter experience window.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Afternoon'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232731',
    imageUrl:
      'https://imgcdn.bokun.tools/717145ed-7ff0-497e-b06e-60ffac9fbb75.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Elephant sanctuary afternoon program in Chiang Mai',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/717145ed-7ff0-497e-b06e-60ffac9fbb75.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/d0040b78-b2e0-486e-aaed-f1dac1b4ac73.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/1cb92500-a933-4113-afc2-eccfe91b77e9.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/6c62a25e-ecbb-4cce-80de-8ad54f112890.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/8b6e1e09-56d3-48f9-90b4-918bd20ca8b9.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232733',
    slug: 'full-day-elephant-sanctuary-pad-thai-cooking-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai',
    shortSummary:
      'A full-day Chiang Mai plan combining elephant sanctuary time with Pad Thai cooking.',
    tags: ['Elephants', 'Chiang Mai', 'Cooking', 'Full Day', 'Food'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232733',
    imageUrl:
      'https://imgcdn.bokun.tools/701c6b95-1c3f-4799-885b-65806d93b2de.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Chiang Mai elephant sanctuary and Pad Thai cooking experience',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/701c6b95-1c3f-4799-885b-65806d93b2de.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/7cf009c0-0760-497f-9872-e0208b57f3e1.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/e55f3a33-e221-496d-a8ef-85ecff88b338.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/f738bd14-1a5a-45bf-997b-b312807c3243.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/c76e5b79-166b-449f-aeaf-a19765915221.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232736',
    slug: 'thai-cooking-class-ethical-elephant-sanctuary-chiang-mai',
    destination: 'Chiang Mai',
    title: 'Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai',
    shortSummary:
      'A Chiang Mai experience pairing Thai cooking with an elephant sanctuary visit.',
    tags: ['Elephants', 'Chiang Mai', 'Cooking', 'Food'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232736',
    imageUrl:
      'https://imgcdn.bokun.tools/2cb1c7d0-0255-4b9c-a0f5-89b8531a4ee2.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Thai cooking class and ethical elephant sanctuary in Chiang Mai',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/2cb1c7d0-0255-4b9c-a0f5-89b8531a4ee2.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/3011c832-2914-4646-bd5f-9f5e5561d111.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/6291fc02-0859-4da4-bb4f-668acc869950.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/e4a86f25-1116-4cc3-abb4-ff801e767b73.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/5cb2071b-5b60-48db-815c-164af3985335.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1232798',
    slug: 'inthanon-heaven-trail-living-green-elephant-sanctuary',
    destination: 'Chiang Mai',
    title: 'Inthanon Heaven Trail (Living Green Elephant Sanctuary)',
    shortSummary:
      'A Chiang Mai nature-focused trail experience connected to Living Green Elephant Sanctuary.',
    tags: ['Elephants', 'Chiang Mai', 'Nature', 'Trail'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232798',
    imageUrl:
      'https://imgcdn.bokun.tools/819e571c-d6da-4653-9052-eb225a7c9fb9.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Inthanon Heaven Trail with Living Green Elephant Sanctuary',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/819e571c-d6da-4653-9052-eb225a7c9fb9.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/917ab598-6609-4fce-94fe-836872e23dad.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/04736811-7500-43c1-b699-990438fba4db.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/674f1247-3b0c-4e65-949e-f11135920282.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/5143950e-cf71-4d11-b9d1-79701c3a86e2.jpg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236811',
    slug: 'day-for-elephant-half-day-morning-bigboy',
    destination: 'Chiang Mai',
    title: 'Day for Elephant Half-Day Morning-Bigboy',
    shortSummary:
      'A Bigboy half-day morning elephant experience in Chiang Mai for shorter trip plans.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Morning'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236811',
    imageUrl:
      'https://imgcdn.bokun.tools/89672328-7e94-4044-94e6-4712aadc1951.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Bigboy half-day morning elephant experience in Chiang Mai',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/89672328-7e94-4044-94e6-4712aadc1951.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/7c303b20-b43b-42f1-abab-e5061f019129.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/21b76f3b-4f52-4378-a108-5072aa7cb0cb.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/5ac301e1-1713-4f80-9380-bda0ef475b93.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/57c7cefd-da57-442e-be3f-88ad9ab9e29c.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236820',
    slug: 'day-for-elephant-half-day-afternoon',
    destination: 'Chiang Mai',
    title: 'Day for Elephant Half-Day Afternoon',
    shortSummary:
      'A Bigboy-style Chiang Mai elephant experience for later-day trip plans.',
    tags: ['Elephants', 'Chiang Mai', 'Half Day', 'Afternoon'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236820',
    imageUrl:
      'https://imgcdn.bokun.tools/66d48eb8-8949-476a-a794-5c04c3be6cca.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
    imageAlt: 'Half-day afternoon elephant experience in Chiang Mai',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/66d48eb8-8949-476a-a794-5c04c3be6cca.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      'https://imgcdn.bokun.tools/fafad4e5-4a99-41dc-bd81-307f3b20f9ef.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/e905e9b3-2a17-4c36-963b-468df0b7b6cd.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/dcfc3949-761d-4be1-bc6f-0e2f1ec83cab.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
      'https://imgcdn.bokun.tools/f759ad45-1bc4-41df-8a4b-688e211e79a8.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=294&h=221',
    ],
    reviewedBy: 'ouyowu',
    reviewedAt: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 'partner_cm_1236830',
    slug: 'day-for-elephant-bamboo-rafting-adventure-natural-beauty',
    destination: 'Chiang Mai',
    title: 'Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty',
    shortSummary:
      'A Chiang Mai elephant and bamboo rafting day for travelers comparing nature-led experiences.',
    tags: ['Elephants', 'Chiang Mai', 'Rafting', 'Nature'],
    partnerName: 'Living Green Elephant Sanctuary',
    bookingWidgetUrl:
      'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1236830',
    imageUrl:
      'https://imgcdn.bokun.tools/83b682f3-57b5-4d7f-8d3b-3a0c5ebba017.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=1200&h=450',
    imageAlt: 'Elephant and bamboo rafting adventure in Chiang Mai',
    sourceImageUrls: [
      'https://imgcdn.bokun.tools/83b682f3-57b5-4d7f-8d3b-3a0c5ebba017.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=1200&h=450',
    ],
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
