import type { DayTripExperience } from '@/lib/ai-trip/itinerary-contract'
import type { ThailandItineraryDayPlan, ThailandItineraryStop } from './thailandTemplates'

const REVIEWED_AT = '2026-07-19'

type ReviewedMapRegion = {
  name: string
  summary: string
  lat: number
  lng: number
  matchTerms: readonly string[]
}

type ReviewedMapCity = {
  cityName: string
  aliases: readonly string[]
  orientation: ReviewedMapRegion
  regions: readonly ReviewedMapRegion[]
}

export type ReviewedPlannerMapArea = {
  cityName: string
  dayPlan: ThailandItineraryDayPlan
  lastReviewedAt: string
  precision: 'area'
  sourceUrl: string
}

function region(
  name: string,
  summary: string,
  lat: number,
  lng: number,
  matchTerms: readonly string[] = [],
): ReviewedMapRegion {
  return { name, summary, lat, lng, matchTerms }
}

const reviewedMapCities: readonly ReviewedMapCity[] = [
  {
    cityName: 'Bangkok',
    aliases: ['bangkok'],
    orientation: region(
      'Bangkok orientation area',
      'A reviewed city-level orientation point. It is not an exact meeting point or product route.',
      13.7563,
      100.5018,
    ),
    regions: [
      region('Damnoen Saduak area', 'Regional orientation for reviewed floating-market day trips from Bangkok.', 13.5197624, 99.9593519, ['floating market', 'damnoen saduak', 'train market', 'railway market', 'maeklong']),
      region('Chao Phraya and canal area', 'Regional orientation for reviewed Bangkok river, canal and dinner-cruise experiences.', 13.7422, 100.4988, ['chao phraya', 'canal', 'longtail', 'dinner cruise', 'river cruise']),
      region('Grand Palace and temple area', 'Regional orientation for reviewed Bangkok old-city palace and temple experiences.', 13.7500, 100.4913, ['grand palace', 'wat pho', 'temple']),
      region('Yaowarat area', 'Regional orientation for reviewed Chinatown and Bangkok food-walk experiences.', 13.7405, 100.5100, ['chinatown', 'yaowarat', 'backstreets food', 'food tour']),
      region('Rajadamnern area', 'Regional orientation for reviewed Bangkok Muay Thai experiences.', 13.7610018, 100.5087556, ['muay thai', 'rajadamnern']),
    ],
  },
  {
    cityName: 'Chiang Mai',
    aliases: ['chiang mai', 'chiangmai'],
    orientation: region(
      'Chiang Mai orientation area',
      'A reviewed city-level orientation point. It is not an exact meeting point or product route.',
      18.7883,
      98.9853,
    ),
    regions: [
      region('Doi Inthanon area', 'Regional orientation for reviewed Doi Inthanon and waterfall day trips from Chiang Mai.', 18.5326746, 98.5578032, ['doi inthanon']),
      region('Chiang Rai temple area', 'Regional orientation for reviewed Chiang Rai temple day trips departing from Chiang Mai.', 19.8238794, 99.7628959, ['chiang rai', 'white temple', 'blue temple', 'golden triangle']),
      region('Bua Tong Sticky Waterfall area', 'Regional orientation for reviewed Bua Tong Sticky Waterfall day trips.', 19.0679872, 99.0795302, ['sticky waterfall', 'bua tong']),
      region('Doi Suthep area', 'Regional orientation for reviewed Doi Suthep and nearby temple experiences.', 18.8166077, 98.8923600, ['doi suthep', 'wat pha lat']),
    ],
  },
  {
    cityName: 'Phuket',
    aliases: ['phuket', 'phuket town'],
    orientation: region(
      'Phuket orientation area',
      'A reviewed island-level orientation point. It is not an exact meeting point or product route.',
      7.8804,
      98.3923,
    ),
    regions: [
      region('Phi Phi Islands area', 'Regional orientation for reviewed Phi Phi Islands day trips departing from Phuket.', 7.7522403, 98.7766434, ['phi phi', 'maya bay']),
      region('Phang Nga Bay area', 'Regional orientation for reviewed Phang Nga Bay and James Bond Island day trips.', 8.2916672, 98.5527728, ['phang nga', 'james bond']),
      region('Big Buddha Phuket area', 'Regional orientation for reviewed Phuket city, viewpoint and Big Buddha experiences.', 7.8275211, 98.3124447, ['big buddha', 'wat chalong', 'city tour', 'viewpoint']),
    ],
  },
  {
    cityName: 'Pattaya',
    aliases: ['pattaya'],
    orientation: region(
      'Pattaya orientation area',
      'A reviewed city-level orientation point. It is not an exact meeting point or product route.',
      12.9236,
      100.8825,
    ),
    regions: [
      region('Koh Larn area', 'Regional orientation for reviewed Koh Larn and Coral Island day trips from Pattaya.', 12.9174502, 100.7782008, ['koh larn', 'ko larn', 'coral island', 'tropical island']),
      region('Sanctuary of Truth area', 'Regional orientation for reviewed Sanctuary of Truth visits in Pattaya.', 12.9727770, 100.8891503, ['sanctuary of truth']),
    ],
  },
  {
    cityName: 'Koh Samui',
    aliases: ['koh samui', 'ko samui', 'samui'],
    orientation: region(
      'Koh Samui orientation area',
      'A reviewed island-level orientation point. It is not an exact meeting point or product route.',
      9.5120,
      100.0136,
    ),
    regions: [
      region('Ang Thong Marine Park area', 'Regional orientation for reviewed Ang Thong Marine Park day trips from Koh Samui.', 9.5375403, 99.6934068, ['ang thong', 'angthong']),
      region('Pig Island area', 'Regional orientation for reviewed Pig Island and Koh Taen day trips from Koh Samui.', 9.3729727, 99.9786959, ['pig island', 'koh madsum', 'koh mudsum', 'koh taen']),
      region('Koh Tao area', 'Regional orientation for reviewed Koh Tao and Koh Nang Yuan day trips from Koh Samui.', 10.0921822, 99.8395362, ['koh tao', 'ko tao', 'nang yuan']),
    ],
  },
  {
    cityName: 'Krabi',
    aliases: ['krabi', 'ao nang'],
    orientation: region(
      'Krabi orientation area',
      'A reviewed city-level orientation point. It is not an exact meeting point or product route.',
      8.0863,
      98.9063,
    ),
    regions: [
      region('Hong Islands area', 'Regional orientation for reviewed Hong Islands day trips from Krabi.', 8.0781357, 98.6772610, ['hong island', 'hong islands']),
      region('Phi Phi Islands area', 'Regional orientation for reviewed Phi Phi Islands day trips departing from Krabi.', 7.7522403, 98.7766434, ['phi phi', 'maya bay', 'bamboo island']),
      region('Emerald Pool area', 'Regional orientation for reviewed Emerald Pool, hot spring and nearby inland day trips.', 7.9250975, 99.2681871, ['emerald pool', 'hot spring', 'tiger cave']),
      region('Ao Nang area', 'Regional orientation for reviewed Ao Nang and nearby island-departure experiences.', 8.0310923, 98.8218831, ['ao nang', '4 island', 'four island', '7 island', 'seven island']),
    ],
  },
] as const

function normalize(value: string): string {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, ' ').trim()
}

function sourceUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=11/${lat}/${lng}`
}

function toStop(selected: ReviewedMapRegion): ThailandItineraryStop {
  return {
    name: selected.name,
    summary: selected.summary,
    lat: selected.lat,
    lng: selected.lng,
    durationMinutes: 60,
    themeTags: ['reviewed-area', 'orientation'],
  }
}

export function getReviewedPlannerMapArea(
  destination: string,
  dayNumber: number,
  product: DayTripExperience,
): ReviewedPlannerMapArea | null {
  if (!Number.isInteger(dayNumber) || dayNumber <= 0 || !product.city) return null

  const normalizedDestination = normalize(destination)
  const normalizedProductCity = normalize(product.city)
  const city = reviewedMapCities.find(candidate =>
    candidate.aliases.some(alias => normalize(alias) === normalizedDestination),
  )

  if (!city || !city.aliases.some(alias => normalize(alias) === normalizedProductCity)) return null

  const productText = normalize([product.title, ...product.tags].join(' '))
  const selected = city.regions.find(candidate =>
    candidate.matchTerms.some(term => productText.includes(normalize(term))),
  ) ?? city.orientation

  return {
    cityName: city.cityName,
    dayPlan: {
      day: dayNumber,
      theme: selected.name,
      stops: [toStop(selected)],
    },
    lastReviewedAt: REVIEWED_AT,
    precision: 'area',
    sourceUrl: sourceUrl(selected.lat, selected.lng),
  }
}
