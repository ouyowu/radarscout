import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ViatorReferencePrice } from '../ViatorReferencePrice'

describe('ViatorReferencePrice', () => {
  it('renders a consumer reference price with its checked date and boundary copy', () => {
    const markup = renderToStaticMarkup(
      <ViatorReferencePrice
        retailPrice="1536.37"
        currency="thb"
        priceFetchedAt="2026-07-23T08:52:26.057Z"
      />,
    )

    expect(markup).toContain('From THB 1,536.37')
    expect(markup).toContain('Reference price checked Jul 23, 2026')
    expect(markup).toContain('Final price and current details on Viator')
    expect(markup).not.toMatch(/live price|available now|lowest price/i)
  })

  it.each([
    { retailPrice: null, currency: 'THB', priceFetchedAt: '2026-07-23T08:52:26.057Z' },
    { retailPrice: '100', currency: null, priceFetchedAt: '2026-07-23T08:52:26.057Z' },
    { retailPrice: '100', currency: 'THB', priceFetchedAt: null },
    { retailPrice: '-1', currency: 'THB', priceFetchedAt: '2026-07-23T08:52:26.057Z' },
  ])('renders nothing for incomplete or invalid data: %o', props => {
    expect(renderToStaticMarkup(<ViatorReferencePrice {...props} />)).toBe('')
  })
})
