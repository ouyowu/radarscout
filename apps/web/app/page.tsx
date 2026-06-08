import type { Metadata } from 'next'
import { ThailandTourChat } from './ThailandTourChat'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  title: 'RadarScout.io — Thailand Day Tour AI Concierge',
  description:
    'Tell RadarScout what kind of Thailand day tour or custom route you want, then get matched itineraries, direct-rate pricing, and simple booking guidance.',
  alternates: { canonical: base },
  openGraph: {
    title: 'RadarScout.io — Thailand Day Tour AI Concierge',
    description:
      'A simple AI travel concierge for Thailand day tours, private routes, hotel-area advice, and direct-rate price comparison.',
    type: 'website',
    url: base,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout.io — Thailand Day Tour AI Concierge',
    description: 'Ask for Thailand tours like a chat, then compare direct-rate prices.',
  },
}

const cityLinks = ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Koh Samui', 'Pattaya']

const steps = [
  ['01', 'Tell us your trip', 'City, dates, travelers, hotel style, budget, pace, and what you want to avoid.'],
  ['02', 'We match real tours', 'The demo reads synced supplier products when available and compares them against public-market estimates.'],
  ['03', 'Book in 2 minutes', 'Pick the tour, confirm date, travelers, pickup area, and let the concierge finish availability.'],
]

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcfaee] text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mansalva&family=Montserrat:wght@400;600;700;800;900&family=Palanquin+Dark:wght@500;600;700&display=swap');
        .adventure-font { font-family: 'Palanquin Dark', 'Montserrat', sans-serif; }
        .travel-body { font-family: 'Montserrat', Arial, sans-serif; }
        .script-font { font-family: 'Mansalva', cursive; }
      `}</style>

      <div className="travel-body">
        <header className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="min-h-[44px] content-center text-lg font-black uppercase tracking-[0.18em] text-black">
            Radar<span className="text-[#ff7900]">Scout</span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.18em] md:flex">
            <a href="#how" className="min-h-[44px] content-center hover:text-[#ff7900]">
              How it works
            </a>
            <a href="#tours" className="min-h-[44px] content-center hover:text-[#ff7900]">
              Day tours
            </a>
            <a href="mailto:hello@radarscout.io" className="min-h-[44px] content-center hover:text-[#ff7900]">
              Contact
            </a>
          </nav>

          <a
            href="#planner"
            className="hidden min-h-[44px] items-center bg-black px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#ff9933] hover:text-black md:inline-flex"
          >
            Start
          </a>

          <a
            href="#planner"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-black text-lg font-black md:hidden"
            aria-label="Open trip planner"
          >
            ≡
          </a>
        </header>

        <section id="top" className="relative border-y border-black bg-[#f1e3d5]">
          <div className="absolute inset-x-0 top-0 h-4 bg-[repeating-linear-gradient(90deg,#000_0,#000_14px,#ff9933_14px,#ff9933_28px)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <p className="script-font text-3xl text-[#007c8a] sm:text-4xl">Thailand, planned like a conversation</p>
              <h1 className="adventure-font mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-black sm:text-6xl lg:text-7xl">
                Get your Thailand day tour plan in one prompt.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#3f372f] sm:text-lg">
                Ask like you would ask Gemini or Claude. Tell us the cities, days, hotel style, travel pace,
                and budget. RadarScout turns that into matched tours, hotel-area advice, and price proof that
                shows why booking direct can beat Viator-style marketplace prices.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {cityLinks.map(city => (
                  <a
                    key={city}
                    href="#planner"
                    className="min-h-[44px] border border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors hover:bg-[#ff9933]"
                  >
                    {city}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-2 border-black bg-[#fcfaee] p-4 shadow-[14px_14px_0_#007c8a] sm:p-6">
              <div className="aspect-[4/3] border border-black bg-[linear-gradient(135deg,#007c8a,#fcfaee_48%,#ff9933)] p-5">
                <div className="flex h-full flex-col justify-between bg-white/80 p-5 backdrop-blur-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#007c8a]">AI price scout</p>
                  <div>
                    <p className="adventure-font text-4xl font-black leading-none text-black sm:text-5xl">Phuket 3 days</p>
                    <p className="adventure-font text-4xl font-black leading-none text-black sm:text-5xl">Chiang Mai 4 days</p>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-[#3f372f]">
                      Multi-city route matched. Day tours ranked. Pickup zones simplified. Direct prices surfaced.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      ['295', 'products'],
                      ['3', 'suppliers'],
                      ['2 min', 'reserve'],
                    ].map(([value, label]) => (
                      <div key={label} className="border border-black bg-[#fcfaee] p-3">
                        <p className="text-xl font-black">{value}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5f5549]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planner" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="script-font text-3xl text-[#ff7900]">Ask once. Compare clearly.</p>
            <h2 className="adventure-font mt-2 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
              One simple box for all Thailand day-tour needs.
            </h2>
          </div>
          <ThailandTourChat />
        </section>

        <section id="how" className="border-y border-black bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
            {steps.map(([number, title, body]) => (
              <article key={title} className="border border-black bg-[#fcfaee] p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff7900]">{number}</p>
                <h2 className="adventure-font mt-4 text-3xl font-black leading-tight">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#5f5549]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tours" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="script-font text-3xl text-[#007c8a]">Start with these ideas</p>
            <h2 className="adventure-font mt-2 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
              Six boutique Thailand day tours appear above as live cards.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#3f372f]">
              The cards are deliberately simple: destination, supplier, short reason to book, public-market estimate,
              and your offer. That keeps the customer path short enough to choose and reserve in about two minutes.
            </p>
          </div>
        </section>

        <footer className="border-t border-black bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs font-black uppercase tracking-[0.16em] md:flex-row md:items-center md:justify-between">
            <p>RadarScout.io — Thailand day tour AI concierge</p>
            <div className="flex flex-wrap gap-5">
              <a href="#planner" className="min-h-[44px] content-center hover:text-[#ff9933]">
                Plan trip
              </a>
              <a href="#tours" className="min-h-[44px] content-center hover:text-[#ff9933]">
                Tours
              </a>
              <a href="mailto:hello@radarscout.io" className="min-h-[44px] content-center hover:text-[#ff9933]">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
