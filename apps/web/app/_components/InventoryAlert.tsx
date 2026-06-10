import Link from 'next/link'

type InventoryAlertProps = {
  status: 'live' | 'coming-soon' | 'planning-only'
  destinationName?: string
  className?: string
}

export function InventoryAlert({ status, destinationName = 'this destination', className = '' }: InventoryAlertProps) {
  const isLive = status === 'live'

  return (
    <div className={`border-l-4 border-[#f59a3d] bg-[#fff8e8] p-5 shadow-[0_10px_0_rgba(16,24,32,0.05)] ${className}`}>
      <h2 className="text-lg font-black text-[#101820]">
        {isLive ? 'Live partner inventory' : 'Planning only — partner tours are coming soon.'}
      </h2>
      <p className="mt-2 text-sm font-semibold leading-7 text-[#7c4a03]">
        {isLive ? (
          'Live partner tours are currently available in Thailand through signed Bókun supplier partners.'
        ) : (
          <>
            RadarScout only displays bookable tours from signed Bókun supplier partners.
            Thailand is currently our first live inventory destination. This page is a travel planning guide while we onboard trusted local Bókun suppliers for this destination ({destinationName}).
          </>
        )}
      </p>
      {!isLive ? (
        <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-[#7c4a03]">
          Booking not yet available outside Thailand. Current live inventory:{' '}
          <Link href="/destinations/thailand" className="underline decoration-[#f59a3d] underline-offset-4">
            Thailand
          </Link>
          . No external affiliate products are shown here.
        </p>
      ) : null}
    </div>
  )
}
