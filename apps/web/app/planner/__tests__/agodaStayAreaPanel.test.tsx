import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { ReviewedAgodaStayAreaOffer } from '@/lib/affiliates/agodaStayAreaOffers'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'
import { AgodaStayAreaPanel } from '../AgodaStayAreaPanel'

const plannerDir = join(process.cwd(), 'app', 'planner')
const panelSource = readFileSync(join(plannerDir, 'AgodaStayAreaPanel.tsx'), 'utf8')
const pageSource = readFileSync(join(plannerDir, 'page.tsx'), 'utf8')
const studioSource = readFileSync(join(plannerDir, 'PlannerStudio.tsx'), 'utf8')

const reviewedOffer: ReviewedAgodaStayAreaOffer = {
  area: {
    id: 'chiang-mai-nimman',
    citySlug: 'chiang-mai',
    city: 'Chiang Mai',
    areaSlug: 'nimman',
    name: 'Nimman',
    bestFor: 'Cafe stays and remote work',
    summary: 'A reviewed area for a contemporary city stay.',
    tradeoffs: ['Check the exact street before choosing a hotel.'],
    reviewedBy: 'owner',
    reviewedAt: '2026-07-22T00:00:00.000Z',
  },
  offer: {
    provider: 'agoda',
    placement: 'hotel_results',
    destination: 'Chiang Mai',
    campaign: 'radarscout_stay_chiang_mai_nimman',
    href: 'https://www.agoda.com/partners/partnersearch.aspx?cid=1234567&pcs=8&tag=radarscout_stay_chiang_mai_nimman',
  },
}

describe('Planner Agoda stay-area guidance', () => {
  it('builds links on the server and passes only safe offers to the client', () => {
    expect(pageSource).toMatch(/buildReviewedAgodaStayAreaOffers/)
    expect(pageSource).toMatch(/reviewedAgodaAreaRecommendations/)
    expect(pageSource).toMatch(/agodaStayAreaOffers=/)
    expect(pageSource).not.toMatch(/NEXT_PUBLIC_AGODA/)
    expect(studioSource).toMatch(/agodaStayAreaOffers/)
  })

  it('renders reviewed fit and tradeoffs with a tracked Agoda handoff', () => {
    expect(panelSource).toMatch(/Where to stay/)
    expect(panelSource).toMatch(/Best for/)
    expect(panelSource).toMatch(/What to check/)
    expect(panelSource).toMatch(/Search Agoda stays/)
    expect(panelSource).toMatch(/TrackedAffiliateLink/)
    expect(panelSource).toMatch(/getReviewedAgodaStayAreasForDestination/)

    const markup = renderToStaticMarkup(
      <AgodaStayAreaPanel
        destination="Chiang Mai"
        offers={[reviewedOffer]}
        tripContext={{
          startDate: '2026-12-10',
          endDate: '2026-12-13',
          groupSize: 4,
          adultCount: 2,
          childCount: 2,
          travelerType: 'family',
        }}
      />,
    )
    expect(markup).toContain('Nimman')
    expect(markup).toContain('Cafe stays and remote work')
    expect(markup).toContain('Search Agoda stays')
    expect(markup).toContain('nofollow sponsored noopener noreferrer')
    expect(markup).toContain('https://www.agoda.com/partners/partnersearch.aspx?cid=1234567')
    expect(markup).toContain('checkin=2026-12-10')
    expect(markup).toContain('checkout=2026-12-13')
    expect(markup).toContain('confirmed stay dates and occupancy are included')
    expect(markup).toContain('NumberofAdults=2')
    expect(markup).toContain('NumberofChildren=2')
    expect(markup).toContain('Rooms=1')
  })

  it('renders nothing for unsupported destinations', () => {
    expect(renderToStaticMarkup(
      <AgodaStayAreaPanel destination="Tokyo" offers={[reviewedOffer]} tripContext={{ startDate: null, endDate: null, groupSize: null, adultCount: null, childCount: null, travelerType: 'unspecified' }} />,
    )).toBe('')
  })

  it('keeps the public accommodation copy within the decision-assistance boundary', () => {
    expectNoForbiddenPublicCopy(panelSource)
    expect(panelSource).not.toMatch(/hotel images|hotel ratings|lowest price|cheapest/i)
  })
})
