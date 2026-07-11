type FAQItem = {
  question: string
  answer: string
}

type FAQAccordionProps = {
  items: FAQItem[]
  title?: string
}

export function FAQAccordion({ items, title = 'Frequently asked questions' }: FAQAccordionProps) {
  return (
    <section className="bg-rs-sand-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-rs-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.035em] text-rs-ink">{title}</h2>
        <div className="mt-7 divide-y divide-[var(--color-border-light)] overflow-hidden rounded-rs-lg border border-[var(--color-border-light)] bg-white shadow-rs-soft">
          {items.map(item => (
            <details key={item.question} className="group p-5 sm:p-6">
              <summary className="cursor-pointer list-none text-lg font-semibold text-rs-ink">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-rs-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
