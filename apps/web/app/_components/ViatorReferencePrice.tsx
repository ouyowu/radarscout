import React from 'react'

type ViatorReferencePriceProps = {
  retailPrice?: string | null
  currency?: string | null
  priceFetchedAt?: string | null
  className?: string
}

function formatReferencePrice(retailPrice: string, currency: string): string | null {
  const amount = Number(retailPrice)
  const normalizedCurrency = currency.trim().toUpperCase()

  if (!Number.isFinite(amount) || amount <= 0 || !/^[A-Z]{3}$/.test(normalizedCurrency)) {
    return null
  }

  return `${normalizedCurrency} ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(amount)}`
}

function formatCheckedDate(priceFetchedAt: string): string | null {
  const date = new Date(priceFetchedAt)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function ViatorReferencePrice({
  retailPrice,
  currency,
  priceFetchedAt,
  className = '',
}: ViatorReferencePriceProps) {
  if (!retailPrice || !currency || !priceFetchedAt) return null

  const formattedPrice = formatReferencePrice(retailPrice, currency)
  const checkedDate = formatCheckedDate(priceFetchedAt)
  if (!formattedPrice || !checkedDate) return null

  return (
    <div
      aria-label="Viator reference price"
      className={`rounded-rs-sm border border-rs-sage-200/80 bg-rs-sand-50 px-4 py-3 ${className}`.trim()}
    >
      <p className="text-base font-bold text-rs-ink">From {formattedPrice}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-rs-muted">
        Reference price checked {checkedDate}. Final price and current details on Viator.
      </p>
    </div>
  )
}
