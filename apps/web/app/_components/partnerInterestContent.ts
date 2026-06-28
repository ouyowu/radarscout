import type { PartnerInterestPageContent } from './PartnerInterestPage'

const MANUAL_REVIEW_NOTE =
  'Send a short note with your destination focus and public booking link. RadarScout manually checks partner inquiries before any public recommendation.'

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
  reviewNote: MANUAL_REVIEW_NOTE,
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
  reviewNote: MANUAL_REVIEW_NOTE,
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
  reviewNote: MANUAL_REVIEW_NOTE,
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
}
