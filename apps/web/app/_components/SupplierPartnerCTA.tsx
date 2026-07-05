type SupplierPartnerCTAProps = {
  title?: string
  body?: string
  email?: string
  showPartnerPathLinks?: boolean
}

const supplierPartnerMailtoBody = [
  '[RadarScout homepage supplier interest]',
  '',
  'Name:',
  'Organization:',
  'Destination focus:',
  'Public experience or partner page:',
  'Traveler audience:',
  'Best contact path:',
  'What you want RadarScout to check:',
].join('\n')

export function SupplierPartnerCTA({
  title = 'Local tour operator or Thailand experience partner?',
  body = 'RadarScout is onboarding trusted Thailand suppliers and future destination partners for curated day tours, private tours, transfers, food tours, cultural experiences, and custom local activities.',
  email = 'hello@radarscout.io',
  showPartnerPathLinks = false,
}: SupplierPartnerCTAProps) {
  return (
    <section className="bg-[var(--color-bg-primary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-[var(--color-bg-dark)] p-6 text-white shadow-xl md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#ffd5ad]">Supplier partners</p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">{title}</h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/72">{body}</p>
        </div>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('RadarScout supplier partnership')}&body=${encodeURIComponent(supplierPartnerMailtoBody)}`}
          className="inline-flex min-h-[44px] items-center justify-center bg-[var(--color-accent-orange)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white"
        >
          Partner with RadarScout
        </a>
        {showPartnerPathLinks ? (
          <div className="lg:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffd5ad]">
              Choose a partner path
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                {
                  href: '/partners',
                  label: 'For travel partners',
                  description: 'Agents, hotels, concierges, and creators helping travelers compare Thailand experiences.',
                },
                {
                  href: '/suppliers',
                  label: 'For local suppliers',
                  description: 'Operators with public experience details and a booking partner handoff path.',
                },
                {
                  href: '/destination-partners',
                  label: 'For destination partners',
                  description: 'DMCs and local teams shaping curated discovery for a destination.',
                },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-white/14 bg-white/8 p-4 transition hover:border-[#ffd5ad]"
                >
                  <span className="text-sm font-black text-white">{link.label}</span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-white/70">
                    {link.description}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
