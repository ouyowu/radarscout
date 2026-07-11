type TrustItem = {
  label: string
  value: string
}

type DmcTrustBarProps = {
  items: TrustItem[]
}

export function DmcTrustBar({ items }: DmcTrustBarProps) {
  return (
    <section className="border-y border-rs-sage-200 bg-[#f3fbf9] px-4 py-6 text-rs-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {items.map(item => (
          <div key={item.label} className="rounded-rs-md bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rs-trust">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-rs-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
