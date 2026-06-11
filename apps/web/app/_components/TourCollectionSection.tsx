import type { ComponentProps } from 'react'
import { CuratedTourCard } from './CuratedTourCard'

type TourCollectionItem = ComponentProps<typeof CuratedTourCard>

type TourCollectionSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  tours: TourCollectionItem[]
}

export function TourCollectionSection({ eyebrow = 'Curated collection', title, subtitle, tours }: TourCollectionSectionProps) {
  return (
    <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">{eyebrow}</p>
        <h2 className="mt-3 max-w-4xl font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">{title}</h2>
        {subtitle ? <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[var(--color-text-secondary)]">{subtitle}</p> : null}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {tours.map(tour => (
            <CuratedTourCard key={`${tour.href}-${tour.title}`} {...tour} />
          ))}
        </div>
      </div>
    </section>
  )
}
