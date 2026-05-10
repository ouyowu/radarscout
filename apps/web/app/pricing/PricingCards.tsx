'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckoutButton } from './CheckoutButton'

function Check() {
  return (
    <svg
      className="h-4 w-4 text-orange-500 flex-shrink-0"
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

const MONTHLY = { STARTER: 15, PRO: 29, TEAM: 79 }
const ANNUAL  = { STARTER: 10, PRO: 19, TEAM: 49 }

export function PricingCards({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const prices = billing === 'monthly' ? MONTHLY : ANNUAL

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
          aria-label="Toggle billing period"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
            billing === 'annual' ? 'bg-orange-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block mt-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
              billing === 'annual' ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billing === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
          Annual
          <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
            Save ~33%
          </span>
        </span>
      </div>

      {/*
        DOM order: Team → Pro → Starter (price anchoring — Team shown first makes Pro feel affordable)
        Visual order on md+: Starter | Pro (center, highlighted) | Team
      */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">

        {/* Team — DOM 1st, visually last */}
        <div className="md:order-3 flex-1 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">Team</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">${prices.TEAM}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            {billing === 'annual' && (
              <p className="text-xs text-gray-400 mt-1">billed ${prices.TEAM * 12}/yr</p>
            )}
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
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
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-gray-300 text-gray-700 hover:bg-gray-50"
          />
        </div>

        {/* Pro — DOM 2nd, visually center (highlighted) */}
        <div className="md:order-2 flex-1 bg-white border-2 border-orange-400 rounded-2xl p-6 flex flex-col relative md:scale-105 md:shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Most popular
            </span>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">Pro</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">${prices.PRO}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            {billing === 'annual' && (
              <p className="text-xs text-gray-400 mt-1">billed ${prices.PRO * 12}/yr</p>
            )}
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
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

        {/* Starter — DOM 3rd, visually first */}
        <div className="md:order-1 flex-1 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Starter</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">${prices.STARTER}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            {billing === 'annual' && (
              <p className="text-xs text-gray-400 mt-1">billed ${prices.STARTER * 12}/yr</p>
            )}
          </div>
          <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
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
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-gray-300 text-gray-700 hover:bg-gray-50"
          />
        </div>
      </div>

      {/* Free tier note */}
      <p className="mt-8 text-center text-sm text-gray-400">
        Just exploring?{' '}
        <Link href={isLoggedIn ? '/dashboard' : '/auth/register'} className="text-orange-600 hover:underline">
          {isLoggedIn ? 'Go to dashboard' : 'Start for free'} →
        </Link>
      </p>
    </div>
  )
}
