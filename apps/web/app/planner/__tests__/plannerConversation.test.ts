import { describe, expect, it } from 'vitest'
import { parseTripIntent } from '@/lib/ai-trip/parse-intent'
import {
  decideNextGuideStep,
  DESTINATION_CHIPS,
  DURATION_CHIPS,
  mergeTripIdea,
  parseMergedTripIdea,
  reconcileTripIdeaParts,
  SKIP_INTERESTS_CHIP,
  summarizeUnderstoodIntent,
} from '../plannerConversation'

describe('planner studio guided conversation', () => {
  it('asks for a destination first', () => {
    const step = decideNextGuideStep(parseTripIntent('3 days relaxing'), { interestsSkipped: false })

    expect(step.kind).toBe('ask_destination')
    expect(step.chips).toEqual(DESTINATION_CHIPS)
  })

  it('asks for duration once a destination is known', () => {
    const step = decideNextGuideStep(parseTripIntent('Chiang Mai with elephants'), { interestsSkipped: false })

    expect(step.kind).toBe('ask_duration')
    expect(step.message).toContain('Chiang Mai')
    expect(step.chips).toEqual(DURATION_CHIPS)
  })

  it('asks for interests when destination and duration are set without interests', () => {
    const step = decideNextGuideStep(parseTripIntent('Chiang Mai 3 days'), { interestsSkipped: false })

    expect(step.kind).toBe('ask_interests')
    expect(step.chips).toContain(SKIP_INTERESTS_CHIP)
  })

  it('moves to search when interests were skipped explicitly', () => {
    const step = decideNextGuideStep(parseTripIntent('Chiang Mai 3 days'), { interestsSkipped: true })

    expect(step.kind).toBe('ready_to_search')
    expect(step.chips).toEqual([])
  })

  it('moves to search when destination, duration, and interests are present', () => {
    const step = decideNextGuideStep(
      parseTripIntent('Chiang Mai 3 days elephants food'),
      { interestsSkipped: false },
    )

    expect(step.kind).toBe('ready_to_search')
    expect(step.message).toContain('3-day')
    expect(step.message).toContain('Chiang Mai')
  })

  it('merges traveler messages into one bounded trip idea', () => {
    expect(mergeTripIdea(['Chiang Mai', ' 3 days ', '', 'elephants'])).toBe('Chiang Mai, 3 days, elephants')
    expect(mergeTripIdea(['x'.repeat(700)]).length).toBeLessThanOrEqual(600)
  })

  it('parses merged messages the same as one combined prompt', () => {
    const merged = parseMergedTripIdea(['Chiang Mai', '3 days', 'elephants'])

    expect(merged.intent.destination).toBe('Chiang Mai')
    expect(merged.intent.durationDays).toBe(3)
    expect(merged.intent.interests.length).toBeGreaterThan(0)
  })

  it('floats the destination-bearing message to the front when merging', () => {
    expect(mergeTripIdea(['3 days', 'Bangkok'])).toBe('Bangkok, 3 days')
    // A message that already leads with the destination is left untouched.
    expect(mergeTripIdea(['Chiang Mai', '3 days'])).toBe('Chiang Mai, 3 days')
  })

  it('resolves the destination even when duration is answered first', () => {
    const merged = parseMergedTripIdea(['3 days', 'Bangkok'])

    expect(merged.intent.destination).toBe('Bangkok')
    expect(merged.intent.durationDays).toBe(3)

    const step = decideNextGuideStep(merged, { interestsSkipped: false })
    expect(step.kind).not.toBe('ask_destination')
  })

  it('starts a fresh plan when a later message changes the destination', () => {
    const parts = reconcileTripIdeaParts(
      ['Bangkok 2 days canals and street food'],
      'chaingmai 3 days',
    )
    const merged = parseMergedTripIdea(parts)

    expect(parts).toEqual(['chaingmai 3 days'])
    expect(merged.intent.destination).toBe('Chiang Mai')
    expect(merged.intent.durationDays).toBe(3)
    expect(merged.intent.interests).not.toContain('food')
  })

  it('keeps follow-up interests in the replacement destination plan', () => {
    const replacement = reconcileTripIdeaParts(
      ['Bangkok 2 days canals and street food'],
      'Chiang Mai 3 days',
    )
    const parts = reconcileTripIdeaParts(replacement, 'elephants and temples')
    const merged = parseMergedTripIdea(parts)

    expect(merged.intent.destination).toBe('Chiang Mai')
    expect(merged.intent.durationDays).toBe(3)
    expect(merged.intent.interests).toEqual(expect.arrayContaining(['elephants', 'temples']))
  })

  it('summarizes understood intent as readable chips', () => {
    const chips = summarizeUnderstoodIntent(parseTripIntent('Chiang Mai 3 days elephants, avoid crowds'))

    expect(chips[0]).toBe('Chiang Mai')
    expect(chips).toContain('3 days')
  })
})
