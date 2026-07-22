export const AGODA_SUPPORTED_CITIES = [
  'Bangkok',
  'Chiang Mai',
  'Phuket',
  'Krabi',
  'Pattaya',
  'Koh Samui',
  'Hua Hin',
] as const

export type AgodaSupportedCity = (typeof AGODA_SUPPORTED_CITIES)[number]

export type AgodaHotelSearchInput = {
  city: AgodaSupportedCity
  checkIn: string
  checkOut: string
  adults: number
  children: number
}

export type AgodaHotelResult = {
  provider: 'agoda'
  hotelId: string
  name: string
  city: AgodaSupportedCity
  starRating: number | null
  reviewScore: number | null
  reviewCount: number
  latitude: number
  longitude: number
  imageUrl: string | null
  price?: {
    currency: string
    total: number
    perNight: number
    nights: number
  }
  handoffUrl: string
  handoffRel: 'nofollow sponsored noopener noreferrer'
}

export function isAgodaSupportedCity(value: string): value is AgodaSupportedCity {
  return (AGODA_SUPPORTED_CITIES as readonly string[]).includes(value)
}
