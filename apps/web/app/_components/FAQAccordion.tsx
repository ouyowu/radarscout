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
    <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">{title}</h2>
        <div className="mt-6 divide-y divide-[var(--color-border-light)] rounded-[1.5rem] bg-white shadow-lg">
          {items.map(item => (
            <details key={item.question} className="group p-5">
              <summary className="cursor-pointer list-none text-lg font-black">
                {item.question}
              </summary>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
