import Link from 'next/link'

const guides = [
  ['F5Bot alternative', '/f5bot-alternative'],
  ['Reddit monitoring tool', '/reddit-monitoring-tool'],
  ['Competitor monitoring', '/reddit-competitor-monitoring'],
  ['Customer discovery', '/reddit-customer-discovery'],
  ['Reddit lead finder', '/reddit-lead-finder'],
] as const

export function RelatedGuides({ exclude }: { exclude?: string }) {
  return (
    <section className="border-t border-gray-100 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Related guides</p>
        <div className="flex flex-wrap gap-3">
          {guides
            .filter(([, href]) => href !== exclude)
            .slice(0, 4)
            .map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-gray-950"
              >
                {label} →
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
