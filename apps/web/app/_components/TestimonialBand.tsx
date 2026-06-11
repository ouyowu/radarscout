type TestimonialBandProps = {
  quote: string
  attribution: string
  note?: string
  isDemo?: boolean
  disclaimer?: string
}

export function TestimonialBand({
  quote,
  attribution,
  note = 'Editorial placeholder for future verified customer or supplier proof.',
  isDemo = false,
  disclaimer = 'Example testimonial for UI demonstration only.',
}: TestimonialBandProps) {
  return (
    <section className="bg-[var(--color-bg-dark)] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">“{quote}”</p>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.12em] text-white/65">{attribution}</p>
        {isDemo ? (
          <p className="mx-auto mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#ffd5ad]">
            {disclaimer}
          </p>
        ) : null}
        <p className="mx-auto mt-4 max-w-2xl text-xs font-semibold leading-6 text-white/45">{note}</p>
      </div>
    </section>
  )
}
