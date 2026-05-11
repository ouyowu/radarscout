'use client'

import { useState, useEffect } from 'react'

const ALERTS = [
  {
    score: 9,
    subreddit: 'SaaS',
    text: '"Anyone know a good Stripe analytics tool? Been using Baremetrics but it\'s too expensive…"',
    time: '2m ago',
  },
  {
    score: 8,
    subreddit: 'Entrepreneur',
    text: '"Looking to hire an SEO agency for our SaaS startup. Budget ~$3k/month, need real ROI…"',
    time: '7m ago',
  },
  {
    score: 9,
    subreddit: 'startups',
    text: '"What\'s the best alternative to Baremetrics for MRR tracking? Open to paid options."',
    time: '14m ago',
  },
]

export function LiveAlertTicker() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      const t = window.setTimeout(() => {
        setIndex(i => (i + 1) % ALERTS.length)
        setVisible(true)
      }, 250)
      return () => window.clearTimeout(t)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const alert = ALERTS[index]

  return (
    <div
      style={{
        transition: 'opacity 250ms ease, transform 250ms ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full mt-0.5"
          style={{ background: 'rgba(255,69,0,0.18)' }}
        >
          <svg className="h-4 w-4 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="inline-flex items-center gap-1 text-label font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,69,0,0.15)', color: '#FF6B35' }}
            >
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Intent {alert.score}/10
            </span>
            <span className="text-label text-gray-400">r/{alert.subreddit}</span>
            <span className="text-label text-gray-400 ml-auto">{alert.time}</span>
          </div>
          <p className="text-sm font-medium leading-snug text-gray-800">
            {alert.text}
          </p>
          <span className="mt-2 inline-block text-label font-semibold" style={{ color: '#FF6B35' }}>
            Draft reply with AI →
          </span>
        </div>
      </div>
    </div>
  )
}
