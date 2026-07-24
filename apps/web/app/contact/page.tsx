import type { Metadata } from 'next'
import Link from 'next/link'
import { AdventureHero } from '../_components/AdventureHero'

export const metadata: Metadata = {
  title: 'Contact RadarScout | Travel Feedback and Partnerships',
  description:
    'Contact RadarScout with Thailand trip-planning feedback or an affiliate, content, or destination partnership inquiry.',
}

const contactPaths = [
  {
    eyebrow: 'Traveler feedback',
    title: 'Help us make Thailand choices clearer.',
    copy: 'Tell us where the planner felt unclear, which destination you were researching, or what practical guidance would have helped you compare the options.',
    label: 'Send traveler feedback',
    href: 'mailto:hello@radarscout.io?subject=RadarScout%20traveler%20feedback',
  },
  {
    eyebrow: 'Affiliate and content partners',
    title: 'Discuss a relevant Thailand partnership.',
    copy: 'Use this path for licensed travel content, affiliate programs, destination expertise, or reviewed product coverage that can improve traveler decisions.',
    label: 'Discuss a partnership',
    href: 'mailto:hello@radarscout.io?subject=RadarScout%20partnership%20inquiry',
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <AdventureHero
        eyebrow="Contact RadarScout"
        title="Choose the right contact path."
        subtitle="RadarScout welcomes useful traveler feedback and relevant partnership conversations. Transaction support remains with the platform that completed the booking."
        trustNote="This page uses direct email links so your message opens in your own email app. RadarScout does not collect contact details through an unhandled web form."
      />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {contactPaths.map((path) => (
            <article
              key={path.eyebrow}
              className="min-w-0 rounded-[2rem] border border-[var(--color-border-light)] bg-white p-8 shadow-lg"
            >
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-live-inventory)]">
                {path.eyebrow}
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
                {path.title}
              </h2>
              <p className="mt-5 text-sm font-semibold leading-7 text-[var(--color-text-secondary)]">
                {path.copy}
              </p>
              <a
                href={path.href}
                className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-7 text-sm font-black text-[var(--color-text-primary)]"
              >
                {path.label}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-secondary)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[var(--color-bg-dark)] p-8 text-white shadow-lg sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-orange)]">
            Booking, payment, change, or cancellation
          </p>
          <h2 className="mt-3 max-w-4xl font-[var(--font-heading)] text-4xl font-black leading-tight tracking-[-0.035em]">
            Contact the platform that handled the transaction.
          </h2>
          <p className="mt-5 max-w-4xl text-sm font-semibold leading-7 text-white/80">
            RadarScout does not access partner booking records, take payment, issue confirmations, or manage changes and cancellations. Use the confirmation email or account area from Viator, Agoda, or the relevant booking partner for transaction support.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/affiliate-disclosure"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[var(--color-text-primary)]"
            >
              Read the affiliate disclosure
            </Link>
            <Link
              href="/about-us"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 px-6 text-sm font-black text-white"
            >
              How RadarScout works
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
