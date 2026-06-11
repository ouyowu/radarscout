type WarmNewsletterFooterProps = {
  title?: string
  body?: string
  email?: string
}

export function WarmNewsletterFooter({
  title = 'Get destination planning notes from RadarScout.',
  body = 'For now, join by email. No automated marketing backend is connected in this UI component.',
  email = 'hello@radarscout.io',
}: WarmNewsletterFooterProps) {
  return (
    <footer className="bg-[var(--color-bg-secondary)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--color-border-light)] bg-white p-6 shadow-lg md:p-10">
        <h2 className="font-[var(--font-heading)] text-4xl font-black tracking-[-0.035em]">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">{body}</p>
        <a href={`mailto:${email}?subject=RadarScout%20destination%20updates`} className="mt-6 inline-flex min-h-[44px] items-center justify-center bg-[var(--color-accent-orange)] px-7 text-sm font-black uppercase tracking-[0.1em] text-white">
          Email RadarScout
        </a>
      </div>
    </footer>
  )
}
