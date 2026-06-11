type ExperienceCategory = {
  title: string
  description: string
  label?: string
}

type ExperienceCategoryGridProps = {
  eyebrow?: string
  title: string
  categories: ExperienceCategory[]
}

export function ExperienceCategoryGrid({ eyebrow = 'Experience categories', title, categories }: ExperienceCategoryGridProps) {
  return (
    <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange-dark)]">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
          {title}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <article key={category.title} className="rounded-3xl border border-[var(--color-border-light)] bg-white p-5 shadow-md">
              {category.label ? (
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">{category.label}</p>
              ) : null}
              <h3 className="mt-2 text-xl font-black">{category.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{category.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
