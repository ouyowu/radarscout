import Link from 'next/link'

export type AiSearchProductCardProps = {
  id: string
  title: string
  city: string | null
  summary: string | null
  tags: string[]
  detailHref: string
  retailPrice: string | null
  currency: string | null
  fitReason?: string | null
}

function buildSafeTourFallback(productId?: string): string {
  return productId ? `/tours/${encodeURIComponent(productId)}` : '/tours'
}

export function buildAiTripPlannerDetailHref(detailHref: string, productId?: string): string {
  const trimmedHref = detailHref.trim()
  const [hrefWithoutHash, hash] = trimmedHref.split('#', 2)

  if (!hrefWithoutHash.startsWith('/tours/')) {
    return `${buildSafeTourFallback(productId)}?source=ai-trip-planner`
  }

  const [path, query = ''] = hrefWithoutHash.split('?', 2)
  const params = new URLSearchParams(query)

  if (params.get('source') === 'ai-trip-planner') {
    return trimmedHref
  }

  params.set('source', 'ai-trip-planner')
  const nextQuery = params.toString()
  const hashSuffix = hash ? `#${hash}` : ''

  return `${path}${nextQuery ? `?${nextQuery}` : ''}${hashSuffix}`
}

export function AiSearchProductCard({
  id,
  title,
  city,
  summary,
  tags,
  detailHref,
  retailPrice,
  currency,
  fitReason,
}: AiSearchProductCardProps) {
  const priceLabel = retailPrice
    ? `${currency ? `${currency} ` : ''}${retailPrice}`
    : null

  return (
    <article className="flex flex-col rounded-[1.5rem] border border-[#e8dfd2] bg-white p-4 sm:p-5 shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <span className="rounded-full bg-[#e7f5f2] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.1em] text-[#0f766e]">
          Comparison match
        </span>
        <span className="rounded-full bg-[#f5efe8] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.1em] text-[#8a4b25]">
          Read-only product result
        </span>
      </div>
      {city ? (
        <div className="mt-2 sm:mt-3">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#0f766e]">
            Matched route stop
          </p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
            {city}
          </p>
        </div>
      ) : null}
      <h3 className="mt-2 text-lg font-black leading-tight text-[#101820]">{title}</h3>
      {summary ? (
        <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[#5a6670] sm:mt-3 sm:leading-7">{summary}</p>
      ) : null}
      {fitReason ? (
        <p className="mt-2 rounded-[1rem] border border-[#d8eadf] bg-[#f5fbf7] px-3 py-2 text-xs font-black leading-5 text-[#0f766e] sm:mt-3">
          {fitReason}
        </p>
      ) : null}
      <div className="mt-2 rounded-[1rem] border border-[#e8dfd2] bg-[#fffdf7] px-3 py-2 sm:mt-3 sm:py-3">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#5a5147]">
          Fit checklist
        </p>
        <ul className="mt-2 grid gap-1.5 text-xs font-black text-[#5a6670] sm:grid-cols-3 sm:gap-2">
          <li className="rounded-full bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">Destination fit</li>
          <li className="rounded-full bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">Interest fit</li>
          <li className="rounded-full bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">Comparison only</li>
        </ul>
      </div>
      {tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
          {tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="rounded-full bg-[#f5efe8] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#a15d31]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-auto pt-4 text-xs font-bold leading-5 text-[#5a6670]">
        Open the product page to review details; booking partner handoff continues from that product page.
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        {priceLabel ? (
          <p className="text-base font-black text-[#101820]">
            From {priceLabel}
          </p>
        ) : (
          <div />
        )}
        <Link
          href={buildAiTripPlannerDetailHref(detailHref, id)}
          aria-label={`View details for ${title}, then continue with the booking partner from that product page`}
          className="inline-flex min-h-[44px] items-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
        >
          View details
        </Link>
      </div>
    </article>
  )
}
