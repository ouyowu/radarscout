export const THAILAND_COORDINATE_BOUNDS = {
  minLat: 5.6,
  maxLat: 20.5,
  minLng: 97.3,
  maxLng: 105.7,
} as const

export type ThailandItineraryCitySlug = 'bangkok' | 'phuket' | 'chiang-mai'
export type ThailandItineraryDays = 3 | 5 | 7
export type ThailandItineraryPace = 'chill' | 'balanced' | 'packed'

export type ThailandItineraryStop = {
  name: string
  summary: string
  lat: number
  lng: number
  durationMinutes: number
  themeTags: readonly string[]
}

export type ThailandItineraryDayPlan = {
  day: number
  theme: string
  stops: readonly ThailandItineraryStop[]
}

export type ThailandItineraryTemplate = {
  citySlug: ThailandItineraryCitySlug
  cityName: string
  days: ThailandItineraryDays
  title: string
  summary: string
  lastReviewedAt: string
  dayPlans: readonly ThailandItineraryDayPlan[]
}

const bangkokThreeDayTemplate: ThailandItineraryTemplate = {
  citySlug: 'bangkok',
  cityName: 'Bangkok',
  days: 3,
  title: 'Bangkok in 3 days',
  summary: 'A balanced first visit that groups the old city, central Bangkok and riverside neighborhoods into clear daily areas.',
  lastReviewedAt: '2026-07-17',
  dayPlans: [
    {
      day: 1,
      theme: 'Old city landmarks',
      stops: [
        {
          name: 'The Grand Palace area',
          summary: 'Begin around Bangkok\'s historic royal district and keep the first part of the day focused on the old city.',
          lat: 13.7500,
          lng: 100.4913,
          durationMinutes: 120,
          themeTags: ['culture', 'temples', 'history'],
        },
        {
          name: 'Wat Pho',
          summary: 'Continue on foot within the same historic cluster for temple architecture and the Reclining Buddha complex.',
          lat: 13.7466,
          lng: 100.4930,
          durationMinutes: 90,
          themeTags: ['culture', 'temples'],
        },
        {
          name: 'Museum Siam area',
          summary: 'Use the afternoon for a compact museum stop and a quieter introduction to Thai cultural history.',
          lat: 13.7442,
          lng: 100.4941,
          durationMinutes: 90,
          themeTags: ['culture', 'museum', 'history'],
        },
        {
          name: 'Pak Khlong Talat',
          summary: 'Finish near the flower market and riverside streets without crossing the city for a separate evening plan.',
          lat: 13.7422,
          lng: 100.4988,
          durationMinutes: 60,
          themeTags: ['market', 'food', 'photography'],
        },
      ],
    },
    {
      day: 2,
      theme: 'Arts and central Bangkok',
      stops: [
        {
          name: 'Jim Thompson House area',
          summary: 'Start in the central arts district with a compact cultural stop before nearby galleries and shopping streets become busier.',
          lat: 13.7493,
          lng: 100.5280,
          durationMinutes: 90,
          themeTags: ['culture', 'museum', 'design'],
        },
        {
          name: 'Bangkok Art and Culture Centre',
          summary: 'Continue to contemporary exhibitions in the same central cluster rather than adding another long transfer.',
          lat: 13.7467,
          lng: 100.5300,
          durationMinutes: 90,
          themeTags: ['art', 'culture', 'design'],
        },
        {
          name: 'Erawan Shrine area',
          summary: 'Move east through central Bangkok for a short cultural stop surrounded by the city\'s modern commercial core.',
          lat: 13.7441,
          lng: 100.5403,
          durationMinutes: 45,
          themeTags: ['culture', 'city'],
        },
        {
          name: 'Lumphini Park',
          summary: 'End with open space and an easier pace after a day spent in dense central neighborhoods.',
          lat: 13.7308,
          lng: 100.5418,
          durationMinutes: 75,
          themeTags: ['nature', 'walking', 'city'],
        },
      ],
    },
    {
      day: 3,
      theme: 'Temples, Chinatown and the river',
      stops: [
        {
          name: 'Wat Saket area',
          summary: 'Begin around the Golden Mount and nearby old-city streets before continuing toward Chinatown.',
          lat: 13.7539,
          lng: 100.5068,
          durationMinutes: 75,
          themeTags: ['temples', 'culture', 'viewpoint'],
        },
        {
          name: 'Wat Suthat area',
          summary: 'Keep the morning geographically compact with another old-city landmark and surrounding civic architecture.',
          lat: 13.7511,
          lng: 100.5010,
          durationMinutes: 75,
          themeTags: ['temples', 'culture', 'history'],
        },
        {
          name: 'Yaowarat Road',
          summary: 'Use the later part of the day for Chinatown streets, food choices and neighborhood exploration.',
          lat: 13.7405,
          lng: 100.5100,
          durationMinutes: 120,
          themeTags: ['food', 'market', 'culture'],
        },
        {
          name: 'Talat Noi riverfront area',
          summary: 'Finish near the river with heritage lanes and street art rather than adding a distant final stop.',
          lat: 13.7344,
          lng: 100.5132,
          durationMinutes: 75,
          themeTags: ['walking', 'art', 'photography'],
        },
      ],
    },
  ],
}

const templates: readonly ThailandItineraryTemplate[] = [bangkokThreeDayTemplate]

export function listThailandItineraryTemplates(): readonly ThailandItineraryTemplate[] {
  return templates
}

export function getThailandItineraryTemplate(
  citySlug: string,
  days: number,
): ThailandItineraryTemplate | null {
  return templates.find(template => template.citySlug === citySlug && template.days === days) ?? null
}
