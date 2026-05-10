'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

/* ── Types ──────────────────────────────────────────────────────────── */

type Platform = 'reddit' | 'hn' | 'x'
type FilterKey = 'all' | Platform

interface Post {
  id: number
  platform: Platform
  source: string
  title: string
  score: number
  time: string
}

interface AlertEntry {
  key: string
  post: Post
}

/* ── Static data ─────────────────────────────────────────────────────── */

const POSTS: Post[] = [
  { id: 1, platform: 'reddit', source: 'r/SaaS',         title: 'Anyone know a good Stripe analytics tool? Baremetrics is getting too expensive for us',    score: 94, time: '2m ago'  },
  { id: 2, platform: 'hn',     source: 'Hacker News',    title: 'Ask HN: Best CRM for a bootstrapped B2B startup under $50/mo?',                             score: 88, time: '5m ago'  },
  { id: 3, platform: 'reddit', source: 'r/Entrepreneur', title: 'Looking to hire an SEO agency for our SaaS startup. Budget is $3k/month — open to options', score: 81, time: '9m ago'  },
  { id: 4, platform: 'x',      source: '@levelsio',      title: 'Frustrated with my current PM tool — what are people using instead of Linear these days?',  score: 76, time: '12m ago' },
  { id: 5, platform: 'reddit', source: 'r/startups',     title: 'What MRR tracking tool do you use? Looking to switch from Baremetrics after price hike',    score: 91, time: '18m ago' },
  { id: 6, platform: 'hn',     source: 'Hacker News',    title: 'Ask HN: Notion alternatives for small teams? Need something more affordable and focused',   score: 79, time: '23m ago' },
]

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',    label: 'All'          },
  { key: 'reddit', label: 'Reddit'       },
  { key: 'hn',     label: 'Hacker News'  },
  { key: 'x',      label: 'X'            },
]

/* ── Platform logos (inline SVG) ─────────────────────────────────────── */

function RedditLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label="Reddit" role="img">
      <circle cx="10" cy="10" r="10" fill="#FF4500" />
      <g fill="white">
        <ellipse cx="10" cy="12" rx="5.2" ry="4.2" />
        <circle cx="7.7"  cy="11.3" r="0.85" fill="#FF4500" />
        <circle cx="12.3" cy="11.3" r="0.85" fill="#FF4500" />
        <path d="M8.2 13.7 Q10 15 11.8 13.7" stroke="#FF4500" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="3.8" r="1.3" />
        <rect x="9.4" y="4.9" width="1.2" height="3" rx="0.6" />
        <circle cx="4.9"  cy="11.4" r="1.3" />
        <circle cx="15.1" cy="11.4" r="1.3" />
      </g>
    </svg>
  )
}

function HNLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label="Hacker News" role="img">
      <rect width="20" height="20" rx="3" fill="#FF6600" />
      <path fill="white" d="M5 4h1.8L10 9.6 13.2 4H15L11.2 11V16H8.8V11L5 4z" />
    </svg>
  )
}

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="X (Twitter)" role="img" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function PlatformLogo({ platform, size = 16 }: { platform: Platform; size?: number }) {
  if (platform === 'reddit') return <RedditLogo size={size} />
  if (platform === 'hn')     return <HNLogo size={size} />
  return <XLogo size={size} />
}

/* ── Score badge ─────────────────────────────────────────────────────── */

function ScoreBadge({ score }: { score: number }) {
  const green = score >= 85
  return (
    <span
      className="text-label font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
      style={green
        ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
        : { background: 'rgba(234,179,8,0.15)',  color: '#facc15' }
      }
    >
      {score}%
    </span>
  )
}

/* ── Main component ──────────────────────────────────────────────────── */

export function LiveDemoWidget() {
  const [filter,     setFilter]     = useState<FilterKey>('all')
  const [cycleIdx,   setCycleIdx]   = useState(0)
  const [alerts,     setAlerts]     = useState<AlertEntry[]>(() =>
    POSTS.slice(0, 3).map((p, i) => ({ key: String(i), post: p }))
  )
  const [matchCount, setMatchCount] = useState(847)

  const activeCardRef = useRef<HTMLDivElement>(null)

  const filteredPosts = useMemo(
    () => filter === 'all' ? POSTS : POSTS.filter(p => p.platform === filter),
    [filter]
  )

  const activePost = filteredPosts[cycleIdx % filteredPosts.length]

  /* Reset cycle index when the platform filter changes */
  useEffect(() => { setCycleIdx(0) }, [filter])

  /* Auto-advance every 2.8 s */
  useEffect(() => {
    const id = setInterval(() => setCycleIdx(i => i + 1), 2800)
    return () => clearInterval(id)
  }, [])

  /* Push new alert entry when active post changes */
  useEffect(() => {
    if (!activePost) return
    setAlerts(prev => [
      { key: String(Date.now()), post: activePost },
      ...prev.slice(0, 2),
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePost?.id])

  /* Keep active post card in view */
  useEffect(() => {
    activeCardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePost?.id])

  /* Drift the post-scanned count upward */
  useEffect(() => {
    const id = setInterval(
      () => setMatchCount(n => n + Math.floor(Math.random() * 3) + 1),
      4200
    )
    return () => clearInterval(id)
  }, [])

  /* ── Render ── */
  return (
    <div
      className="w-full select-none"
      style={{ animation: 'widget-float 6s ease-in-out infinite' }}
    >
      <div
        className="rounded-[20px] overflow-hidden"
        style={{
          background:    'rgba(255,255,255,0.04)',
          border:        '1px solid rgba(255,255,255,0.08)',
          backdropFilter:'blur(16px)',
        }}
      >

        {/* ── Header bar ── */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#FF4500]"
              style={{ boxShadow: '0 0 8px rgba(255,69,0,0.8)' }}
            />
            <span className="text-label font-semibold text-white/50">RadarScout</span>
          </div>
          <span className="text-label text-white/25">live demo</span>
        </div>

        {/* ── Platform filter tabs ── */}
        <div
          className="flex items-center gap-1 px-3 py-2 overflow-x-auto"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 whitespace-nowrap text-label font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px] flex-shrink-0"
              style={
                filter === key
                  ? { background: 'rgba(255,69,0,0.15)', color: '#FF6B35' }
                  : { color: 'rgba(255,255,255,0.38)' }
              }
            >
              {key !== 'all' && <PlatformLogo platform={key as Platform} size={13} />}
              {label}
            </button>
          ))}
        </div>

        {/* ── Body: feed + alerts ── */}
        <div className="flex flex-col sm:flex-row">

          {/* Left: scrolling post feed */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              maxHeight: '272px',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="p-3 space-y-2">
              {filteredPosts.map(post => {
                const isActive = post.id === activePost?.id
                return (
                  <div
                    key={post.id}
                    ref={isActive ? activeCardRef : undefined}
                    className="rounded-xl p-3 transition-all duration-300 cursor-default"
                    style={
                      isActive
                        ? {
                            background: 'rgba(255,69,0,0.08)',
                            border:     '1px solid rgba(255,69,0,0.38)',
                            boxShadow:  '0 0 0 2px rgba(255,69,0,0.06) inset',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            border:     '1px solid rgba(255,255,255,0.06)',
                            opacity:    0.5,
                          }
                    }
                  >
                    {/* Source row */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <PlatformLogo platform={post.platform} size={14} />
                      <span className="text-label font-medium text-white/50 flex-1 truncate">
                        {post.source}
                      </span>
                      <span className="text-label text-white/25 flex-shrink-0">{post.time}</span>
                    </div>

                    {/* Title */}
                    <p
                      className="text-sm leading-snug line-clamp-2"
                      style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)' }}
                    >
                      {post.title}
                    </p>

                    {/* Active-card footer */}
                    {isActive && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-label text-white/30">Score:</span>
                        <ScoreBadge score={post.score} />
                        <span
                          className="text-label font-semibold ml-auto"
                          style={{ color: '#FF6B35' }}
                        >
                          Draft reply →
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: alerts panel */}
          <div className="sm:w-[152px] flex-shrink-0 p-3">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-label font-semibold text-white/30 uppercase">Alerts</p>
              <span
                className="text-label font-semibold tabular-nums"
                style={{ color: '#FF6B35' }}
              >
                {alerts.length}
              </span>
            </div>

            <div className="space-y-2">
              {alerts.map((entry, i) => (
                <div
                  key={entry.key}
                  className="rounded-xl p-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border:     '1px solid rgba(255,255,255,0.07)',
                    animation:  i === 0
                      ? 'alert-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both'
                      : undefined,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ScoreBadge score={entry.post.score} />
                    <PlatformLogo platform={entry.post.platform} size={12} />
                  </div>
                  <p className="text-[0.7rem] leading-snug line-clamp-2 text-white/50">
                    {entry.post.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer: monitoring bar ── */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"
              style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }}
            />
            <span className="text-label text-white/40">Monitoring 24/7</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-label font-semibold tabular-nums"
              style={{ color: '#FF6B35' }}
            >
              {matchCount.toLocaleString()}
            </span>
            <span className="text-label text-white/30">posts scanned</span>
          </div>
        </div>

      </div>
    </div>
  )
}
