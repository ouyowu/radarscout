'use client'

type DestinationStarterCardProps = {
  city: string
  title: string
  body: string
  prompt: string
}

export function DestinationStarterCard({ city, title, body, prompt }: DestinationStarterCardProps) {
  function handleUseStarter() {
    window.dispatchEvent(new CustomEvent('radarscout:ai-trip-starter', { detail: { city, prompt } }))
    document.getElementById('intent-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={handleUseStarter}
      className="group flex min-h-full flex-col rounded-[1.75rem] border border-[#ede6db] bg-white p-6 text-left shadow-[0_20px_40px_rgba(17,24,39,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(17,24,39,0.08)]"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a15d31]">{city}</span>
      <h3 className="mt-4 text-2xl font-semibold text-[#1E2D59]">{title}</h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-[#6b7280]">{body}</p>
      <p className="mt-5 rounded-2xl bg-[#f5efe8] p-4 text-xs font-semibold leading-6 text-[#4b5563]">
        Example: {prompt}
      </p>
      <span className="mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#D57C48]">
        Use {city} route idea
      </span>
    </button>
  )
}
