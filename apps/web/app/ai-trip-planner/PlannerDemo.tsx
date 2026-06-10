'use client'

import { useState } from 'react'
import Link from 'next/link'

const travelStyles = ['Private', 'Family', 'Food', 'Culture', 'Adventure', 'Relaxed']
const budgetStyles = ['Smart value', 'Comfort', 'Premium']

export function PlannerDemo() {
  const [showDemo, setShowDemo] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('Private')
  const [selectedBudget, setSelectedBudget] = useState('Smart value')

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <form
          className="bg-white p-5 shadow-[0_16px_0_rgba(16,24,32,0.06)] sm:p-7"
          onSubmit={(event) => {
            event.preventDefault()
            setShowDemo(true)
          }}
        >
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">Trip brief</p>
          <h2 className="mt-3 font-serif text-4xl font-black leading-none text-[#101820]">Tell us the trip you want.</h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-[#101820]">Destination</span>
              <input
                className="mt-2 min-h-[48px] w-full border border-[#ded7ca] bg-[#fffdf7] px-4 text-sm font-semibold outline-none focus:border-[#0f766e]"
                placeholder="Thailand, Japan, Europe, World Cup 2026..."
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-[#101820]">Travel dates or days</span>
              <input
                className="mt-2 min-h-[48px] w-full border border-[#ded7ca] bg-[#fffdf7] px-4 text-sm font-semibold outline-none focus:border-[#0f766e]"
                placeholder="7 days, June 2026, 11 days..."
              />
            </label>
          </div>

          <div className="mt-6">
            <p className="text-sm font-black text-[#101820]">Travel style</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {travelStyles.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`min-h-[44px] px-4 text-sm font-black transition ${
                    selectedStyle === style
                      ? 'bg-[#101820] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]'
                      : 'border border-[#ded7ca] bg-[#fffdf7] text-[#101820]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-black text-[#101820]">Budget style</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {budgetStyles.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedBudget(style)}
                  className={`min-h-[44px] px-4 text-sm font-black transition ${
                    selectedBudget === style
                      ? 'bg-[#f59a3d] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]'
                      : 'border border-[#ded7ca] bg-[#fffdf7] text-[#101820]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-black text-[#101820]">Natural language prompt</span>
            <textarea
              className="mt-2 min-h-[160px] w-full border border-[#ded7ca] bg-[#fffdf7] px-4 py-4 text-sm font-semibold leading-7 outline-none focus:border-[#0f766e]"
              placeholder="Example: I have 11 days in Europe. I want Austria 5 days, Germany 3 days, France 3 days. Recommend the best route and available partner tours."
            />
          </label>

          <button
            type="submit"
            className="mt-6 min-h-[52px] w-full bg-[#101820] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#0f766e] [clip-path:polygon(4%_0,100%_8%,96%_100%,0_92%)]"
          >
            Generate static demo
          </button>
          <p className="mt-3 text-xs font-semibold leading-6 text-[#5a6670]">
            UI demo only. This button does not call an AI provider, create an API request, write to a database, or start a booking flow.
          </p>
        </form>

        <div className="bg-[#101820] p-5 text-white shadow-[0_16px_0_rgba(16,24,32,0.12)] sm:p-7">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#8dd8ca]">Static demo result</p>
          {showDemo ? (
            <div className="mt-5 space-y-5">
              <div>
                <h2 className="font-serif text-4xl font-black leading-none">Suggested route</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/76">
                  Start with a live Thailand example: Bangkok for food and temples, Chiang Mai for culture and elephant care, then Phuket for island day tours.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  ['Day 1-2', 'Bangkok arrival, hotel-area check, canal or temple route, and one relaxed food experience.'],
                  ['Day 3-5', 'Chiang Mai culture base with one ethical elephant experience and one old-city or mountain route.'],
                  ['Day 6-7', 'Phuket island day tour with enough buffer for pickup windows and return transfer.'],
                ].map(([day, plan]) => (
                  <article key={day} className="border border-white/12 bg-white/[0.06] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#eeb08f]">{day}</p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-white/78">{plan}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="bg-white/[0.06] p-4">
                  <h3 className="text-lg font-black">Recommended experience types</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-white/76">
                    Airport transfer, private city tour, food tour, elephant care, island hopping, and relaxed day trips.
                  </p>
                </article>
                <article className="bg-white/[0.06] p-4">
                  <h3 className="text-lg font-black">Estimated planning time saved</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-white/76">
                    3-5 hours saved by turning route timing, tour types, and pickup logic into one clean draft.
                  </p>
                </article>
              </div>

              <div className="border-l-4 border-[#8dd8ca] bg-white/[0.06] p-4">
                <h3 className="text-lg font-black">Available partner tours</h3>
                <p className="mt-2 text-sm font-semibold leading-7 text-white/76">
                  Example live inventory: Thailand currently has partner tours from signed Bókun suppliers.
                </p>
                <Link href="/tours" className="mt-4 inline-flex min-h-[44px] items-center bg-[#f59a3d] px-5 text-sm font-black uppercase tracking-[0.08em] text-white [clip-path:polygon(5%_0,100%_8%,95%_100%,0_92%)]">
                  View Thailand tours
                </Link>
              </div>

              <div className="border-l-4 border-[#f59a3d] bg-[#fff8e8] p-4 text-[#7c4a03]">
                <h3 className="text-lg font-black text-[#101820]">Partner tours coming soon notice</h3>
                <p className="mt-2 text-sm font-semibold leading-7">
                  For Japan, Europe, World Cup cities, and other destinations, partner tours are coming soon. These demo ideas are planning guidance, not bookable third-party products.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 border border-white/12 bg-white/[0.06] p-6">
              <h2 className="font-serif text-4xl font-black leading-none">Your demo plan appears here.</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/76">
                Fill the brief and click Generate to preview the static planning format: route, day-by-day plan, experience types, planning time saved, available partner tours, and coming-soon guidance.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
