/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5
 * Hallmark · genre: editorial utility · macrostructure: asymmetric decision report · designed-as-app
 */

import type { CSSProperties } from 'react'
import type { PlannerRealityModel } from './plannerReality'

type PlannerRealityPanelProps = {
  model: PlannerRealityModel
}

type RealityDisclosureProps = {
  label: string
  count?: number
  items: readonly string[]
  open?: boolean
}

function RealityDisclosure({ label, count, items, open = false }: RealityDisclosureProps) {
  return (
    <details
      open={open}
      className="group border-b border-rs-sage-200/80 last:border-b-0"
    >
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-rs-ink outline-none focus-visible:ring-2 focus-visible:ring-rs-forest-500/40 [&::-webkit-details-marker]:hidden">
        <span className="whitespace-nowrap">{label}</span>
        <span className="flex items-center gap-2 text-xs text-rs-muted">
          {typeof count === 'number' ? (
            <span className="rounded-rs-pill bg-rs-sage-100 px-2.5 py-1">{count}</span>
          ) : null}
          <span aria-hidden="true" className="text-base text-rs-forest-700 transition-transform group-open:rotate-45">+</span>
        </span>
      </summary>
      <ul className="space-y-2 pb-4 text-sm font-semibold leading-6 text-rs-muted">
        {items.map(item => (
          <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
            <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 rounded-full bg-rs-terracotta" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}

export function PlannerRealityPanel({ model }: PlannerRealityPanelProps) {
  const matchValue = `${model.visibleMatchCount}/${model.reviewedMatchCount}`
  const coverageStyle = {
    '--planner-coverage': `${model.reviewedCoveragePercent}%`,
  } as CSSProperties

  return (
    <section aria-label="Trip reality" className="overflow-hidden rounded-rs-lg border border-rs-forest-900/15 bg-white shadow-rs-soft">
      <header className="bg-rs-forest-900 px-5 py-5 text-white sm:px-7 sm:py-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rs-terracotta">Trip reality</p>
            <h2 className="mt-2 min-w-0 font-rs-display text-3xl font-semibold leading-none tracking-[-0.035em] text-white [overflow-wrap:anywhere] sm:text-4xl">
              {model.destination}
              <span className="sr-only"> · {model.durationDays} day{model.durationDays === 1 ? '' : 's'}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Confirmed trip summary">
            <span className="whitespace-nowrap rounded-rs-pill bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
              {model.durationDays} day{model.durationDays === 1 ? '' : 's'}
            </span>
            <span className="whitespace-nowrap rounded-rs-pill bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
              {model.paceLabel}
            </span>
            {model.selectedThemes.map(theme => (
              <span key={theme} className="whitespace-nowrap rounded-rs-pill bg-rs-terracotta px-3 py-1.5 text-xs font-bold text-rs-ink">
                {theme}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-7">
        <div className="grid gap-7 xl:grid-cols-[minmax(230px,0.62fr)_minmax(0,1.38fr)] xl:items-center">
          <div className="grid min-w-0 gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center xl:grid-cols-1 xl:justify-items-center xl:border-r xl:border-rs-sage-200/80 xl:pr-7 xl:text-center">
            <div
              aria-label="Reviewed route coverage"
              className="planner-coverage-ring grid h-40 w-40 shrink-0 place-items-center rounded-full p-3 sm:h-44 sm:w-44"
              style={coverageStyle}
            >
              <div className="grid h-full w-full place-content-center rounded-full bg-white text-center shadow-[inset_0_0_0_1px_var(--rs-sage-200)]">
                <strong className="font-rs-display text-4xl font-semibold leading-none text-rs-ink">
                  {model.assignedDayCount}
                  <span className="text-xl text-rs-muted">/{model.durationDays}</span>
                </strong>
                <span className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-forest-700">reviewed days</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rs-terracotta-600">Reviewed route coverage</p>
              <p className="mt-2 text-sm font-bold leading-6 text-rs-ink">
                {model.assignedDayCount} of {model.durationDays} reviewed days
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-rs-muted">
                Missing days stay flexible instead of being filled with invented products.
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rs-terracotta-600">Decision brief</p>
            <h3 className="mt-2 min-w-0 font-rs-display text-2xl font-semibold leading-tight text-rs-ink [overflow-wrap:anywhere] sm:text-3xl">
              {model.statusLabel}
            </h3>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-rs-muted">{model.verdict}</p>

            <dl className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-rs-sm bg-rs-sage-100 p-4 sm:p-5">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-forest-700">Map orientation</dt>
                <dd className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">
                  {model.mapCoverageDayCount}/{model.durationDays}
                </dd>
                <p className="mt-1 text-xs font-semibold leading-5 text-rs-muted">Days with reviewed regional coverage</p>
              </div>
              <div className="min-w-0 rounded-rs-sm bg-rs-sand-100 p-4 sm:p-5">
                <dt className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-rs-terracotta-600">Matches in view</dt>
                <dd className="mt-2 font-rs-display text-3xl font-semibold text-rs-ink">{matchValue}</dd>
                <p className="mt-1 text-xs font-semibold leading-5 text-rs-muted">Reviewed choices after your theme filters</p>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-7 grid gap-x-7 border-t border-rs-sage-200/80 lg:grid-cols-2">
          <div>
            <RealityDisclosure label="Why this route" count={model.whyThisRoute.length} items={model.whyThisRoute} open />
            <RealityDisclosure label="Best for" count={model.bestFor.length} items={model.bestFor} />
          </div>
          <div>
            <RealityDisclosure label="Before choosing" count={model.beforeChoosing.length} items={model.beforeChoosing} />
            <RealityDisclosure
              label="Map and handoff"
              items={[model.paceNote, ...model.mapAndHandoffNotes]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
