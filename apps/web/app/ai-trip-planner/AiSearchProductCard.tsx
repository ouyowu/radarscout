import Link from 'next/link'
import { track } from '@/lib/analytics/track'

export type AiSearchProductCardProps = {
  id: string
  title: string
  city: string | null
  summary: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  tags: string[]
  detailHref: string
  retailPrice: string | null
  currency: string | null
  fitReason?: string | null
  ctaHref?: string | null
  ctaLabel?: 'Check availability' | null
  ctaRel?: 'nofollow sponsored noopener noreferrer' | null
  externalHandoff?: boolean
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
  imageUrl,
  imageAlt,
  tags,
  detailHref,
  fitReason,
  ctaHref,
  ctaLabel,
  ctaRel,
  externalHandoff,
}: AiSearchProductCardProps) {
  const hasExternalHandoff = Boolean(externalHandoff && ctaHref)

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#e8dfd2] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt ?? title}
          loading="lazy"
          className="h-44 w-full object-cover sm:h-48"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
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
        {hasExternalHandoff
          ? 'Continue with the booking partner to review current product details.'
          : 'This discovery-only product does not currently have a reviewed booking partner handoff.'}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        {hasExternalHandoff ? (
          <a
            href={ctaHref ?? undefined}
            target="_blank"
            rel={ctaRel ?? 'nofollow sponsored noopener noreferrer'}
            aria-label={`Check availability for ${title} with the booking partner`}
            onClick={() => track('booking_partner_handoff_clicked', { productId: id, source: 'ai_trip_planner' })}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
          >
            {ctaLabel ?? 'Check availability'}
          </a>
        ) : (
          <Link
            href={buildAiTripPlannerDetailHref(detailHref, id)}
            aria-label={`View details for ${title}; no reviewed booking partner handoff is available`}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
          >
            View details
          </Link>
        )}
      </div>
      </div>
    </article>
  )
}
