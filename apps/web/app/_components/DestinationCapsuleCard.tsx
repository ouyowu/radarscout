import Link from 'next/link'

type DestinationCapsuleCardProps = {
  name: string
  href: string
  status: 'live' | 'coming-soon' | 'planning'
  region?: string
  summary: string
  highlights?: string[]
}

const statusCopy = {
  live: 'Live partner inventory',
  'coming-soon': 'Partner onboarding',
  planning: 'Planning guide',
}

const statusClass = {
  live: 'bg-[var(--color-live-inventory)] text-white',
  'coming-soon': 'bg-[var(--color-coming-soon)] text-white',
  planning: 'bg-[var(--color-bg-dark)] text-white',
}

export function DestinationCapsuleCard({ name, href, status, region, summary, highlights = [] }: DestinationCapsuleCardProps) {
  return (
    <Link href={href} className="group block rounded-[2rem] bg-[var(--color-bg-card)] p-6 shadow-xl transition hover:-translate-y-1">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${statusClass[status]}`}>
        {statusCopy[status]}
      </span>
      {region ? <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{region}</p> : null}
      <h3 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-none tracking-[-0.035em] group-hover:text-[var(--color-accent-orange-dark)]">
        {name}
      </h3>
      <p className="mt-4 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{summary}</p>
      {highlights.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {highlights.slice(0, 4).map(highlight => (
            <span key={highlight} className="rounded-full bg-[var(--color-accent-orange-pale)] px-3 py-1 text-xs font-bold text-[#7c4a03]">
              {highlight}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  )
}
