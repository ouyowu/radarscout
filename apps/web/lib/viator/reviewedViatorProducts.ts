import { reviewedViatorBatch2ProductSeedRecords } from './reviewedViatorBatch2Products'
import { reviewedViatorBatch3ProductSeedRecords } from './reviewedViatorBatch3Products'

const REVIEWED_AT = '2026-07-16T00:00:00.000Z'

const cityDestinationIds = {
  Bangkok: '343',
  Bophut: '51001',
  'Chiang Mai': '5267',
  'Chiang Rai': '5268',
  'Hua Hin': '22968',
  Kanchanaburi: '22285',
  'Khao Lak': '23786',
  'Ko Chang': '24532',
  'Ko Lanta': '24522',
  'Ko Lipe': '37757',
  'Ko Pha Ngan': '34192',
  'Ko Phi Phi Don': '40944',
  'Ko Yao Yai': '50552',
  'Koh Tao': '34193',
  Phuket: '349',
  Krabi: '348',
  'Mae Hong Son': '51553',
  Pattaya: '344',
  'Koh Samui': '347',
} as const

const allowedKeys = new Set([
  'id',
  'city',
  'destinationId',
  'productCode',
  'title',
  'shortSummary',
  'tags',
  'productUrl',
  'imageUrl',
  'reviewedAt',
])

const forbiddenKeys = new Set([
  'price',
  'pricing',
  'pricingInfo',
  'availability',
  'inventory',
  'supplier',
  'reviews',
  'rating',
  'raw',
  'rawResponse',
  'viatorUniqueContent',
  'bookingRequirements',
  'bookingQuestions',
  'cancellationPolicy',
])

export type ViatorThailandCity = keyof typeof cityDestinationIds

export type ReviewedViatorProduct = {
  id: string
  city: ViatorThailandCity
  destinationId: string
  productCode: string
  title: string
  shortSummary: string
  tags: readonly string[]
  productUrl: string
  imageUrl: string
  reviewedAt: string
}

export type ReviewedViatorProductValidationResult =
  | { ok: true, data: ReviewedViatorProduct }
  | { ok: false, error: string, fields?: string[] }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function readString(value: unknown, maxLength: number): string | null {
  return typeof value === 'string' && value.trim() !== '' && value.trim().length <= maxLength
    ? value.trim()
    : null
}

function readTags(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 6) return null

  const tags = value.map((tag) => readString(tag, 40))
  return tags.every((tag): tag is string => tag !== null) && new Set(tags).size === tags.length
    ? tags
    : null
}

// The one approved RadarScout Viator affiliate ID. Any other pid means the
// referral would be credited to someone else, so validation fails closed.
export const VIATOR_AFFILIATE_PID = 'P00309837'

function isViatorAffiliateUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && (url.hostname === 'viator.com' || url.hostname.endsWith('.viator.com'))
      && url.searchParams.get('pid') === VIATOR_AFFILIATE_PID
  } catch {
    return false
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateReviewedViatorProduct(value: unknown): ReviewedViatorProductValidationResult {
  const record = asRecord(value)
  if (!record) return { ok: false, error: 'not_object' }

  const keys = Object.keys(record)
  const forbidden = keys.filter((key) => forbiddenKeys.has(key))
  if (forbidden.length > 0) return { ok: false, error: 'forbidden_fields', fields: forbidden }

  const unknown = keys.filter((key) => !allowedKeys.has(key))
  if (unknown.length > 0) return { ok: false, error: 'unknown_fields', fields: unknown }

  const id = readString(record.id, 80)
  const city = readString(record.city, 40)
  const destinationId = readString(record.destinationId, 12)
  const productCode = readString(record.productCode, 48)
  const title = readString(record.title, 220)
  const shortSummary = readString(record.shortSummary, 280)
  const tags = readTags(record.tags)
  const productUrl = readString(record.productUrl, 2_000)
  const imageUrl = readString(record.imageUrl, 2_000)
  const reviewedAt = readString(record.reviewedAt, 40)

  if (!id || !/^viator_[a-z0-9]+$/.test(id)) return { ok: false, error: 'invalid_id' }
  if (!city || !(city in cityDestinationIds)) return { ok: false, error: 'invalid_city' }
  if (!destinationId || cityDestinationIds[city as ViatorThailandCity] !== destinationId) {
    return { ok: false, error: 'invalid_destination' }
  }
  if (!productCode || !/^[a-z0-9]+$/i.test(productCode)) return { ok: false, error: 'invalid_product_code' }
  if (!title) return { ok: false, error: 'invalid_title' }
  if (!shortSummary) return { ok: false, error: 'invalid_short_summary' }
  if (!tags) return { ok: false, error: 'invalid_tags' }
  if (!productUrl || !isViatorAffiliateUrl(productUrl)) return { ok: false, error: 'invalid_product_url' }
  if (!imageUrl || !isHttpsUrl(imageUrl)) return { ok: false, error: 'invalid_image_url' }
  if (!reviewedAt || Number.isNaN(Date.parse(reviewedAt))) return { ok: false, error: 'invalid_reviewed_at' }
  if (id !== `viator_${productCode.toLowerCase()}`) return { ok: false, error: 'invalid_id' }

  return {
    ok: true,
    data: {
      id,
      city: city as ViatorThailandCity,
      destinationId,
      productCode,
      title,
      shortSummary,
      tags,
      productUrl,
      imageUrl,
      reviewedAt,
    },
  }
}

const reviewedViatorProductSeedRecords: readonly ReviewedViatorProduct[] = [
  {
    id: 'viator_5567417p3',
    city: 'Bangkok',
    destinationId: '343',
    productCode: '5567417P3',
    title: 'The Newest Luxury 5-Star Bangkok Chao Phraya Dinner Cruise',
    shortSummary: 'An evening Chao Phraya cruise focused on dinner and Bangkok city views.',
    tags: ['food', 'culture', 'evening'],
    productUrl: 'https://www.viator.com/tours/Bangkok/Bangkok-Chao-Phraya-Cruise-The-newest-luxurious-dinner-cruise/d343-5567417P3?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/72/ce/aa.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_6467bkknight',
    city: 'Bangkok',
    destinationId: '343',
    productCode: '6467BKKNIGHT',
    title: 'Bangkok by Night: Temples, Markets and Food Tuk-Tuk Tour',
    shortSummary: 'A Bangkok night tour by tuk-tuk combining temples, markets and local food.',
    tags: ['food', 'culture', 'night'],
    productUrl: 'https://www.viator.com/tours/Bangkok/Bangkok-by-Night-Food-Temples-and-Markets-by-Tuk-Tuk/d343-6467BKKNIGHT?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/06/73/10/8c.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_191442p6',
    city: 'Chiang Mai',
    destinationId: '5267',
    productCode: '191442P6',
    title: 'Doi Inthanon, Waterfall+Royal Project from Chiang Mai with Lunch',
    shortSummary: 'A Chiang Mai day trip to Doi Inthanon, waterfalls and the Royal Project.',
    tags: ['nature', 'waterfalls', 'day-trip'],
    productUrl: 'https://www.viator.com/tours/Chiang-Mai/Bestseller-Doi-Inthanon-National-Park-and-Waterfall-Highest-mountain-Chiang-Mai/d5267-191442P6?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/09/4e/af/a0.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_26152p7',
    city: 'Chiang Mai',
    destinationId: '5267',
    productCode: '26152P7',
    title: 'Chiang Rai White and Blue Temples Private Trip',
    shortSummary: 'A Chiang Rai day trip focused on the White Temple and Blue Temple.',
    tags: ['temples', 'culture', 'day-trip'],
    productUrl: 'https://www.viator.com/tours/Chiang-Mai/Private-Chiang-Rai-Temples-Tour-from-Chiang-Mai-Including-Lunch/d5267-26152P7?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0d/04/be/f0.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_27424p2',
    city: 'Phuket',
    destinationId: '349',
    productCode: '27424P2',
    title: 'Phi Phi Islands Adventure Day Trip w/ Seaview Lunch by V. Marine',
    shortSummary: 'A speedboat day trip from Phuket to the Phi Phi Islands with lunch.',
    tags: ['islands', 'boat', 'beach'],
    productUrl: 'https://www.viator.com/tours/Phuket/Phi-Phi-Island-Adventure-Day-Trip-by-Speedboat-from-Phuket-with-Lunch/d349-27424P2?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0d/80/43/83.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_208505p1',
    city: 'Phuket',
    destinationId: '349',
    productCode: '208505P1',
    title: 'Luxury Boat to James Bond Islands with Lunch and Sunset Dinner',
    shortSummary: 'A Phuket boat day trip to James Bond Island with meals and a sunset return.',
    tags: ['islands', 'boat', 'sunset'],
    productUrl: 'https://www.viator.com/tours/Phuket/James-Bond-Island-trip-on-Luxury-boat-Lunch-buffet-Dinner-Kayaking-Toys-DJ/d349-208505P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0f/cc/68/8f.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_91960p29',
    city: 'Phuket',
    destinationId: '349',
    productCode: '91960P29',
    title: 'Phuket City Tour with Wat Chalong, Big Buddha & Famous Viewpoints',
    shortSummary: 'A Phuket city sightseeing tour with Wat Chalong, the Big Buddha and viewpoints.',
    tags: ['culture', 'temples', 'city'],
    productUrl: 'https://www.viator.com/tours/Phuket/Phuket-Half-Day-City-Tour/d349-91960P29?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/5d/7f/ed.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_211395p4',
    city: 'Krabi',
    destinationId: '348',
    productCode: '211395P4',
    title: 'ATV Jungle Adventure in Krabi with Roundtrip Transfer',
    shortSummary: 'An off-road ATV adventure through the Krabi countryside.',
    tags: ['adventure', 'atv', 'nature'],
    productUrl: 'https://www.viator.com/tours/Krabi/ATV-Jungle-Adventure-at-Krabi/d348-211395P4?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/20/76/cc.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_111606p1',
    city: 'Krabi',
    destinationId: '348',
    productCode: '111606P1',
    title: 'Private Longtail Boat Tour to Hong Islands',
    shortSummary: 'A private longtail boat trip from Krabi to the Hong Islands.',
    tags: ['islands', 'boat', 'private'],
    productUrl: 'https://www.viator.com/tours/Krabi/Private-Longtail-Boat-Tour-to-Hong-Islands/d348-111606P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/11/6d/12/20.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_231516p1',
    city: 'Krabi',
    destinationId: '348',
    productCode: '231516P1',
    title: 'All day Krabi Jungle Tour (Hot Spring Water, Emerald Pool, Tiger Cave Temple)',
    shortSummary: 'A full-day Krabi route combining hot springs, the Emerald Pool and Tiger Cave Temple.',
    tags: ['nature', 'temples', 'day-trip'],
    productUrl: 'https://www.viator.com/tours/Krabi/Krabi-Jungle-Tour-Hot-Spring-Water-Emerald-Pool-Tiger-Cave-Temple/d348-231516P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/r/33/27/24/c2/caption.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_22127p1',
    city: 'Pattaya',
    destinationId: '344',
    productCode: '22127P1',
    title: 'Pattaya Full-Day 3 Tropical Island tour Snorkeling Cruise Buffet',
    shortSummary: 'A full-day Pattaya island cruise with snorkeling and a Thai buffet.',
    tags: ['islands', 'boat', 'snorkeling'],
    productUrl: 'https://www.viator.com/tours/Pattaya/Full-Day-Sightseeing-Cruise-in-Pattaya-Including-Thai-Buffet-Lunch/d344-22127P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/16/b6/54/52.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_382966p1',
    city: 'Pattaya',
    destinationId: '344',
    productCode: '382966P1',
    title: 'Pattaya Full-Day SUNSET Yacht exclusive Island(Buffet,Snorkeling)',
    shortSummary: 'A Pattaya yacht day trip with island time, snorkeling and a sunset return.',
    tags: ['islands', 'yacht', 'sunset'],
    productUrl: 'https://www.viator.com/tours/Pattaya/Ocean-Yachting-Catamaran-Island-Tour/d344-382966P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/10/0a/31/b6.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_68083p2',
    city: 'Pattaya',
    destinationId: '344',
    productCode: '68083P2',
    title: 'Experienced Riders Tour Pattaya 34km ATV or Buggy Adventure',
    shortSummary: 'An off-road ATV or buggy adventure for experienced riders in Pattaya.',
    tags: ['adventure', 'atv', 'outdoors'],
    productUrl: 'https://www.viator.com/tours/Pattaya/ULTIMATE-ATV-TOUR/d344-68083P2?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/2f/ef/61.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_224272p2',
    city: 'Koh Samui',
    destinationId: '347',
    productCode: '224272P2',
    title: 'Zipline by Hawk Adventure The Biggest & Longest in Koh Samui',
    shortSummary: 'A Koh Samui zipline experience for travelers seeking an active outdoor day.',
    tags: ['adventure', 'zipline', 'nature'],
    productUrl: 'https://www.viator.com/tours/Koh-Samui/Zipline-by-Skyhawk-Adventure-on-Koh-Samui/d347-224272P2?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0a/8c/52/36.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_382123p5',
    city: 'Koh Samui',
    destinationId: '347',
    productCode: '382123P5',
    title: 'Pig Island Tour by Speedboat with Snorkeling',
    shortSummary: 'A Koh Samui speedboat trip to Pig Island with snorkeling.',
    tags: ['islands', 'boat', 'snorkeling'],
    productUrl: 'https://www.viator.com/tours/Koh-Samui/Pig-Island-Tour-by-Speedboat-with-Snorkeling/d347-382123P5?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/4e/7f/aa.jpg',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'viator_338950p1',
    city: 'Koh Samui',
    destinationId: '347',
    productCode: '338950P1',
    title: 'Angthong National Marine Park VIP Small Group Tour',
    shortSummary: 'A Koh Samui boat day trip to Angthong National Marine Park.',
    tags: ['islands', 'boat', 'nature'],
    productUrl: 'https://www.viator.com/tours/Bophut/Angthong-Marine-Park-VIP-Guided-Tour/d51001-338950P1?mcid=42383&pid=P00309837&medium=api&api_version=2.0',
    imageUrl: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/11/82/3a/9a.jpg',
    reviewedAt: REVIEWED_AT,
  },
]

const allReviewedViatorProductSeedRecords: readonly ReviewedViatorProduct[] = [
  ...reviewedViatorProductSeedRecords,
  ...reviewedViatorBatch2ProductSeedRecords,
  ...reviewedViatorBatch3ProductSeedRecords,
]

export function loadReviewedViatorProducts(
  records: readonly ReviewedViatorProduct[] = allReviewedViatorProductSeedRecords,
): ReviewedViatorProduct[] {
  return records.map((record) => {
    const result = validateReviewedViatorProduct(record)
    if (!result.ok) throw new Error(`Invalid reviewed Viator product ${record.id}: ${result.error}`)
    return result.data
  })
}
