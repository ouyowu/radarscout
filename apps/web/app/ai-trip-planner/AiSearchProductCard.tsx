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
}

export function AiSearchProductCard({
  title,
  city,
  summary,
  tags,
  detailHref,
  retailPrice,
  currency,
}: AiSearchProductCardProps) {
  const priceLabel = retailPrice
    ? `${currency ? `${currency} ` : ''}${retailPrice}`
    : null

  return (
    <article className="flex flex-col rounded-[1.5rem] border border-[#e8dfd2] bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
      {city ? (
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">{city}</p>
      ) : null}
      <h3 className="mt-2 text-lg font-black leading-tight text-[#101820]">{title}</h3>
      {summary ? (
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-[#5a6670]">{summary}</p>
      ) : null}
      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
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
      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        {priceLabel ? (
          <p className="text-base font-black text-[#101820]">
            From {priceLabel}
            <span className="ml-1 text-xs font-semibold text-[#6b7280]">partner rate</span>
          </p>
        ) : (
          <p className="text-xs font-semibold text-[#9a9084]">Contact for partner rate</p>
        )}
        <Link
          href={detailHref}
          className="inline-flex min-h-[40px] items-center rounded-full bg-[#101820] px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1e2d59]"
        >
          View experience
        </Link>
      </div>
    </article>
  )
}
