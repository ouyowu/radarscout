'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Types ────────────────────────────────────────────────────────────────── */

type Platform = 'reddit' | 'hn' | 'x'
type View = 'inbox' | 'analytics' | 'keywords' | 'settings'
type Filter = 'all' | 'high' | 'medium' | 'low' | 'saved'
type Sort = 'intent' | 'recent' | 'platform'

interface Post {
  id: number
  platform: Platform
  subreddit?: string
  handle?: string
  title: string
  body?: string
  author?: string
  time: string
  upvotes?: number
  points?: number
  likes?: number
  retweets?: number
  comments?: number
  intent: number
  tags: string[]
}

/* ── Sample data ──────────────────────────────────────────────────────────── */

const POSTS: Post[] = [
  {
    id: 1, platform: 'reddit', subreddit: 'r/SaaS',
    title: 'Looking for a cheaper alternative to Brand24 for Reddit monitoring',
    body: "We're a small startup and Brand24 is way out of our budget. Anyone know a good tool that just monitors Reddit mentions?",
    author: 'u/startup_mike', time: '2 minutes ago', upvotes: 4, comments: 7,
    intent: 97, tags: ['buying intent', 'competitor mention'],
  },
  {
    id: 2, platform: 'hn',
    title: 'Ask HN: How do you monitor Reddit for mentions of your product?',
    body: "I've been using F5Bot but it sends too many irrelevant alerts. Looking for something with better filtering.",
    author: 'throwaway_founder', time: '8 minutes ago', points: 23, comments: 14,
    intent: 91, tags: ['buying intent', 'F5Bot mention'],
  },
  {
    id: 3, platform: 'x', handle: '@IndieHacker_Dan',
    title: 'GummySearch is gone and I have no idea how to find Reddit leads anymore. Any alternatives?',
    time: '15 minutes ago', likes: 12, retweets: 3,
    intent: 88, tags: ['buying intent', 'GummySearch mention'],
  },
  {
    id: 4, platform: 'reddit', subreddit: 'r/Entrepreneur',
    title: "How are you guys finding customers on Reddit without spending hours scrolling?",
    body: "I know Reddit has tons of potential customers for my SaaS but I can't monitor it manually.",
    author: 'u/founder_life', time: '32 minutes ago', upvotes: 19, comments: 23,
    intent: 84, tags: ['pain point'],
  },
  {
    id: 5, platform: 'reddit', subreddit: 'r/marketing',
    title: 'Best social listening tools for Reddit in 2025?',
    body: 'Looking for recommendations — we need to track competitor mentions and buying intent keywords.',
    author: 'u/growth_hq', time: '1 hour ago', upvotes: 31, comments: 18,
    intent: 79, tags: ['buying intent', 'research'],
  },
  {
    id: 6, platform: 'hn',
    title: 'What tools do indie hackers use for customer discovery?',
    author: 'devinramani', time: '2 hours ago', points: 47, comments: 38,
    intent: 71, tags: ['research'],
  },
  {
    id: 7, platform: 'reddit', subreddit: 'r/SideProject',
    title: 'Show HN: I built a Reddit comment tracker',
    author: 'u/buildinpublic99', time: '3 hours ago', upvotes: 62, comments: 11,
    intent: 45, tags: ['low intent'],
  },
  {
    id: 8, platform: 'x', handle: '@techblogger',
    title: "Interesting thread about Reddit's new API policies",
    time: '4 hours ago', likes: 8, retweets: 2,
    intent: 38, tags: ['low intent'],
  },
]

const SAMPLE_REPLY =
  "Hey! I actually built something that might help — RadarScout monitors Reddit 24/7 and uses AI to filter out the noise so you only get high-intent alerts. Free plan available with 3 keywords. Happy to answer any questions!"

/* ── Platform icons ───────────────────────────────────────────────────────── */

function RedditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label="Reddit" role="img">
      <circle cx="10" cy="10" r="10" fill="#FF4500" />
      <g fill="white">
        <ellipse cx="10" cy="12" rx="5.2" ry="4.2" />
        <circle cx="7.7" cy="11.3" r="0.85" fill="#FF4500" />
        <circle cx="12.3" cy="11.3" r="0.85" fill="#FF4500" />
        <path d="M8.2 13.7 Q10 15 11.8 13.7" stroke="#FF4500" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="3.8" r="1.3" />
        <rect x="9.4" y="4.9" width="1.2" height="3" rx="0.6" />
        <circle cx="4.9" cy="11.4" r="1.3" />
        <circle cx="15.1" cy="11.4" r="1.3" />
      </g>
    </svg>
  )
}

function HNIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label="Hacker News" role="img">
      <rect width="20" height="20" rx="3" fill="#FF6600" />
      <path fill="white" d="M5 4h1.8L10 9.6 13.2 4H15L11.2 11V16H8.8V11L5 4z" />
    </svg>
  )
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="X (Twitter)" role="img" style={{ background: '#000', borderRadius: 4 }}>
      <path fill="white" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function PlatformIcon({ platform, size = 16 }: { platform: Platform; size?: number }) {
  if (platform === 'reddit') return <RedditIcon size={size} />
  if (platform === 'hn') return <HNIcon size={size} />
  return <XIcon size={size} />
}

/* ── Nav icons ────────────────────────────────────────────────────────────── */

function InboxSvg() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m4-4l4 4 4-4" />
    </svg>
  )
}

function AnalyticsSvg() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function KeywordsSvg() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}

function SettingsSvg() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function BookmarkSvg({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function MenuSvg() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseSvg({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/* ── Intent badge ─────────────────────────────────────────────────────────── */

function IntentBadge({ score }: { score: number }) {
  let bg: string, color: string, label: string
  if (score >= 90) {
    bg = 'rgba(34,197,94,0.18)'; color = '#4ade80'; label = `${score}% intent`
  } else if (score >= 75) {
    bg = 'rgba(34,197,94,0.10)'; color = '#86efac'; label = `${score}% intent`
  } else if (score >= 60) {
    bg = 'rgba(234,179,8,0.15)'; color = '#facc15'; label = `${score}% intent`
  } else {
    bg = '#f3f4f6'; color = '#9ca3af'; label = `${score}% intent`
  }
  return (
    <span
      className="text-label font-semibold px-2 py-0.5 rounded-md tabular-nums whitespace-nowrap"
      style={{ background: bg, color }}
    >
      {score >= 90 && (
        <span aria-hidden="true" className="mr-0.5">
          <svg className="inline h-3 w-3 mb-px" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
          </svg>
        </span>
      )}
      {label}
    </span>
  )
}

/* ── Source label ─────────────────────────────────────────────────────────── */

function sourceLabel(post: Post) {
  if (post.platform === 'reddit') return post.subreddit ?? 'Reddit'
  if (post.platform === 'hn') return 'Hacker News'
  return post.handle ?? 'X'
}

/* ── Reply modal ──────────────────────────────────────────────────────────── */

function ReplyModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(SAMPLE_REPLY).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Draft reply"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.65)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'white', border: '1px solid #e5e7eb' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-label font-semibold text-gray-400 uppercase mb-1">AI Draft Reply</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{post.title}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close modal"
          >
            <CloseSvg />
          </button>
        </div>

        {/* Draft textarea */}
        <textarea
          readOnly
          value={SAMPLE_REPLY}
          rows={5}
          className="w-full text-sm text-gray-700 leading-relaxed rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
          style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          aria-label="AI-generated reply draft"
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copy}
            className="flex-1 py-2.5 px-4 rounded-xl text-[0.9375rem] font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ border: '1px solid #d1d5db', color: copied ? '#16a34a' : '#374151' }}
          >
            {copied ? 'Copied!' : 'Copy reply'}
          </button>
          <Link
            href="/auth/register"
            className="flex-1 py-2.5 px-4 rounded-xl text-[0.9375rem] font-semibold text-white bg-[#FF4500] hover:bg-[#e63e00] transition-colors text-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white min-h-[44px] flex items-center justify-center"
          >
            Sign up to post →
          </Link>
        </div>

        <p className="text-label text-gray-400 text-center">
          Sign up to generate custom AI replies tailored to your product
        </p>
      </div>
    </div>
  )
}

/* ── Post card ────────────────────────────────────────────────────────────── */

function PostCard({
  post,
  saved,
  onSave,
  onReply,
}: {
  post: Post
  saved: boolean
  onSave: (id: number) => void
  onReply: (post: Post) => void
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const engagementLabel =
    post.platform === 'hn'
      ? `${post.points ?? 0} pts · ${post.comments ?? 0} comments`
      : post.platform === 'x'
      ? `${post.likes ?? 0} likes · ${post.retweets ?? 0} retweets`
      : `${post.upvotes ?? 0} upvotes · ${post.comments ?? 0} comments`

  return (
    <article
      className="rounded-2xl p-5 flex flex-col gap-3 transition-colors"
      style={{ background: 'white', border: '1px solid #e5e7eb' }}
    >
      {/* Source row */}
      <div className="flex items-center gap-2 flex-wrap">
        <PlatformIcon platform={post.platform} size={15} />
        <span className="text-label font-medium text-gray-500">{sourceLabel(post)}</span>
        <span className="text-label text-gray-400 ml-auto flex-shrink-0">{post.time}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{post.title}</h3>

      {/* Body */}
      {post.body && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.body}</p>
      )}

      {/* Intent + tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <IntentBadge score={post.intent} />
        {post.tags.map(tag => (
          <span
            key={tag}
            className="text-label px-1.5 py-0.5 rounded-md"
            style={{ background: '#f3f4f6', color: '#6b7280' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onReply(post)}
          className="inline-flex items-center gap-1.5 text-label font-semibold px-3 py-1.5 rounded-lg bg-[#FF4500] hover:bg-[#e63e00] text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-1 focus:ring-offset-transparent min-h-[36px]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Draft Reply
        </button>

        {/* Disabled "Open" button with tooltip */}
        <div className="relative">
          <button
            disabled
            aria-disabled="true"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className="inline-flex items-center gap-1.5 text-label font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
            style={{
              border: '1px solid #e5e7eb',
              color: '#9ca3af',
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </button>
          {showTooltip && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-label text-white/80 whitespace-nowrap pointer-events-none z-10"
              style={{ background: '#1f2937', border: '1px solid #374151' }}
              role="tooltip"
            >
              Sign up to open on Reddit
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: '#1f2937' }} />
            </div>
          )}
        </div>

        {/* Engagement */}
        <span className="text-label text-gray-400 ml-auto flex-shrink-0">{engagementLabel}</span>

        {/* Bookmark */}
        <button
          onClick={() => onSave(post.id)}
          className={`rounded-lg p-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[36px] min-w-[36px] flex items-center justify-center ${
            saved ? 'text-[#FF4500]' : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label={saved ? 'Unsave post' : 'Save post'}
          aria-pressed={saved}
        >
          <BookmarkSvg filled={saved} />
        </button>
      </div>
    </article>
  )
}

/* ── Inbox view ───────────────────────────────────────────────────────────── */

function InboxView({
  savedIds,
  onSave,
  onReply,
}: {
  savedIds: Set<number>
  onSave: (id: number) => void
  onReply: (post: Post) => void
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('intent')

  const filtered = POSTS.filter(p => {
    if (filter === 'high') return p.intent >= 80
    if (filter === 'medium') return p.intent >= 60 && p.intent < 80
    if (filter === 'low') return p.intent < 60
    if (filter === 'saved') return savedIds.has(p.id)
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'intent') return b.intent - a.intent
    if (sort === 'platform') return a.platform.localeCompare(b.platform)
    return 0 // 'recent' — already in insertion order
  })

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High Intent' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
    { key: 'saved', label: 'Saved' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Filter tabs + sort */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="whitespace-nowrap text-label font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4500] min-h-[36px]"
              style={
                filter === key
                  ? { background: 'rgba(255,69,0,0.15)', color: '#FF6B35' }
                  : { color: '#6b7280' }
              }
              aria-pressed={filter === key}
            >
              {label}
              {key === 'saved' && savedIds.size > 0 && (
                <span className="ml-1.5 tabular-nums" style={{ color: '#FF6B35' }}>
                  {savedIds.size}
                </span>
              )}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as Sort)}
          className="text-label font-medium rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4500] min-h-[36px]"
          style={{
            background: 'white',
            border: '1px solid #d1d5db',
            color: '#374151',
          }}
          aria-label="Sort posts"
        >
          <option value="intent">Highest Intent</option>
          <option value="recent">Most Recent</option>
          <option value="platform">Platform</option>
        </select>
      </div>

      {/* Post list */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No posts match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(post => (
            <PostCard
              key={post.id}
              post={post}
              saved={savedIds.has(post.id)}
              onSave={onSave}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Analytics view ───────────────────────────────────────────────────────── */

const CHART_DATA = [
  { day: 'Mon', high: 3, med: 2, low: 4 },
  { day: 'Tue', high: 5, med: 3, low: 2 },
  { day: 'Wed', high: 2, med: 4, low: 3 },
  { day: 'Thu', high: 7, med: 2, low: 5 },
  { day: 'Fri', high: 6, med: 4, low: 2 },
  { day: 'Sat', high: 4, med: 3, low: 3 },
  { day: 'Sun', high: 8, med: 3, low: 4 },
]

function AnalyticsView() {
  const maxTotal = Math.max(...CHART_DATA.map(d => d.high + d.med + d.low))

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Posts monitored today', value: '47,293' },
          { label: 'High intent found', value: '8' },
          { label: 'Keywords active', value: '3' },
          { label: 'Alerts sent', value: '5' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex flex-col gap-1"
            style={{ background: 'white', border: '1px solid #e5e7eb' }}
          >
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
            <p className="text-label text-gray-400 leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'white', border: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Intent distribution this week</h2>
          <div className="flex items-center gap-4 text-label text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: '#4ade80' }} aria-hidden="true" />
              High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: '#facc15' }} aria-hidden="true" />
              Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: '#d1d5db' }} aria-hidden="true" />
              Low
            </span>
          </div>
        </div>

        <p className="sr-only">
          Bar chart showing intent distribution across Mon–Sun. Thursday had the highest volume with 14 posts total.
        </p>

        <div className="flex items-end gap-2 h-36" aria-hidden="true">
          {CHART_DATA.map(({ day, high, med, low }) => {
            const total = high + med + low
            const highPct = (high / maxTotal) * 100
            const medPct = (med / maxTotal) * 100
            const lowPct = (low / maxTotal) * 100
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end rounded-t-lg overflow-hidden" style={{ height: `${((total / maxTotal) * 128)}px` }}>
                  <div style={{ height: `${lowPct}%`, background: '#d1d5db', minHeight: low > 0 ? 2 : 0 }} />
                  <div style={{ height: `${medPct}%`, background: '#facc15', minHeight: med > 0 ? 2 : 0 }} />
                  <div style={{ height: `${highPct}%`, background: '#4ade80', borderRadius: '4px 4px 0 0', minHeight: high > 0 ? 2 : 0 }} />
                </div>
                <span className="text-label text-gray-400">{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Keywords view ────────────────────────────────────────────────────────── */

function KeywordsView() {
  const [showSignup, setShowSignup] = useState(false)

  const keywords = [
    { kw: 'brand24 alternative', matches: 12 },
    { kw: 'reddit monitoring tool', matches: 8 },
    { kw: 'f5bot alternative', matches: 5 },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700">Active keywords</h2>
        <span className="text-label text-gray-400">Demo plan · 3/3 used</span>
      </div>

      {keywords.map(({ kw, matches }) => (
        <div
          key={kw}
          className="rounded-2xl p-5 flex items-center justify-between gap-4"
          style={{ background: 'white', border: '1px solid #e5e7eb' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,69,0,0.12)' }}
            >
              <KeywordsSvg />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{kw}</p>
              <p className="text-label text-gray-400">active · watching r/all</p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold text-[#FF4500] tabular-nums">{matches}</p>
            <p className="text-label text-gray-400">today</p>
          </div>
        </div>
      ))}

      {/* Add keyword */}
      {showSignup ? (
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: 'rgba(255,69,0,0.06)', border: '1px solid rgba(255,69,0,0.25)' }}
        >
          <p className="text-sm text-gray-600 mb-3">Sign up to add more keywords and unlock real-time monitoring.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-5 py-2.5 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
          >
            Sign up free →
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setShowSignup(true)}
          className="w-full rounded-2xl p-4 text-sm font-medium text-gray-400 hover:text-gray-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[52px] flex items-center justify-center gap-2"
          style={{ border: '1px dashed #d1d5db' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add keyword
        </button>
      )}
    </div>
  )
}

/* ── Settings view ────────────────────────────────────────────────────────── */

function SettingsView() {
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: 'white', border: '1px solid #e5e7eb' }}
      >
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,69,0,0.12)' }}
        >
          <SettingsSvg />
        </div>
        <h2 className="text-base font-semibold text-gray-700 mb-2">Settings are locked in demo</h2>
        <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
          Sign up to configure email alerts, notification preferences, and team access.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center bg-[#FF4500] hover:bg-[#e63e00] text-white font-semibold text-[0.9375rem] px-5 py-2.5 rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
        >
          Create free account →
        </Link>
      </div>
    </div>
  )
}

/* ── Sidebar ──────────────────────────────────────────────────────────────── */

const NAV_ITEMS: { key: View; label: string; Icon: () => JSX.Element }[] = [
  { key: 'inbox',     label: 'Inbox',     Icon: InboxSvg     },
  { key: 'analytics', label: 'Analytics', Icon: AnalyticsSvg },
  { key: 'keywords',  label: 'Keywords',  Icon: KeywordsSvg  },
  { key: 'settings',  label: 'Settings',  Icon: SettingsSvg  },
]

function Sidebar({
  view,
  onView,
  onClose,
  mobile,
}: {
  view: View
  onView: (v: View) => void
  onClose?: () => void
  mobile?: boolean
}) {
  return (
    <aside
      className={`flex flex-col h-full ${mobile ? 'w-64' : 'w-64'}`}
      style={{ background: '#f9fafb', borderRight: '1px solid #e5e7eb' }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="h-7 w-7 rounded-lg bg-[#FF4500] flex items-center justify-center flex-shrink-0">
          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="#FF4500" />
            <g fill="white">
              <ellipse cx="10" cy="12" rx="5.2" ry="4.2" />
              <circle cx="7.7" cy="11.3" r="0.85" fill="#FF4500" />
              <circle cx="12.3" cy="11.3" r="0.85" fill="#FF4500" />
              <path d="M8.2 13.7 Q10 15 11.8 13.7" stroke="#FF4500" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <circle cx="10" cy="3.8" r="1.3" />
              <rect x="9.4" y="4.9" width="1.2" height="3" rx="0.6" />
              <circle cx="4.9" cy="11.4" r="1.3" />
              <circle cx="15.1" cy="11.4" r="1.3" />
            </g>
          </svg>
        </div>
        <span className="text-[0.9375rem] font-semibold text-gray-900">RadarScout</span>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close sidebar"
          >
            <CloseSvg className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = view === key
          return (
            <button
              key={key}
              onClick={() => { onView(key); onClose?.() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.9375rem] font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4500] min-h-[44px]"
              style={
                active
                  ? { background: 'rgba(255,69,0,0.12)', color: '#FF6B35' }
                  : { color: '#6b7280' }
              }
              aria-current={active ? 'page' : undefined}
            >
              <Icon />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-5 space-y-3" style={{ borderTop: '1px solid #e5e7eb' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,69,0,0.20)' }}
        >
          <span
            className="h-2 w-2 rounded-full bg-[#FF4500] flex-shrink-0"
            style={{ boxShadow: '0 0 6px rgba(255,69,0,0.8)' }}
          />
          <span className="text-label font-semibold text-[#FF6B35]">Demo mode</span>
        </div>
        <Link
          href="/auth/register"
          className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
        >
          Sign up free →
        </Link>
      </div>
    </aside>
  )
}

/* ── Top banner ───────────────────────────────────────────────────────────── */

function DemoBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 flex-wrap"
      style={{ background: 'rgba(255,69,0,0.92)', backdropFilter: 'blur(8px)' }}
      role="banner"
    >
      <p className="text-sm font-medium text-white flex items-center gap-2">
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        This is a live demo with sample data. Sign up free to monitor your own keywords.
      </p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/auth/register"
          className="text-sm font-semibold bg-white text-[#FF4500] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors min-h-[36px] flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#FF4500]"
        >
          Start free — no credit card
        </Link>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white transition-colors cursor-pointer rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Dismiss banner"
        >
          <CloseSvg className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ── Main DemoApp ─────────────────────────────────────────────────────────── */

export function DemoApp() {
  const [view, setView] = useState<View>('inbox')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [replyPost, setReplyPost] = useState<Post | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSave = useCallback((id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  /* Close mobile sidebar on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const viewTitle: Record<View, string> = {
    inbox: 'Inbox', analytics: 'Analytics', keywords: 'Keywords', settings: 'Settings',
  }

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: 'white', color: '#111' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0" style={{ width: 256 }}>
        <Sidebar view={view} onView={setView} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm md:hidden"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 left-0 z-50 md:hidden"
            style={{ width: 256 }}
          >
            <Sidebar view={view} onView={setView} onClose={() => setSidebarOpen(false)} mobile />
          </div>
        </>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14"
          style={{ borderBottom: '1px solid #e5e7eb', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center rounded-lg p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[44px] min-w-[44px]"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <MenuSvg />
          </button>

          <h1 className="text-[0.9375rem] font-semibold text-gray-700">{viewTitle[view]}</h1>

          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-label font-medium px-2.5 py-1 rounded-lg hidden sm:inline"
              style={{ background: '#f3f4f6', color: '#6b7280' }}
            >
              Demo data
            </span>
            <Link
              href="/auth/register"
              className="text-label font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-1 focus:ring-offset-transparent"
            >
              Start free trial →
            </Link>
          </div>
        </header>

        {/* Dismissible banner */}
        {!bannerDismissed && <DemoBanner onDismiss={() => setBannerDismissed(true)} />}

        {/* Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent' }}
        >
          {view === 'inbox'     && <InboxView savedIds={savedIds} onSave={toggleSave} onReply={setReplyPost} />}
          {view === 'analytics' && <AnalyticsView />}
          {view === 'keywords'  && <KeywordsView />}
          {view === 'settings'  && <SettingsView />}
        </main>
      </div>

      {/* Reply modal */}
      {replyPost && <ReplyModal post={replyPost} onClose={() => setReplyPost(null)} />}
    </div>
  )
}
