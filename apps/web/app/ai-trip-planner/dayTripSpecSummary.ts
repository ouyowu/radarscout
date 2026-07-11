import type { DayTripSpec } from '@/lib/ai-trip/itinerary-contract'

function sentenceCase(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

export function buildTripSpecChips(spec: DayTripSpec): string[] {
  const chips = [
    spec.destination,
    `${spec.durationDays} day trip${spec.durationDays === 1 ? '' : 's'}`,
  ]

  if (spec.pace !== 'unspecified') chips.push(`${sentenceCase(spec.pace)} pace`)
  if (spec.travelerType !== 'unspecified') chips.push(sentenceCase(spec.travelerType))
  if (spec.groupSize) chips.push(`Group of ${spec.groupSize}`)

  return chips
}
