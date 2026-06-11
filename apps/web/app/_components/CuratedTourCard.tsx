import Link from 'next/link'

type CuratedTourCardProps = {
  title: string
  href: string
  supplierName?: string
  imageUrl?: string
  imageAlt?: string
  summary: string
  tourStyle: string
  bestFor: string
  priceLabel?: string
  inventoryStatus?: 'live' | 'coming-soon' | 'demo'
}

export function CuratedTourCard({
  title,
  href,
  supplierName = 'Signed Bókun supplier partner',
  imageUrl,
  imageAlt = '',
  summary,
  tourStyle,
  bestFor,
  priceLabel,
  inventoryStatus = 'live',
}: CuratedTourCardProps) {
  const statusText = inventoryStatus === 'live' ? 'Bókun partner inventory' : inventoryStatus === 'demo' ? 'UI demo only' : 'Partner onboarding'

  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.75rem] bg-white shadow-xl transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-[var(--color-bg-muted)]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-end bg-[linear-gradient(135deg,#4a7c59,#efebdb_55%,#ff9933)] p-5">
            <p className="font-[var(--font-heading)] text-4xl font-black text-white">{tourStyle}</p>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[var(--color-bg-dark)] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-white">
          {statusText}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">{supplierName}</p>
        <h3 className="mt-3 font-[var(--font-heading)] text-3xl font-black leading-tight">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{summary}</p>
        <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
          <p className="rounded-full bg-[var(--color-accent-orange-pale)] px-3 py-2">Best for: {bestFor}</p>
          <p className="rounded-full bg-[var(--color-bg-muted)] px-3 py-2">Tour style: {tourStyle}</p>
        </div>
        {priceLabel ? <p className="mt-5 text-2xl font-black text-[var(--color-live-inventory)]">{priceLabel}</p> : null}
      </div>
    </Link>
  )
}
