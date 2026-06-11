import Link from 'next/link'

type StickyMobileCTAProps = {
  label: string
  href: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function StickyMobileCTA({ label, href, secondaryLabel, secondaryHref }: StickyMobileCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-light)] bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="flex gap-2">
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-[var(--color-border-medium)] px-4 text-sm font-black text-[var(--color-text-primary)]">
            {secondaryLabel}
          </Link>
        ) : null}
        <Link href={href} className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-4 text-sm font-black text-white">
          {label}
        </Link>
      </div>
    </div>
  )
}
