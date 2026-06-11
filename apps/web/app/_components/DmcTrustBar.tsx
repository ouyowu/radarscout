type TrustItem = {
  label: string
  value: string
}

type DmcTrustBarProps = {
  items: TrustItem[]
}

export function DmcTrustBar({ items }: DmcTrustBarProps) {
  return (
    <section className="bg-[var(--color-bg-dark)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {items.map(item => (
          <div key={item.label} className="border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-white/55">{item.label}</p>
            <p className="mt-2 text-lg font-black">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
