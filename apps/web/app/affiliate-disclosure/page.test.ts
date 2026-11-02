import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata } from './page'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

describe('affiliate disclosure', () => {
  it('stays out of search and explains only the live Viator and Agoda affiliate path', () => {
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(source).toContain('How RadarScout makes money')
    expect(source).toContain('Experience links go to Viator and stay links go to Agoda.')
    expect(source).toContain('If you book, the partner may pay us a commission. Your price is the same.')
    expect(source).toContain('sell tours, hold inventory, take payment, or confirm bookings.')
    expect(source).toContain('2. How we choose.')
    expect(source).toContain('The page shows the latest review date.')
    expect(source).toContain('The partner website handles product details, availability, booking, purchase, confirmation, changes, and cancellations.')
    expect(source).not.toContain('3. How we choose.')
    expect(source).not.toContain('named person')
    expect(source).not.toContain('reviewer')
    expect(source).not.toContain('Sponsored placements')
    expect(source).not.toContain('Sponsored')
    expect(source).not.toMatch(/@/)
    expect(source).not.toContain('CONTACT_EMAIL')
    expect(source).not.toContain('Questions:')
  })
})
