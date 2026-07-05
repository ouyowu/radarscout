import type { PartnerInterestPageContent } from './PartnerInterestPage'

const MANUAL_REVIEW_NOTE =
  'Send a short note with your destination focus and public booking link. RadarScout manually checks partner inquiries before any public recommendation.'

const MANUAL_NEXT_STEPS = [
  'We read your message and confirm the destination focus, audience, and public links.',
  'If the fit is relevant, we ask for any missing public experience details before considering a recommendation.',
  'RadarScout checks traveler-facing links manually and asks only for public-safe details, not operating-process or inventory materials.',
  'Nothing is published, recommended, or represented as accepted without a separate manual check.',
]

const SAFE_INTAKE_GUIDE = {
  title: 'What to send first',
  body:
    'Start with public-safe details RadarScout can check manually before any recommendation is considered.',
  items: [
    'Organization name and contact person',
    'Destination focus and traveler audience',
    'Public traveler-facing URL if you have one',
    'Experience category, duration, and public booking partner path if available',
  ],
}

function buildPartnerMailto({
  sourceLabel,
  subject,
  bodyPrompts,
}: {
  sourceLabel: string
  subject: string
  bodyPrompts: string[]
}) {
  const body = [
    sourceLabel,
    '',
    'Name:',
    'Organization:',
    'Destination focus:',
    ...bodyPrompts,
    'What you want to discuss:',
  ].join('\n')

  return `mailto:hello@radarscout.io?subject=${encodeURIComponent(
    `${sourceLabel} ${subject}`,
  )}&body=${encodeURIComponent(body)}`
}

export const PARTNERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Partner program',
  headline: 'Sell trusted Thailand experiences with AI-guided discovery',
  intro:
    'RadarScout helps travelers discover, compare, and choose trusted local experiences, then continue to a booking partner when they are ready.',
  audience: [
    'Travel agents who want a clearer way to match clients with Thailand experiences.',
    'Hotels and concierges helping guests choose the right local day.',
    'Local travel planners and creators with Thailand travel traffic.',
  ],
  helps: [
    'Organizes traveler intent into guided discovery flows instead of a crowded marketplace list.',
    'Highlights trusted local experiences by destination, category, style, and pace.',
    'Supports partner-direct handoff while keeping final booking details with the booking partner.',
  ],
  doesNotReplace: [
    'Your existing client relationship or advisory process.',
    'The operator or booking partner responsible for final traveler details.',
    'A private agent portal; early partner interest is handled manually.',
  ],
  intake: [
    'Your audience, destination focus, and typical traveler needs.',
    'The types of Thailand experiences you want to recommend.',
    'The best contact path for a short partnership conversation.',
  ],
  intakeGuide: SAFE_INTAKE_GUIDE,
  reviewNote: MANUAL_REVIEW_NOTE,
  nextSteps: MANUAL_NEXT_STEPS,
  ctaLabel: 'Contact RadarScout about partnerships',
  ctaHref: buildPartnerMailto({
    sourceLabel: '[RadarScout partners page]',
    subject: 'RadarScout partner interest',
    bodyPrompts: [
      'Audience or client type:',
      'Thailand experiences you want to recommend:',
      'Preferred contact path:',
    ],
  }),
  relatedLinks: [
    {
      label: 'List a Thailand experience',
      description:
        'For local operators with a public traveler-facing page and booking partner path.',
      href: '/suppliers',
    },
    {
      label: 'Discuss a destination partnership',
      description:
        'For DMCs, local agencies, and destination teams organizing local experience knowledge.',
      href: '/destination-partners',
    },
  ],
}

export const SUPPLIERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Supplier interest',
  headline: 'List your Thailand experience with RadarScout',
  intro:
    'RadarScout can help match your local experience with travelers looking for the right fit, then send them to your trusted booking partner path.',
  audience: [
    'Local operators and activity providers in Thailand.',
    'Elephant sanctuaries, cooking schools, nature guides, and cultural experience teams.',
    'Owner-managed experiences with clear public details and a customer-facing booking link.',
  ],
  helps: [
    'Turns public experience details into traveler-friendly discovery and comparison copy.',
    'Matches experiences by destination, traveler style, duration, intensity, and interests.',
    'Keeps the handoff partner-direct so your existing operating process remains intact.',
  ],
  doesNotReplace: [
    'Your current booking tools or operator workflow.',
    'Your team’s responsibility for final operating details and guest communication.',
    'A supplier dashboard; early intake is checked manually before anything goes live.',
  ],
  intake: [
    'Public title, photos, destination, duration, and experience summary.',
    'Trust notes such as suitability, safety boundaries, and who the experience is best for.',
    'A customer-facing public booking link that travelers can open safely.',
  ],
  intakeGuide: SAFE_INTAKE_GUIDE,
  reviewNote: MANUAL_REVIEW_NOTE,
  nextSteps: MANUAL_NEXT_STEPS,
  ctaLabel: 'Share your experience details',
  ctaHref: buildPartnerMailto({
    sourceLabel: '[RadarScout suppliers page]',
    subject: 'RadarScout supplier interest',
    bodyPrompts: [
      'Public experience link:',
      'Experience type and duration:',
      'Customer-facing booking link:',
    ],
  }),
  relatedLinks: [
    {
      label: 'Partner with RadarScout',
      description:
        'For travel agents, hotels, concierges, and creators matching travelers with Thailand experiences.',
      href: '/partners',
    },
    {
      label: 'Plan a destination collaboration',
      description:
        'For destination teams that want to shape curated local experience discovery.',
      href: '/destination-partners',
    },
  ],
  operatorUrlRequest: {
    eyebrow: 'Public link check',
    title: 'Send the traveler-facing page you want RadarScout to check.',
    body:
      'Operators can share a public product page or booking partner page for a manual handoff check. RadarScout checks the link before using it in any recommendation.',
    items: [
      'Public traveler-facing URL',
      'Experience name and destination',
      'Operator public name',
      'Contact person for link check',
    ],
    ctaLabel: 'Submit public link for check',
    ctaHref: buildPartnerMailto({
      sourceLabel: '[RadarScout supplier public link check]',
      subject: 'Public handoff URL check',
      bodyPrompts: [
        'Public traveler-facing URL:',
        'Experience name and destination:',
        'Operator public name:',
        'Contact person for link check:',
      ],
    }),
  },
}

export const DESTINATION_PARTNERS_PAGE_CONTENT: PartnerInterestPageContent = {
  eyebrow: 'Destination partners',
  headline: 'Help travelers discover the best local experiences in your destination',
  intro:
    'RadarScout can organize destination knowledge into guided discovery flows that help travelers compare trusted local experiences before handoff.',
  audience: [
    'DMCs, local tourism organizations, and destination managers.',
    'Local agencies building curated experience portfolios.',
    'Teams that understand which operators and activities are relevant for each traveler type.',
  ],
  helps: [
    'Structures destination expertise into clear planning paths for families, couples, groups, and independent travelers.',
    'Connects destination themes with trusted local experiences and partner-direct handoff.',
    'Starts with manual collaboration and curated intake before any deeper integration is considered.',
  ],
  doesNotReplace: [
    'Your destination strategy, supplier relationships, or local quality process.',
    'The booking partner or operator responsible for final traveler details.',
    'An API integration; this stage is static interest collection and manual collaboration only.',
  ],
  intake: [
    'Destination focus, traveler segments, and priority experience categories.',
    'Recommended local operators or experiences with public-safe details.',
    'A contact person for manual partnership scoping.',
  ],
  intakeGuide: SAFE_INTAKE_GUIDE,
  reviewNote: MANUAL_REVIEW_NOTE,
  nextSteps: MANUAL_NEXT_STEPS,
  ctaLabel: 'Discuss a destination partnership',
  ctaHref: buildPartnerMailto({
    sourceLabel: '[RadarScout destination partners page]',
    subject: 'RadarScout destination partnership',
    bodyPrompts: [
      'Traveler segments:',
      'Priority experience categories:',
      'Best contact person:',
    ],
  }),
  relatedLinks: [
    {
      label: 'Partner with RadarScout',
      description:
        'For travel sellers and concierges who want a clearer discovery path for clients.',
      href: '/partners',
    },
    {
      label: 'Share a supplier experience',
      description:
        'For local operators with public-safe experience details and a customer-facing booking link.',
      href: '/suppliers',
    },
  ],
}
