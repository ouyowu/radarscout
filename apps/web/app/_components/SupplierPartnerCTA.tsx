type SupplierPartnerCTAProps = {
  title?: string
  body?: string
  email?: string
}

export function SupplierPartnerCTA({
  title = 'Local tour operator or Bókun supplier partner?',
  body = 'RadarScout is onboarding trusted suppliers in selected top travel destinations for curated day tours, private tours, transfers, food tours, cultural experiences, and custom local activities.',
  email = 'hello@radarscout.io',
}: SupplierPartnerCTAProps) {
  return (
    <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-[var(--color-bg-dark)] p-6 text-white shadow-xl md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">Supplier partners</p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">{title}</h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/72">{body}</p>
        </div>
        <a href={`mailto:${email}?subject=RadarScout%20supplier%20partnership`} className="inline-flex min-h-[44px] items-center justify-center bg-[var(--color-accent-orange)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white">
          Partner with RadarScout
        </a>
      </div>
    </section>
  )
}
