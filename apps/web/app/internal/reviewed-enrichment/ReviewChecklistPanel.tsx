export const REVIEW_CHECKLIST_ITEMS = [
  'Destination matches source city.',
  'Title does not mention another country/city.',
  'AI draft does not invent missing facts.',
  'Summary is based only on source product data.',
  'SEO title is accurate and not over-promising.',
  'SEO description is accurate and not over-promising.',
  'Tags describe the actual experience.',
  'Price/currency/location look reasonable.',
  'If source data looks wrong, use Skip instead of Save.',
]

export const WARNING_WITH_ISSUES =
  'Quality warnings are present. Do not save unless you have manually confirmed the source data is correct.'

export function ReviewChecklistPanel({ hasWarnings }: { hasWarnings: boolean }) {
  return (
    <div className="overflow-hidden rounded border border-blue-200 bg-blue-50">
      <div className="border-b border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-800">
        Review checklist before saving
      </div>
      <div className="space-y-3 p-4">
        {hasWarnings && (
          <div className="rounded border border-orange-300 bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-900">
            ⚠ {WARNING_WITH_ISSUES}
          </div>
        )}
        <ul className="space-y-1.5 text-sm text-blue-900">
          {REVIEW_CHECKLIST_ITEMS.map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-blue-400">☐</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
