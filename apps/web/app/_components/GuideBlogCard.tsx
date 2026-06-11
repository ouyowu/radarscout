import Link from 'next/link'

type GuideBlogCardProps = {
  title: string
  href: string
  summary: string
  category: string
  imageUrl?: string
}

export function GuideBlogCard({ title, href, summary, category, imageUrl }: GuideBlogCardProps) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.5rem] bg-white shadow-lg transition hover:-translate-y-1">
      <div className="aspect-[16/10] bg-[var(--color-bg-muted)]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">{category}</p>
        <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-black leading-tight">{title}</h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{summary}</p>
      </div>
    </Link>
  )
}
