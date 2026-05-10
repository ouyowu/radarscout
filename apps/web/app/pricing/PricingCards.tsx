'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckoutButton } from './CheckoutButton'

/* ── ROI calculator ── */
function RoiCalculator() {
  const [value, setValue] = useState('')
  const numericValue = parseInt(value.replace(/\D/g, ''), 10)
  const roi = numericValue > 0 ? Math.round(numericValue / 29) : null

  return (
    <div
      className="mt-10 rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-sm font-semibold text-white/85 mb-1">
        If LeadPulse helps you close just 1 extra customer per month&hellip;
      </p>
      <p className="text-label text-white/35 mb-4">Based on Pro plan at $29/mo</p>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium select-none">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={e => setValue(e.target.value.replace(/\D/g, ''))}
            placeholder="500"
            aria-label="Your average customer value in dollars"
            className="w-full pl-7 pr-3 py-2.5 text-sm text-white/85 placeholder-white/25 rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-0 transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
        </div>
        <p className="text-sm text-white/40">avg customer value</p>
      </div>
      {roi !== null && (
        <p className="mt-4 text-sm text-white/65">
          That&rsquo;s{' '}
          <span className="text-xl font-bold text-[#FF4500]">{roi}×</span>
          {' '}ROI on your LeadPulse subscription.
        </p>
      )}
      {roi === null && value === '' && (
        <p className="mt-4 text-label text-white/30">Enter your average customer value to see your ROI.</p>
      )}
    </div>
  )
}

/* ── Checkmark icon ── */
function Check() {
  return (
    <svg
      className="h-4 w-4 text-[#FF4500] flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/* ── Price constants ── */
const MONTHLY = { STARTER: 15, PRO: 29, TEAM: 79 }
const ANNUAL  = { STARTER: 10, PRO: 19, TEAM: 49 }

/* ── Shared style tokens ── */
const cardBase = {
  background: 'rgba(255,255,255,0.04)',
  border:     '1px solid rgba(255,255,255,0.08)',
} as const

const cardPro = {
  background: 'rgba(255,69,0,0.07)',
  border:     '1.5px solid rgba(255,69,0,0.45)',
} as const

/* ── Main component ── */
export function PricingCards({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const prices = billing === 'monthly' ? MONTHLY : ANNUAL

  return (
    <div>
      {/* ── Billing toggle ── */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-white/85' : 'text-white/35'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
          aria-label="Toggle billing period"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f] ${
            billing === 'annual' ? 'bg-[#FF4500]' : 'bg-white/15'
          }`}
        >
          <span
            className={`inline-block mt-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
              billing === 'annual' ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${billing === 'annual' ? 'text-white/85' : 'text-white/35'}`}>
          Annual
          <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-label font-semibold bg-green-500/15 text-green-400">
            Save ~33%
          </span>
        </span>
      </div>

      {/*
        DOM order: Team → Pro → Starter (price anchoring)
        Visual order on md+: Starter | Pro (center, highlighted) | Team
      */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">

        {/* ── Team — DOM 1st, visually last ── */}
        <div
          className="md:order-3 flex-1 rounded-2xl p-6 flex flex-col"
          style={cardBase}
        >
          <div className="mb-6">
            <p className="text-label font-semibold text-purple-400 uppercase mb-1">Team</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white/90">${prices.TEAM}</span>
              <span className="text-sm text-white/35">/mo</span>
            </div>
            <p className="text-label text-white/35 mt-1">
              {billing === 'annual' ? `billed $${prices.TEAM * 12}/yr · ` : ''}For agencies managing multiple clients
            </p>
          </div>
          <ul className="space-y-3 text-sm text-white/60 mb-8 flex-1">
            <li className="flex items-center gap-2"><Check /><span>Unlimited keywords</span></li>
            <li className="flex items-center gap-2"><Check /><span>Everything in Pro</span></li>
            <li className="flex items-center gap-2"><Check /><span>5 team members</span></li>
            <li className="flex items-center gap-2"><Check /><span>Unlimited match history</span></li>
            <li className="flex items-center gap-2"><Check /><span>Priority support</span></li>
          </ul>
          <CheckoutButton
            plan="TEAM"
            billing={billing}
            label="Upgrade to Team"
            isLoggedIn={isLoggedIn}
            className="w-full py-2.5 px-4 rounded-xl text-[0.9375rem] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/15 text-white/70 hover:text-white/90 hover:bg-white/[0.08]"
          />
        </div>

        {/* ── Pro — DOM 2nd, visually center (highlighted) ── */}
        <div
          className="md:order-2 flex-1 rounded-2xl p-6 flex flex-col relative md:scale-105 md:shadow-2xl"
          style={cardPro}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-[#FF4500] text-white text-label font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Most popular
            </span>
          </div>
          <div className="mb-6">
            <p className="text-label font-semibold text-[#FF6B35] uppercase mb-1">Pro</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white/90">${prices.PRO}</span>
              <span className="text-sm text-white/35">/mo</span>
            </div>
            <p className="text-label text-white/35 mt-1">
              {billing === 'annual' ? `billed $${prices.PRO * 12}/yr · ` : ''}For founders ready to scale lead gen
            </p>
          </div>
          <ul className="space-y-3 text-sm text-white/65 mb-8 flex-1">
            <li className="flex items-center gap-2"><Check /><span>10 keywords</span></li>
            <li className="flex items-center gap-2"><Check /><span>Unlimited hits per day</span></li>
            <li className="flex items-center gap-2"><Check /><span>AI intent scoring</span></li>
            <li className="flex items-center gap-2"><Check /><span>AI reply drafts</span></li>
            <li className="flex items-center gap-2"><Check /><span>90-day match history</span></li>
          </ul>
          <CheckoutButton
            plan="PRO"
            billing={billing}
            label="Upgrade to Pro"
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* ── Starter — DOM 3rd, visually first ── */}
        <div
          className="md:order-1 flex-1 rounded-2xl p-6 flex flex-col"
          style={cardBase}
        >
          <div className="mb-6">
            <p className="text-label font-semibold text-blue-400 uppercase mb-1">Starter</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white/90">${prices.STARTER}</span>
              <span className="text-sm text-white/35">/mo</span>
            </div>
            <p className="text-label text-white/35 mt-1">
              {billing === 'annual' ? `billed $${prices.STARTER * 12}/yr · ` : ''}For solo founders getting started
            </p>
          </div>
          <ul className="space-y-3 text-sm text-white/60 mb-8 flex-1">
            <li className="flex items-center gap-2"><Check /><span>3 keywords</span></li>
            <li className="flex items-center gap-2"><Check /><span>200 hits per day</span></li>
            <li className="flex items-center gap-2"><Check /><span>Email alerts</span></li>
            <li className="flex items-center gap-2"><Check /><span>7-day match history</span></li>
          </ul>
          <CheckoutButton
            plan="STARTER"
            billing={billing}
            label="Get Starter"
            isLoggedIn={isLoggedIn}
            className="w-full py-2.5 px-4 rounded-xl text-[0.9375rem] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/15 text-white/70 hover:text-white/90 hover:bg-white/[0.08]"
          />
        </div>
      </div>

      <RoiCalculator />

      {/* Free tier note */}
      <p className="mt-8 text-center text-sm text-white/35">
        Just exploring?{' '}
        <Link href={isLoggedIn ? '/dashboard' : '/auth/register'} className="text-[#FF4500] hover:text-[#ff6b35] transition-colors">
          {isLoggedIn ? 'Go to dashboard' : 'Start for free'} →
        </Link>
      </p>
    </div>
  )
}
